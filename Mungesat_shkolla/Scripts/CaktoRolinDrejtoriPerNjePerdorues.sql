-- ═══════════════════════════════════════════════════════════════════
--  Cakton rolin "Drejtori" për një përdorues (username ose email).
--  Së pari ekzekutoni ShtoRolinDrejtori.sql që roli të ekzistojë.
--  Ndryshoni @UserName më poshtë me username-in e përdoruesit.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

DECLARE @UserName NVARCHAR(256) = N'drejtori1';  -- <-- Ndryshoje: username ose email i llogarisë
DECLARE @UserId INT;
DECLARE @DrejtoriRoleId INT;

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

SELECT @DrejtoriRoleId = Id FROM [dbo].[Roles] WHERE Name = N'Drejtori';

IF @DrejtoriRoleId IS NULL
BEGIN
    PRINT 'Gabim: Rol "Drejtori" nuk u gjet. Ekzekutoni ShtoRolinDrejtori.sql së pari.';
    RETURN;
END

IF EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE UserId = @UserId AND RoleId = @DrejtoriRoleId)
BEGIN
    PRINT 'Ky përdorues ka tashmë rolin Drejtori.';
    RETURN;
END

INSERT INTO [dbo].[UserRoles] (UserId, RoleId)
VALUES (@UserId, @DrejtoriRoleId);

PRINT 'U caktua roli Drejtori për përdoruesin "' + @UserName + '". Dil nga aplikacioni dhe kyçu përsëri.';
GO
