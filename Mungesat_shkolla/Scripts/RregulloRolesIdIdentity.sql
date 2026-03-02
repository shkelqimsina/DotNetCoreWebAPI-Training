-- ═══════════════════════════════════════════════════════════════════
--  Rregullon tabelën Roles: Id bëhet INT IDENTITY(1,1).
--  UserRoles rikrijohet me RoleId INT (përputhet me Roles.Id).
--  Ekzekutoni në SSMS kundër eMungesatDb. Pas kësaj: ShtoRolinAdministrator.sql, pastaj rinisni backend-in.
-- ═══════════════════════════════════════════════════════════════════

USE [eMungesatDb];
GO

-- 1. Heq çdo FK që referencon Roles
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE [' + OBJECT_SCHEMA_NAME(parent_object_id) + '].[' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
FROM sys.foreign_keys
WHERE referenced_object_id = OBJECT_ID('dbo.Roles');
IF LEN(@sql) > 0 EXEC sp_executesql @sql;

-- 2. Heq FK nga UserRoles drejt Kujdestari (nëse ka), pastaj fshij UserRoles
IF OBJECT_ID('dbo.UserRoles') IS NOT NULL
BEGIN
    SET @sql = '';
    SELECT @sql = @sql + 'ALTER TABLE [dbo].[UserRoles] DROP CONSTRAINT [' + name + '];'
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('dbo.UserRoles');
    IF LEN(@sql) > 0 EXEC sp_executesql @sql;
    DROP TABLE [dbo].[UserRoles];
END

-- 3. Fshi RoleClaims dhe Roles
DROP TABLE IF EXISTS [dbo].[RoleClaims];
DROP TABLE IF EXISTS [dbo].[Roles];

-- 4. Rikrijo Roles me Id INT IDENTITY
CREATE TABLE [dbo].[Roles] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(256) NULL,
    [NormalizedName] NVARCHAR(256) NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
);

INSERT INTO [dbo].[Roles] ([Name], [NormalizedName], [ConcurrencyStamp])
VALUES (N'Administrator', N'ADMINISTRATOR', NEWID()),
       (N'Kujdestar', N'KUJDESTAR', NEWID());

-- 5. Rikrijo RoleClaims
CREATE TABLE [dbo].[RoleClaims] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [RoleId] INT NOT NULL,
    [ClaimType] NVARCHAR(MAX) NULL,
    [ClaimValue] NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_RoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoleClaims_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
);

-- 6. Rikrijo UserRoles me UserId INT, RoleId INT
CREATE TABLE [dbo].[UserRoles] (
    [UserId] INT NOT NULL,
    [RoleId] INT NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserRoles_Kujdestari_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Kujdestari] ([Id]) ON DELETE CASCADE
);

PRINT 'Roles dhe UserRoles u rregulluan. Tani ekzekutoni ShtoRolinAdministrator.sql për të caktuar Administrator, pastaj rinisni backend-in.';
GO
