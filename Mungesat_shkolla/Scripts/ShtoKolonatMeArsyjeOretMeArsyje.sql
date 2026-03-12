-- Shto kolonat MeArsyje dhe OretMeArsyje në tabelën mungesa.
-- Ekzekutoni në SSMS kundër eMungesatDb (Execute / F5).

USE [eMungesatDb];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'MeArsyje'
)
BEGIN
    ALTER TABLE [dbo].[mungesa]
    ADD [MeArsyje] bit NOT NULL DEFAULT 0;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'OretMeArsyje'
)
BEGIN
    ALTER TABLE [dbo].[mungesa]
    ADD [OretMeArsyje] nvarchar(max) NULL;
END
GO
