-- ═══════════════════════════════════════════════════════════════════
--  Rregullim një herë për PC të shkollës:
--  1) Shton kolonën PrindiUserId në nxenesi (heq "Të dhënat nuk u ngarkuan" / 500).
--  2) Fshin klasat ekzistuese në Klasat (heq "duplicate key" kur shtoni klasën e parë).
--  Ekzekutoni në SSMS kundër eMungesatDb.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

-- ─── 1. Shto PrindiUserId në nxenesi nëse mungon ───
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.nxenesi') AND name = N'PrindiUserId'
)
BEGIN
    ALTER TABLE [dbo].[nxenesi]
    ADD [PrindiUserId] INT NULL;
    PRINT 'Kolone PrindiUserId u shtua në nxenesi.';

    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_nxenesi_Kujdestari_PrindiUserId')
    BEGIN
        ALTER TABLE [dbo].[nxenesi]
        ADD CONSTRAINT [FK_nxenesi_Kujdestari_PrindiUserId]
        FOREIGN KEY ([PrindiUserId]) REFERENCES [dbo].[Kujdestari]([Id]);
        PRINT 'Foreign key u shtua.';
    END
END
ELSE
    PRINT 'PrindiUserId ekziston tashmë.';
GO

-- ─── 2. Pastro Klasat (që të mund të shtoni klasën e parë pa "duplicate key") ───
-- Nëse nuk doni të fshini klasat, komentoni dy rreshtat e poshtëm (DELETE dhe DBCC).
DELETE FROM [dbo].[Klasat];
PRINT 'Klasat u pastruan.';
DBCC CHECKIDENT ('dbo.Klasat', RESEED, 0);
GO
