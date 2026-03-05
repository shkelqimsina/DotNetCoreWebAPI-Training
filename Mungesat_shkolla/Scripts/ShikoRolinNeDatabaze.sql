-- ═══════════════════════════════════════════════════════════════════
--  Si të shikosh rolin në databazë dhe të rregullosh përdoruesin e parë
-- ═══════════════════════════════════════════════════════════════════
--  Ekzekuto në SSMS kundër eMungesatDb.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

-- 1. Shiko rolet që ekzistojnë në sistem
PRINT '═══ Rolet në tabelën Roles ═══';
SELECT Id, Name, NormalizedName FROM [dbo].[Roles];

-- 2. Shiko të gjithë përdoruesit ME rolin e tyre (lidhje Kujdestari + UserRoles + Roles)
PRINT '';
PRINT '═══ Përdoruesit dhe rolet e tyre ═══';
SELECT 
    k.Id AS UserId,
    k.UserName,
    k.Email,
    k.Emri,
    k.Mbiemri,
    r.Name AS Roli
FROM [dbo].[Kujdestari] k
LEFT JOIN [dbo].[UserRoles] ur ON ur.UserId = k.Id
LEFT JOIN [dbo].[Roles] r ON r.Id = ur.RoleId
ORDER BY k.Id;

-- 3. Nëse përdoruesi i parë (Id më i vogël) nuk ka rol, shtoje si Administrator
--    (Përdoruesi i parë që krijohet nga regjistrimi duhet të jetë Administrator;
--     ndonjëherë roli nuk u caktua nëse tabela Roles/UserRoles nuk ishin gati.)

DECLARE @UserId INT;
DECLARE @AdminRoleId INT;
DECLARE @UserName NVARCHAR(256);

-- Përdoruesi me Id më të vogël = i pari i krijuar
SELECT TOP 1 @UserId = Id, @UserName = UserName
FROM [dbo].[Kujdestari]
ORDER BY Id;

SELECT @AdminRoleId = Id FROM [dbo].[Roles] WHERE Name = N'Administrator';

IF @AdminRoleId IS NULL
BEGIN
    PRINT '';
    PRINT 'Gabim: Rol "Administrator" nuk ekziston në Roles. Ekzekuto RregulloRolesIdIdentity.sql fillimisht.';
END
ELSE IF @UserId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = @UserId)
BEGIN
    INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
    VALUES (@UserId, @AdminRoleId);
    PRINT '';
    PRINT 'U shtua roli Administrator për përdoruesin e parë: "' + ISNULL(@UserName, '') + '" (Id = ' + CAST(@UserId AS NVARCHAR(10)) + ').';
    PRINT 'Dil nga aplikacioni dhe kyçu përsëri.';
END
ELSE IF @UserId IS NOT NULL
BEGIN
    PRINT '';
    PRINT 'Përdoruesi i parë (' + ISNULL(@UserName, '') + ') ka tashmë një rol. Nëse do Administrator, përdor ShtoRolinAdministrator.sql me @UserName = N''adilj''.';
END
GO

-- ═══════════════════════════════════════════════════════════════════
--  Nëse përsëri Roli është NULL për adilj: ekzekuto VETËM këtë bllok
--  (Zgjidh këto 4 rreshta, F5, pastaj dil dhe kyçu përsëri në app.)
-- ═══════════════════════════════════════════════════════════════════
/*
USE eMungesatDb;
INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
SELECT 1, 1
WHERE NOT EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = 1 AND RoleId = 1);
-- UserId=1 është adilj, RoleId=1 është Administrator
*/
