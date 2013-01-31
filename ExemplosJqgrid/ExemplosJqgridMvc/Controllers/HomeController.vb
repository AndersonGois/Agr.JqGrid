Imports AGR.Controller

<HandleError()> _
Public Class HomeController
    Inherits System.Web.Mvc.Controller

    Dim _Controller As GridCliente = New GridCliente

    Function Index() As ActionResult
        ViewData("Message") = "Welcome to ASP.NET MVC!"
        Dim lista = _Controller.ListarCliente()
        Return (View())
    End Function

    Function About() As ActionResult
        Return View()
    End Function
End Class
