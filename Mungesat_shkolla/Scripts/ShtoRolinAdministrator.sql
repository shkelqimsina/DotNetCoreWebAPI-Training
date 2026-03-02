-- ═══════════════════════════════════════════════════════════════════
--  Shto një përdorues si ADMINISTRATOR (që të mund të shtosh kujdestarë)
-- ═══════════════════════════════════════════════════════════════════
--  1. Ndrysho 'adilj' më poshtë me username ose email-in TËND.
--  2. Ekzekuto këtë skriptë në SSMS kundër eMungesatDb.
--  3. Nëse përsëri nuk gjendet, ekzekuto vetëm bllokun "Lista e përdoruesve"
--     më poshtë – do të shohësh saktësisht çfarë ka në bazë dhe kopjoje vlerën.
--  4. Dil nga aplikacioni dhe kyçu përsëri.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

DECLARE @UserName NVARCHAR(256) = N'ilmib';  -- <-- Ndryshoje: username OSE email i llogarisë së parë
DECLARE @UserId INT;
DECLARE @AdminRoleId INT;

-- Kërkim sipas UserName ose Email (pa dallim të madhësisë së shkronjave)
SELECT @UserId = Id
FROM [dbo].[Kujdestari]
WHERE LOWER(LTRIM(RTRIM(UserName))) = LOWER(LTRIM(RTRIM(@UserName)))
   OR LOWER(LTRIM(RTRIM(ISNULL(Email, '')))) = LOWER(LTRIM(RTRIM(@UserName)));

IF @UserId IS NULL
BEGIN
    PRINT 'Gabim: Përdoruesi "' + @UserName + '" nuk u gjet.';
    PRINT '';
    PRINT 'Lista e përdoruesve në bazë (kopjoje UserName ose Email dhe provo përsëri):';
    SELECT Id, UserName, Email, Emri, Mbiemri FROM [dbo].[Kujdestari];
    RETURN;
END

SELECT @AdminRoleId = Id FROM [dbo].[Roles] WHERE Name = N'Administrator';

IF @AdminRoleId IS NULL
BEGIN
    PRINT 'Gabim: Rol "Administrator" nuk u gjet në tabelën Roles.';
    RETURN;
END

IF EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = @UserId AND RoleId = @AdminRoleId)
BEGIN
    PRINT 'Ky përdorues është tashmë Administrator.';
    RETURN;
END

INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
VALUES (@UserId, @AdminRoleId);

PRINT 'U shtua roli Administrator për përdoruesin "' + @UserName + '". Dil dhe kyçu përsëri.';
GO

-- ═══════════════════════════════════════════════════════════════════
--  LISTA E TË GJITHË PËRDORUESVE (ekzekutoje nëse nuk e di saktë username-in)
-- ═══════════════════════════════════════════════════════════════════
/*
USE eMungesatDb;
SELECT Id, UserName, Email, Emri, Mbiemri FROM [dbo].[Kujdestari];
*/
