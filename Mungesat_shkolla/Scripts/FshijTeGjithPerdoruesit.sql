-- ═══════════════════════════════════════════════════════════════════
--  FILLOJ NGA ZERO – Fshin TË GJITHA të dhënat e aplikacionit
-- ═══════════════════════════════════════════════════════════════════
--  Fshirë: mungesat, nxënësit, klasat, kujdestarët (përdoruesit).
--  Pas kësaj mund të regjistroheni si i pari (= Administrator) dhe
--  të shtoni klasa, nxënës dhe mungesa nga e para.
--  Ekzekutoni kundër eMungesatDb në SSMS (Execute / F5).
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

-- 1. Mungesat
DELETE FROM [dbo].[mungesa];

-- 2. Nxënësit
DELETE FROM [dbo].[nxenesi];

-- 3. Klasa–Lenda (lidhja klasë–lëndë)
IF OBJECT_ID(N'dbo.klasaLenda', N'U') IS NOT NULL
   DELETE FROM [dbo].[klasaLenda];

-- 4. Klasat
DELETE FROM [dbo].[Klasat];

-- 5. Tabelat Identity (lidhen me përdoruesit)
DELETE FROM [dbo].[UserTokens];
DELETE FROM [dbo].[UserClaims];
DELETE FROM [dbo].[UserLogins];
DELETE FROM [dbo].[UserRoles];

-- 6. Kujdestarët (përdoruesit)
DELETE FROM [dbo].[Kujdestari];

-- 7. (Opsional) Rifillim i numëruesve ID nga 1
DBCC CHECKIDENT ('[dbo].[mungesa]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[nxenesi]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Klasat]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Kujdestari]', RESEED, 0);

PRINT 'E gatshme. Të gjitha të dhënat janë fshirë – fillon nga zero. Regjistrohuni si i pari për të qenë Administrator.';
GO
   USE eMungesatDb;
   SELECT Id, UserName, Emri, Mbiemri, Email FROM [dbo].[Kujdestari];
