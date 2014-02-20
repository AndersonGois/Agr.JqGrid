<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
    <%= Url.Action("\ListarCliente") %>
</asp:Content>
<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">

   <script type="text/javascript">
        var entidade = '<%=ViewData("EntidadeNome")%>';
        var UrlEntidade = '<%= Url.Action("ListarCliente") %>';
        var teste = new Agr.GridMultiSelecao;


        
        var vaData = null;

        var carregarDados = function () {
       
//            $.ajax({
//                url: UrlEntidade,
//                type: "POST",
//                dataType: "json",
//                data: {},
//                contentType: "application/json; charset=utf-8",
//                error: function (data) { },
//                success: function (data) {
//                    vaData = data
//                    for (var i = 0; i <= vaData.length; i++)
//                        jQuery("#grid").jqGrid('addRowData', i + 1, vaData[i]);


//                    $(".frozen-bdiv").css("top", "48px");
//                }
//            }); // $.ajax
//            return vaData;
        }

        var definirGrid = function () {

            $.ajax({
                url: '<%= Url.Action("ListarColunasGRid") %>',
                type: "POST",
                dataType: "json",
                data: {},
                contentType: "application/json; charset=utf-8",
                error: function (data) { },
                success: function (data) {

                    var colNames = data[0];
                    var ColModel = data[1];

                    teste.definir(UrlEntidade, "ListarCliente", "#list4", "Observacao");
                    teste.configurar(colNames, ColModel);

                    $("#grid").jqGrid({
                        //                url: UrlEntidade,
                        datatype: "local",
                        mtype: 'POST',
                        colNames: colNames,
                        colModel: ColModel,
                        height: '100%',
                        width: 500,
                        pager: '#page',
                        shrinkToFit: false,
                        sortname: 'Codigo',
                        viewrecords: true,
                        sortorder: "desc",
                        caption: "Clientes",
                        jsonReader: { repeatitems: false },
                        loadComplete: function () {
                            $(".frozen-bdiv").css("top", "48px");
                        }
                    });
                }
            }); // $.ajax
          


            //jQuery("#grid").jqGrid('setGroupHeaders', { useColSpanStyle: false, groupHeaders: [{ startColumnName: 'Codigo', numberOfColumns: 2, titleText: 'Teste'}] });
            jQuery("#grid").jqGrid('setFrozenColumns');
            //            $("#grid2").jqGrid({
            //                //                url: UrlEntidade,
            //                datatype: "local",
            //                mtype: 'POST',
            //                colNames: ['', 'Nome', 'Data Nascimento', 'Idade'],
            //                colModel: [
            //                            { name: 'Codigo', index: 'Codigo' },
            //                            { name: 'Nome', index: 'Nome', width: '130', align: 'left' },
            //                            { name: 'DataNascimento', index: 'DataNascimento', width: '130', align: 'left', formatter: { date: { newformat: 'd/m/Y'}} },
            //                            { name: 'Idade', index: 'Idade', width: '130', align: 'left' }

            //                          ],
            //                height: '100%',
            //                pager: '#page',
            //                sortname: 'Codigo',
            //                viewrecords: true,
            //                sortorder: "desc",
            //                caption: "Clientes",
            //                loadComplete: function () {

            //                }
            //            });

        }

        $(function () {
            definirGrid();
            carregarDados();
           

        });
    </script>
    <table id="list4">
    </table>
    <div id="pager11">
    </div>
    <table id="grid">
    </table>
    <div id="page">
    </div>
    <br />
    <table id="grid2">
    </table>
    <div id="page2">
    </div>
</asp:Content>
