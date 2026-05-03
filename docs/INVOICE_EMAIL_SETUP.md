# Otomatik Fatura Oluşturma ve E-posta Gönderimi

Bu belge, `dentalmarket` projesine eklenen otomatik fatura oluşturma ve sipariş onayı e-postası gönderme özelliğini açıklamaktadır.

---

## Genel Bakış

Bir müşteri sipariş verdiğinde sistem otomatik olarak:

1. PDF fatura oluşturur (`@react-pdf/renderer` kullanarak)
2. Fatura kaydını `invoices` veritabanı tablosuna yazar *(tablo mevcutsa)*
3. PDF dosyasını Supabase Storage `invoices` bucket'ına yükler *(bucket mevcutsa)*
4. Sipariş onayı + fatura ekli e-postayı müşterinin e-posta adresine gönderir *(SMTP yapılandırıldıysa)*

> **Not:** Fatura ve e-posta işlemleri sırasında oluşan hatalar siparişin oluşturulmasını **engellemez**. Her hata `console.error` ile kaydedilir.

---

## Yapılandırma

### 1. Ortam Değişkenleri (`.env.local`)

`.env.example` dosyasındaki SMTP bloğunu kopyalayın ve kendi değerlerinizi girin:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Dent Alışveriş <noreply@dentalisveris.com>"
```

SMTP değişkenlerinin herhangi biri eksikse e-posta gönderimi sessizce atlanır; sipariş yine de başarıyla oluşturulur.

### Sağlayıcı Örnekleri

| Sağlayıcı | SMTP_HOST | SMTP_PORT | SMTP_SECURE |
|-----------|-----------|-----------|-------------|
| Gmail (App Password) | `smtp.gmail.com` | `587` | `false` |
| Resend (SMTP) | `smtp.resend.com` | `587` | `false` |
| Mailgun | `smtp.mailgun.org` | `587` | `false` |
| SendGrid | `smtp.sendgrid.net` | `587` | `false` |
| Genel SSL/TLS | *(sağlayıcınız)* | `465` | `true` |

**Gmail ile kullanım:** Google hesabında 2FA'yı etkinleştirip [App Password](https://myaccount.google.com/apppasswords) oluşturun; `SMTP_PASS` olarak bu şifreyi kullanın.

### 2. Veritabanı Migrasyonu

Fatura kayıtlarını veritabanında saklamak için `invoices` tablosunu oluşturun:

```bash
# Supabase SQL Editor'da çalıştırın
# (docs/migrations/004_invoices_table.sql)
```

Ya da migration dosyasını Supabase CLI ile uygulayın:

```bash
supabase db push --db-url "$SUPABASE_DB_URL" < docs/migrations/004_invoices_table.sql
```

> Tablo oluşturulmazsa fatura kaydı veritabanına yazılmaz, ancak PDF yine oluşturulur ve e-postayla gönderilir.

### 3. Supabase Storage Bucket

Fatura PDF dosyalarını Supabase Storage'da saklamak için `invoices` adında bir bucket oluşturun:

**Supabase Dashboard → Storage → New Bucket**

- **Name:** `invoices`
- **Public:** ✓ (müşterilerin PDF URL'sine erişebilmesi için)

Alternatif olarak SQL ile:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;
```

> Bucket oluşturulmazsa PDF Storage'a yüklenmez; e-posta eki olarak yine gönderilir.

---

## Mimari

```
app/api/orders/route.ts          ← Sipariş oluşturma (entegrasyon noktası)
  │
  ├── lib/invoice/
  │     └── generate-invoice-pdf.ts   ← PDF oluşturma + yardımcı fonksiyonlar
  │
  ├── lib/email/
  │     ├── mailer.ts                 ← SMTP transporter (nodemailer)
  │     └── templates/
  │           └── order-confirmation.ts  ← HTML + düz metin e-posta şablonu
  │
  └── components/InvoicePDF.tsx       ← @react-pdf/renderer PDF bileşeni

app/api/invoices/generate/route.ts   ← Manuel fatura oluşturma endpoint'i
docs/migrations/004_invoices_table.sql ← DB migrasyonu
```

### Akış

```
Müşteri sipariş verir
        │
        ▼
POST /api/orders
  1. Validasyon + stok kontrolü
  2. Sipariş DB'ye kaydedilir
  3. Stoklar güncellenir
  4. Sepet temizlenir
  5. [try/catch] Fatura + e-posta
       ├── generateInvoiceNumber()     → INV-YYYYMM-XXXXX
       ├── buildInvoiceData()          → shipping_address'ten müşteri bilgisi
       ├── mapOrderItems()             → InvoicePDF'e uygun format
       ├── generateInvoicePdf()        → Buffer (PDF bayt dizisi)
       ├── INSERT INTO invoices        → (tablo yoksa atlanır)
       ├── Storage upload              → (bucket yoksa atlanır)
       └── sendEmail()                 → PDF ekli onay maili (SMTP yoksa atlanır)
  6. 200 OK { success, order, message }
```

---

## Fatura Numarası Formatı

Fatura numaraları kod tarafında üretilir, herhangi bir veritabanı fonksiyonuna bağımlılık yoktur:

```
INV-YYYYMM-XXXXX
```

Örnek: `INV-202506-A3F7K`

---

## Manuel Fatura Oluşturma

Mevcut bir sipariş için fatura oluşturmak üzere endpoint'i doğrudan çağırabilirsiniz:

```bash
curl -X POST https://your-site.com/api/invoices/generate \
  -H "Content-Type: application/json" \
  -d '{"order_id": "uuid-of-order"}'
```

Yanıt:

```json
{
  "success": true,
  "invoice": {
    "id": "uuid-or-null",
    "invoice_number": "INV-202506-A3F7K",
    "pdf_url": "https://...supabase.co/storage/.../invoices/INV-202506-A3F7K.pdf"
  }
}
```

---

## Sınırlamalar ve Genişletme

- **KDV hesabı:** Şu anda toplam fiyattan %18 KDV tersine hesaplanır. Ürün bazlı farklı KDV oranları için `order_items` tablosuna `tax_rate` kolonu eklenebilir.
- **Kurumsal fatura:** `billing_type: 'corporate'` desteği için `orders` tablosuna `billing_*` alanları eklenebilir ve `buildInvoiceData` fonksiyonu güncellenebilir.
- **E-posta şablonu:** `lib/email/templates/order-confirmation.ts` düzenlenerek marka/tasarım özelleştirilebilir.
