USE [um_db]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author      : WARDI
-- Create date : 11-09-2025
-- Description : Proses Validasi Upload GMA
-- =============================================
ALTER PROCEDURE USP_ProsesValidasiUploadGMA 
    @IDimport varchar(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Hapus #temptess jika sudah ada
    IF EXISTS (SELECT [Table_name] 
               FROM tempdb.information_schema.tables 
               WHERE [Table_name] LIKE '#temptess%') 
    BEGIN
        DROP TABLE #temptess;
    END;



    -- Buat table temp untuk hasil validasi
    CREATE TABLE #temptess(
        IDimport VARCHAR(50) NOT NULL,
        number INT NOT NULL,
        product_number FLOAT,
        product_all VARCHAR(150) NOT NULL,
        store INT,
        item_tax VARCHAR(100) NULL,
        price FLOAT,
        qty INT,
        total_price FLOAT,
        payable FLOAT,
        ppn FLOAT,
        id_toko INT,
        customer_id VARCHAR(200),
        status_toko CHAR(1),
        status_product CHAR(1),
        status_partid CHAR(1)
    );




      INSERT INTO #temptess
			SELECT 
				GT.IDimport,
				GT.number,
				GT.product_number,
				GT.product_all,
				GT.store,
				GT.item_tax,
				GT.price,
				GT.qty,
				GT.total_price,
				GT.payable,
				GT.ppn,
				MS.id_toko,
				MS.customer_id,
				CASE 
					WHEN MS.id_toko IS NULL THEN 'N' 
					ELSE 'Y' 
				END AS status_idtoko,
				CASE 
					WHEN MP.partid_gramedia IS NULL THEN 'N' 
					ELSE 'Y' 
				END AS status_product,
				CASE 
					WHEN PM.partid IS NULL THEN 'N' 
					ELSE 'Y' 
				END AS status_partid
			FROM [um_db].[dbo].gramediaso_temp AS GT
			LEFT JOIN [um_db].[dbo].master_gramed_lokasi AS MS
				ON MS.id_toko = GT.store
			LEFT JOIN [um_db].[dbo].master_gramed_partid AS MP
				ON MP.partid_gramedia = GT.product_number
			LEFT JOIN [bambi-bmi].[dbo].[partmaster] AS PM
				ON PM.partid = MP.partid_bambi
			WHERE GT.IDimport = @IDimport;


    -- Jika masih ada status N → tampilkan data dari #temptess
    IF EXISTS (SELECT 1 FROM #temptess WHERE status_toko = 'N'  OR status_product = 'N' OR status_partid = 'N')
    BEGIN
        SELECT * FROM #temptess   ORDER BY  number ASC;
		DELETE  FROM [um_db].[dbo].gramediaso_temp  WHERE  IDimport=@IDimport;
        RETURN;  -- hentikan proses di sini
    END
    ELSE
    BEGIN
		  SELECT * FROM #temptess   ORDER BY  number ASC;
    END
END
GO

EXEC USP_ProsesValidasiUploadGMA 'GMA-17598952'


 