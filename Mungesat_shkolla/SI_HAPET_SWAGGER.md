# Si ta hapësh Swagger-in

## 1. Mbyll çdo instancë të vjetër të API

Porti **5050** duhet të jetë i lirë. Nëse API tashmë po xhiron (ose një proces tjetër e përdor 5050), mbylleni atë.

- Në terminal ku po xhiron `dotnet run`: shtypni **Ctrl+C**.
- Ose mbyllni Visual Studio / Cursor nëse e keni nisur API nga aty.

Për të parë se cili proces e përdor portin 5050 (PowerShell):

```powershell
netstat -ano | findstr :5050
```

Për ta ndalur procesin (zëvendëso `PID` me numrin e fundit nga netstat):

```powershell
Stop-Process -Id PID -Force
```

## 2. Nisni backend-in

Nga folderi i projektit:

```powershell
cd c:\Sources\DotNetCoreWebAPI-Training\Mungesat_shkolla
dotnet run
```

Pritni derisa të shfaqet: **"Now listening on: http://localhost:5050"**.

## 3. Hapni Swagger në shfletues

Hapni në shfletues një nga këto:

- **http://localhost:5050/swagger**
- **http://localhost:5050/swagger/index.html**

Nëse përdorni HTTPS (profil "https"): **https://localhost:7129/swagger**

## Nëse 5050 është ende i zënë

Nisni në një port tjetër:

```powershell
dotnet run --urls "http://localhost:5051"
```

Pastaj hapni: **http://localhost:5051/swagger**
