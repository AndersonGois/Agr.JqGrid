Mapeamento
quando ela tem um foreign key - {
								.HasRequired(Function(paE) paE.TipoLeitura)
								//ou
								.HasOptional(Function(paE) paE.FormaPagamento).WithMany().HasForeignKey(Function(paD) paD.FormaPagamento_Codigo)
								}
	
								ou
								.HasOptional(Function(paE) paE.FormaPagamento).WithMany().HasForeignKey(Function(paD) paD.FormaPagamento_Codigo)

quando objeto é foreing Key	- 	.HasMany(Function(paE) paE.ModeloImpressoraLayoutPapel)
								
								

								
Public Class LayoutPapel{
   
Public Overridable Property ModeloImpressoraLayoutPapel As List(Of ModeloImpressoraLayoutPapel) 
//Mapeamento 
{	
				.HasMany(Function(paE) paE.ModeloImpressoraLayoutPapel)	
				//quando objeto é foreing Key
				.ToTable("LayoutPapel")
}
}End Class		
	
End Class

Public Class ModeloImpressoraLayoutPapel{
  
    Public Property LayoutPapel As LayoutPapel 
//Mapeamento 
{		
	.HasRequired(Function(paE) paE.LayoutPapel)
	//ou
	.HasOptional(Function(paE) paE.FormaPagamento).WithMany().HasForeignKey(Function(paD) paD.FormaPagamento_Codigo)
	'quando objeto tem um foreign key
	
	.ToTable("ModeloImpressoraLayoutPapel")
}								
}End Class	

Public Class ModeloImpressoraLayoutPapelConfiguration{
        Inherits EntityTypeConfiguration(Of ModeloImpressoraLayoutPapel)

        Public Sub New()

            With Me
                .HasKey(Function(paE) paE.Codigo)
                .Property(Function(paE) paE.Padrao).HasColumnName("Padrao")
                .HasRequired(Function(paE) paE.LayoutPapel)
                .HasRequired(Function(paE) paE.ModeloImpressora)
                ''
                .ToTable("ModeloImpressoraLayoutPapel")
            End With

        End Sub
    }End Class								
	
Public Class LayoutPapelConfiguration{
        Inherits EntityTypeConfiguration(Of LayoutPapel)

        Sub New()
            With Me
                .HasKey(Function(paE) paE.Codigo)
                .Property(Function(paE) paE.Nome).HasColumnName("Nome").IsRequired()
                .Property(Function(paE) paE.Altura).HasColumnName("Altura")
                .Property(Function(paE) paE.Largura).HasColumnName("Largura")
                .Property(Function(paE) paE.Imagem).HasColumnName("Imagem")
                .Property(Function(paE) paE.Continuo).HasColumnName("Continuo")
                ''
                .HasMany(Function(paE) paE.ModeloImpressoraLayoutPapel)
                ''
                .ToTable("LayoutPapel")
            End With
        End Sub
    }End Class