# NoteLand - Proje Tanıtımı

NoteLand, üniversite öğrencilerinin ders notlarını paylaşabildiği, beğenebildiği ve filtreleyerek erişebildiği tam kapsamlı bir web uygulamasıdır. Proje, modern .NET 8 tabanlı bir RESTful API (backend) ve saf HTML/CSS/JS ile geliştirilmiş bir frontend arayüzünden oluşmaktadır.

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
#### Proje İçinden Örnek Görüntüler:

![Image](https://github.com/user-attachments/assets/02896d45-3b42-4e2c-a194-9a430e44d53d)
![Image](https://github.com/user-attachments/assets/2c7b7f07-577e-48f4-9b70-df4690aa1df3)
![Image](https://github.com/user-attachments/assets/7d8b0683-4704-4c6d-bfae-f8611a53f37c)

