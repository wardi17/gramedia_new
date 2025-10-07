use [um_db]
GO
CREATE FUNCTION dbo.fn_FormatSODocID (@Number INT)
RETURNS VARCHAR(30)
AS
BEGIN
    DECLARE @Result VARCHAR(30)

    -- Format: dua digit tahun sekarang + '.' + nomor urut dengan padding nol (6 digit)
    SET @Result = 
        RIGHT(CAST(YEAR(GETDATE()) AS VARCHAR(4)), 2)
        + '.' 
        + RIGHT('000000' + CAST(@Number AS VARCHAR(6)), 6)

    RETURN @Result
END
GO
