USE [Db_Ingresso]
GO

/****** Object:  Table [dbo].[ClienteTeste]    Script Date: 01/31/2013 18:07:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[ClienteTeste](
	[Codigo] [int] IDENTITY(1,1) NOT NULL,
	[Nome] [varchar](60) NOT NULL,
	[TipoLeitura_Codigo] [int] NOT NULL,
	[DataAlteracao] date NULL
 CONSTRAINT [PK_ClienteTeste] PRIMARY KEY CLUSTERED 
(
	[Codigo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[ClienteTeste]  WITH CHECK ADD  CONSTRAINT [FK_ClienteTeste_TipoLeitura] FOREIGN KEY([TipoLeitura_Codigo])
REFERENCES [dbo].[TipoLeitura] ([Codigo])
GO

ALTER TABLE [dbo].[ClienteTeste] CHECK CONSTRAINT [FK_ClienteTeste_TipoLeitura]
GO


