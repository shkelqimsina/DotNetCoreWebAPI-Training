-- Shton rolin "Drejtori" në tabelën Roles (nëse nuk ekziston).
USE eMungesatDb;
GO
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE Name = N'Drejtori')
BEGIN
    INSERT INTO [dbo].[Roles] (Name, NormalizedName, ConcurrencyStamp)
    VALUES (N'Drejtori', N'DREJTORI', NEWID());
    PRINT 'Roli "Drejtori" u shtua.';
END
ELSE
    PRINT 'Roli "Drejtori" ekziston tashmë.';
GO
