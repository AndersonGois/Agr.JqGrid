

Imports AGR.Domain.Entities

Public Class GridCliente
    Public Function ListarCliente() As List(Of Cliente)
        Dim lista As List(Of Cliente) = New List(Of Cliente)

        For i = 0 To 10
            Dim vaCliente = New Cliente
            vaCliente.Codigo = i + 1
            vaCliente.Nome = "Anderson" & i
            vaCliente.Idade = 38
            vaCliente.DataNascimento = New DateTime(1975, 9, 1 + i)
            lista.Add(vaCliente)
        Next

        Return lista
    End Function

End Class
