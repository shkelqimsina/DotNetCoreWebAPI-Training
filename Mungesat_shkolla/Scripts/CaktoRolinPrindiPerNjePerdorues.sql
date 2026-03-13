-- ═══════════════════════════════════════════════════════════════════
--  Cakton rolin "Prindi" për një përdorues (username ose email).
--  Së pari ekzekutoni ShtoRolinPrindi.sql që roli të ekzistojë.
--  Ndryshoni @UserName më poshtë me username-in e përdoruesit.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

DECLARE @UserName NVARCHAR(256) = N'prindi1';  -- <-- Ndryshoje: username ose email i llogarisë
DECLARE @UserId INT;
DECLARE @PrindiRoleId INT;

SELECT @UserId = Id
FROM [dbo].[Kujdestari]
WHERE LOWER(LTRIM(RTRIM(UserName))) = LOWER(LTRIM(RTRIM(@UserName)))
   OR LOWER(LTRIM(RTRIM(ISNULL(Email, '')))) = LOWER(LTRIM(RTRIM(@UserName)));

IF @UserId IS NULL
BEGIN
    PRINT 'Gabim: Përdoruesi "' + @UserName + '" nuk u gjet.';
    SELECT Id, UserName, Email, Emri, Mbiemri FROM [dbo].[Kujdestari];
    RETURN;
END

SELECT @PrindiRoleId = Id FROM [dbo].[Roles] WHERE Name = N'Prindi';

IF @PrindiRoleId IS NULL
BEGIN
    PRINT 'Gabim: Rol "Prindi" nuk u gjet. Ekzekutoni ShtoRolinPrindi.sql së pari.';
    RETURN;
END

IF EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = @UserId AND RoleId = @PrindiRoleId)
BEGIN
    PRINT 'Ky përdorues ka tashmë rolin Prindi.';
    RETURN;
END

INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
VALUES (@UserId, @PrindiRoleId);

PRINT 'U caktua roli Prindi për përdoruesin "' + @UserName + '". Dil nga aplikacioni dhe kyçu përsëri.';
GO
