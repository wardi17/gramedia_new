USE [um_db]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author      : WARDI
-- Create date : 2-10-2025 13:33
-- Description : INSERT master_gramed_lokasi
-- =============================================
CREATE PROCEDURE USP_SimpanDataMastergramedLokasi
    @id_toko VARCHAR(50),
    @customerid VARCHAR(50),
    @namatoko VARCHAR(50),
    @alamat VARCHAR(3000)

AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
    SELECT 1 
    FROM [um_db].[dbo].master_gramed_lokasi 
    WHERE id_toko = @id_toko
)
BEGIN
    UPDATE [um_db].[dbo].master_gramed_lokasi
    SET customer_id= @customerid,
        nama_toko = @namatoko,
        alamat    =@alamat
    WHERE id_toko = @id_toko
END
ELSE
BEGIN
    INSERT INTO [um_db].[dbo].master_gramed_lokasi
        (id_toko, customer_id, nama_toko,alamat)
    VALUES
        (@id_toko,@customerid,@namatoko,@alamat)
END

  END

  GO
  EXEC USP_SimpanDataMastergramedLokasi '10102', 'AEONBSD', 'test', 'Grand Boulevard BSD City, Pagedangan, Pagedangan, Kab. Tanggerang. Banten, 15339'

  --1201 12013