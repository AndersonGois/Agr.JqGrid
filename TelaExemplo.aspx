<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Cadastro.Master" Inherits="System.Web.Mvc.ViewPage(Of Ingresso.Central.Periferico.Entities.ClienteTeste)" %>

<%@ Import Namespace="Ingresso.Lib.Web.Mvc" %>
<%@ Import Namespace="Cliente.Web" %>
<asp:Content ID="cScript" ContentPlaceHolderID="cScript" runat="server">
    <script type="text/javascript">
        var entidade = '<%=ViewData("EntidadeNome")%>';
        var UrlEntidade = '<%= Url.Action("/", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>';

        function limparForm() {
            var vaCampos = ["txtcodigo", "txtnome"];
            limpaCampos(vaCampos);
            Ingresso.dropdown.clear($("#tipoLeituraSelecionada"));
            definirElementoSelecionado();
            carregarListaTipoLeitura()
        }

                      
    </script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/sistema/crud.js") %>"></script>
    <script type="text/javascript">
 
        var gridClienteTeste;
        var gridNome = "#gridCliente"
        var gridUrl = UrlEntidade + "ListarClienteTeste";
        var qtdVigenciaCodigoNovo = -100;
         
         
         // Excluir Linha no grid 
        var excluirVigencia = function(codigo) { var su = jQuery('#gridCliente').jqGrid('delRowData', codigo); };

        // Inserir Linha no Grid
        InserirLinhaGrid = function(){
            qtdVigenciaCodigoNovo = qtdVigenciaCodigoNovo - 1;
            var datarow = {
                            Codigo: '' + qtdVigenciaCodigoNovo,
                            Nome: $("#txtnome").val(),
                            TipoLeituraNome: $("#tipoLeituraSelecionada option:selected").text(),
                             TipoLeituraCodigo: $("#tipoLeituraSelecionada option:selected").val(),
                            operacaoExcluir:"<a href=\"javascript:excluirVigencia('" + "" + qtdVigenciaCodigoNovo +  "')\" class=\"operacaoExcluir\"><img src=\"<%= Url.Content("~/Content/img/_IcoExcluir.png")%>\" border=\"0\"></a>"
                          };
            var su = jQuery('#gridCliente').jqGrid('addRowData', "" + qtdVigenciaCodigoNovo, datarow);
        }

        // Atualizar Grid
        var atualizarGrid = function () {
                    gridClienteTeste.trigger("reloadGrid");
        }

        //grid
        var definirGrid = function(){
            var ColNamesClienteTeste =['Codigo','TipoLeituraCodigo','Nome','Tipo de Leitura',''];
            var ColModelClienteTeste =[ { name:'Codigo',index: 'Codigo',hidden: true},
                                        { name:'TipoLeituraCodigo',index:'Nome',width:'130',align:'left',hidden: true},
                                        { name:'Nome',index:'Nome',width:'130',align:'left'},
                                        { name:'TipoLeituraNome',index:'Nome',width:'130',align:'left'},
                                        { name: 'operacaoExcluir', index: 'operacaoExcluir', width: 16, align: 'center', sortable: false, hidden: false }
                                      ];

            gridClienteTeste = $(gridNome).jqGrid({
                    url: gridUrl,
                    datatype: "json", mtype: "get", 
                    colNames: ColNamesClienteTeste, 
                    colModel: ColModelClienteTeste,
                    height: '100%',
                    viewrecords: true, 
                    multiselect: false,
                    rowNum: 1000,
                    sortname: 'Nome', sortorder: "asc",
                    caption: "Clientes",
                    multiselect: true,
                    onSelectRow: function (id, status) {}
            });
        }
       
        var incluirListaCliente = function(rowid,status){
              var retorno = [];
              var li;
           // todos ids selecionados do grid
           var s = jQuery("#gridCliente").jqGrid('getGridParam','selarrrow'); 
                     
            for (var i = 0; i < s.length; i++) {

              var linha = { Codigo: null,Nome: null,TipoLeitura:{ Codigo: null,Nome: null }};

              li =  $('#gridCliente').jqGrid('getRowData',s[i] );

              with (linha) {
                        Nome = li.Nome;
                        if(li.Codigo<0){ li.Codigo = 0}
                            Codigo = li.Codigo;
                        with (TipoLeitura) {
                            Codigo = li.TipoLeituraCodigo;
                            Nome = li.TipoLeituraNome;
                        }
              }
                 retorno.push(linha);
            }
            return retorno;
          } 
         
        // Dropdown - Seleciona 
        function selectTipoLeitura(codigo) { Ingresso.dropdown.selectItem("tipoLeituraSelecionada", codigo); }
        
        // Dropdown - Carrega 
        var carregarListaTipoLeitura = function (ClienteTeste) {
	        $.post('<%= Url.Action("/ListarTipoLeituraCombo", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>',
		        {},
		        function (data) {
			        Ingresso.dropdown.populate($("#tipoLeituraSelecionada"), data);
			        if (ClienteTeste != null) {
				        selectTipoLeitura(ClienteTeste.TipoLeitura.Codigo);
			        }
		        });
        }
        
        // Elementos de Dados de Apresentação: Grids, tabelas dinamicas...
        var onSelectRow = function (rowid, status) {
            
            definirGrid(); 
            atualizarGrid();
            blockCarregando();
            
            var codigo = $('#grid').getCell(rowid, 'codigo');
	        
	        $.getJSON(UrlEntidade + 'Selecionar/' + codigo, function (data) {
		        if (data.Codigo == constantes.resultado.Acerto) {
			        limparForm();

			        $('#txtcodigo').attr('readonly', true); 
			        $("#operacao").val(constantes.operacao.Alterar);
			        $("#txtcodigo").val(data.Dados.Codigo);
			        $("#txtnome").val(data.Dados.Nome);

			        // Selecionar o tipoLeitura
			        carregarListaTipoLeitura(data.Dados);
                  
			        unblockDireito();
			        
			        definirElementoSelecionado(data.Dados.Nome);
		        }
		        else { exibirMensagemErro(data.Mensagem); }
	        });
        }
        
        // Incluir Do Sistema
        var incluir = function () {
	        $("#txtnome").focus();
	        $('#txtcodigo').attr('readonly', true);
	        $("#operacao").val(constantes.operacao.Incluir);
	        unblockDireito();
            definirGrid(); 
	        carregarListaTipoLeitura();

	        limparForm()  
	        //
            definirElementoSelecionado("<%: Html.Traduzir(ViewData("EntidadeCriar"))%>");
        }

        //salvar Operacao
        var salvarOperacao = function (operacao, codigo) {
        var vaEntidade;
        if (operacao == constantes.crud.Excluir) { vaEntidade = new Ingresso.ObjetoListavel(codigo); } 
            else { 
                    vaEntidade =  incluirListaCliente();
                 }

            postJson(UrlEntidade, operacao, vaEntidade);

            atualizarGrid()
        }

        $(document).ready(function () {

            configForm(colPadraoNames, colPadraoModel, onSelectRow);

            $("#incluirCliente").click(function(){
                InserirLinhaGrid()
                limparForm()
            })
        });

    </script>
</asp:Content>
<asp:Content ID="cPrincipal" ContentPlaceHolderID="cPrincipal" runat="server">
    <h2>
        <%: ViewData("Message") %></h2>
</asp:Content>
<asp:Content ID="cDireito" ContentPlaceHolderID="cDireito" runat="server">
    <div id="tabs" style="height: 100%; display: none;">
        <%Using Html.BeginForm("Form", "ClienteTeste", Nothing, FormMethod.Post, New With {.id = "frmEdicao"})%>
        <input type="hidden" id="operacao" value="i" />
        <input type="hidden" id="tag" value="" />
        <ul>
            <li><a href="#tabs-1">
                <%: Html.Traduzir("Cadastro")%></a></li>
            <li id="tabClienteTeste"><a href="#tabs-2">
                <%: Html.Traduzir("Cliente")%></a></li>
        </ul>
        <div id="tabs-1">
            <!-- Accordion -->
            <h2 id="elementoSelecionado">
            </h2>
            <div id="accordion">
                <div>
                    <h3>
                        <a id="infoGeral" href="#">
                            <%: Html.Traduzir("Informações Gerais")%></a></h3>
                    <fieldset>
                        <label class="w100 inputselect" for="txtcodigo">
                            <span class="wrapper"><span class="title">
                                <%: Html.Traduzir("Código")%>:</span>
                                <input id="txtcodigo" name="txtcodigo" disabled="disabled" class="fieldDisable" />
                            </span>
                        </label>
                        <label class="w100 inputselect" for="Nome">
                            <span class="wrapper"><span class="title">
                                <%: Html.Traduzir("Nome")%>
                                *:</span>
                                <input id="txtnome" name="nome" maxlength="60" title="<%: Html.Traduzir("Nome")  %>"
                                    class="field" />
                            </span>
                        </label>
                        <label class="w100 inputselect" for="tipoLeituraSelecionada">
                            <span class="wrapper"><span class="title">
                                <%: Html.Traduzir("Tipo de Leitura")%>
                                *:</span>
                                <select id="tipoLeituraSelecionada" name="tipoLeituraSelecionada" class="field" title="'<%: Html.Traduzir("Tipo de Leitura")  %>'">
                                    <option value="0">...</option>
                                </select>
                            </span>
                        </label>
                    </fieldset>
                </div>
            </div>
        </div>
        <div id="tabs-2">
            <!-- Accordion -->
            <div id="accordionCliente">
                <div>
                    <h3>
                        <a id="infoGeral2" href="#">
                            <%: Html.Traduzir("Grid Cliente")%></a></h3>
                    <fieldset>
                        <div class="w100 inputselect" id="lstCliente">
                            <table border="0" cellspacing="10" cellpadding="10">
                                <tr>
                                    <td colspan="2">
                                        <a href="#" id="incluirCliente" class="fg-button ui-state-default fg-button-icon-left ui-corner-all">
                                            <span class="ui-icon ui-icon-document"></span>Incluir</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        &nbsp;
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table id="gridCliente" class="scroll" cellpadding="0" cellspacing="0">
                                        </table>
                                        <div id="gridClientepager">
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <h3>
                        <a id="dfd" href="#">
                            <%: Html.Traduzir("Teste")%></a></h3>
                    <fieldset>
                    <label>anderson</label>
                    </fieldset>
                </div>
            </div>
            
        </div>
        <% End Using%>
    </div>
</asp:Content>
