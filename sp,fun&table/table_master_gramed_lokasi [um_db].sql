USE [um_db]
GO

/****** Object:  Table [dbo].[master_gramed_lokasi]    Script Date: 10/02/2025 08:19:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[master_gramed_lokasi](
	[id_toko] [varchar](50) NOT NULL,
	[customer_id] [varchar](60) NULL,
	[nama_toko] [varchar](60) NULL,
	[alamat] [varchar](255) NULL,
	[id_pic] [int] NULL,
)

