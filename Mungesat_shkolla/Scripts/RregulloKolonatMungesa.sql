-- ═══════════════════════════════════════════════════════════════════
--  Shton kolonat që mungojnë në tabelën mungesa (për fushat "me arsyje",
--  orët me arsyje, arsyetim prindi, skedar arsyetimi).
--  Ekzekutoni në SSMS kundër eMungesatDb (Execute / F5).
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

-- MeArsyje, OretMeArsyje
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'MeArsyje')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [MeArsyje] bit NOT NULL DEFAULT 0;
    PRINT 'Kolone MeArsyje u shtua.';
END
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'OretMeArsyje')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [OretMeArsyje] nvarchar(max) NULL;
    PRINT 'Kolone OretMeArsyje u shtua.';
END
GO

-- ArsyetimPrindi, SkedarArsyetimit
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'ArsyetimPrindi')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [ArsyetimPrindi] nvarchar(max) NULL;
    PRINT 'Kolone ArsyetimPrindi u shtua.';
END
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'SkedarArsyetimit')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [SkedarArsyetimit] nvarchar(max) NULL;
    PRINT 'Kolone SkedarArsyetimit u shtua.';
END
GO

PRINT 'Tabela mungesa u rregullua. Mund të fusni mungesa tani.';
