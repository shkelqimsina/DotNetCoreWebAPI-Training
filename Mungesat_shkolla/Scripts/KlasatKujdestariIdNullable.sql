-- E bën kolonën KujdestariId të tabelës Klasat të pranojë NULL (që të mund të fshihet një kujdestar pa e fshirë klasën).
USE eMungesatDb;
GO
ALTER TABLE [dbo].[Klasat]
ALTER COLUMN [KujdestariId] INT NULL;
GO
PRINT 'KujdestariId tani lejon NULL.';
GO
