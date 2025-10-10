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
    IF EXISTS ( SELECT [Table_name] FROM tempdb.information_schema.tables WHERE [Table_name] LIKE '#temptess2%' ) BEGIN DROP TABLE #temptess2; END;
    IF EXISTS ( SELECT [Table_name] FROM tempdb.information_schema.tables WHERE [Table_name] LIKE '#temptess2detail%' ) BEGIN DROP TABLE #temptess2detail; END;

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
	[SOTransacID] [char](15) NOT NULL PRIMARY KEY,
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
);


CREATE TABLE #temptess2detail(
	SOTransacID char(15) NOT NULL,
	Amount float NULL,
	Itemno float NULL,
	Quantity float NULL,
	UnitPrice float NULL,
	PPNpercen float NULL,
	parttype char(5) NULL,
	partid char(10) NULL,
	partname char(60) NULL,
	prodclass char(10) NULL,
	subprod char(10) NULL,
	product char(10) NULL,
	partnameorg char(60) NULL,
	unitpriceorg float NULL,
	discpercen float NULL,
	discamount float NULL,
	UserId char(10) NULL,
	LastDateAccess datetime NULL,
	QtyOutstanding float NULL,
	QtyTempDelivery float NULL,
	QtyDelivery float NULL,
	komisiI float NULL,
	komisiII float NULL,
	pkomII float NULL,
	QtyCancel float NULL,
	itemnoso float NULL,
	xrounded float NULL,
	sotransacid2 char(15) NULL,
	sotransacid3 char(15) NULL,
	flagbmi char(1) NULL,
	disc01 float NULL,
	disc02 float NULL,
	disc03 float NULL,
	disc04 float NULL,
	desc2 char(60) NULL,
	num01 float NULL,
	num02 float NULL,
	num03 float NULL,
	num04 float NULL,
	num05 float NULL
) ;
    DECLARE @contsodtl NUMERIC(18,2);
    DECLARE @constgramdtl NUMERIC(18,2);
    DECLARE @ErrMsg VARCHAR(200);
    -------------------------------------------------
    -- 2. Variabel untuk cursor
    -------------------------------------------------
    DECLARE @Store VARCHAR(50),
            @Kode CHAR(14),
           @Tanggal DATETIME,
            @Counter INT;
            
    SET @Tanggal = GETDATE();
    SET @Counter =1;
    -------------------------------------------------
    -- 3. Cursor ambil store dari tabel import
    -------------------------------------------------
		DECLARE c CURSOR FOR
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
		 -- Buat kode pertama
		SET @Kode = dbo.FUN_GetKodeNow(@Tanggal);

		-- Cek duplikat di #temptess
		WHILE EXISTS (SELECT 1 FROM #temptess WHERE SOTransacID = @Kode)
		BEGIN
			SET @Counter = @Counter + 1;
			SET @Kode = LEFT(dbo.FUN_GetKodeNow(@Tanggal), 12) + RIGHT('00' + CAST(@Counter AS VARCHAR(2)), 2);
		END;

		-- Simpan ke tabel temp
		INSERT INTO #temptess (IDimport, Store, SOTransacID)
		VALUES (@IDimport, @Store, @Kode);

		FETCH NEXT FROM c INTO @Store;
    END;

    CLOSE c;
    DEALLOCATE c;

   

    --stop test
    -------------------------------------------------
    -- 5. Ambil nomor transaksi sekarang dari setupNo
    -------------------------------------------------
    DECLARE @currentNo INT;
    DECLARE @Thn INT;

    SET @Thn = YEAR(GETDATE());
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
        @username AS userid,
        GETDATE() AS lastdateaccess,
        0 AS subtotal, --total  unitprec * qty  dari detail
        0 AS subtotalafterdisc, --total payable dari detail
        0 AS amountcashdisc,
        0 AS subtotalaftercashdisc, ---total payable dari detail
        0 AS amounttax,
        0 AS totalamount, ---total payable dari detail
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
    
-------------------------------------------------
-- 8. Mencari data detail untuk dimasukkan ke temptess2detail ini jadi SoTransactionDetail
-------------------------------------------------

BEGIN TRANSACTION;
    INSERT INTO #temptess2detail
    SELECT 
        b.SOTransacID,
        (a.price_disc * a.qty) AS Amount, --price_disc 
        --ROW_NUMBER() OVER (PARTITION BY b.Store ORDER BY b.Store)
        a.noid AS ItemNo,
        a.qty AS Quantity,
        a.price_list AS UnitPrice, --price_list
        0 AS PPNpercen,
        d.parttype,
        d.partid,
        d.partname,
        d.prodclass,
        d.subprod,
        d.product,
        d.partname AS partnameorg,
        d.harga_beli AS unitpriceorg,
        35 AS discpercen, 
        (a.disc * a.qty) AS discamount, --disc
        @username AS UserId,
        GETDATE() AS LastDateAccess,
        a.qty AS QtyOutstanding,
        0 AS QtyTempDelivery,
        0 AS QtyDelivery,
        0 AS komisiI,
        0 AS komisiII,
        0 AS pkomII,
        0 AS QtyCancel,
        NULL AS itemnoso,
        0 AS xrounded,
        '' AS sotransacid2,
        '' AS sotransacid3,
        NULL AS flagbmi,
        35 AS disc01,
        0 AS disc02,
        0 AS disc03,
        0 AS disc04,
        NULL AS desc2,
        0 AS num01,
        0 AS num02,
        0 AS num03,
        0 AS num04,
        0 AS num05
    FROM gramediaso_temp AS a
    LEFT JOIN #temptess2 AS b ON b.Store = a.Store 
    LEFT JOIN master_gramed_partid AS c ON c.partid_gramedia = a.product_number
    LEFT JOIN [bambi-bmi].[dbo].partmaster AS d ON d.partid = c.partid_bambi
    ORDER BY b.Store, a.noid ASC;


    -------------------------------------------------
    /* 9. Hitung subtotal dkk di derived table
        - subtotal              -- total unitprice * qty dari detail
        - subtotalafterdisc     -- total payable dari detail
        - subtotalaftercashdisc -- total payable dari detail
        - totalamount           -- total payable dari detail
    */
    -------------------------------------------------

UPDATE T2
SET 
    T2.subtotal              = Agg.subtotal,
    T2.subtotalafterdisc     = Agg.subtotalafterdisc,
    T2.subtotalaftercashdisc = Agg.subtotalaftercashdisc,
    T2.totalamount           = Agg.totalamount
FROM #temptess2 AS T2
INNER JOIN (
    SELECT 
        SOTransacID,
        SUM(COALESCE(Quantity, 0) * COALESCE(UnitPrice, 0)) AS subtotal,
        SUM(COALESCE(Amount, 0)) AS subtotalafterdisc,
        SUM(COALESCE(Amount, 0)) AS subtotalaftercashdisc,
        SUM(COALESCE(Amount, 0)) AS totalamount
    FROM #temptess2detail
    GROUP BY SOTransacID
) AS Agg ON T2.SOTransacID = Agg.SOTransacID;


-------------------------------------------------
-- 10. Insert ke tabel SOTRANSACTION dan SOTRANSACTIONDETAIL di bambi-bmi
-------------------------------------------------

INSERT INTO [bambi-bmi].[dbo].SOTRANSACTION
(
    SOTransacID,
    descpajak,
    cabang,
    divisi,
    CustomerID,
    DateEntry,
    DateInvoice,
    SOEntryDesc,
    DateDue,
    SODocumenID,
    CurrencyID,
    SOCurrRate,
    UserIDEntry,
    DateValidasi,
    UserIDValidasi,
    TaxId,
    TaxPercen,
    CustName,
    Attention,
    ShipAttention,
    CustAddress,
    kotamadya02,
    kecamatan02,
    kodepos02,
    ShipAddress,
    kotamadya03,
    kecamatan03,
    kodepos03,
    City,
    ShipCity,
    Country,
    ShipCountry,
    TermCode,
    FlagPosted,
    SalesmanCode,
    parttype,
    coderegion,
    codesubreg01,
    codesubreg02,
    custtitle,
    shipcusttitle,
    custphone,
    shipcustphone,
    custhp,
    shipcusthp,
    billcustfax,
    shipcustfax,
    voucherdocid,
    voucherdocid2,
    voucherdocid3,
    cashdiscpercen,
    shipdate,
    userid,
    lastdateaccess,
    subtotal,
    subtotalafterdisc,
    amountcashdisc,
    subtotalaftercashdisc,
    amounttax,
    totalamount,
    whslocation,
    custclass,
    flagDO,
    flagINV,
    flagcancelSO,
    flagcancelSOPosted,
    komisiI,
    komisiII,
    pkomII,
    QtyCancel,
    flagcheck,
    flagSO,
    sotransacid2,
    flagso01,
    flagso02,
    flagso03,
    flagso04,
    flagso05,
    sotransacid3,
    sotransacid4,
    flagpjkso01,
    flagpjkso02,
    flagpjkso03,
    flagpjkso04,
    flagpjkso05,
    statuscbd,
    flag_cbd1,
    flag_cbd2,
    cdso,
    voucher,
    creditmemo
)
SELECT 
    SOTransacID,
    descpajak,
    cabang,
    divisi,
    CustomerID,
    DateEntry,
    DateInvoice,
    SOEntryDesc,
    DateDue,
    --untuk Sodokument ditambah tahun berjalan
    dbo.fn_FormatSODocID(SODocumenID,@Thn) AS SODocumenID,
    CurrencyID,
    SOCurrRate,
    UserIDEntry,
    DateValidasi,
    UserIDValidasi,
    TaxId,
    TaxPercen,
    CustName,
    Attention,
    ShipAttention,
    CustAddress,
    kotamadya02,
    kecamatan02,
    kodepos02,
    ShipAddress,
    kotamadya03,
    kecamatan03,
    kodepos03,
    City,
    ShipCity,
    Country,
    ShipCountry,
    TermCode,
    FlagPosted,
    SalesmanCode,
    parttype,
    coderegion,
    codesubreg01,
    codesubreg02,
    custtitle,
    shipcusttitle,
    custphone,
    shipcustphone,
    custhp,
    shipcusthp,
    billcustfax,
    shipcustfax,
    voucherdocid,
    voucherdocid2,
    voucherdocid3,
    cashdiscpercen,
    shipdate,
    userid,
    lastdateaccess,
    subtotal,
    subtotalafterdisc,
    amountcashdisc,
    subtotalaftercashdisc,
    amounttax,
    totalamount,
    whslocation,
    custclass,
    flagDO,
    flagINV,
    flagcancelSO,
    flagcancelSOPosted,
    komisiI,
    komisiII,
    pkomII,
    QtyCancel,
    flagcheck,
    flagSO,
    sotransacid2,
    flagso01,
    flagso02,
    flagso03,
    flagso04,
    flagso05,
    sotransacid3,
    sotransacid4,
    flagpjkso01,
    flagpjkso02,
    flagpjkso03,
    flagpjkso04,
    flagpjkso05,
    statuscbd,
    flag_cbd1,
    flag_cbd2,
    0 AS cdso,
    0 AS voucher,
    0 AS creditmemo
FROM #temptess2;

-------------------------------------------------
-- Untuk detail 
-------------------------------------------------

INSERT INTO [bambi-bmi].[dbo].SOTRANSACTIONDETAIL
SELECT * FROM #temptess2detail;
    -------------------------------------------------
    -- Validasi total: bandingkan total dari temp dengan yang sudah masuk
    -------------------------------------------------

    -- Hitung total di tabel tujuan
    SELECT @contsodtl = ISNULL(SUM(Amount),0)
    FROM [bambi-bmi].[dbo].SOTRANSACTIONDETAIL
    WHERE SOTransacID IN (SELECT SOTransacID FROM #temptess2);
    
    IF @@ERROR <> 0
    BEGIN
        SET @ErrMsg = 'Error saat menghitung total di SOTRANSACTIONDETAIL';
        ROLLBACK TRANSACTION;
        RAISERROR(@ErrMsg,16,1);
        RETURN;
    END
    -- Hitung total di gramediaso_temp
    SELECT @constgramdtl = ISNULL(SUM(payable),0)
    FROM gramediaso_temp
    WHERE IDimport = @IDimport;

    IF @@ERROR <> 0
    BEGIN
        SET @ErrMsg = 'Error saat menghitung total di gramediaso_temp';
        ROLLBACK TRANSACTION;
        RAISERROR(@ErrMsg,16,1);
        RETURN;
    END
    -------------------------------------------------
    -- Jika validasi lolos: hapus temp dan commit
    -------------------------------------------------
    DELETE FROM gramediaso_temp
    WHERE IDimport = @IDimport;

    IF @@ERROR <> 0
    BEGIN
        SET @ErrMsg = 'Error saat hapus gramediaso_temp';
        ROLLBACK TRANSACTION;
        RAISERROR(@ErrMsg,16,1);
        RETURN;
    END

    COMMIT TRANSACTION;
END
GO

-- Eksekusi contoh
 EXEC USP_ProsesImportgramediaSO 'GMA-17599074','wardi'







