-- Shton rolin Administrator për përdoruesin adilj (UserId = 1).
-- Ekzekuto në SSMS kundër eMungesatDb, pastaj dil dhe kyçu përsëri në aplikacion.

USE eMungesatDb;
GO

INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
SELECT 1, 1
WHERE NOT EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = 1 AND RoleId = 1);
-- 1 = adilj, 1 = Administrator

PRINT 'U shtua roli Administrator për adilj. Dil dhe kyçu përsëri.';
GO
