USE [um_db]
GO

IF EXISTS (SELECT * FROM sysobjects WHERE id = OBJECT_ID(N'[dbo].[FUN_GetKodeNow]') AND xtype IN (N'FN'))
    DROP FUNCTION [dbo].[FUN_GetKodeNow]
GO

CREATE FUNCTION dbo.FUN_GetKodeNow (@Tanggal DATETIME)
RETURNS VARCHAR(20)
AS
BEGIN
    DECLARE @Kode VARCHAR(20)

    SET @Kode = 'KN' +
        RIGHT(CONVERT(VARCHAR(4), YEAR(@Tanggal)), 2) +
        RIGHT('0' + CONVERT(VARCHAR(2), MONTH(@Tanggal)), 2) +
        RIGHT('0' + CONVERT(VARCHAR(2), DAY(@Tanggal)), 2) +
        RIGHT('0' + CONVERT(VARCHAR(2), DATEPART(HOUR, @Tanggal)), 2) +
        RIGHT('0' + CONVERT(VARCHAR(2), DATEPART(MINUTE, @Tanggal)), 2) +
        RIGHT('00' + CONVERT(VARCHAR(3), DATEPART(MILLISECOND, @Tanggal)), 3)

    RETURN LEFT(@Kode, 14)
END
GO

PRINT dbo.FUN_GetKodeNow('2025-10-07 16:33:04.457')