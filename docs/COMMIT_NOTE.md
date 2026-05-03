# Commit Note

## Ozet

- Orders API akisi uygulama katmanindaki parca parca insert/update modelinden cikarilip Supabase RPC transaction modeline tasindi.
- `create_order_transaction` fonksiyonu canli veritabani semasina hizalandi: `orders` insert kolonlari, `order_status` enum cast'i, `order_items` snapshot alanlari ve stok dusumu ayni transaction icinde calisiyor.
- Orders route artik auth icin normal server client, transaction ve stok islemleri icin service-role admin client kullaniyor.
- Misafir ve girisli kullanici yuzeylerindeki fiyat gizleme, katalog filtreleme ve kategori kapsami iyilestirmeleri korunarak build ve test tekrar yesile cekildi.

## Dogrulama

- `npm run build`
- `npm run test:run`
- Canli smoke test: gercek guest siparis POST basarili oldu, `orders` ve `order_items` kayitlari olustu, `offers.stock_quantity` 1 adet dustu, ardindan test kayitlari temizlenip stok geri yuklendi.

## Onerilen Commit Mesaji

`fix: align transactional order flow with live supabase schema`

## Commit Aciklamasi

- use service-role Supabase client for order transaction execution
- make order creation rely on `create_order_transaction` as single source of truth
- align RPC function with live `orders` and `order_items` schema requirements
- persist product snapshot fields on order items and keep stock updates transactional
- document manual smoke-test steps and verify build, tests, and live order flow