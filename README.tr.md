# Dental Market

Next.js 15, TypeScript, Supabase ve TailwindCSS ile geliştirilmiş modern B2B dental ürünler ve ekipmanları e-ticaret platformu.

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/Iwamergun/dentalmarket.git
cd dentalmarket
```

### 2. Bağımlılıkları Kurun

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Yapılandırması
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Dental Market
```

**Önemli:** `.env.example` dosyasını kopyalayıp `.env.local` olarak kaydedebilir ve kendi Supabase anahtarlarınızı ekleyebilirsiniz.

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını düzenleyerek Supabase bilgilerinizi girin.

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📋 Kullanılabilir Komutlar

- `npm run dev` - Geliştirme sunucusunu başlat (Turbopack ile)
- `npm run build` - Production için derle
- `npm run start` - Production sunucusunu başlat
- `npm run lint` - ESLint kontrolü yap

## ✨ Özellikler

- 🚀 **Next.js 15** - App Router ile optimal performans
- 🎨 **TailwindCSS** - Modern, responsive tasarım
- 🔐 **Supabase** - Authentication ve veritabanı
- 🔍 **SEO Optimizasyonu** - Yapılandırılmış veri ve dinamik sitemap
- 📱 **Responsive Tasarım** - Tüm cihazlarda çalışır
- 🌐 **Türkçe Dil Desteği**
- 🏗️ **TypeScript** - Tip güvenliği

## 🎨 Yeni Premium Tasarım

Proje, Amazon, eBay ve StoreEnvy'den ilham alan premium e-ticaret tasarımı ile güncellenmiştir:

- 🌈 **Canlı Renk Paleti** - Turuncu (#FF9900), mor, turkuaz ve mavi gradientler
- ✨ **Premium Animasyonlar** - Hover efektleri, ölçek dönüşümleri, parıltı gölgeleri
- 🎯 **Gelişmirilmiş UX** - Daha büyük butonlar, kalın yazı tipleri, daha iyi görsel hiyerarşi
- 💎 **E-ticaret En İyi Uygulamaları** - İndirim rozetleri, aciliyet göstergeleri, güven sinyalleri

## 📁 Proje Yapısı

```
dentalmarket/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                # Public rotalar (auth gerekmez)
│   │   ├── layout.tsx           # Header/footer ile public layout
│   │   ├── page.tsx             # Anasayfa
│   │   ├── urunler/             # Ürünler
│   │   ├── kategoriler/         # Kategoriler
│   │   └── markalar/            # Markalar
│   ├── (dashboard)/             # Kimlik doğrulama gerektiren rotalar
│   │   └── dashboard/
│   ├── sitemap.ts               # Dinamik sitemap oluşturma
│   └── robots.ts                # Robots.txt oluşturma
├── components/
│   ├── ui/                      # Yeniden kullanılabilir UI bileşenleri
│   ├── layout/                  # Layout bileşenleri
│   ├── catalog/                 # Katalog özel bileşenleri
│   ├── home/                    # Anasayfa bileşenleri
│   └── seo/                     # SEO bileşenleri
├── lib/
│   ├── supabase/                # Supabase yapılandırması
│   ├── utils/                   # Yardımcı fonksiyonlar
│   └── constants/               # Sabitler ve yapılandırma
└── types/                       # TypeScript tip tanımlamaları
```

## 💾 Veritabanı Şeması

Uygulama Supabase'de şu ana tabloları kullanır:

- **catalog_products** - Ürün bilgileri
- **categories** - Hiyerarşik kategoriler
- **brands** - Ürün markaları
- **offers** - Tedarikçi teklifleri
- **profiles** - Kullanıcı profilleri

Tam tip tanımlamaları için `types/database.types.ts` dosyasına bakın.

## 🔧 Sorun Giderme

### Port 3000 zaten kullanımda

Eğer 3000 portu zaten kullanılıyorsa, farklı bir port belirtebilirsiniz:

```bash
npm run dev -- -p 3001
```

### Supabase bağlantı hatası

1. `.env.local` dosyasının doğru konumda olduğundan emin olun (proje kök dizini)
2. Supabase URL ve anahtarlarının doğru olduğunu kontrol edin
3. Supabase projenizin aktif olduğundan emin olun

### Build hatası

```bash
# node_modules ve .next dizinlerini temizleyin
rm -rf node_modules .next
npm install
npm run build
```

## 🌍 Ortam Değişkenleri

Gerekli ortam değişkenleri:

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonim anahtarı | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase servis rol anahtarı | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | Site URL'i | `https://dentalmarket.com` |
| `NEXT_PUBLIC_SITE_NAME` | Site adı | `Dental Market` |

## 🔒 Güvenlik Notları

- `.env.local` dosyasını asla git'e commit etmeyin
- Supabase servis rol anahtarınızı güvenli tutun
- Production'da HTTPS kullanın

## 🚀 Deployment

### Vercel (Önerilen)

1. Kodunuzu GitHub'a push edin
2. Vercel'de repository'nizi import edin
3. Ortam değişkenlerini yapılandırın
4. Deploy edin

### Diğer Platformlar

Uygulama, Next.js'i destekleyen herhangi bir platforma deploy edilebilir:
- Netlify
- AWS Amplify
- Docker konteynerları

Deployment platformunda ortam değişkenlerini ayarlamayı unutmayın.

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch'inizi oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

## 📞 Destek

Destek için info@dentalmarket.com adresine e-posta gönderin veya GitHub'da issue açın.

## 📝 Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Not:** Bu proje sürekli geliştirilmektedir. En son güncellemeler için repository'yi takip edin.
