Imports AGR.Controller
Imports System.Linq
Imports System.Reflection
Imports AGR.Domain.Entities

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

    ' ''' <summary>
    ' ''' Obem o colNames e o colModel do grid dinamicamente a partir do estabelecimento e tipo
    ' ''' </summary>
    ' ''' <param name="estabelecimento"></param>
    ' ''' <param name="tipo"></param>
    ' ''' <returns></returns>
    ' ''' <remarks></remarks>
    'Public Function ObterConfiguracaoGrid(ByVal estabelecimento As Integer, ByVal tipo As String) As ActionResult
    '    Dim negocio As IEntradaInventarioFacade = MovimentacaoFacadeFactory.CreateEntradaInventarioFacade
    '    'gerando o colNames do grid
    '    Dim colNames As List(Of String) = New List(Of String) From {"Produto", "", "", "Un Medida", "", "Qtd Total"}
    '    Dim nomesSubestoques = From i In negocio.ObterSubestoques(estabelecimento, tipo) Select i.Nome
    '    colNames.AddRange(nomesSubestoques)
    '    colNames.AddRange({"Dt Ult Contagem", "Qtd Ult Contagem", "Parametro", "", "", "", ""})
    '    'gerando o colModel
    '    Dim colModel As List(Of Object) = New List(Of Object) From {New With {.name = "ProdutoNome", .index = "ProdutoNome", .width = "150", .fixed = True, .sortable = False, .hidden = False, .resizable = False},
    '                                                                New With {.name = "ProdutoCodigo", .index = "ProdutoCodigo", .sortable = False, .hidden = True, .key = True},
    '                                                                New With {.name = "EstabelecimentoCodigo", .index = "EstabelecimentoCodigo", .sortable = False, .hidden = True},
    '                                                                New With {.name = "UnidadeMedida_Nome", .index = "UnidadeMedida_Nome", .width = "75", .fixed = True, .sortable = False, .hidden = False, .resizable = False},
    '                                                                New With {.name = "UnidadeMedida_Codigo", .index = "UnidadeMedida_Codigo", .sortable = False, .hidden = True},
    '                                                                New With {.name = "QuantidadeTotal", .index = "QuantidadeTotal", .width = "60", .fixed = True, .sortable = False, .hidden = False, .resizable = False}
    '                                                               }

    '    colModel.AddRange(From i In nomesSubestoques Select New With {.name = i.ToString(), .index = i.ToString(), .width = "100", .fixed = True, .sortable = False, .hidden = False, .resizable = False})
    '    colModel.AddRange({New With {.name = "DataUltimaContagem", .index = "DataUltimaContagem", .width = "120", .fixed = True, .sortable = False, .hidden = False, .resizable = False},
    '                       New With {.name = "QtdUltimaContagem", .index = "QtdUltimaContagem", .width = "120", .fixed = True, .sortable = False, .hidden = False, .resizable = False},
    '                       New With {.name = "Parametro", .index = "Parametro", .width = "80", .fixed = True, .sortable = False, .hidden = False, .resizable = False},
    '                       New With {.name = "ParametroCodigo", .index = "ParametroCodigo", .sortable = False, .hidden = True, .resizable = False},
    '                       New With {.name = "SubEstoques", .index = "SubEstoques", .sortable = False, .hidden = True, .resizable = False},
    '                       New With {.name = "ProdSituacaoUnidadeCodigo", .index = "ProdSituacaoUnidadeCodigo", .sortable = False, .hidden = True, .resizable = False},
    '                       New With {.name = "Fator", .index = "Fator", .sortable = False, .hidden = True, .resizable = False}
    '                      })

    '    Dim config As Object() = {colNames, colModel}
    '    Return JsonNet(config)
    'End Function


    Public Function ListarColunasGRid() As JsonResult
        Return New JsonResult With {.Data = ConfiguraGrid(New Cliente(), {"Codigo", "Nome", "Idade", "Data Nascimento", "Email"})}
    End Function

    Public Function ConfiguraGrid(Of T)(ByVal tipo As T, ByVal titulo As String()) As Object()

        Dim colNames As List(Of String) = New List(Of String)()
        Dim colModel As List(Of Object) = New List(Of Object)()

        For Each item In titulo
            colNames.Add(item)
        Next

        For Each p In tipo.GetType().GetProperties()
            colModel.Add(New With {.name = p.Name, .index = p.Name, .sortable = True, .hidden = False, .key = True})
        Next
        Dim config As Object() = {colNames, colModel}

        Return config


    End Function

    Public Function ListarCliente() As JsonResult
        Return New JsonResult With {.Data = _Controller.ListarCliente().Select(Function(x) New With {.Codigo = x.Codigo,
                                                                                                     .Idade = x.Idade,
                                                                                                    .DataNascimento = Format(x.DataNascimento, "d"),
                                                                                                    .Email = x.Email,
                                                                                                    .Nome = x.Nome})}
    End Function

End Class

