-- Shton kolonat për arsyetimin e prindit (tekst + emër skedari) në mungesa.
USE eMungesatDb;
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'ArsyetimPrindi')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [ArsyetimPrindi] nvarchar(max) NULL;
END
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.mungesa') AND name = N'SkedarArsyetimit')
BEGIN
    ALTER TABLE [dbo].[mungesa] ADD [SkedarArsyetimit] nvarchar(max) NULL;
END
GO
