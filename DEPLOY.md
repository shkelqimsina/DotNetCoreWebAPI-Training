# Hapat për ta bërë eMungesat të përdorshme nga jashtë (prindërit në shtëpi, drejtori në zyrë, kujdestarët nga laptopët)

Aplikacioni tani punon vetëm **lokalisht** (localhost). Që prindërit, drejtori dhe kujdestarët të përdorin aplikacionin nga shtëpia, zyra ose laptopët e tyre, duhet ta **vendosni (deploy)** në një server të aksesueshëm nga të gjithë.

---

## 1. Ku ta hostoni (vendosni) aplikacionin

Ju nevojiten **dy gjëra**:
- **API (backend)** – projekti ASP.NET Core (Mungesat_shkolla)
- **Frontend** – faqja React (mungesat-front-app), e ndërtuar si skedarë statikë

**Opsione të zakonshme:**

| Opsioni | Përshkrim | Vështirësi |
|--------|-----------|------------|
| **A) Një PC/server në shkollë** | PC me Windows Server ose Windows 10/11, me IP të fiksuar ose emër domain. API dhe faqja web serviren nga ky kompjuter. | Mesatare – duhet konfigurim rrjeti (port forwarding, firewall) |
| **B) Hosting në cloud** | P.sh. Azure, DigitalOcean, AWS – API dhe frontend vendosen atje. | Mesatare – kosto mujore, por pa u shqetësuar për rrjetin e shkollës |
| **C) ISP / kompani hosting lokale** | Një shërbim hosting në vend që ofron Windows/IIS ose Linux. | Varësisht nga oferta |

Në vijim supozojmë që keni **një server** (PC në shkollë ose VPS në cloud) me adresë të njohur, p.sh. `https://emungesat.shkolla.edu` ose `http://192.168.1.100`.

---

## 2. Përgatitja e **backend-it (API)**

### 2.1 Baza e të dhënave
- **SQL Server** duhet të jetë i instaluar dhe i dostueshëm nga API-ja (në të njëjtën makinë ose në një server tjetër).
- Në serverin e prodhimit, përdorni **Connection String** që tregon te SQL Server-i i prodhimit (jo `localhost` nëse baza është në një PC tjetër).
- Ekzekutoni skriptet SQL (tabela, rolet, etj.) në atë bazë të dhënash.

### 2.2 Konfigurimi për prodhim
- Kopjoni `appsettings.json` në `appsettings.Production.json` (ose përditësoni direkt në server).
- Në `appsettings.Production.json` (ose në variabla mjedisi) vendosni:
  - **ConnectionStrings:MungesatConnectionString** – connection string për SQL Server-in e prodhimit.
  - **JWT:Issuer** dhe **JWT:Audience** – URL e API-së, p.sh. `https://emungesat.shkolla.edu` ose `https://api.emungesat.shkolla.edu`.
  - **CORS:AllowedOrigins** – URL e faqes së frontend-it, p.sh. `https://emungesat.shkolla.edu` (ku do të hapen prindërit/drejtori aplikacionin).

### 2.3 Publikimi i API-së
- Në Visual Studio: klikoni të djathtë mbi projektin **Mungesat_shkolla** → **Publish** → zgjidhni folder ose profil (IIS, Azure, Folder).
- Ose nga terminali:
  ```bash
  cd Mungesat_shkolla
  dotnet publish -c Release -o ./publish
  ```
- Në server: instaloni **.NET Runtime** (për .NET 8) dhe nëse përdorni IIS, konfiguroni një site që tregon te folderi `publish` dhe përdorni **HTTPS** (certifikatë SSL).

---

## 3. Përgatitja e **frontend-it** (faqja që hapin prindërit/drejtori)

- Frontend-i duhet të “flasë” me API-në e **prodhimit**, jo me localhost.
- Në projektin **mungesat-front-app** krijohet një ndërtim (build) ku **URL e API-së** merret nga konfigurimi (shiko seksionin 4 më poshtë).
- Ndërtoni:
  ```bash
  cd mungesat-front-app
  npm run build
  ```
- Rezultati është në folderin `dist/`. Këto skedarë (HTML, JS, CSS) duhen servuar nga një **web server** (IIS, nginx, Apache) në të njëjtën adresë që keni futur në CORS (p.sh. `https://emungesat.shkolla.edu`).

---

## 4. Çfarë është ndryshuar në kod për prodhim

- **Backend:** CORS dhe JWT lexohen nga konfigurimi; në prodhim përdorni `appsettings.Production.json` ose variabla mjedisi për URL e API-së dhe origjina e lejuara (frontend).
- **Frontend:** Në build për prodhim, URL e API-së merret nga **VITE_API_URL** (pa `/api` në fund – shtohet automatikisht). Kur bëni build, p.sh.:
  - **Windows (CMD):** `set VITE_API_URL=https://emungesat.shkolla.edu` dhe pastaj `npm run build`
  - **Windows (PowerShell):** `$env:VITE_API_URL="https://emungesat.shkolla.edu"; npm run build`
  - **Linux/Mac:** `export VITE_API_URL=https://emungesat.shkolla.edu` dhe pastaj `npm run build`
  Kështu aplikacioni do të thërrasë API-në në atë adresë; prindërit, drejtori dhe kujdestarët e hapin faqen nga e njëjta adresë (ku keni vendosur skedarët e `dist/`).

---

## 5. Rrjeti dhe siguria

- **Firewall:** Hapni portin ku dëgjon API-ja (p.sh. 443 për HTTPS) nga rrjeti i nevojshëm (LAN e shkollës, VPN, ose internet, varësisht nga nevoja).
- **HTTPS:** Në prodhim përdorni gjithmonë **HTTPS** (certifikatë SSL) që të mos kalojnë fjalëkalime në tekst të qartë.
- **Fjalëkalimi i bazës së të dhënave:** Në connection string përdorni një llogari me fjalëkalim të fortë dhe të kufizuar vetëm për këtë aplikacion.

---

## 6. Përmbledhje e shkurtër e hapave

1. **Zgjidhni** ku do të hostoni: server në shkollë ose cloud.
2. **Vendosni** SQL Server dhe ekzekutoni skriptet e bazës së të dhënave.
3. **Konfiguroni** `appsettings.Production.json` (connection string, JWT Issuer/Audience, CORS AllowedOrigins).
4. **Publish** backend-in (API) në server dhe konfiguroni web server (IIS ose Kestrel).
5. **Vendosni** `VITE_API_URL` me URL e API-së, bëni `npm run build` dhe **vendosni** skedarët e `dist/` në web server.
6. **Hapni** portet e nevojshme dhe përdorni **HTTPS**.
7. **Jepni** linkun e faqes (p.sh. `https://emungesat.shkolla.edu`) prindërve, drejtorit dhe kujdestarëve – ata e hapin nga shtëpia, zyra ose laptopët.

Pas këtyre hapave, API-ja mund të thirret nga prindërit në shtëpi, drejtori në zyrë dhe kujdestarët nga laptopët e tyre, me kusht që ata të kenë qasje në internet (ose në rrjetin e shkollës) te URL që keni konfiguruar.
