-- ═══════════════════════════════════════════════════════════════════
--  Shton rolin "Prindi" në tabelën Roles (nëse nuk ekziston).
--  Ekzekutoni në SSMS kundër eMungesatDb.
--  Pas kësaj, për t'u caktuar roli Prindi një përdoruesi, përdorni
--  skriptin CaktoRolinPrindiPerNjePerdorues.sql (ose shtoni manualisht
--  në UserRoles: UserId të përdoruesit dhe RoleId të rolit Prindi).
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE Name = N'Prindi')
BEGIN
    INSERT INTO [dbo].[Roles] (Name, NormalizedName, ConcurrencyStamp)
    VALUES (N'Prindi', N'PRINDI', NEWID());
    PRINT 'Roli "Prindi" u shtua.';
END
ELSE
    PRINT 'Roli "Prindi" ekziston tashmë.';
GO
