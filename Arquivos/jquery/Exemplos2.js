        var gridClienteTeste;
        var gridNome = "#gridCliente"
        var gridUrl = UrlEntidade + "ListarClienteTeste";
        var qtdVigenciaCodigoNovo = -100;

//Grid/////////////////{
	//Recarregar o grid
    $("#txtsistema").jqGrid('clearGridData').trigger("reloadGrid");
	// linha do grid
    linha =  $('#gridCliente').jqGrid('getRowData',rowid );
           
     // campo do grid
     var codigo = $('#gridCliente').getCell(rowid, 'codigo');
           
     // todos ids selecionados do grid
     var s = jQuery("#gridCliente").jqGrid('getGridParam','selarrrow'); 
			
	//Selecionar  linha no multiselect
	jQuery("#gridCliente2").jqGrid('setSelection',"2");
	   
    // todos os ids do grid
    var rowIds = $('#gridCliente').jqGrid('getDataIDs');
		 
    // Excluir Linha no grid 
    var excluirVigencia = function(codigo) { var su = jQuery('#gridCliente').jqGrid('delRowData', codigo); };

    // Inserir Linha no Grid
    InserirLinhaGrid = function(){
            qtdVigenciaCodigoNovo = qtdVigenciaCodigoNovo - 1;
            var datarow = {
                            Codigo: '' + qtdVigenciaCodigoNovo,
                            Nome: "Teste",
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
    var ColNamesClienteTeste =['Codigo','Nome',''];
    var ColModelClienteTeste =[ { name:'Codigo',index: 'Codigo'},
                                 { name:'Nome',index:'Nome',width:'130',align:'left'},
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
                    caption: "Clientes"
            });
        }


//Grid fim/////////////}

//Dropdown/////////////{         
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

//Dropdown Fim////////}
         
//Sistema/////////////{
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
        var vaEntidade = { 
                            Codigo: null, 
                            Nome: null, 
                            TipoLeitura:
                                        { 
                                            Codigo: null , 
                                            Nome: null 
                                        }
                         };

            if (operacao == constantes.crud.Excluir) { vaEntidade = new Ingresso.ObjetoListavel(codigo); } 
            else { 
                    with (vaEntidade) 
                        { 
                            Codigo = codigo;
                            Nome = $("#txtnome").val() 
                            TipoLeitura.Codigo = $("#tipoLeituraSelecionada option:selected").val();
                            TipoLeitura.Nome =   $("#tipoLeituraSelecionada option:selected").text();
                            }
                    }
			// Crud
            postJson(UrlEntidade, operacao, vaEntidade); 

            atualizarGrid()
        }

		var entidade = '<%=ViewData("EntidadeNome")%>';
        var UrlEntidade = '<%= Url.Action("/", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>';

        function limparForm() {
            var vaCampos = ["txtcodigo", "txtnome"];
            limpaCampos(vaCampos); Ingresso.dropdown.clear($("#tipoLeituraSelecionada"));
            Ingresso.dropdown.clear($("#Nome"));
            definirElementoSelecionado();
        }
		
		//Para o grid do lado esquerdo  script minimo
		
		  <script type="text/javascript">
          var entidade = '<%=ViewData("EntidadeNome")%>';
          var UrlEntidade = '<%= Url.Action("/", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>';
          var vaCampos = ["txtcodigo", "txtnome"];
          function limparForm() {
              limpaCampos(vaCampos);
              definirElementoSelecionado();
          }
    </script>
    <script type="text/javascript" src="<%= Url.Content("~/Scripts/sistema/crud.js") %>"></script>
    <script type="text/javascript">


        var onSelectRow = function (rowid, status) {
        }

        $(document).ready(function () {
            configForm(colPadraoNames, colPadraoModel, onSelectRow);
        });

    </script>
		
//Sistema fim/////////}
        $(document).ready(function () {

            configForm(colPadraoNames, colPadraoModel, onSelectRow);

            $("#incluirCliente").click(function(){
                InserirLinhaGrid()
            })
        });

//Json
{		
//Data		
{

//Convert data to json 
{
        function convertendoStringEmUTC( data )
        {
                
            if( !data ){
                return "";
            }

            var novaDataArr = data.split("/");
               
            var mes = (parseInt(novaDataArr[1],10)-1);

            return "\/Date(" +  Date.UTC( novaDataArr[2],mes,novaDataArr[0])+ ")\/"
        }
//
}
//Converte data em json para data 
{
	var dateString = "\/Date(1334514600000)\/".substr(6);
	var currentTime = new Date(parseInt(dateString ));
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var date = day + "/" + month + "/" + year;
	alert(date);

}

}

var str = window.JSON.stringify({myDate:new Date()});
// str == "{"myDate":"2010-12-27T11:59:18.119Z"}"
var obj = window.JSON.parse(str);
// obj.myDate == "2010-12-27T11:59:18.119Z"



}