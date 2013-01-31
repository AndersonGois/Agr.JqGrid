Imports AGR.Controller

<HandleError()> _
Public Class HomeController
    Inherits System.Web.Mvc.Controller

    Dim _Controller As GridCliente = New GridCliente

    Private _NomeArea As String = "Periferico"
    Private _NomeEntidade As String = "Home"



#Region "Actions - Views"

    Function Index() As ActionResult


        ViewData("EntidadeArea") = Me._NomeArea
        ViewData("EntidadeNome") = Me._NomeEntidade

        ViewData("TituloPagina") = "Cadastro de Tipo de ClienteTeste"
        ViewData("Entidade Criar") = "Criar Tipo de ClienteTeste"

        Return View()
    End Function

    Function ClienteCadastro() As ActionResult
        Return View()
    End Function

    Function About() As ActionResult
        Return View()
    End Function
#End Region

    Public Function ListarCliente(ByVal page As Integer, _
                             ByVal rows As Integer, _
                             ByVal search As String, _
                             ByVal sidx As String, _
                             ByVal sord As String) As JsonResult


        Dim pageIndex As Integer = Convert.ToInt32(page) - 1
        Dim pageSize As Integer = rows
        Dim totalRecords As Integer = If(IsNothing(_Controller.ListarCliente()), 0, _Controller.ListarCliente().Count())
        Dim totalPages As Integer = CInt(Math.Truncate(Math.Ceiling(CSng(totalRecords) / CSng(pageSize))))

        Dim jsonData = New With { _
         Key .Total = totalPages, _
         Key .Page = page, _
         Key .Records = totalRecords, _
         Key .Rows = (From vaEntidade In _Controller.ListarCliente().AsQueryable()
                     Select New With { _
                     Key .Codigo = vaEntidade.Codigo, _
                     Key .Nome = vaEntidade.Nome, _
                     Key .DataNascimento = vaEntidade.DataNascimento, _
                     Key .Idade = vaEntidade.Idade _
                                    }
                    ).ToArray(), _
             .UserData = Nothing}

        Return Json(jsonData, JsonRequestBehavior.AllowGet)

    End Function

End Class

