# Bakım Sepetim | GitHub Pages Müşteri İnceleme Demosu

**Sürüm:** V5.2 · Rose Gold Atelier · KKTC

Bu depo **tanıtım amaçlıdır**. Katalog ve ürün bilgileri örnek, yönetim paneli ise salt-okunur önizlemedir.
**Gerçek sipariş, tahsilat, stok kaydı, yönetici hesabı veya kişisel veri tutulmaz.**

## Berber randevu projesiyle aynı şekilde yayınla

1. https://github.com/new adresine git.
2. Depo adını **bakim-sepetim-demo** yap, **Public** seç; başlangıç dosyası (README) oluşturma.
3. **Create repository** seç.
4. **uploading an existing file** veya **Add file → Upload files** seç.
5. İndirdiğin ZIP'i çıkar. **İçindeki dosya ve klasörlerin hepsini** yükleme alanına sürükle: `index.html`, `admin/`, `static/`, `api/`, `urun/`, `inceleme/` vb. ZIP dosyasını tek başına yükleme; `Bakim_Sepetim...` üst klasörünü repo içine ekleme.
6. **Commit changes** seç.
7. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
8. Yayın tamamlandıktan sonra aç:
   - **Mağaza:** https://sheigthean.github.io/bakim-sepetim-demo/
   - **Yönetim önizlemesi:** https://sheigthean.github.io/bakim-sepetim-demo/admin/
   - **İnceleme ve geri bildirim:** https://sheigthean.github.io/bakim-sepetim-demo/inceleme/

> Bu bağlantılar yalnızca repo GitHub'da oluşturulup Pages etkinleştirildiğinde çalışır. Henüz yayınlanmış bağlantılar değildir.

**Önemli:** Bu paket **tam çalışan FastAPI uygulaması değildir**. Gerçek satış için V5 çalışan arka uç uygulamasının güvenli bir sunucuda, kalıcı veritabanıyla ayrıca yayına alınması gerekir. GitHub Pages HTML/CSS/JS gibi statik dosyaları yayınlar; sunucu tarafı Python uygulamasını çalıştırmaz.

## Demoda neleri inceleyebilirsiniz?

- Rose Gold Atelier ana sayfa, marka ve kategoriler
- Ürün kartları, 8 örnek ürün ve ürün detayları
- Tarayıcı içinde demo sepeti (yalnızca bulunduğunuz cihazda)
- KKTC teslimat ve kapıda ödeme / IBAN bilgilendirme görünümü
- Sipariş ekranı, gerçek kayıt **yok**
- Yönetim paneli, örnek stok ve sipariş görünümleri, gerçek değişiklik **yok**
- `inceleme/` ekranından WhatsApp geri bildirim paylaşımı

Bu paket gerçek IBAN, yönetici şifresi veya `.env` dosyası içermez. İnceleme ekranında müşterinin yazdığı mesaj yalnızca WhatsApp üzerinden veya kopyalama yoluyla paylaşılır; web sitesinin kendi sunucusuna kaydedilmez.
