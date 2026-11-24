#  MiniShop — Modern E-Ticaret Demo Projesi

MiniShop; **HTML5, CSS3 ve saf (vanilla) JavaScript** ile geliştirilmiş, backend gerektirmeyen, tamamen tarayıcı tarafında çalışan bir e-ticaret demo uygulamasıdır. Ürün verileri bir JSON dosyasından okunur; sepet, favoriler, kullanıcılar, siparişler, yorumlar ve stok değişiklikleri tarayıcının **LocalStorage** alanında saklanır.

>  **Not:** Bu proje gerçek bir satış platformu değildir. Yalnızca frontend yeteneklerini göstermek amacıyla hazırlanmıştır. Gerçek ödeme alınmaz, gerçek kargo gönderilmez.

---

##  İçindekiler

- [Özellikler](#-özellikler)
- [Sayfalar](#-sayfalar)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Demo Hesap ve Ödeme Bilgileri](#-demo-hesap-ve-ödeme-bilgileri)
- [Nasıl Çalışır?](#-nasıl-çalışır)
- [Güvenlik Notları](#-güvenlik-notları)
- [GitHub Pages ile Yayınlama](#-github-pages-ile-yayınlama)
- [Geliştirme Fikirleri](#-geliştirme-fikirleri)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

##  Özellikler

###  Vitrin ve Ürün Keşfi
- Hero alanı, özellik şeridi (ücretsiz kargo, güvenli ödeme, kolay iade, 7/24 destek)
- Ana sayfada **Öne Çıkan Kategoriler**, **Çok Satanlar**, **Yeni Eklenenler** ve **İndirimli Ürünler** bölümleri
- Kategori sayfasında gelişmiş filtreleme:
  - Kategori seçimi
  - Fiyat aralığı (min / max)
  - Marka filtresi
  - Sadece stokta olanlar
- Sıralama seçenekleri: önerilen, fiyat artan/azalan, en çok değerlendirilen, en yeni
- URL parametreleriyle filtreleme (ör. `category.html?sort=rating`, `category.html?fav=1`)
- Mobil uyumlu filtre paneli (aç/kapat butonu)

###  Ürün Detay
- Ürün görselleri, marka, fiyat, stok durumu
- Teknik özellikler tablosu
- Breadcrumb (sayfa yolu) navigasyonu
- Benzer ürünler bölümü
- Favorilere ekleme

###  Yorum ve Puanlama Sistemi
- 1–5 yıldız seçici (klavye/ekran okuyucu uyumlu `role="radiogroup"`)
- Ortalama puan, toplam değerlendirme sayısı ve **yıldız dağılımı çubukları**
- Form doğrulaması (isim, başlık, yorum uzunluğu)
- Demo yorumları ayrı etiketle gösterilir
- Yorum eklendiğinde ürün puanı anında güncellenir

###  Sepet
- Adet artır / azalt / doğrudan sayı girişi
- Ürün kaldırma ve sepeti temizleme (onay penceresiyle)
- Ara toplam, kargo ücreti ve genel toplam hesabı
- **750 TL üzeri siparişlerde ücretsiz kargo** ve "kargo için kalan tutar" bilgilendirmesi
- Sepetten ödemeye geçerken giriş kontrolü (giriş yoksa `redirect` ile login sayfasına yönlendirir)

###  Demo Ödeme (Checkout)
- Teslimat bilgileri formu (profilden otomatik doldurma)
- Demo kart doğrulaması + demo ödeme kodu
- Kart numarası ve SKT alanlarında otomatik biçimlendirme (`4242 4242 ...`, `12/30`)
- Alan bazlı hata mesajları
- Sipariş oluşturma, **stok düşürme**, adres bilgilerini profile kaydetme
- Başarılı ödeme sonrası siparişlerim sayfasına yönlendirme

###  Kullanıcı Sistemi
- Kayıt olma ve giriş yapma (form doğrulamalı)
- Güvenli yönlendirme (`redirect` parametresi için whitelist kontrolü, açık yönlendirme / open redirect koruması)
- Profil sayfası üç sekmeden oluşur:
  - **Profil:** sipariş sayısı, toplam harcama, favori sayısı, hesap bilgileri
  - **Bilgilerim:** ad, telefon, şehir ve adres güncelleme (e-posta değiştirilemez)
  - **Siparişlerim:** sipariş kartları, durum etiketi, başarılı siparişin vurgulanması
- Favorilerim listesi

###  Admin Paneli
- Yalnızca `admin` rolündeki kullanıcılar erişebilir
- Tüm siparişlerin listesi (müşteri, adres, ürünler, toplam)
- Kayıtlı kullanıcı listesi
- **Stok yönetimi:** her ürün için stok değerini düzenleme ve kaydetme

###  Kurumsal Sayfalar
- Hakkımızda, Yardım (SSS), Gizlilik Politikası, Kullanım Koşulları, KVKK Aydınlatma Metni, Mesafeli Satış Sözleşmesi (demo)
- Hash tabanlı (`info.html#kvkk`) otomatik kaydırma

###  Erişilebilirlik ve UX
- "İçeriğe geç" (skip link) bağlantısı
- `aria-label`, `aria-live`, `role` nitelikleri
- Toast bildirimleri (başarı / hata / bilgi)
- Görsel yüklenemezse yedek görsel (image fallback)
- Boş durum (empty state) ekranları
- XSS'e karşı kullanıcı verilerinde `escapeHTML` kullanımı

---

##  Sayfalar
| Sayfa | Dosya | Açıklama |
|-------|-------|----------|
| Ana Sayfa | `index.html` | Vitrin, kategoriler, öne çıkan ürünler |
| Ürünler | `category.html` | Filtreleme, sıralama, ürün listesi |
| Ürün Detayı | `product.html?id=…` | Detaylar, yorumlar, benzer ürünler |
| Sepet | `cart.html` | Sepet yönetimi ve sipariş özeti |
| Ödeme | `checkout.html` | Demo ödeme ve sipariş oluşturma |
| Giriş Yap | `login.html` | Kullanıcı girişi |
| Kayıt Ol | `register.html` | Yeni hesap oluşturma |
| Hesabım | `profile.html?tab=…` | Profil, bilgiler, siparişler |
| Admin Paneli | `admin.html` | Sipariş, kullanıcı ve stok yönetimi |
| Kurumsal | `info.html` | Yasal ve bilgilendirme metinleri |

---

##  Kullanılan Teknolojiler

- **HTML5** — anlamsal (semantic) yapı
- **CSS3** — CSS değişkenleri, Grid, Flexbox, responsive tasarım
- **JavaScript (ES6+)** — framework / kütüphane yok
- **LocalStorage** — kalıcı istemci tarafı veri saklama
- **JSON** — ürün veritabanı
- **IIFE modül deseni** — her sayfa betiği kendi kapsamında, ortak `App` nesnesi üzerinden çalışır

Hiçbir derleme (build) adımı, paket yöneticisi veya sunucu tarafı kod gerekmez.

---

##  Proje Yapısı

```
minishop/
├── index.html          # Ana sayfa
├── category.html       # Ürün listeleme ve filtreleme
├── product.html        # Ürün detay
├── cart.html           # Sepet
├── checkout.html       # Ödeme
├── login.html          # Giriş
├── register.html       # Kayıt
├── profile.html        # Kullanıcı profili
├── admin.html          # Admin paneli
├── info.html           # Kurumsal / yasal sayfalar
├── css/
│   └── style.css       # Tüm stiller
├── js/
│   ├── app.js          # Çekirdek: App nesnesi (depolama, sepet, auth, yardımcılar, header/footer)
│   ├── products.js     # Ana sayfa, kategori ve ürün detay mantığı
│   ├── reviews.js      # Yorum ve yıldız sistemi
│   ├── cart.js         # Sepet sayfası
│   ├── checkout.js     # Ödeme akışı
│   ├── auth.js         # Giriş ve kayıt
│   ├── profile.js      # Profil, bilgiler, siparişler
│   ├── admin.js        # Admin paneli
│   └── info.js         # Kurumsal sayfa davranışı
└── products.json       # Ürün verileri (konumu projenize göre ayarlayın)
```

>  `products.json` dosyasının klasör konumu `js/app.js` içindeki fetch yoluna göre değişebilir. Projenizdeki gerçek yapıya göre bu bölümü düzenleyin.

---

##  Kurulum ve Çalıştırma

### 1. Projeyi klonlayın

```bash
git clone https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
cd REPO_ADINIZ
```

### 2. Yerel bir sunucu ile açın

Ürün verileri `fetch` ile JSON dosyasından yüklendiği için `index.html` dosyasına çift tıklayarak (`file://`) açmak çoğu tarayıcıda **çalışmaz**. Basit bir yerel sunucu kullanın:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve .
```

**VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) eklentisi ile *Go Live*.

Ardından tarayıcıda şu adresi açın: <http://localhost:8000>

---

##  Demo Hesap ve Ödeme Bilgileri

### Admin hesabı

| Alan | Değer |
|------|-------|
| E-posta | `admin@minishop.demo` |
| Şifre | `admin123` |

Admin ile giriş yaptığınızda otomatik olarak **Admin Paneli**'ne yönlendirilirsiniz.

### Demo ödeme bilgileri

| Alan | Değer |
|------|-------|
| Kart Numarası | `4242 4242 4242 4242` |
| Kart Üzerindeki İsim | `DEMO KART` |
| Son Kullanma Tarihi | `12/30` |
| CVV | `123` |
| Demo Ödeme Kodu | `DEMO2026` |

Başka bir kart bilgisi kabul edilmez; gerçek kart bilgisi **girmeyin**.

### Normal kullanıcı
Kayıt sayfasından yeni bir hesap oluşturabilirsiniz (şifre en az 4 karakter).

---

##  Nasıl Çalışır?

### Merkezi `App` nesnesi
`app.js` dosyası `window.App` altında ortak işlevleri sunar. Diğer sayfa betikleri bu nesneyi kullanır:

- **Ürün işlemleri:** `getProducts`, `reloadProducts`, `setStock`, `setStockBatch`
- **Sepet:** `getCart`, `getCartDetailed`, `updateCartItem`, `removeFromCart`, `clearCart`, `calculateTotals`
- **Kimlik doğrulama:** `register`, `login`, `getCurrentUser`, `isAdmin`, `getUsers`
- **Profil:** `getUserProfile`, `updateUserProfile`, `getMyOrders`
- **Favoriler:** `getFavorites`
- **Yorumlar:** `getProductReviews`, `addProductReview`, `getReviewStats`
- **Yardımcılar:** `escapeHTML`, `formatPrice`, `readJSON`, `writeJSON`, `toast`, `attachImageFallback`, `ICONS`

### Sayfa başlatma
Her sayfa `<body data-page="...">` niteliğiyle kendini tanımlar. İlgili betik yalnızca kendi sayfasında çalışır:

```js
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.getAttribute('data-page') === 'cart') init();
});
```

### Sipariş akışı
1. Kullanıcı ürünleri sepete ekler.
2. Sepetten **Ödemeye Geç** → giriş yapılmamışsa `login.html?redirect=checkout.html` sayfasına yönlendirilir.
3. Teslimat ve demo kart bilgileri doğrulanır.
4. Sipariş (`MS-YYYY-XXXXX` formatında numara ile) LocalStorage'a kaydedilir.
5. Stoklar düşürülür, adres profile kaydedilir, sepet temizlenir.
6. Kullanıcı `profile.html?tab=orders` sayfasına yönlendirilir.

### Veri saklama
Tüm kalıcı veriler LocalStorage'dadır: kullanıcılar, aktif oturum, sepet, favoriler, siparişler, yorumlar ve stok güncellemeleri. Tarayıcı verileri temizlendiğinde proje ilk haline döner.

Tüm verileri sıfırlamak için tarayıcı konsolunda:

```js
localStorage.clear();
```

---

##  Güvenlik Notları

Bu proje **eğitim ve gösterim** amaçlıdır. Üretim ortamında kullanılmamalıdır:

- Kimlik doğrulama tamamen istemci tarafındadır; şifreler sunucuda doğrulanmaz.
- Admin yetkisi LocalStorage verisine dayanır; tarayıcı araçlarıyla değiştirilebilir.
- Ödeme yalnızca simülasyondur.

Yine de projede alınan bazı önlemler:

- Kullanıcıdan gelen metinler `escapeHTML` ile kaçışlanarak **XSS** riski azaltılır.
- `redirect` parametresi yalnızca iç yollara izin veren bir desenle doğrulanır (açık yönlendirme koruması).
- Gerçek kart bilgisi kabul edilmez; yalnızca demo kart eşleştirilir.

Gerçek bir e-ticaret uygulaması için sunucu tarafı kimlik doğrulama, şifre hashleme, ödeme sağlayıcı entegrasyonu (iyzico, Stripe vb.) ve veritabanı gereklidir.

---

##  GitHub Pages ile Yayınlama

Proje statik olduğu için ücretsiz olarak yayınlanabilir:

1. Dosyaları GitHub reposuna yükleyin.
2. **Settings → Pages** bölümüne gidin.
3. **Source** olarak `Deploy from a branch` seçin.
4. Branch olarak `main` ve klasör olarak `/ (root)` seçip kaydedin.
5. Birkaç dakika sonra siteniz `https://KULLANICI_ADINIZ.github.io/REPO_ADINIZ/` adresinde yayında olur.

---

##  Geliştirme Fikirleri

- [ ] Gerçek bir backend (Node.js / Express, Firebase, Supabase vb.) entegrasyonu
- [ ] Şifrelerin hashlenmesi ve JWT tabanlı oturum
- [ ] Gerçek ödeme sağlayıcısı entegrasyonu
- [ ] Admin panelinde ürün ekleme / silme / düzenleme
- [ ] Sipariş durumu yönetimi (hazırlanıyor, kargoda, teslim edildi)
- [ ] Kupon / indirim kodu sistemi
- [ ] Ürün arama çubuğu ve otomatik tamamlama
- [ ] Karanlık mod (dark mode)
- [ ] Çoklu dil desteği (TR / EN)
- [ ] Sayfalama veya sonsuz kaydırma
- [ ] PWA desteği (çevrimdışı kullanım)
- [ ] Birim ve uçtan uca testler

---

##  Katkıda Bulunma

Katkılar memnuniyetle karşılanır!

1. Bu repoyu **fork** edin.
2. Yeni bir dal oluşturun: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerinizi commit edin: `git commit -m "Yeni özellik eklendi"`
4. Dalınızı push edin: `git push origin ozellik/yeni-ozellik`
5. Bir **Pull Request** açın.
