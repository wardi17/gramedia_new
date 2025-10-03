USE [um_db]
GO

/****** Object:  Table [dbo].[master_gramed_partid]    Script Date: 10/01/2025 08:24:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[master_gramed_partid](
	[partid_gramedia] [varchar](50) NOT NULL,
	[partid_bambi] [varchar](50) NOT NULL,
	[partname_bambi] [varchar](255) NULL,
 CONSTRAINT [PK_master_gramed_partid] PRIMARY KEY CLUSTERED 
(
	[partid_gramedia] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


