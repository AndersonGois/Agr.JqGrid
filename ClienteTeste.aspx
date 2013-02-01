<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Cadastro.Master" Inherits="System.Web.Mvc.ViewPage(Of Ingresso.Central.Periferico.Entities.ClienteTeste)" %>

<%@ Import Namespace="Ingresso.Lib.Web.Mvc" %>
<%@ Import Namespace="Cliente.Web" %>
<asp:Content ID="cScript" ContentPlaceHolderID="cScript" runat="server">
    <script type="text/javascript">
        var entidade = '<%=ViewData("EntidadeNome")%>';
        var UrlEntidade = '<%= Url.Action("/", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>';
        var vaCampos = ["txtcodigo", "txtnome"];
        var vaAlterar = 0;
        
        function limparForm() {
            limpaCampos(vaCampos);
            Ingresso.dropdown.clear($("#tipoLeituraSelecionada"));
            $("#gridCliente2").jqGrid('clearGridData').trigger("reloadGrid");
            definirElementoSelecionado();
            carregarListaTipoLeitura()
        }
    </script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/sistema/crud.js") %>"></script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/sistema/util.js") %>"></script>
    <script type="text/javascript">
 
        var gridClienteTeste;
        var gridClienteTeste2;
        var gridNome = "#gridCliente"
        var gridUrl = UrlEntidade + "ListarClienteTeste";
        var qtdVigenciaCodigoNovo = -100;
        var lastsel;
       var lastsel2;
         

        function convertendoStringEmUTC( data )
        {
                
            if( !data ){
                return "";
            }

            var novaDataArr = data.split("/");
               
            var mes = (parseInt(novaDataArr[1],10)-1);

            return "\/Date(" +  Date.UTC( novaDataArr[2],mes,novaDataArr[0])+ ")\/"
        }

         // Excluir Linha no grid 
        var excluirVigencia = function(codigo) { var su = jQuery('#gridCliente2').jqGrid('delRowData', codigo); };

        // Inserir Linha no Grid
        InserirLinhaGrid = function(){
            qtdVigenciaCodigoNovo = qtdVigenciaCodigoNovo - 1;
            var vaCodigo = $("#txtcodigo").val();
            var  vaNome =$("#txtnome").val();
            var vatipoLeitura = $("#tipoLeituraSelecionada").val();

            if(vaNome == ''){
               return exibirMensagemErro("Campo '[Nome]' obrigatório."); 
                
            }
            if(vatipoLeitura == 0){
               return exibirMensagemErro("Campo '[Tipo de Leitura]' obrigatório."); 
            }
            var datarow = {
                            Codigo: vaCodigo == ''? '' + qtdVigenciaCodigoNovo : vaCodigo,
                            Nome: $("#txtnome").val(),
                            TipoLeituraNome: $("#tipoLeituraSelecionada option:selected").text(),
                             TipoLeituraCodigo: $("#tipoLeituraSelecionada option:selected").val(),
                             DataAlteracao: $("#txtDataHoraSaida").val(),
                             operacaoExcluir: vaAlterar == 0 ? "<a href=\"javascript:excluirVigencia('" + "" + qtdVigenciaCodigoNovo +  "')\" class=\"operacaoExcluir\"><img src=\"<%= Url.Content("~/Content/img/_IcoExcluir.png")%>\" border=\"0\"></a>":''
                          };
            var su = jQuery('#gridCliente2').jqGrid('addRowData', "" + qtdVigenciaCodigoNovo, datarow);

            if(vaAlterar == 1){
                    RemoverincluirLinhaGrid(); 
                    jQuery("#gridCliente2").jqGrid('setSelection',qtdVigenciaCodigoNovo);
                }
            else {          
                    CarregarIncluirLinhaGrid(); 
                    jQuery("#gridCliente2").jqGrid('setSelection',qtdVigenciaCodigoNovo);
                    }
                    limpaCampos(vaCampos);
                    selectTipoLeitura(0);
                   jQuery("#gridCliente2").trigger("reloadGrid");
                
        }

        // Atualizar Grid
        var atualizarGrid = function () {
                    gridClienteTeste.trigger("reloadGrid");
        }

        //grid
        var definirGrid = function(){
            var ColNamesClienteTeste =['Codigo','TipoLeituraCodigo','Nome','Tipo de Leitura','Data'];
            var ColModelClienteTeste =[ { name:'Codigo'             ,index:'Codigo'                                             ,hidden: true   ,editable: true},
                                        { name:'TipoLeituraCodigo'  ,index:'TipoLeituraCodigo'  ,width:'130'    ,align:'left'   ,hidden: true   ,editable: true},
                                        { name:'Nome'               ,index:'Nome'               ,width:'130'    ,align:'left'                   ,editable: true},
                                        { name:'TipoLeituraNome'    ,index:'TipoLeituraNome'    ,width:'130'    ,align:'left'                   ,editable: true},
                                        { name:'DataAlteracao'      ,index:'DataAlteracao'      ,width:'130'    ,align:'left'                   ,editable: true}
                                      ];

            gridClienteTeste = $(gridNome).jqGrid({
                    url: gridUrl,
                    datatype: "json", mtype: "get", 
                    colNames: ColNamesClienteTeste, 
                    colModel: ColModelClienteTeste,
                    height: '100%',
                    viewrecords: true,
                    rowNum: 10,
                    rowList:[10,20,50], 
                    multiselect: false,
                    sortname: 'Nome', sortorder: "asc",
                    caption: "Clientes",
                    pager:'gridClientepager',
                    editurl:UrlEntidade + "ListaTeste",
                    multiselect: false,
                    onSelectRow: function (id, status) {
                        if(id && id!==lastsel2){
			                    gridClienteTeste.jqGrid('restoreRow',lastsel2);
                                gridClienteTeste.jqGrid('editRow',id,true);
			                    lastsel2=id;
		                    }
                            else
                             gridClienteTeste.jqGrid('editRow',id,true);

                            
	                    }
                    
            });
               gridClienteTeste.jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: "cn" });
        }
          var atualizarGrid = function () {
                    gridClienteTeste.trigger("reloadGrid");
        }

        //grid
        var definirGrid2 = function(){

            var ColNamesClienteTeste =['Codigo','TipoLeituraCodigo','Nome','Data de Alteracao','Tipo de Leitura',''];
            var ColModelClienteTeste =[ { name:'Codigo'             ,index:'Codigo'                                                                 ,hidden: true  },
                                        { name:'TipoLeituraCodigo'  ,index:'TipoLeituraCodigo'  ,width:'130'    ,align:'left'                       ,hidden: true  },
                                        { name:'Nome'               ,index:'Nome'               ,width:'130'    ,align:'left'                                      },
                                        { name:'TipoLeituraNome'    ,index:'TipoLeituraNome'    ,width:'130'    ,align:'left'                                      },
                                        { name:'DataAlteracao'      ,index:'DataAlteracao'      ,width:'130'    ,align:'left'   ,sorttype:"date"                   },
                                        { name:'operacaoExcluir'    ,index:'operacaoExcluir'    ,width: 16      ,align:'center' ,sortable: false    ,hidden: true}
                                      ];

            gridClienteTeste2 = $("#gridCliente2").jqGrid({
                    datatype: "local",
                    mtype: "get", 
                    colNames: ColNamesClienteTeste, 
                    colModel: ColModelClienteTeste,
                    height: '100%',
                   viewrecords: true, 
                   multiselect: false,
                   rowNum: 1,
                   rowList:[1,2,5,10],
                    sortname: 'Nome', sortorder: "asc",
                    caption: "Clientes",
                    multiselect: true,
                    pager:'gridClientepager2',
//                    editurl:UrlEntidade + "ListaTeste",
                    onSelectRow: function(id){
		                    if(id && id!==lastsel){
			                    jQuery('#gridCliente2').jqGrid('restoreRow',lastsel);
                                jQuery('#gridCliente2').jqGrid('editRow',id,true);
			                    lastsel=id;
		                    }
                            else
                             jQuery('#gridCliente2').jqGrid('editRow',id,true);
	                    }
                   
            });
             // gridClienteTeste2.jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: "cn" });

            
        }
    
      
        var incluirListaCliente = function(rowid,status){
              var retorno = [];
              var li;
           // todos ids selecionados do grid
           var s = jQuery("#gridCliente2").jqGrid('getGridParam','selarrrow'); 
                     
            for (var i = 0; i < s.length; i++) {

              var linha = { Codigo: null,Nome: null,DataAlteracao: null,TipoLeitura:{ Codigo: null,Nome: null }};

              li =  $('#gridCliente2').jqGrid('getRowData',s[i] );

              with (linha) {
                        Nome = li.Nome;
                        DataAlteracao = convertToJsonDate(li.DataAlteracao);
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
        
        var RemoverincluirLinhaGrid = function(){
            $("#txtnome").attr('readonly', true);
            $("#tipoLeituraSelecionada").attr('disabled',true);
            $("#incluirCliente").hide();
        }

        var CarregarIncluirLinhaGrid = function() {
            $("#txtnome").attr('readonly', false);
            $("#tipoLeituraSelecionada").attr('disabled',false);
            $("#incluirCliente").show();
          
        }
        
        // Elementos de Dados de Apresentação: Grids, tabelas dinamicas...
        var onSelectRow = function (rowid, status) {
            
            definirGrid(); 
            definirGrid2(); 
            atualizarGrid();
            blockCarregando();
            CarregarIncluirLinhaGrid();
            vaAlterar = 1;
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
            definirGrid2();  
	        carregarListaTipoLeitura();
             CarregarIncluirLinhaGrid();
             vaAlterar = 0;
	        limparForm()  
	        //
            definirElementoSelecionado("<%: Html.Traduzir(ViewData("EntidadeCriar"))%>");
        }

        //salvar Operacao
        var salvarOperacao = function (operacao, codigo) {
          CarregarIncluirLinhaGrid() 
        var vaEntidade;
        if (operacao == constantes.crud.Excluir) { vaEntidade = new Ingresso.ObjetoListavel(codigo); } 
            else { 
                    vaEntidade =  incluirListaCliente();
                 }

            postJson(UrlEntidade, operacao, vaEntidade);

            atualizarGrid()
        }

        $(document).ready(function () {

         $("#gridCliente").blur(function(){
                                atualizarGrid();
                             });

            configForm(colPadraoNames, colPadraoModel, onSelectRow);
              toDatePicker("txtDataHoraSaida");
              $.ajax({
                        url: UrlEntidade + 'ListaCaixa',
                        type: "POST", dataType: "json", 
                        data: {}, 
                        contentType: "application/json; charset=utf-8",
                        success:function(data) {

                            for (var i = 0; i < data.length; i++) {
                                $("#din").append("<span>nome: " + data[i].Nome +" Tipo Leitura: "+ data[i].TipoLeitura.Nome+"</span><br />");
                            }
                            //alert(data[0].TipoLeitura.Nome);
                        }
                    });  
                       
            $("#incluirCliente").click(function(){
                InserirLinhaGrid()
                

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
                        <%-- <p id="din">--%>
                        </p>
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
                        <label class="w25 inputselect" for="txtDataHoraSaida">
                            <span class="wrapper"><span class="title">
                                <%: Html.Traduzir("DataHoraSaida")%>:</span>
                                <input id="txtDataHoraSaida" name="txtDataHoraSaida" size="13" class="field BRDate" />
                            </span>
                        </label>
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
                                        <table id="gridCliente2" class="scroll" cellpadding="0" cellspacing="0">
                                        </table>
                                        <div id="gridClientepager2">
                                        </div>
                                        <table id="rowed5">
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
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
                            <%: Html.Traduzir("Clientes")%></a></h3>
                    <fieldset>
                        <table border="0" cellspacing="10" cellpadding="10">
                            <tr>
                                <td>
                                    <table id="gridCliente" class="scroll" cellpadding="0" cellspacing="0">
                                    </table>
                                    <div id="gridClientepager">
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </fieldset>
                </div>
            </div>
        </div>
        <% End Using%>
    </div>
</asp:Content>
