SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SOTRANSACTION](
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
	[flag_cbd2] [char](1) NULL,
	[cdso] [float] NULL,
	[voucher] [float] NULL,
	[creditmemo] [float] NULL,
 CONSTRAINT [PK_SOTRANSACTION] PRIMARY KEY CLUSTERED 
(
	[SOTransacID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_SOCurrRate]  DEFAULT (0) FOR [SOCurrRate]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_TaxPercen]  DEFAULT (0) FOR [TaxPercen]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_voucherdocid2]  DEFAULT ('') FOR [voucherdocid2]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_voucherdocid3]  DEFAULT ('') FOR [voucherdocid3]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_cashdiscpercen]  DEFAULT (0) FOR [cashdiscpercen]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_subtotal]  DEFAULT (0) FOR [subtotal]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_subtotalafterdisc]  DEFAULT (0) FOR [subtotalafterdisc]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_amountcashdisc]  DEFAULT (0) FOR [amountcashdisc]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_subtotalaftercashdisc]  DEFAULT (0) FOR [subtotalaftercashdisc]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_amounttax]  DEFAULT (0) FOR [amounttax]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_totalamount]  DEFAULT (0) FOR [totalamount]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_komisiI]  DEFAULT (0) FOR [komisiI]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_komisiII]  DEFAULT (0) FOR [komisiII]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_pkomII]  DEFAULT (0) FOR [pkomII]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_QtyCancel]  DEFAULT (0) FOR [QtyCancel]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flagcheck]  DEFAULT ('') FOR [flagcheck]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flagso04]  DEFAULT ('STD') FOR [flagso04]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flagpjkso01]  DEFAULT (1) FOR [flagpjkso01]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flagpjkso04]  DEFAULT ('N') FOR [flagpjkso04]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flagpjkso05]  DEFAULT ('N') FOR [flagpjkso05]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_statuscbd]  DEFAULT ('NON-CBD') FOR [statuscbd]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flag_cbd1]  DEFAULT ('Y') FOR [flag_cbd1]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_flag_cbd2]  DEFAULT ('Y') FOR [flag_cbd2]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_cdso]  DEFAULT (0) FOR [cdso]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_voucher]  DEFAULT (0) FOR [voucher]
GO
ALTER TABLE [dbo].[SOTRANSACTION] ADD  CONSTRAINT [DF_SOTRANSACTION_creditmemo]  DEFAULT (0) FOR [creditmemo]
GO
