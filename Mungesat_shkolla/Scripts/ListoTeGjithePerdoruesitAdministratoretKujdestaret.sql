-- ═══════════════════════════════════════════════════════════════════
--  Të gjithë përdoruesit, administratorët dhe kujdestarët
--  Ekzekuto në SQL Server Management Studio kundër eMungesatDb.
-- ═══════════════════════════════════════════════════════════════════

USE eMungesatDb;
GO

-- 1. TË GJITHË PËRDORUESIT (tabela Kujdestari – të gjithë që kyçen në sistem)
PRINT '═══ Të gjithë përdoruesit (Kujdestari) ═══';
SELECT 
    Id,
    UserName,
    Email,
    Emri,
    Mbiemri
FROM [dbo].[Kujdestari]
ORDER BY Id;

-- 2. VETËM ADMINISTRATORËT (përdoruesit me rolin "Administrator")
PRINT '';
PRINT '═══ Administratorët ═══';
SELECT 
    k.Id,
    k.UserName,
    k.Email,
    k.Emri,
    k.Mbiemri
FROM [dbo].[Kujdestari] k
INNER JOIN [dbo].[UserRoles] ur ON ur.UserId = k.Id
INNER JOIN [dbo].[Roles] r ON r.Id = ur.RoleId
WHERE r.Name = N'Administrator'
ORDER BY k.Id;

-- 3. VETËM KUJDESTARËT (përdoruesit me rolin "Kujdestar")
PRINT '';
PRINT '═══ Kujdestarët ═══';
SELECT 
    k.Id,
    k.UserName,
    k.Email,
    k.Emri,
    k.Mbiemri
FROM [dbo].[Kujdestari] k
INNER JOIN [dbo].[UserRoles] ur ON ur.UserId = k.Id
INNER JOIN [dbo].[Roles] r ON r.Id = ur.RoleId
WHERE r.Name = N'Kujdestar'
ORDER BY k.Id;

-- 4. TË GJITHË PËRDORUESIT ME ROLIN (një listë e vetme – përdorues + rol)
PRINT '';
PRINT '═══ Të gjithë përdoruesit me rolin e tyre ═══';
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

GO
