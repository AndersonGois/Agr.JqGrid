        var gridClienteTeste;
        var gridNome = "#gridCliente"
        var gridUrl = UrlEntidade + "ListarClienteTeste";
        var qtdVigenciaCodigoNovo = -100;

//Grid/////////////////{
         
		   // linha do grid
            linha =  $('#gridCliente').jqGrid('getRowData',rowid );
           
           // campo do grid
           var codigo = $('#gridCliente').getCell(rowid, 'codigo');
           
           // todos ids selecionados do grid
           var s = jQuery("#gridCliente").jqGrid('getGridParam','selarrrow'); 
       
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
//Sistema fim/////////}
        $(document).ready(function () {

            configForm(colPadraoNames, colPadraoModel, onSelectRow);

            $("#incluirCliente").click(function(){
                InserirLinhaGrid()
            })
        });