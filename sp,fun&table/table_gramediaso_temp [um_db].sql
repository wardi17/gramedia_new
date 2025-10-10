use [um_db]

DROP TABLE gramediaso_temp
CREATE TABLE gramediaso_temp(
    noid INT,
    IDimport VARCHAR(50) NOT NULL,
    number INT NOT NULL,
    product_number VARCHAR(50) NOT NULL,
    product_all VARCHAR(150) NOT NULL,
    store VARCHAR(50) NOT NULL,
    item_tax VARCHAR(100) NULL,
    price_list FLOAT,
    disc FLOAT,
    price_disc FLOAT,
    price FLOAT,
    qty INT,
    total_price FLOAT,
    payable FLOAT,
    ppn FLOAT

);


--tambah  10132 ,81112
select * from [um_db].[dbo].master_gramed_lokasi where id_toko IN('10132','81112')

INSERT INTO  [um_db].[dbo].master_gramed_lokasi (id_toko,customer_id,nama_toko,alamat,id_pic)
VALUES
--('10132','GAMCITRA2','Gramedia Jkt Mal Ciputra (KBI)','Mal Ciputra Unit No. V09 Jakarta barat DKI jakarta11470','11'),
('81112','GAMCITRA3','Gramedia Jkt Mal Ciputra (KBI)','Mal Ciputra Unit No. V09 Jakarta barat DKI jakarta11470','11');


DELETE from [um_db].[dbo].master_gramed_lokasi where id_toko IN('10132','81112')