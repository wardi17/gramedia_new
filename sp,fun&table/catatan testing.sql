select trans_no9 from  [bambi-ns].[dbo].setupNo
UPDATE [bambi-ns].[dbo].setupNo SET trans_no9=28929



select top 1  * from [bambi-bmi].[dbo].SOTRANSACTION where SOTransacID like '%KN%' AND CustomerID='AEONSEN'

select
 CU.CustCoTitle AS custtitle,CU.CustTelpNo AS custphone,CU.CustTelpNo AS shipcustphone,CU.HandPhone AS shipcusthp,
CU.CustFaxNo AS billcustfax,CU.CustFaxNo AS shipcustfax,'-' AS voucherdocid,  -- tanya rian dulu
'' AS voucherdocid2,'' AS voucherdocid3,0 AS cashdiscprercen,CONVERT(DATETIME, CONVERT(CHAR(10), GETDATE(), 120))  AS shipdate,
CU.UserId AS userid,GETDATE() AS LastDateAccess,
 0 AS subtotal, 0 AS subtotalafterdisc,0 AS amountcashdisc,0 AS amounttax,0 AS totalamount, -- ini diupdate daridetail
 'BMI' AS whslocation,CU.CustomerClass AS custclass,'N' AS flagDO,'N' AS flagINV,NULL AS  flagcancelSO, NULL AS flagcancelSOPosted,
 0 AS komisil, 0 AS komisill, 0 AS pkomll, 0 AS QtyCancel, '' AS flagcheck, NULL AS flagSO ,NULL AS sotransacid2,NULL AS flags02,
 NULL AS flagso03,'STD' AS flagso04,NULL AS flagso05,'NON-CBD' AS statuscbd,'N' AS flag_cbd1,'N' AS flag_cbd2
 from [bambi-bmi].[dbo].customer AS CU where CustomerID='AEONSEN'



--untuk  tampil detail
select SOTransacID,Amount,Itemno,Quantity,UnitPrice,PPNpercen,parttype,partid,
 partname,prodclass,subprod,product,partnameorg,unitpriceorg,discpercen,discamount,UserId,
 LastDateAccess,QtyTempDelivery,QtyDelivery,komisiI,komisiII,pkomII,QtyCancel,itemnoso,xrounded,sotransacid2,sotransacid3,
 flagbmi,disc01,disc02,disc03,disc04,desc2,num01,num02,num03,num04,num05
 from [bambi-bmi].[dbo].SOTRANSACTIONDETAIL  where SOTransacID like'%KN%'



 --contoh instet table detail
  SELECT 
        data_1.customer_id, a.pkomII, a.SOTransacID, 
        a.voucherdocid, data_1.no_pesanan, data_1.customer_id, 
        data_1.send_date as date_invoice, data_1.item, data_1.partid as no_sku, 
        data_1.partname as item_description, data_1.total_price, data_1.unit_price_baru, 
        data_1.total_sebelum_diskon, (data_1.total_sebelum_diskon-data_1.total_price) as discamount,
        ((data_1.total_sebelum_diskon-data_1.total_price)/data_1.total_sebelum_diskon)*100 as discpercen,  
        data_1.qty, data_1.nama_toko, data_1.prodclass, data_1.subprod, 
        data_1.product, data_1.harga_beli
        FROM SOTRANSACTION as a
        LEFT JOIN 
        (
            SELECT aa.*, cc.partname, cc.partid, cc.prodclass, cc.subprod, 
            (CASE 
				when LEFT(bb.partid_bambi,4)='4100' then cc.cat05
				when LEFT(bb.partid_bambi,4)='4101' then cc.cat05
				when LEFT(bb.partid_bambi,4)='5300' then cc.cat05
				when LEFT(bb.partid_bambi,4)='5301' then cc.cat05
				else cc.unit_price
			END) as unit_price_baru,
			(CASE 
				when LEFT(bb.partid_bambi,4)='4100' then cc.cat05*aa.qty
				when LEFT(bb.partid_bambi,4)='4101' then cc.cat05*aa.qty
				when LEFT(bb.partid_bambi,4)='5300' then cc.cat05*aa.qty
				when LEFT(bb.partid_bambi,4)='5301' then cc.cat05*aa.qty
				else cc.unit_price*aa.qty
			END) as total_sebelum_diskon, 
            cc.product, dd.customer_id, dd.nama_toko, cc.harga_beli
            FROM [UM_DB].[dbo].master_gramed_temp as aa 
            LEFT JOIN [UM_DB].[dbo].master_gramed_partid bb on bb.partid_gramedia=aa.item
            LEFT JOIN partmaster cc on cc.partid=bb.partid_bambi
            LEFT JOIN [UM_DB].[dbo].master_gramed_lokasi dd on dd.id_toko=aa.location_id
            WHERE aa.status='Y'
            and aa.status_transaksi='Y'
        ) AS data_1
        ON a.voucherdocid = data_1.no_pesanan
        WHERE data_1.status_transaksi IS NOT NULL
        ORDER BY a.SOTransacID



DECLARE @noid INT;

-- Ambil noid terakhir per store & IDimport, kalau kosong mulai dari 1
SELECT @noid = ISNULL(MAX(noid), 0) + 1
FROM [um_db].[dbo].gramediaso_temp
WHERE IDimport = 'GMA-17591965'
  AND store = '10101';

-- Insert dengan noid baru
INSERT INTO [um_db].[dbo].gramediaso_temp
    (noid, IDimport, number, product_number, product_all, store, item_tax, price, qty, total_price, payable, ppn)
VALUES
    (@noid, 'GMA-17591965', '1', '208120230',
     'BAMBI BUSINESS FILE A4 4101-15 MED BLUE CO', '10101',
     'BKP', '3513', '1', '3513', '3899', '386');


/* 
select * from [um_db].[dbo].gramediaso_temp 

 SELECT *  FROM #temptess2  WHERE Store='10101'
 SELECT  * FROM #temptess2detail 
 LEFT JOIN #temptess2 ON #temptess2.SOTransacID=#temptess2detail.SOTransacID
 WHERE #temptess2.Store='10101'

 sumbtotal =950900 
 subtotalafterdisc=647292
 subtotalaftercashdisc=647292
 totalamount=647292 */

delete FROM [bambi-bmi].[dbo].SOTRANSACTION  where  SOTransacID LIKE 'KN251003%'
delete FROM [bambi-bmi].[dbo].SOTRANSACTIONDETAIL  where  SOTransacID LIKE 'KN251003%'

 select count(*) from  [um_db].[dbo].gramediaso_temp

SELECT * FROM [bambi-bmi].[dbo].SOTRANSACTION  where  SOTransacID LIKE 'KN251003%'
SELECT * FROM [bambi-bmi].[dbo].SOTRANSACTIONDETAIL  where SOTransacID LIKE 'KN251003%'


SELECT *
FROM [bambi-bmi].[dbo].SOTRANSACTION
WHERE SOTransacID IN (
    SELECT SOTransacID
    FROM [bambi-bmi].[dbo].SOTRANSACTION
    WHERE SOTransacID LIKE 'KN251003%'
    GROUP BY SOTransacID
    HAVING COUNT(*) > 1
)
ORDER BY SOTransacID;


--Kalau mau langsung cek jumlah total duplikatnya
SELECT COUNT(*) AS TotalDuplikat
FROM (
    SELECT SOTransacID
    FROM [bambi-bmi].[dbo].SOTRANSACTION
    WHERE SOTransacID LIKE 'KN251003%'
    GROUP BY SOTransacID
    HAVING COUNT(*) > 1
) AS T;


--NOT EXISTS (lebih aman & cepat biasanya)
SELECT *
FROM [bambi-bmi].[dbo].SOTRANSACTIONDETAIL t 
WHERE t.SOTransacID LIKE 'KN251003%'
  AND NOT EXISTS (
      SELECT 1
      FROM [bambi-bmi].[dbo].SOTRANSACTION d
      WHERE d.SOTransacID = t.SOTransacID
  );

--DELETE FROM [um_db].[dbo].gramediaso_temp
/*
BEGIN TRAN;

UPDATE Accounts
SET Balance = Balance - 200
WHERE AccountID=1;

UPDATE Accounts
SET Balance= Balance + 200
WHERE AccountID =99;

ROLLBACK;

SELECT * FROM Accounts


CREATE TABLE Produk_sql (
    ProdukID INT PRIMARY KEY,
    NamaProduk NVARCHAR(50),
    Harga DECIMAL(18,2)
);


--Update menguankan try catch

BEGIN TRY
    BEGIN TRAN;
    UPDATE Produk_sql
    SET Harga = Harga + 8000000
    WHERE ProdukID = 1;

    COMMIT TRAN;

END TRY
BEGIN CATCH
    ROLLBACK TRAN;
    PRINT 'Terjadi kesalahan: ' + ERROR_MESSAGE();
END CATCH;





--latihan 3: Simulasi Error
--Kita buat error secara sengaja  dengana RAISEERROR */






SELECT a.nik,a.namalengkap,a.namapanggilan,a.cabang,a.jabatan,a.tanggal_resign,a.departemen,
		a.tanggal_resign,b.nama_document,a.catatan 
		FROM TransaksiResign AS a
		INNER JOIN DocumentAtterfileRisagn AS b
		ON b.nik=a.nik WHERE a.nik='77.24.126'


