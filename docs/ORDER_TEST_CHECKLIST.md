# Test Siparisi Checklist

## Hazirlik

- `.env.local` icinde Supabase baglanti degiskenlerinin dolu oldugunu kontrol et.
- Supabase tarafinda `orders`, `order_items`, `offers`, `cart`, `cart_items`, `addresses` tablolarinin erisilebilir oldugunu kontrol et.
- Test kullanicisi icin giris ac ve en az bir teslimat adresi ekle.
- Testte kullanilacak urunun aktif bir `offer` kaydi, yeterli stogu ve gecerli fiyati oldugunu dogrula.
- Misafir fiyat gizleme davranisini test etmek icin ikinci bir gizli pencere hazir tut.

## Public Akis Kontrolleri

- Giris yapmadan ana sayfa, kategori sayfasi, urun listesi ve urun detay sayfasinda fiyat yerine `Fiyat icin giris yapin` metninin gorundugunu kontrol et.
- Kategori filtresinde mobil acilir panelin calistigini, kategori siralamasinin alfabetik oldugunu ve `Daha fazlasini gor` butonunun kalan kategorileri actigini kontrol et.
- Ust kategori barinda yatay kaydirma, `Butun kategorileri gor` butonu ve hover ile alt kategori acilmasi davranislarini kontrol et.

## Sepet Ve Checkout Akisi

- Giris yaptiktan sonra bir urunu sepete ekle.
- Sepette adet artirma/azaltma, stok limiti, fiyat degisimi ve toplam hesaplarinin dogru guncellendigini kontrol et.
- `/odeme` ekraninda adres, odeme yontemi ve siparis ozeti alanlarini doldur.
- Siparisi gonderdikten sonra `/siparis/{orderNumber}` sayfasina yonlendirme oldugunu kontrol et.
- Siparis sonrasi kullanici sepetinin temizlendigini dogrula.

## Canli Smoke Test

- Uygulamayi production modunda acmak icin `npm run build` ve ardindan `npm run start -- --port 3000` ya da musait bir port calistir.
- Aktif ve stoklu bir `offers` kaydi sec. Test sirasinda `product_id`, `offer.id`, `stock_quantity`, `price` degerlerini not al.
- Browser uzerinden giris yapmis bir kullanici ile urunu sepete ekle ve `/odeme` ekranina git.
- Gecerli teslimat adresi gir, `bank_transfer` veya `cash_on_delivery` sec, siparisi tamamla.
- API basarisiz olursa server logunda `Order transaction error:` satirini kontrol et; hata artik transaction fonksiyonundan cikiyor olmalidir.
- API basariliysa donen `orderNumber` degerini not al ve `orders`, `order_items`, `offers` tablolarinda asagidaki uc kontrolu yap:
- `orders`: yeni kayitta `status`, `payment_status`, `total`, `customer_note` dogru mu.
- `order_items`: `product_name`, `product_sku`, `quantity`, `unit_price`, `offer_id` snapshot alanlari dolu mu.
- `offers`: ayni offer icin `stock_quantity` siparis miktari kadar dustu mu.
- Test verisini geri alman gerekiyorsa once `order_items`, sonra `orders` kaydini sil; son olarak ilgili `offers.stock_quantity` degerini eski haline getir.

## Veri Tutarliligi Kontrolleri

- Supabase'te yeni `orders` kaydinin olustugunu kontrol et.
- Ayni siparise bagli `order_items` satirlarinin dogru adet ve fiyatlarla olustugunu kontrol et.
- Ilgili `offers.stock_quantity` degerinin siparis adedi kadar azaldigini kontrol et.
- Stok yetersizligi simulasyonunda API'nin `409` dondugunu ve yeni `orders` / `order_items` artigi birakmadigini kontrol et.
- Siparis kalemi insert veya stok update hatasi simulasyonunda order rollback davranisinin calistigini kontrol et.

## Rol Ve Panel Kontrolleri

- `admin` rolu ile admin panel butonunun gorundugunu ve `/admin` erisiminin acik oldugunu kontrol et.
- `depo` veya stok yonetimi token'larina sahip kullanici ile ayni admin panel erisiminin acik oldugunu kontrol et.
- Yetkisiz kullanicinin `/admin` ve `/supplier` yuzeylerine yonlendirilip engellendigini kontrol et.

## Son Onay

- `npm run test:run` calistir.
- `npm run build` calistir.
- Son olarak browser uzerinde bir tam siparis senaryosunu bastan sona tekrar et ve order number, stok dusumu, sepet temizligi ucunu birlikte dogrula.