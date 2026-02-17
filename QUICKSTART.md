# Hızlı Başlangıç Rehberi / Quick Start Guide

## 🇹🇷 Türkçe

### Yerel Olarak Çalıştırma

Evet, projeyi lokalde pull yapıp çalıştırabilirsiniz! İşte adım adım rehber:

#### 1. Depoyu Klonlayın

```bash
git clone https://github.com/Iwamergun/dentalmarket.git
cd dentalmarket
```

#### 2. Bağımlılıkları Kurun

```bash
npm install
```

Bu komut tüm gerekli paketleri yükleyecektir (yaklaşık 2-3 dakika sürer).

#### 3. Ortam Dosyasını Oluşturun

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

Ardından `.env.local` dosyasını bir metin editörü ile açın ve Supabase bilgilerinizi girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Dental Market
```

> **Not:** Supabase hesabınız yoksa, [supabase.com](https://supabase.com) adresinden ücretsiz hesap oluşturabilirsiniz.

#### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Bu komut projeyi başlatacak ve tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açabilirsiniz.

#### 5. Tarayıcıda Açın

Tarayıcınızda şu adresi açın:
- **Ana Sayfa:** http://localhost:3000
- **Ürünler:** http://localhost:3000/urunler
- **Kategoriler:** http://localhost:3000/kategoriler

### Yaygın Sorunlar ve Çözümler

#### "Port 3000 already in use" hatası

```bash
# Farklı bir port kullanın
npm run dev -- -p 3001
```

#### "Cannot find module" hatası

```bash
# Önbelleği temizleyip yeniden kurun
rm -rf node_modules .next
npm install
```

#### Supabase bağlantı hatası

1. `.env.local` dosyasının doğru konumda olduğundan emin olun
2. Supabase anahtarlarınızı kontrol edin
3. İnternet bağlantınızı kontrol edin

### Güncellemeleri Çekme

Projedeki yeni güncellemeleri almak için:

```bash
git pull origin main
npm install  # Yeni bağımlılıklar eklenmişse
npm run dev
```

---

## 🇬🇧 English

### Running Locally

Yes, you can pull and run the project locally! Here's a step-by-step guide:

#### 1. Clone the Repository

```bash
git clone https://github.com/Iwamergun/dentalmarket.git
cd dentalmarket
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (takes about 2-3 minutes).

#### 3. Create Environment File

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Dental Market
```

> **Note:** If you don't have a Supabase account, create a free one at [supabase.com](https://supabase.com).

#### 4. Start Development Server

```bash
npm run dev
```

This will start the project and you can open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Open in Browser

Open these URLs in your browser:
- **Home:** http://localhost:3000
- **Products:** http://localhost:3000/urunler
- **Categories:** http://localhost:3000/kategoriler

### Common Issues and Solutions

#### "Port 3000 already in use" error

```bash
# Use a different port
npm run dev -- -p 3001
```

#### "Cannot find module" error

```bash
# Clean cache and reinstall
rm -rf node_modules .next
npm install
```

#### Supabase connection error

1. Ensure `.env.local` is in the correct location
2. Verify your Supabase keys
3. Check your internet connection

### Pulling Updates

To get the latest updates from the project:

```bash
git pull origin main
npm install  # If new dependencies were added
npm run dev
```

---

## 📦 What You Need

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Clean everything
rm -rf node_modules .next
```

## 📞 Need Help?

- **Email:** info@dentalmarket.com
- **GitHub Issues:** [Open an issue](https://github.com/Iwamergun/dentalmarket/issues)
- **Documentation:** See [README.md](./README.md) or [README.tr.md](./README.tr.md)
