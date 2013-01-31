<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
    <%= Url.Action("\ListarCliente") %>
</asp:Content>
<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
   
    <script type="text/javascript">
        var entidade = '<%=ViewData("EntidadeNome")%>';
        var UrlEntidade ='<%= Url.Action("ListarCliente") %>';

        var definirGrid = function () {

            gridClienteTeste = $("#grid").jqGrid({
                url: UrlEntidade,
                datatype: "json",
                colNames: ['', 'Nome', 'Data Nascimento', 'Idade'],
                colModel: [
                            { name: 'Codigo', index: 'Codigo', hidden: true },
                            { name: 'Nome', index: 'Nome', width: '130', align: 'left', hidden: false },
                            { name: 'DataNascimento', index: 'DataNascimento', width: '130', align: 'left' },
                            { name: 'Idade', index: 'Idade', width: '130', align: 'left' }
                          ],
                height: '100%',
                pager: '#pager',
                sortname: 'Codigo',
                viewrecords: true,
                sortorder: "desc",
                caption: "Clientes",
                loadComplete: function () {
                    alert("vai");
                }
            });

        }

        $(function () {
            definirGrid();

//            jQuery("#list4").jqGrid({
//                datatype: "local",
//                height: 250,
//                colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
//                colModel: [

//   		{ name: 'id', index: 'id', width: 60, sorttype: "int" },
//   		{ name: 'invdate', index: 'invdate', width: 90, sorttype: "date" },
//   		{ name: 'name', index: 'name', width: 100 },
//   		{ name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float" },
//   		{ name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float" },
//   		{ name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
//   		{ name: 'note', index: 'note', width: 150, sortable: false }
//   	],
//                height: '100%',
//                multiselect: true,
//                caption: "Manipulating Array Data"
//            });
//            var mydata = [
//		{ id: "1", invdate: "2007-10-01", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
//		{ id: "2", invdate: "2007-10-02", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
//		{ id: "3", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" },
//		{ id: "4", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
//		{ id: "5", invdate: "2007-10-05", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
//		{ id: "6", invdate: "2007-09-06", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" },
//		{ id: "7", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
//		{ id: "8", invdate: "2007-10-03", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
//		{ id: "9", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" }
//		];
//            for (var i = 0; i <= mydata.length; i++)
//                jQuery("#list4").jqGrid('addRowData', i + 1, mydata[i]);
        });
    </script>
 
       
    <table id="list4" >
    </table>
    <div id="pager11">
    </div>

     <table id="grid" >
    </table>
     <div id="page">
    </div>
</asp:Content>
