USE [um_db]
GO

IF EXISTS (SELECT * FROM sysobjects WHERE id = OBJECT_ID(N'[dbo].[fn_FormatSODocID]') AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION [dbo].[fn_FormatSODocID]
GO

CREATE FUNCTION dbo.fn_FormatSODocID (
    @Number INT,
    @Year INT
)
RETURNS VARCHAR(30)
AS
BEGIN
    DECLARE @Result VARCHAR(30)
    DECLARE @Year2Digit VARCHAR(2)
    DECLARE @NumText VARCHAR(10)

    SET @Year2Digit = RIGHT(CONVERT(VARCHAR(4), @Year), 2)
    SET @NumText = RIGHT('000000' + CONVERT(VARCHAR(6), @Number), 6)
    SET @Result = @Year2Digit + '.' + @NumText

    RETURN @Result
END
GO
