Mapeamento
quando ela tem um foreign key - .HasRequired(Function(paE) paE.TipoLeitura)
								ou
								.HasOptional(Function(paE) paE.FormaPagamento).WithMany().HasForeignKey(Function(paD) paD.FormaPagamento_Codigo)

quando objeto é foreing Key	- 	.HasMany(Function(paE) paE.ModeloImpressoraLayoutPapel)								
								
Public Class LayoutPapel
   
    Public Overridable Property ModeloImpressoraLayoutPapel As List(Of ModeloImpressoraLayoutPapel) //
	.HasMany(Function(paE) paE.ModeloImpressoraLayoutPapel)	
	'quando objeto é foreing Key
End Class

Public Class ModeloImpressoraLayoutPapel
  
    Public Property LayoutPapel As LayoutPapel 
	.HasRequired(Function(paE) paE.LayoutPapel)
	'ou
	.HasOptional(Function(paE) paE.FormaPagamento).WithMany().HasForeignKey(Function(paD) paD.FormaPagamento_Codigo)
	'quando objeto tem um foreign key
End Class
								

								 