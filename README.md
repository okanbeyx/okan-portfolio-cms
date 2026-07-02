# Okan Portfolio CMS

Modern, multilingual and CMS-based personal portfolio website.  
Modern, çok dilli ve CMS destekli kişisel portföy web sitesi.

---

## 🇹🇷 Proje Hakkında

Okan Portfolio CMS, statik portföy yapısını dinamik ve yönetilebilir hale getirmek için geliştirilen full-stack bir portföy yönetim sistemidir.

Proje; public portföy sitesi ve korumalı admin panelinden oluşur. Admin panel üzerinden projeler, hero alanı, hakkımda bölümü, teknik yetenekler, eğitim geçmişi, iletişim bağlantıları, yorumlar ve site metinleri yönetilebilir.

Sistem Türkçe ve İngilizce içerik desteğine sahiptir. Admin Türkçe içerik girdikten sonra OpenAI entegrasyonu ile İngilizce içerik otomatik olarak oluşturulabilir ve manuel olarak düzenlenebilir.

---

## 🇬🇧 About the Project

Okan Portfolio CMS is a full-stack portfolio management system designed to make a personal portfolio website dynamic and manageable through a custom CMS panel.

The project includes a public portfolio website and a protected admin dashboard. Through the admin panel, projects, hero content, about section, technical skills, education history, contact links, testimonials and site texts can be managed dynamically.

The system supports Turkish and English content. The admin can enter Turkish content first, generate English content automatically with OpenAI integration, and manually edit the generated result if needed.

---

## 🚀 Features / Özellikler

### 🇹🇷 Özellikler

- Public portföy sitesi
- Korumalı admin paneli
- JWT tabanlı admin girişi
- Özel admin route yapısı
- Proje CMS sistemi
- Çoklu proje görseli yükleme
- Kapak görseli seçme
- Projeleri aktif/pasif yapma
- Hero alanı CMS
- Hakkımda CMS
- Teknik yetenekler CMS
- Eğitim geçmişi CMS
- İletişim bağlantıları CMS
- Yorumlar / testimonials CMS
- Public yorum gönderme formu
- Admin onaylı yorum yayınlama
- Türkçe / İngilizce içerik desteği
- Site metinleri CMS
- OpenAI destekli İngilizce çeviri
- Görseli olmayan projeler için özel placeholder tasarım
- Splash / loading ekranı
- Login rate limit
- Public yorum gönderme rate limit
- User-secrets / environment variables ile güvenli secret yönetimi

### 🇬🇧 Features

- Public portfolio website
- Protected admin dashboard
- JWT-based admin authentication
- Custom admin route
- Project CMS
- Multiple project image uploads
- Cover image selection
- Active/passive project status
- Hero section CMS
- About section CMS
- Skills CMS
- Education timeline CMS
- Contact links CMS
- Testimonials CMS
- Public testimonial submission form
- Admin approval flow for testimonials
- Turkish / English multilingual content support
- Site texts CMS
- OpenAI-assisted English translation
- Placeholder design for projects without images
- Splash / loading screen
- Login rate limiting
- Public testimonial submission rate limiting
- Secure secret management with user-secrets / environment variables

---

## 🛠 Tech Stack / Kullanılan Teknolojiler

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Icons

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- MSSQL Server
- JWT Authentication
- OpenAI API Integration
- Rate Limiting Middleware

### Database

- Microsoft SQL Server

---

## 📁 Project Structure / Proje Yapısı

```txt
okan-portfolio-cms
├── backend
│   ├── OkanPortfolio.Api
│   ├── OkanPortfolio.Application
│   ├── OkanPortfolio.Domain
│   └── OkanPortfolio.Infrastructure
│
└── frontend
    ├── public
    └── src
```

---

## ⚙️ Requirements / Gereksinimler

### 🇹🇷 Gerekli Kurulumlar

Projeyi çalıştırmadan önce bilgisayarında şunların kurulu olması gerekir:

- .NET SDK
- Node.js
- npm
- Microsoft SQL Server
- SQL Server Management Studio veya benzeri bir araç
- OpenAI API key

### 🇬🇧 Required Tools

Before running the project, make sure the following tools are installed:

- .NET SDK
- Node.js
- npm
- Microsoft SQL Server
- SQL Server Management Studio or similar database tool
- OpenAI API key

---

# 🇹🇷 Kurulum ve Çalıştırma

## 1. Projeyi Klonla

```bash
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd okan-portfolio-cms
```

---

## 2. Backend Ayarları

Backend API klasörüne git:

```bash
cd backend/OkanPortfolio.Api
```

Paketleri yükle:

```bash
dotnet restore
```

---

## 3. User Secrets Ayarları

Bu projede hassas bilgiler kaynak kodda tutulmaz.  
JWT key, OpenAI API key ve admin şifresi `user-secrets` veya production ortamında environment variable üzerinden yönetilmelidir.

User-secrets başlat:

```bash
dotnet user-secrets init
```

JWT key ekle:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_RANDOM_JWT_SECRET"
```

OpenAI API key ekle:

```bash
dotnet user-secrets set "OpenAI:ApiKey" "YOUR_OPENAI_API_KEY"
```

OpenAI model ayarı:

```bash
dotnet user-secrets set "OpenAI:Model" "gpt-5.1"
```


---

## 4. Veritabanı Ayarı

`appsettings.json` içinde local database bağlantısını kendi bilgisayarına göre düzenle:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=OkanPortfolioCmsDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

Migration’ları veritabanına uygula:

```bash
dotnet ef database update
```

---

## 5. Backend’i Çalıştır

```bash
dotnet run
```

Backend çalıştıktan sonra health endpoint’i kontrol edebilirsin:

```txt
/api/health
```

Örnek local URL:

```txt
http://localhost:5231/api/health
```

---

## 6. Frontend Ayarları

Yeni terminal aç ve frontend klasörüne git:

```bash
cd frontend
```

Paketleri yükle:

```bash
npm install
```

Frontend için `.env` dosyası oluştur:

```env
VITE_API_BASE_URL=http://localhost:5231/api
```

Backend portun farklıysa URL’yi kendi backend portuna göre değiştir.

Frontend’i çalıştır:

```bash
npm run dev
```

Varsayılan frontend adresi:

```txt
http://localhost:5173
```

---

## 7. Admin Panel

Admin panel varsayılan `/admin` yolunda değildir.  
Admin route bilgisi frontend tarafında şu dosyadan yönetilir:

```txt
frontend/src/config/adminRoutes.js
```

Güvenlik sebebiyle public README içinde gerçek admin route paylaşılmamalıdır.

---

# 🇬🇧 Installation and Running the Project

## 1. Clone the Project

```bash
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd okan-portfolio-cms
```

---

## 2. Backend Setup

Go to the backend API folder:

```bash
cd backend/OkanPortfolio.Api
```

Restore packages:

```bash
dotnet restore
```

---

## 3. User Secrets Setup

Sensitive values are not stored in the source code.  
JWT key, OpenAI API key and admin password should be managed through `user-secrets` during local development or environment variables in production.

Initialize user-secrets:

```bash
dotnet user-secrets init
```

Set JWT key:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_RANDOM_JWT_SECRET"
```

Set OpenAI API key:

```bash
dotnet user-secrets set "OpenAI:ApiKey" "YOUR_OPENAI_API_KEY"
```

Set OpenAI model:

```bash
dotnet user-secrets set "OpenAI:Model" "gpt-5.1"
```

Set admin seed values:

```bash
dotnet user-secrets set "AdminSeed:UserName" "YOUR_ADMIN_USERNAME"
dotnet user-secrets set "AdminSeed:Email" "admin@example.com"
dotnet user-secrets set "AdminSeed:FullName" "Admin User"
dotnet user-secrets set "AdminSeed:Password" "YOUR_STRONG_ADMIN_PASSWORD"
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "true"
```

After logging in successfully, disable password reset:

```bash
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "false"
```

---
## Admin User Setup / Admin Kullanıcısı Oluşturma

### 🇹🇷 Türkçe

Bu projede varsayılan admin şifresi kaynak kodda tutulmaz.  
Admin kullanıcısı, backend ilk çalıştırıldığında `AdminSeeder` tarafından oluşturulur.

Admin hesabı oluşturmak için API projesi klasöründe aşağıdaki secret değerleri tanımlanmalıdır:

```bash
dotnet user-secrets set "AdminSeed:UserName" "YOUR_ADMIN_USERNAME"
dotnet user-secrets set "AdminSeed:Email" "admin@example.com"
dotnet user-secrets set "AdminSeed:FullName" "Admin User"
dotnet user-secrets set "AdminSeed:Password" "YOUR_STRONG_ADMIN_PASSWORD"
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "true"
```

Daha sonra backend çalıştırılır:

```bash
dotnet run
```

Backend ilk açıldığında admin hesabı oluşturulur veya mevcut admin hesabının şifresi güncellenir.

Admin girişi başarılı olduktan sonra şifre resetleme ayarı kapatılmalıdır:

```bash
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "false"
```

Admin panel route bilgisi frontend tarafında şu dosyada tanımlıdır:

```txt
frontend/src/config/adminRoutes.js
```

Güvenlik sebebiyle gerçek admin route bilgisi public README içinde paylaşılmamalıdır. Projeyi çalıştıran geliştirici bu dosyadan kendi admin route’unu belirleyebilir.

---

### 🇬🇧 English

This project does not store the default admin password in the source code.  
The admin user is created by `AdminSeeder` when the backend runs for the first time.

To create an admin user, define the following secret values inside the API project folder:

```bash
dotnet user-secrets set "AdminSeed:UserName" "YOUR_ADMIN_USERNAME"
dotnet user-secrets set "AdminSeed:Email" "admin@example.com"
dotnet user-secrets set "AdminSeed:FullName" "Admin User"
dotnet user-secrets set "AdminSeed:Password" "YOUR_STRONG_ADMIN_PASSWORD"
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "true"
```

Then run the backend:

```bash
dotnet run
```

When the backend starts, it creates the admin account or updates the password of the existing admin user.

After logging in successfully, disable password reset:

```bash
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "false"
```

The admin panel route is configured in:

```txt
frontend/src/config/adminRoutes.js
```

For security reasons, the actual admin route should not be exposed in a public README. The developer running the project can define their own admin route in this file.

---

## 4. Database Setup

Update the connection string in `appsettings.json` based on your local SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=OkanPortfolioCmsDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

Apply database migrations:

```bash
dotnet ef database update
```

---

## 5. Run Backend

```bash
dotnet run
```

Health check endpoint:

```txt
/api/health
```

Example local URL:

```txt
http://localhost:5231/api/health
```

---

## 6. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_BASE_URL=http://localhost:5231/api
```

Update the backend port if your API runs on a different port.

Run frontend:

```bash
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

---

## 7. Admin Panel

The admin panel does not use the default `/admin` route.  
The custom admin route is configured in:

```txt
frontend/src/config/adminRoutes.js
```

For security reasons, the actual admin route should not be exposed in a public README.

---

## 🔐 Security Notes / Güvenlik Notları

### 🇹🇷

Bu projede hassas bilgiler kaynak koda yazılmamalıdır.

GitHub’a gönderilmemesi gereken bilgiler:

```txt
JWT secret key
OpenAI API key
Production database connection string
Admin password
```

Geliştirme ortamında `user-secrets`, production ortamında environment variables veya hosting sağlayıcısının secret manager sistemi kullanılmalıdır.

### 🇬🇧

Sensitive values must not be committed to the repository.

Do not commit:

```txt
JWT secret key
OpenAI API key
Production database connection string
Admin password
```

Use `user-secrets` for local development and environment variables or hosting secret manager for production.

---

## 🧩 Main CMS Modules / Ana CMS Modülleri

### 🇹🇷

- Projeler CMS
- Proje görselleri yönetimi
- Hero alanı CMS
- Hakkımda CMS
- Teknik yetenekler CMS
- Eğitim geçmişi CMS
- İletişim bağlantıları CMS
- Yorumlar / Testimonials CMS
- Site metinleri CMS
- OpenAI destekli İngilizce çeviri sistemi

### 🇬🇧

- Projects CMS
- Project image management
- Hero section CMS
- About CMS
- Skills CMS
- Education CMS
- Contact links CMS
- Testimonials CMS
- Site texts CMS
- OpenAI-assisted English translation system

---

## 🖼 Image Uploads / Görsel Yükleme

### 🇹🇷

Proje görselleri admin panel üzerinden proje oluşturulduktan sonra yüklenir.

Desteklenen formatlar:

```txt
jpg
jpeg
png
webp
```

Maksimum dosya boyutu:

```txt
5 MB
```

### 🇬🇧

Project images are uploaded through the admin panel after a project is created.

Supported formats:

```txt
jpg
jpeg
png
webp
```

Maximum file size:

```txt
5 MB
```

---

## 🌍 Multilingual Content Flow / Çok Dilli İçerik Akışı

### 🇹🇷

Genel kullanım akışı:

1. Admin Türkçe içeriği girer.
2. “İngilizceyi Otomatik Oluştur” butonuna basar.
3. OpenAI ile İngilizce içerik oluşturulur.
4. Admin isterse İngilizce metni manuel düzenler.
5. Public sitede seçilen dile göre içerik gösterilir.

### 🇬🇧

General content flow:

1. Admin enters Turkish content.
2. Admin clicks “Generate English Automatically”.
3. English content is generated with OpenAI.
4. Admin can manually edit the English content.
5. The public website displays content based on the selected language.

---

## 📌 API Summary / API Özeti

### Public Endpoints

```txt
GET /api/projects
GET /api/projects/{id}
GET /api/hero
GET /api/about
GET /api/skills
GET /api/education
GET /api/contact
GET /api/testimonials
POST /api/testimonials
GET /api/site-texts
GET /api/health
```

### Protected Admin Endpoints

```txt
POST /api/auth/login

GET /api/projects/all
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}

POST /api/projects/{projectId}/images
PUT /api/projects/{projectId}/images/{imageId}/cover
DELETE /api/projects/{projectId}/images/{imageId}

GET /api/hero/admin
PUT /api/hero

GET /api/about/admin
PUT /api/about

GET /api/skills/admin
POST /api/skills
PUT /api/skills/{id}
DELETE /api/skills/{id}

GET /api/education/all
POST /api/education
PUT /api/education/{id}
DELETE /api/education/{id}

GET /api/contact/admin
POST /api/contact
PUT /api/contact/{id}
DELETE /api/contact/{id}

GET /api/testimonials/admin
PUT /api/testimonials/{id}
DELETE /api/testimonials/{id}

GET /api/site-texts/admin
PUT /api/site-texts

POST /api/translation/project-to-en
POST /api/translation/hero-to-en
POST /api/translation/about-to-en
POST /api/translation/skill-to-en
POST /api/translation/education-to-en
POST /api/translation/site-text-to-en
POST /api/translation/testimonial-to-en
```

---

## ✅ Current Status / Mevcut Durum

### 🇹🇷

Proje local ortamda geliştirilmiş ve CMS modülleri test edilmiştir.

Tamamlanan başlıklar:

- Public portfolio website
- Admin dashboard
- Project CMS
- Project images
- Hero CMS
- About CMS
- Skills CMS
- Education CMS
- Contact CMS
- Testimonials CMS
- Site Texts CMS
- JWT authentication
- Rate limiting
- OpenAI translation flow
- Multilingual content flow

### 🇬🇧

The project has been developed and tested locally.

Completed parts:

- Public portfolio website
- Admin dashboard
- Project CMS
- Project images
- Hero CMS
- About CMS
- Skills CMS
- Education CMS
- Contact CMS
- Testimonials CMS
- Site Texts CMS
- JWT authentication
- Rate limiting
- OpenAI translation flow
- Multilingual content flow

---

## 🔮 Future Improvements / Gelecek Geliştirmeler

- Production deployment
- Contact form with backend validation
- SEO metadata CMS
- Sitemap generation
- Refresh token support
- Admin password change screen
- Audit logs
- Image cropping before upload
- Advanced dashboard statistics

---

## 👤 Author / Geliştirici

Developed by Okan Çelikcan.  
Geliştirici: Okan Çelikcan.