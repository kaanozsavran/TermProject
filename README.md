# NoteLand - Proje Tanıtımı

NoteLand, üniversite öğrencilerinin ders notlarını paylaşabildiği, beğenebildiği ve filtreleyerek erişebildiği tam kapsamlı bir web uygulamasıdır. Proje, modern .NET 8 tabanlı bir RESTful API (backend) ve saf HTML/CSS/JS ile geliştirilmiş bir frontend arayüzünden oluşmaktadır.

---

## İçindekiler

- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Mimari ve Katmanlar](#mimari-ve-katmanlar)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Backend Detayları](#backend-detayları)
- [Frontend Detayları](#frontend-detayları)
- [API ve Örnekler](#api-ve-örnekler)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Katkı Sağlama](#katkı-sağlama)
- [Lisans](#lisans)

---

## Kullanılan Teknolojiler

### Backend (.NET API)

- **.NET 8.0**: Modern, hızlı ve güvenli web API geliştirme platformu.
- **ASP.NET Core Web API**: RESTful servisler için.
- **Entity Framework Core**: ORM, veritabanı işlemleri için.
- **SQL Server**: Veritabanı yönetimi.
- **JWT (Json Web Token)**: Kimlik doğrulama ve yetkilendirme.
- **Swagger (Swashbuckle)**: API dokümantasyonu ve test arayüzü.
- **CORS**: Frontend ile güvenli iletişim için.
- **Statik Dosya Sunumu**: Not dosyaları ve profil resimleri için.

### Frontend

- **HTML5, CSS3, JavaScript (Vanilla JS)**
- **Bootstrap 5**: Responsive ve modern arayüz.
- **Bootstrap Icons**: UI ikonları.
- **AlertifyJS**: Bildirim ve uyarı sistemi.
- **PDF.js**: Notların PDF önizlemesi için.
- **LocalStorage**: Kullanıcı oturum yönetimi.

---

## Mimari ve Katmanlar

### Backend

- **Controller**: API uç noktaları (User, Note, University, Faculty, Department, Course, Statistics, NoteLike).
- **Services**: İş mantığı ve veri erişim katmanı.
- **Models**: Veritabanı tabloları ve DTO'lar.
- **Data**: DbContext ve migration işlemleri.
- **wwwroot**: Statik dosyalar (notlar, profil resimleri).

### Frontend

- **Sayfa Bazlı Klasörler**: Her sayfa için ayrı HTML, JS ve CSS dosyaları (ör. `notepage`, `register`, `login`).
- **img/**: Logo ve görseller.
- **auth.js**: Oturum kontrolü ve yönlendirme.
- **PDF.js**: Not önizleme.
- **Bootstrap**: CDN üzerinden responsive tasarım.

---

## Kurulum ve Çalıştırma

### Backend

1. **Gereksinimler**: .NET 8 SDK, SQL Server
2. **Bağımlılıklar**: Proje kökünde
   ```
   dotnet restore
   ```
3. **Veritabanı Ayarları**: `appsettings.json` dosyasında bağlantı dizesini güncelleyin.
4. **Migration ve DB Oluşturma**:
   ```
   dotnet ef database update
   ```
5. **API'yi Başlatın**:
   ```
   dotnet run --project TermProject.Api
   ```
6. **Swagger**: `https://localhost:7149/swagger` adresinden API dokümantasyonuna erişin.

### Frontend

1. **Gereksinimler**: Modern bir tarayıcı.
2. **Başlatma**: `TermProject_Frontend` klasörünü bir HTTP sunucusunda (ör. Live Server, IIS, nginx) çalıştırın.
3. **Ana Sayfa**: `homepages/home.html` dosyasını açın.

---

## Backend Detayları

- **Kimlik Doğrulama**: JWT tabanlı, login sonrası token localStorage'da tutulur.
- **CORS**: Sadece belirli frontend adreslerine izin verilir.
- **Statik Dosya Sunumu**: Notlar ve profil resimleri `wwwroot/files` ve `wwwroot/images/profile-pictures` klasörlerinde tutulur.
- **Swagger**: Tüm endpointler test edilebilir.

#### Önemli NuGet Paketleri

- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Swashbuckle.AspNetCore`

#### Temel Controller'lar

- `UserController`: Kayıt, giriş, profil işlemleri.
- `NoteController`: Not ekleme, listeleme, filtreleme, dosya sunumu.
- `NoteLikeController`: Not beğenme/geri alma.
- `StatisticsController`: Toplam kullanıcı, not, üniversite sayısı.
- `University/Faculty/Department/CourseController`: Filtreleme için.

---

## Frontend Detayları

- **Tamamen Vanilla JS**: Ekstra framework yok, sade ve anlaşılır.
- **Bootstrap ile Responsive Tasarım**: Mobil ve masaüstü uyumlu.
- **AlertifyJS**: Hata ve bilgi mesajları.
- **PDF.js**: Notların ilk sayfası önizleme olarak gösterilir.
- **Kullanıcı Oturumu**: localStorage ile yönetilir.
- **Sayfa Bazlı JS**: Her sayfanın kendi işlevselliği var (ör. not ekleme, filtreleme, beğeni).

#### Örnek Kullanıcı Akışı

1. **Kayıt Ol**: Üniversite, fakülte, bölüm seçimi ile.
2. **Giriş Yap**: JWT token alınır.
3. **Notları Filtrele**: Üniversite > Fakülte > Bölüm > Ders seçimiyle notlar listelenir.
4. **Not Beğen**: Sadece giriş yapan kullanıcılar beğenebilir.
5. **Not Ekle**: PDF dosyası yüklenir, başlık ve açıklama girilir.
6. **Profil**: Kullanıcı bilgileri ve yüklediği notlar.

---

## API ve Örnekler

### Kimlik Doğrulama

```http
POST /api/User/login
{
  "email": "kullanici@eposta.com",
  "password": "sifre"
}
```

### Not Listeleme

```http
GET /api/Note/course-notes/{courseId}
Authorization: Bearer {token}
```

### Not Beğenme

```http
POST /api/NoteLike/like/{noteId}
Authorization: Bearer {token}
```

### İstatistikler

```http
GET /api/Statistics
```

---

## Ekran Görüntüleri

> Ekran görüntüleri ve demo GIF'leri buraya ekleyin.

---

## Katkı Sağlama

1. Fork'layın.
2. Yeni bir branch oluşturun.
3. Değişikliklerinizi commit'leyin.
4. Pull request gönderin.

---

## Lisans

MIT License

---

### Notlar

- Proje tamamen açık kaynak ve geliştirilmeye açıktır.
- Herhangi bir sorunda [issue](https://github.com/your-repo/issues) açabilirsiniz.

---

Bu README, projenin tüm teknik detaylarını, kullanılan araçları ve işleyişini kapsamlı şekilde özetler. Daha fazla teknik detay veya kod örneği isterseniz belirtmeniz yeterli! 