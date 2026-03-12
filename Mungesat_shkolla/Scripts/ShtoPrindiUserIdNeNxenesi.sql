-- ═══════════════════════════════════════════════════════════════════
--  Shton kolonën PrindiUserId në tabelën nxenesi (lidhje me llogarinë e prindit).
--  Ekzekutoni në SSMS kundër eMungesatDb.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.nxenesi') AND name = N'PrindiUserId'
)
BEGIN
    ALTER TABLE [dbo].[nxenesi]
    ADD [PrindiUserId] INT NULL;
    PRINT 'Kolone PrindiUserId u shtua në nxenesi.';
END
ELSE
    PRINT 'Kolone PrindiUserId ekziston tashmë.';
GO
