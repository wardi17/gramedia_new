USE [um_db]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author      : WARDI
-- Create date : 11-09-2025
-- Description : Proses Sales Order dari import excel
-- =============================================
ALTER PROCEDURE USP_ProsesImportgramediaSO
    @IDimport VARCHAR(50),
    @username VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -------------------------------------------------
    -- 1. Buat ulang tabel temp (hapus kalau sudah ada)
    -------------------------------------------------
    IF EXISTS ( SELECT [Table_name] FROM tempdb.information_schema.tables WHERE [Table_name] LIKE '#temptess%' ) BEGIN DROP TABLE #temptess; END;
    IF EXISTS ( SELECT [Table_name] FROM tempdb.information_schema.tables WHERE [Table_name] LIKE '#temptess%' ) BEGIN DROP TABLE #temptess2; END;

    CREATE TABLE #temptess (
        ItemNo INT IDENTITY(1,1) PRIMARY KEY,
        IDimport VARCHAR(50) NOT NULL,
        Store VARCHAR(50),
        SOTransacID CHAR(14)
    );

    CREATE TABLE #temptess2(
	ItemNo INT,
	IDimport VARCHAR(50) NOT NULL,
    Store VARCHAR(50),
	[SOTransacID] [char](15) NOT NULL,
	[descpajak] [char](10) NULL,
	[cabang] [char](2) NULL,
	[divisi] [char](5) NULL,
	[CustomerID] [char](10) NULL,
	[DateEntry] [datetime] NULL,
	[DateInvoice] [datetime] NULL,
	[SOEntryDesc] [text] NULL,
	[DateDue] [datetime] NULL,
	[SODocumenID] [char](30) NULL,
	[CurrencyID] [char](10) NULL,
	[SOCurrRate] [float] NULL,
	[UserIDEntry] [char](10) NULL,
	[DateValidasi] [datetime] NULL,
	[UserIDValidasi] [char](10) NULL,
	[TaxId] [char](5) NULL,
	[TaxPercen] [float] NULL,
	[CustName] [char](50) NULL,
	[Attention] [char](30) NULL,
	[ShipAttention] [char](30) NULL,
	[CustAddress] [text] NULL,
	[kotamadya02] [char](10) NULL,
	[kecamatan02] [char](10) NULL,
	[kodepos02] [char](6) NULL,
	[ShipAddress] [text] NULL,
	[kotamadya03] [char](10) NULL,
	[kecamatan03] [char](10) NULL,
	[kodepos03] [char](6) NULL,
	[City] [char](50) NULL,
	[ShipCity] [char](50) NULL,
	[Country] [char](30) NULL,
	[ShipCountry] [char](30) NULL,
	[TermCode] [char](2) NULL,
	[FlagPosted] [char](1) NULL,
	[SalesmanCode] [char](10) NULL,
	[parttype] [char](5) NULL,
	[coderegion] [char](10) NULL,
	[codesubreg01] [char](10) NULL,
	[codesubreg02] [char](10) NULL,
	[custtitle] [char](30) NULL,
	[shipcusttitle] [char](30) NULL,
	[custphone] [char](30) NULL,
	[shipcustphone] [char](30) NULL,
	[custhp] [char](30) NULL,
	[shipcusthp] [char](30) NULL,
	[billcustfax] [char](30) NULL,
	[shipcustfax] [char](30) NULL,
	[voucherdocid] [char](30) NULL,
	[voucherdocid2] [char](30) NULL,
	[voucherdocid3] [char](30) NULL,
	[cashdiscpercen] [float] NULL,
	[shipdate] [datetime] NULL,
	[userid] [char](10) NULL,
	[lastdateaccess] [datetime] NULL,
	[subtotal] [float] NULL,
	[subtotalafterdisc] [float] NULL,
	[amountcashdisc] [float] NULL,
	[subtotalaftercashdisc] [float] NULL,
	[amounttax] [float] NULL,
	[totalamount] [float] NULL,
	[whslocation] [char](10) NULL,
	[custclass] [char](5) NULL,
	[flagDO] [char](1) NULL,
	[flagINV] [char](1) NULL,
	[flagcancelSO] [char](1) NULL,
	[flagcancelSOPosted] [char](1) NULL,
	[komisiI] [float] NULL,
	[komisiII] [float] NULL,
	[pkomII] [float] NULL,
	[QtyCancel] [float] NULL,
	[flagcheck] [char](10) NULL,
	[flagSO] [char](1) NULL,
	[sotransacid2] [char](15) NULL,
	[flagso01] [char](1) NULL,
	[flagso02] [char](1) NULL,
	[flagso03] [char](1) NULL,
	[flagso04] [char](10) NULL,
	[flagso05] [char](1) NULL,
	[sotransacid3] [char](15) NULL,
	[sotransacid4] [char](15) NULL,
	[flagpjkso01] [char](1) NULL,
	[flagpjkso02] [char](1) NULL,
	[flagpjkso03] [char](1) NULL,
	[flagpjkso04] [char](1) NULL,
	[flagpjkso05] [char](1) NULL,
	[statuscbd] [char](10) NULL,
	[flag_cbd1] [char](1) NULL,
	[flag_cbd2] [char](1) NULL
)
    -------------------------------------------------
    -- 2. Variabel untuk cursor
    -------------------------------------------------
    DECLARE @Store VARCHAR(50),
            @Kode CHAR(14);

    -------------------------------------------------
    -- 3. Cursor ambil store dari tabel import
    -------------------------------------------------
    DECLARE c CURSOR LOCAL FAST_FORWARD FOR
        SELECT DISTINCT store
        FROM gramediaso_temp
        WHERE IDimport = @IDimport;

    OPEN c;
    FETCH NEXT FROM c INTO @Store;

    -------------------------------------------------
    -- 4. Loop setiap store, generate kode unik
    -------------------------------------------------
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Generate kode pertama
        SET @Kode = dbo.FUN_GetKodeNow();

        -- Ulangi jika duplikat di #temptess
        WHILE EXISTS (SELECT 1 FROM #temptess WHERE SOTransacID = @Kode)
        BEGIN
            SET @Kode = dbo.FUN_GetKodeNow();
        END;

        -- Simpan hasil ke tabel temp
        INSERT INTO #temptess (IDimport, Store, SOTransacID)
        VALUES (@IDimport, @Store, @Kode);

        -- Ambil store berikutnya
        FETCH NEXT FROM c INTO @Store;
    END;

    CLOSE c;
    DEALLOCATE c;

    -------------------------------------------------
    -- 5. Ambil nomor transaksi sekarang dari setupNo
    -------------------------------------------------
    DECLARE @currentNo INT;

    SELECT @currentNo = trans_no9 
    FROM [bambi-ns].[dbo].setupNo WITH (UPDLOCK, HOLDLOCK);

    -------------------------------------------------
    -- 6. Select hasil akhir dengan join ke master
    -------------------------------------------------
    INSERT INTO #temptess2
    SELECT 
        A.ItemNo,
        A.IDimport,
        A.Store,
        A.SOTransacID,
        'standar' AS Descpajak,
        '77' AS Cabang,
        CU.divcode AS Divisi,
        CU.CustomerID,
        GETDATE() AS DateEntry,
        CONVERT(DATETIME, CONVERT(CHAR(10), GETDATE(), 120)) AS DateInvoice,
        '-' AS SOEntryDesc,
        CONVERT(DATETIME, CONVERT(CHAR(10), DATEADD(DAY, CAST(CU.termcode AS INT), GETDATE()), 120)) AS DateDue,
        -- Generate SODocumenID: untuk ItemNo=1 gunakan currentNo, untuk lainnya increment currentNo
        /*CASE 
            WHEN A.ItemNo = 1 THEN @currentNo +1
            ELSE @currentNo + A.ItemNo - 1
        END AS SODocumenID,*/
        (@currentNo + A.ItemNo) AS SODocumenID,
        'Rp' AS CurrencyID,
        0 AS SOCurrRate,
        @username AS UserIDEntry,
        GETDATE() AS DateValidasi,
        @username AS UserIDValidasi,
        NULL AS TaxId,
        0 AS TaxPercen,
        CU.CustName,
        CU.CustCoName AS Attention,
        CU.CustCoName AS ShipAttention,
        CU.npwpaddress AS CustAddress,
        CU.kotamadya02,
        CU.kecamatan02,
        CU.postcode02 AS kodepos02,
        CU.CustAddress AS ShipAddress,
        CU.codesubreg01 AS kotamadya03,
        CU.codesubreg02 AS kecamatan03,
        CU.postcode04 AS kodepos03,
        NULL AS City,
        '' AS ShipCity,
        '' AS Country,
        NULL AS ShipCountry,
        CU.termcode AS TermCode,
        'Y' AS FlagPosted,
        CU.salescode AS SalesmanCode,
        'FG' AS parttype,
        CU.coderegion,
        CU.codesubreg01,
        CU.codesubreg02,
        CU.CustCoTitle AS custtitle,
        CU.CustCoTitle AS shipcusttitle,
        CU.CustTelpNo AS custphone,
        CU.CustTelpNo AS shipcustphone,
        CU.HandPhone AS custhp,
        CU.HandPhone AS shipcusthp,
        CU.CustFaxNo AS billcustfax,
        CU.CustFaxNo AS shipcustfax,
        '-' AS voucherdocid,
        '' AS voucherdocid2,
        '' AS voucherdocid3,
        0 AS cashdiscpercen,
        CONVERT(DATETIME, CONVERT(CHAR(10), GETDATE(), 120)) AS shipdate,
        CU.UserId AS userid,
        GETDATE() AS lastdateaccess,
        0 AS subtotal,
        0 AS subtotalafterdisc,
        0 AS amountcashdisc,
        0 AS subtotalaftercashdisc,
        0 AS amounttax,
        0 AS totalamount,
        'BMI' AS whslocation,
        CU.CustomerClass AS custclass,
        'N' AS flagDO,
        'N' AS flagINV,
        NULL AS flagcancelSO,
        NULL AS flagcancelSOPosted,
        0 AS komisiI,
        0 AS komisiII,
        0 AS pkomII,
        0 AS QtyCancel,
        '' AS flagcheck,
        NULL AS flagSO,
        NULL AS sotransacid2,
        '' AS flagso01,
        '' AS flagso02,
        '' AS flagso03,
        'STD' AS flagso04,
        NULL AS flagso05,
        NULL AS sotransacid3,
        '' AS sotransacid4,
        2 AS flagpjkso01,
        NULL AS flagpjkso02,
        NULL AS flagpjkso03,
        'N' AS flagpjkso04,
        'N' AS flagpjkso05,
        'NON-CBD' AS statuscbd,
        'N' AS flag_cbd1,
        'N' AS flag_cbd2
    FROM #temptess AS A
    LEFT JOIN [um_db].[dbo].master_gramed_lokasi AS MS
        ON MS.id_toko = A.Store
    LEFT JOIN [bambi-bmi].[dbo].customer AS CU
        ON CU.CustomerID = MS.customer_id
    ORDER BY A.ItemNo ASC;

    -------------------------------------------------
    -- 7. Update nomor transaksi di setupNo sesuai jumlah data
    -------------------------------------------------
    UPDATE [bambi-ns].[dbo].setupNo
    SET trans_no9 = @currentNo + (SELECT COUNT(*) FROM #temptess);
    

    SELECT * FROM #temptess2
    
END
GO

-- Eksekusi contoh
EXEC USP_ProsesImportgramediaSO 'GMA-17575619', 'Herman';