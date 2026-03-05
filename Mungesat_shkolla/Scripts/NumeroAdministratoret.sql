-- Sa veta janë Administrator? (përdoruesit me rolin "Administrator")
USE [eMungesatDb];

SELECT COUNT(*) AS NumriAdministratoreve
FROM [dbo].[UserRoles] ur
INNER JOIN [dbo].[Roles] r ON r.Id = ur.RoleId
WHERE r.Name = N'Administrator';

-- Lista e administratorëve (Id, UserName, Emri, Mbiemri)
SELECT k.Id, k.UserName, k.Emri, k.Mbiemri
FROM [dbo].[Kujdestari] k
INNER JOIN [dbo].[UserRoles] ur ON ur.UserId = k.Id
INNER JOIN [dbo].[Roles] r ON r.Id = ur.RoleId
WHERE r.Name = N'Administrator';
