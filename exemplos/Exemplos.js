{/*******Cadastro Script ********************************************************************************************/


    var entidade = '<%=ViewData("EntidadeNome")%>';
    var UrlEntidade = '<%=Url.Action("/", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>';
	<script type="text/javascript" src="<%= Url.Content("~/Scripts/sistema/crud.js") %>"></script>
	<script type="text/javascript">
	   
	    function limparForm() {
	        var vaCampos = ["txtcodigo", "txtnome"];
	        limpaCampos(vaCampos); Ingresso.dropdown.clear($("#tipoLeituraSelecionada"));
	        definirElementoSelecionado();
	    }
        
	</script>
	
	var incluir = function () { //ESSE MEDODO É CHAMADO NO NOVO
			$("#txtnome").focus();
			$('#txtcodigo').attr('readonly', true);
			$("#operacao").val(constantes.operacao.Incluir);
			unblockDireito();

			carregarListaTipoLeitura();

			limparForm();  
			//
            definirElementoSelecionado("<%: Html.Traduzir(ViewData("EntidadeCriar"))%>");
		}		
}		
{/*******Drop down **************************************************************************************************/	
 <label class="w100 inputselect" for="tipoLeituraSelecionada">
							<span class="wrapper">
								<span class="title"><%: Html.Traduzir("Tipo de Leitura")%> *:</span>
								<select id="tipoLeituraSelecionada" name="tipoLeituraSelecionada" class="field comborequired" title="'<%: Html.Traduzir("Tipo de Leitura")  %>'">
										<option value="0">...</option>
									</select>
							</span>
						</label>
						
	var carregarListaTipoLeitura = function (tipoPeriferico) {
			$.post('<%= Url.Action("/ListarTipoLeituraCombo", ViewData("EntidadeNome"), New With {.area = ViewData("EntidadeArea")})%>',
				{},
				function (data) {
					Ingresso.dropdown.populate($("#tipoLeituraSelecionada"), data);
					if (tipoPeriferico != null) {
						selectTipoLeitura(tipoPeriferico.TipoLeitura.Codigo);
					}
				});
		}
		
		  <HttpPost()> _
        Function ListarTipoLeituraCombo() As ActionResult

            Dim vaLista As List(Of TipoLeitura) = Nothing
            Dim vaRetorno As New RetornoOperacao
            ''
            vaLista = _Fachada.ListarTipoLeitura(Nothing)
            ''
            Return Json(ListaWeb.converter(vaLista))
        End Function


}
{/******* Grid*******************************************************************************************************/ 
{/*******Exemplo de Grid*********************************************************************************************/
        var definirGrid = function () {

            var colNamesIngresso = ['EstabelecimentoCodigo', 'ProdutoCodigo',
                                    '<%: Html.Traduzir("Estabelecimento") %>', 
                                    '<%: Html.Traduzir("Departamento") %>', 
                                    '<%: Html.Traduzir("Categoria") %>', 
                                    '<%: Html.Traduzir("Grupo de Produto") %>', 
                                    '<%: Html.Traduzir("Classificação") %>', 
                                    '<%: Html.Traduzir("Composição") %>', 
                                    '<%: Html.Traduzir("Produto") %>', 
                                    '<%: Html.Traduzir("Estoque") %>'
                                   ];

            var colModelIngresso = [
                                    { name: 'EstabelecimentoCodigo', index: 'EstabelecimentoCodigo', hidden: true },                                    
                                    { name: 'ProdutoCodigo', index: 'ProdutoCodigo', hidden: true },                                    
                                    { name: 'Estabelecimento', index: 'Estabelecimento', hidden: true },
                                    { name: 'Departamento', index: 'Departamento', width: 115, align: 'left', sortable: true, hidden: false },
                                    { name: 'Categoria', index: 'Categoria', width: 130, align: 'left', sortable: true, hidden: false },
                                    { name: 'Grupo', index: 'Grupo', width: 130, align: 'left', sortable: true, hidden: false },
                                    { name: 'Classificacao', index: 'Classificacao', width: 80, align: 'center', search: false, editable: true, formatter: getIconeClassificacao },
                                    { name: 'Composicao', index: 'Composicao', width: 80, align: "center", search: false, editable: true, formatter: getIconeComposicao },
                                    { name: 'Produto', index: 'Produto', width: 320, align: 'left', editoptions: { maxlength: "20" }, sortable: false, hidden: false, title: false },
                                    { name: 'Estoque', index: 'Estoque', width: 90, align: 'right', sortable: true, hidden: false }
                                   ];

            function getIconeClassificacao(cellvalue, options, rowObject) {
                var imageHtml = "";
                if (cellvalue) {
                    switch (cellvalue) {
                        case ("I"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/insumo.png") %>' class='iconeClassificacao' alt='Insumo' title='Insumo' />";
                            break;
                        case ("P"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/produtovenda.png") %>' class='iconeClassificacao' alt='Produto de Venda' />";
                            break;
                        case ("S"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/servico.png")%>' class='iconeClassificacao' alt='Serviço' title='Serviço' />";
                            break;
                        case ("B"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/brinde.png")%>' class='iconeClassificacao'alt='Brinde' title='Brinde' />";
                            break;
                        case ("M"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/materialconsumo.png")%>' class='iconeClassificacao' alt='Material de Consumo' title='Material de Consumo' />";
                            break;
                        case ("U"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/suprimento.png")%>' class='iconeClassificacao' alt='Suprimento' title='Suprimento' />";
                            break;
                        default:
                            imageHtml = "-";
                    }               
                } else {
                    imageHtml = "-";
                }
                return imageHtml;
            }
            
                       
            function getIconeComposicao(cellvalue, options, rowObject) {
                var imageHtml = "";
                if (cellvalue) {
                    switch (cellvalue) {
                        case ("R"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/receita.png") %>' class='iconeComposicao' alt='Receita' title='Receita' />";
                            break;
                        case ("C"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/composto.png")%>' class='iconeComposicao' alt='Composto' title='Composto' />";
                            break;
                        case ("N"):
                            imageHtml = "<img src='<%= Url.Content("~/Content/img/normal.png")%>' class='iconeComposicao' alt='Normal' title='Normal' />";
                            break;
                        default:
                            imageHtml = "-";
                    }               
                } else {
                    imageHtml = "-";
                }
                return imageHtml;
            }
           
            gridRelacionamento = jQuery(gridNome).jqGrid({
                url: gridUrl + "?EstabelecimentoCodigo=" + 0,
                datatype: "json", mtype: "get", 
                colNames: colNamesIngresso, 
                colModel: colModelIngresso,
                height: 340,
                viewrecords: true, 
                multiselect: false,
                rowNum: 1000,
                sortname: 'Departamento', sortorder: "asc",
                caption: "Produtos por Estabelecimento",
                gridComplete: function() {
                    $(".jqgrow").mouseover(function(e) {
                        
                        var srcClassificacao = $(this).find('img.iconeClassificacao').attr("src").replace(".png", "_hover.png");
                        var srcComposicao = $(this).find('img.iconeComposicao').attr("src").replace(".png", "_hover.png");
                        
                        $(this).find('img.iconeClassificacao')
                        .stop(true)
                        .fadeTo(0,0)
                        .attr("src", srcClassificacao)
                        .fadeTo('slow', 1);

                        $(this).find('img.iconeComposicao')
                        .stop(true)
                        .fadeTo(0,0)
                        .attr("src", srcComposicao)
                        .fadeTo('slow', 1);

                    });

                     $(".jqgrow").mouseout(function(e) {
                        
                        var srcClassificacao = $(this).find('img.iconeClassificacao').attr("src").replace("_hover.png", ".png");
                        var srcComposicao = $(this).find('img.iconeComposicao').attr("src").replace("_hover.png",".png");

                        $(this).find('img.iconeClassificacao')
                        .stop(true)
                        .fadeTo(0,0)
                        .attr("src", srcClassificacao)
                        .fadeTo('slow', 1);

                        $(this).find('img.iconeComposicao')
                        .stop(true)
                        .fadeTo(0,0)
                        .attr("src", srcComposicao)
                        .fadeTo('slow', 1);
                    });
                  

                }
            });

            gridRelacionamento.jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: "cn" });

            jQuery.each(colModelIngresso, function (paIndex, paItem) {
                if (paItem == undefined) { return; }

                var vaObjSelector = "#gbox_" + gridNome.replace("#", "") + " #gs_" + paItem.name;
                var vaObj = $(vaObjSelector);
                vaObj.unbind("keypress")
                .keypress(function (e) {
                    if (e.which == 13) busca(vaObj.val(), paItem.name);
            
                });
            });

        }
}
{/*******Atualizar Grid de pesquiza**********************************************************************************/		
  var atualizarGrid = function (paUrl) {
            gridClienteTeste.setGridParam({ url: paUrl, page: 1 }).trigger("reloadGrid");
        }
}
{/*******Inserir linha no grid **************************************************************************************/
var datarow = {
                codigo: '' + qtdVigenciaCodigoNovo,
                datainicio: dtini,//"/Date("+formatUTCDate(fmt_dtini)+")/",
                datafim: dtfim,//"/Date("+formatUTCDate(fmt_dtfim)+")/",
                operacaoExcluir:"<a href=\"javascript:excluirVigencia('" + "" + qtdVigenciaCodigoNovo +  "')\" class=\"operacaoExcluir\"><img src=\"<%= Url.Content("~/Content/img/_IcoExcluir.png")%>\" border=\"0\"></a>"
              };
        
            var su = jQuery('#txtvigencia').jqGrid('addRowData', "" + qtdVigenciaCodigoNovo, datarow);
var datarow = {
             Codigo: '9' ,
             Nome: 'teste'
             
         };
			var su = jQuery('#gridCliente').jqGrid('addRowData', "" , datarow);
}//
}//