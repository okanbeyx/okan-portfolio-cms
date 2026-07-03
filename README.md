# Okan Portfolio CMS

Modern, multilingual, SEO-friendly and CMS-based personal portfolio system.  
Modern, çok dilli, SEO uyumlu ve CMS destekli kişisel portföy sistemi.

🔗 Live Website: https://okancelikcan.com

---

## 🇹🇷 Proje Hakkında

Okan Portfolio CMS, klasik statik portföy yapısını dinamik, yönetilebilir ve ürün mantığına sahip bir CMS sistemine dönüştürmek amacıyla geliştirilen full-stack bir portföy projesidir.

Proje; SEO uyumlu public portföy sitesi, korumalı admin CMS paneli ve ASP.NET Core Web API backend yapısından oluşur.

Public portföy sitesi Next.js ile geliştirilmiştir. Bu sayede sayfalar SEO açısından daha uygun şekilde prerender edilir; sitemap, robots.txt, canonical URL, Open Graph metadata ve JSON-LD structured data desteği sağlanır.

Admin panel üzerinden projeler, hero alanı, hakkımda bölümü, teknik yetenekler, eğitim geçmişi, iletişim bağlantıları, yorumlar ve site metinleri yönetilebilir.

Sistem Türkçe ve İngilizce içerik desteğine sahiptir. Admin Türkçe içerik girdikten sonra OpenAI entegrasyonu ile İngilizce içerikler otomatik olarak oluşturulabilir ve gerektiğinde manuel olarak düzenlenebilir.

---

## 🇬🇧 About the Project

Okan Portfolio CMS is a full-stack portfolio management system designed to transform a classic static portfolio into a dynamic, manageable and product-oriented CMS platform.

The project consists of an SEO-friendly public portfolio website, a protected admin CMS panel and an ASP.NET Core Web API backend.

The public portfolio website is built with Next.js. This provides prerendered pages, better SEO support, sitemap, robots.txt, canonical URLs, Open Graph metadata and JSON-LD structured data.

Through the admin panel, projects, hero content, about section, technical skills, education history, contact links, testimonials and site texts can be managed dynamically.

The system supports Turkish and English content. The admin can enter Turkish content first, generate English content automatically with OpenAI integration, and manually edit the generated content when needed.

---

## 🚀 Features / Özellikler

### 🇹🇷 Özellikler

- SEO uyumlu public portföy sitesi
- Next.js tabanlı prerender edilmiş public frontend
- React + Vite tabanlı admin CMS paneli
- ASP.NET Core Web API backend
- MSSQL veritabanı
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
- Mobil uyumlu navbar ve dil değiştirici
- Login rate limiting
- Public yorum gönderme rate limiting
- robots.txt desteği
- sitemap.xml desteği
- Canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- Google Search Console uyumluluğu
- User-secrets / environment variables ile güvenli secret yönetimi

### 🇬🇧 Features

- SEO-friendly public portfolio website
- Next.js-based prerendered public frontend
- React + Vite-based admin CMS panel
- ASP.NET Core Web API backend
- MSSQL database
- JWT-based admin authentication
- Custom admin route structure
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
- Mobile-friendly navbar and language switcher
- Login rate limiting
- Public testimonial submission rate limiting
- robots.txt support
- sitemap.xml support
- Canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- Google Search Console support
- Secure secret management with user-secrets / environment variables

---

## 🧱 Project Architecture / Proje Mimarisi

This project consists of three main parts:

Bu proje üç ana parçadan oluşur:

### 1. Public Portfolio Website

- Built with Next.js
- SEO-friendly prerendered output
- Fetches dynamic content from the ASP.NET Core API
- Turkish and English content support
- Mobile responsive design
- robots.txt and sitemap.xml support
- JSON-LD structured data
- Open Graph and Twitter metadata
- Deployed on Vercel

### 2. Admin CMS Panel

- Built with React and Vite
- Protected admin login
- JWT-based authentication
- CMS modules for managing:
  - Hero content
  - Projects
  - Project images
  - Skills
  - About section
  - Education timeline
  - Contact links
  - Testimonials
  - Site texts
- Deployed separately from the public Next.js frontend

### 3. Backend API

- ASP.NET Core Web API
- MSSQL database
- Entity Framework Core
- JWT authentication
- Rate limiting
- Secure configuration practices
- OpenAI API integration for automatic English content generation
- Hosted separately from the frontend applications

---

## 🛠 Tech Stack / Kullanılan Teknolojiler

### Public Frontend

- Next.js
- React
- Tailwind CSS
- JavaScript
- JSON-LD structured data
- Vercel deployment

### Admin Frontend

- React
- Vite
- Tailwind CSS
- React Router
- React Icons

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication
- Rate Limiting Middleware
- OpenAI API Integration

### Database

- Microsoft SQL Server

### Deployment & Infrastructure

- Vercel for public frontend
- Vercel for admin frontend
- Plesk / Windows hosting for ASP.NET Core API
- Cloudflare DNS
- Google Search Console

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
├── frontend
│   ├── public
│   └── src
│
├── frontend-next
│   ├── public
│   └── src
│       ├── app
│       ├── components
│       ├── data
│       ├── hooks
│       └── services
│
└── README.md
```

### Folder Notes

- `backend/` contains the ASP.NET Core Web API.
- `frontend/` contains the React + Vite admin/CMS frontend.
- `frontend-next/` contains the SEO-friendly Next.js public portfolio frontend.

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
git clone https://github.com/okanbeyx/okan-portfolio-cms.git
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

JWT key, OpenAI API key, production database connection string ve admin şifresi `user-secrets` veya production ortamında environment variable üzerinden yönetilmelidir.

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

Admin seed değerleri:

```bash
dotnet user-secrets set "AdminSeed:UserName" "YOUR_ADMIN_USERNAME"
dotnet user-secrets set "AdminSeed:Email" "admin@example.com"
dotnet user-secrets set "AdminSeed:FullName" "Admin User"
dotnet user-secrets set "AdminSeed:Password" "YOUR_STRONG_ADMIN_PASSWORD"
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "true"
```

Admin girişi başarılı olduktan sonra şifre resetleme ayarı kapatılmalıdır:

```bash
dotnet user-secrets set "AdminSeed:ResetExistingPassword" "false"
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

## 6. Next.js Public Frontend’i Çalıştır

Yeni terminal aç ve Next.js frontend klasörüne git:

```bash
cd frontend-next
```

Paketleri yükle:

```bash
npm install
```

`frontend-next` içinde `.env.local` dosyası oluştur:

```env
API_BASE_URL=http://localhost:5231/api
NEXT_PUBLIC_API_BASE_URL=/api
```

Geliştirme sunucusunu çalıştır:

```bash
npm run dev
```

Varsayılan Next.js adresi:

```txt
http://localhost:3000
```

Build almak için:

```bash
npm run build
```

---

## 7. React/Vite Admin Frontend’i Çalıştır

Yeni terminal aç ve admin frontend klasörüne git:

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

Varsayılan Vite adresi:

```txt
http://localhost:5173
```

---

## 8. Admin Panel

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
git clone https://github.com/okanbeyx/okan-portfolio-cms.git
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

JWT key, OpenAI API key, production database connection string and admin password should be managed through `user-secrets` during local development or environment variables in production.

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

## 6. Run the Next.js Public Frontend

Open a new terminal and go to the Next.js frontend folder:

```bash
cd frontend-next
```

Install packages:

```bash
npm install
```

Create a `.env.local` file inside the `frontend-next` folder:

```env
API_BASE_URL=http://localhost:5231/api
NEXT_PUBLIC_API_BASE_URL=/api
```

Run the development server:

```bash
npm run dev
```

Default Next.js URL:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

---

## 7. Run the React/Vite Admin Frontend

Open a new terminal and go to the admin frontend folder:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5231/api
```

Update the backend port if your API runs on a different port.

Run the admin frontend:

```bash
npm run dev
```

Default Vite URL:

```txt
http://localhost:5173
```

---

## 8. Admin Panel

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
Production appsettings files
Deployment output folders
```

Geliştirme ortamında `user-secrets`, production ortamında environment variables veya hosting sağlayıcısının secret manager sistemi kullanılmalıdır.

Aşağıdaki dosya ve klasörler repository’ye dahil edilmemelidir:

```txt
.env
.env.local
appsettings.Production.json
publish/
publish-x86/
node_modules/
.next/
dist/
```

### 🇬🇧

Sensitive values must not be committed to the repository.

Do not commit:

```txt
JWT secret key
OpenAI API key
Production database connection string
Admin password
Production appsettings files
Deployment output folders
```

Use `user-secrets` for local development and environment variables or a hosting secret manager for production.

The following files and folders should not be included in the repository:

```txt
.env
.env.local
appsettings.Production.json
publish/
publish-x86/
node_modules/
.next/
dist/
```

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

## 🔎 SEO Features / SEO Özellikleri

### 🇹🇷

Public site SEO uyumlu olması için Next.js’e taşınmıştır.

Eklenen SEO özellikleri:

- Next.js prerendered public pages
- Custom title ve meta description
- Canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- Person schema
- WebSite schema
- ProfilePage schema
- robots.txt
- sitemap.xml
- Google Search Console doğrulama uyumluluğu
- Mobil uyumlu yapı
- Yüksek PageSpeed performansı

### 🇬🇧

The public site has been migrated to Next.js for better SEO support.

Implemented SEO features:

- Next.js prerendered public pages
- Custom title and meta description
- Canonical URL
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- Person schema
- WebSite schema
- ProfilePage schema
- robots.txt
- sitemap.xml
- Google Search Console verification support
- Mobile-friendly layout
- High PageSpeed performance

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

## 🚀 Deployment / Canlıya Alma

### 🇹🇷

Canlı mimari:

```txt
Public Website      → Next.js on Vercel
Admin CMS Frontend  → React/Vite on Vercel
Backend API         → ASP.NET Core API on Windows/Plesk hosting
Database            → MSSQL
DNS                 → Cloudflare
```

Public site:

```txt
https://okancelikcan.com
```

Backend API:

```txt
https://api.example.com/api
```

Public site Next.js olduğu için `robots.txt` ve `sitemap.xml` otomatik olarak sunulur.

### 🇬🇧

Production architecture:

```txt
Public Website      → Next.js on Vercel
Admin CMS Frontend  → React/Vite on Vercel
Backend API         → ASP.NET Core API on Windows/Plesk hosting
Database            → MSSQL
DNS                 → Cloudflare
```

Public website:

```txt
https://okancelikcan.com
```

Backend API:

```txt
https://api.example.com/api
```

Since the public website is served with Next.js, `robots.txt` and `sitemap.xml` are provided automatically.

---

## ✅ Current Status / Mevcut Durum

### 🇹🇷

Proje canlıya alınmış ve public site Next.js altyapısına taşınmıştır.

Tamamlanan başlıklar:

- Next.js public portfolio website
- React/Vite admin CMS panel
- ASP.NET Core Web API
- MSSQL database integration
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
- SEO metadata
- robots.txt
- sitemap.xml
- Google Search Console setup
- Domain deployment

### 🇬🇧

The project has been deployed and the public site has been migrated to a Next.js-based architecture.

Completed parts:

- Next.js public portfolio website
- React/Vite admin CMS panel
- ASP.NET Core Web API
- MSSQL database integration
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
- SEO metadata
- robots.txt
- sitemap.xml
- Google Search Console setup
- Domain deployment

---

## 🔮 Future Improvements / Gelecek Geliştirmeler

- Admin password change screen
- Refresh token support
- Audit logs
- Advanced dashboard statistics
- Contact form with backend validation
- Image cropping before upload
- SEO metadata management from CMS
- Blog/articles module for organic traffic
- Admin panel migration into Next.js
- Advanced analytics integration

---

## 👤 Author / Geliştirici

Developed by Okan Çelikcan.  
Geliştirici: Okan Çelikcan.

Portfolio: https://okancelikcan.com
