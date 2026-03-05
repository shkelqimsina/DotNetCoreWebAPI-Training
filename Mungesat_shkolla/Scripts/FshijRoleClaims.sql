-- ═══════════════════════════════════════════════════════════════════
--  Fshin të gjitha rreshtat nga RoleClaims (e kryn krejt).
--  Nëse tabela nuk ekziston, nuk bën asgjë.
--  Ekzekutoni në SSMS kundër eMungesatDb.
-- ═══════════════════════════════════════════════════════════════════

USE [eMungesatDb];
GO

IF OBJECT_ID(N'dbo.RoleClaims', N'U') IS NOT NULL
BEGIN
    DELETE FROM [dbo].[RoleClaims];
    PRINT 'RoleClaims u kryer – të gjitha rreshtat u fshinë.';
END
ELSE
    PRINT 'Tabela RoleClaims nuk ekziston – nuk ka asgjë për ta fshirë.';
GO
