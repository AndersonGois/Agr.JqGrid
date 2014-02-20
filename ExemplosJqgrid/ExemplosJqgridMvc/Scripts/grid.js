
if (Agr == undefined) { var Agr = {}; };

//////////////////////////////////////////////////////////////////////////////////
var stripAccentsGridMultiSelecao = (function () {
    var in_chrs = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
      out_chrs = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY',
      chars_rgx = new RegExp('[' + in_chrs + ']', 'g'),
      transl = {}, i,
      lookup = function (m) { return transl[m] || m; };

    for (i = 0; i < in_chrs.length; i++) {
        transl[in_chrs[i]] = out_chrs[i];
    }

    return function (s) { return s ? s.replace(chars_rgx, lookup) : ''; }
})();

Agr.GridMultiSelecao = function () {
    this.Parametros = { width: "450", height: "150", pager: "#pager", sortname: "nome", sortorder: "asc", mtype: "get", datatype: "json", columnid: "Codigo",   //columnid - Aceita qualquer tipo(texto,double e etc)
        ExpandColumn: 'Codigo',
        multiselect: true,
        shrinkToFit: true,
        exibirNumeroLinhas: null,
        onBeforeSelectRow: null,
        rowList: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        rowNum: 15,

        treeGrid: false,
        treeReader: { level_field: 'tree_level',
            parent_id_field: 'tree_parent',
            leaf_field: 'tree_leaf',
            expanded_field: 'tree_expanded',
            loaded: 'tree_loaded',
            icon_field: 'tree_icon'
        }
    }
    this.ParametrosPersonalizadoUrl = new Object();
};
Agr.GridMultiSelecao.prototype = {
    GridNome: null, GridTitulo: null, GridObj: null, CallBackCheckBox: null, CallBackReiniciar: null, CallBackCargaCompleta: null,
    CallBackSelecionado: null,
    EntidadeUrl: null, EntidadeMetodo: null,
    Valores: [], Colunas: { Nomes: undefined, Modelo: undefined },
    definir: function (paEntidadeUrl, paEntidadeMetodo, paGrid, paTitulo) {
        //
        this.GridNome = paGrid; this.GridTitulo = paTitulo;
        this.EntidadeUrl = paEntidadeUrl; this.EntidadeMetodo = paEntidadeMetodo;
        this.Valores = [];

        if (this.Parametros.pager === false) {
            this.Parametros.pager = this.Parametros.pager;
            this.Parametros.rowNum = 9999
        } else {
            this.Parametros.pager = "#grid" + this.GridNome.replace("#", "") + "Pager"
        }
    }, //definir
    reload: function () {
        jQuery(this.GridNome).trigger("reloadGrid");
    }, //reload
    buscarGridFormCrud: function (paBusca) {
        //
        // Somente ativa a barra de filtros quando não for Treeview e Multiselect ao mesmo tempo.
        // ToDo: Adaptar GridMultiSelect para permitir realização de filtros quando esta estiver configurada para TreeView e MultiSelect ao mesmo tempo.
        if (this.Parametros.treeGrid && this.Parametros.multiselect) return false;

        var vaQryString = this.lerStringParametrosPersonalizadosUrl();

        if (paBusca == undefined || paBusca == "") {
            jQuery(this.GridNome).setGridParam({ url: this.EntidadeUrl + this.EntidadeMetodo + vaQryString, page: 1 }).trigger("reloadGrid");
            jQuery(this.GridNome).trigger("reloadGrid"); return;
        }

        vaQryString += (!vaQryString ? '?' : '&') + "_search=True&searchString=" + paBusca;

        jQuery(this.GridNome).setGridParam({ url: this.EntidadeUrl + this.EntidadeMetodo + vaQryString, page: 1 }).trigger("reloadGrid");
    }, //buscarGridFormCrud
    definirGridFormCrud: function (paEntidadeUrl, paEntidadeMetodo, paGrid, paColNames, paColModel) {
        this.Parametros.height = "100%";
        this.Parametros.columnid = "Codigo";
        this.Parametros.sortname = "Codigo";
        $.extend(this.Parametros, { multiselect: false });
        this.definir(paEntidadeUrl, paEntidadeMetodo, paGrid, paGrid);
        this.configurar(paColNames, paColModel);
        $("#gview_" + paGrid.replace("#", "") + " > .ui-jqgrid-titlebar").hide();

        var mygrid = jQuery(this.GridNome);
        $(paColModel).each(function (index) {
            mygrid.jqGrid('setLabel', this.name, '&nbsp;' + paColNames[index], { 'text-align': 'left' });
        });


    }, //definirGridFormCrud
    definirNumeroLinhasPadrao: function (paNumero) {
        //
        this.Parametros.rowNum = paNumero;
    }, //definir
    definirCallBackCheckBox: function (paCallBack) {
        //
        this.CallBackCheckBox = paCallBack;
    }, //definir
    definirCallBackReiniciar: function (paCallBack) {
        //
        this.CallBackReiniciar = paCallBack;
    }, //definir
    definirCallBackCargaCompleta: function (paCallBack) {
        //
        this.CallBackCargaCompleta = paCallBack;
    }, //definir
    limpar: function (manterValoresSelecionados) {
        var mygrid = jQuery(this.GridNome);

        if (!manterValoresSelecionados) this.Valores = [];

        mygrid.jqGrid('clearGridData');
        mygrid.setGridParam({ url: this.EntidadeUrl + this.EntidadeMetodo });
    }, //clear
    limparSelecao: function () {
        var mygrid = jQuery(this.GridNome);
        this.Valores = [];
        mygrid.jqGrid('resetSelection');
    }, //resetSelection
    selecionar: function (rowid) {
        if (rowid == null) {
            this.limparSelecao();
        }
        var mygrid = jQuery(this.GridNome);
        mygrid.jqGrid('setSelection', rowid);
    }, //resetSelection
    filter: function (selectedItens, filtro) {
        var mygrid = jQuery(this.GridObj);
        mygrid.setGridParam({ url: this.EntidadeUrl + this.EntidadeMetodo + "?" + filtro });
        //Não podemos apagar o itemData, caso selectedItens seja null.
        if (selectedItens != null) {
            this.ItemData = selectedItens;
        };
        mygrid.trigger("reloadGrid");
    }, //filter
    reiniciar: function (paSelecionados, paForcarReload) {
        //
        if (paForcarReload) {

            if (paSelecionados) this.Valores = $.map(paSelecionados, function (item) { return item.Codigo });
            this.busca('', '');

        } else {

            var gboxVal = "gbox_" + this.GridNome.replace("#", "");

            $('#' + gboxVal + '.cbox').attr('checked', false);
            jQuery(this.GridNome).jqGrid("resetSelection");
            this.Valores = [];
            if (paSelecionados != null) {
                for (var i = 0; i < paSelecionados.length; i++) {
                    if (jQuery.inArray(paSelecionados[i].Codigo, this.Valores) > -1) {
                        //não faz nada
                    } else {
                        this.Valores.push(paSelecionados[i].Codigo); //inclui no array
                        jQuery(this.GridNome).jqGrid("setSelection", paSelecionados[i].Codigo);
                    }
                }
            }
            else {
                $('#gbox_' + this.GridNome.replace('#', '') + ' [id^=gs_]').val('');   // limpa as caixas de texto de pesquisa
                this.busca("", "");
            }
        }
        if (this.CallBackReiniciar != null) { this.CallBackReiniciar(); }

    }, //reiniciar
    lerLinhasPaginaAtual: function () {
        return jQuery(this.GridNome).jqGrid('getRowData');
    }, // lerLinhasPaginaAtual
    lerValores: function () {
        return this.Valores;
    }, //lerValores
    lerValorEstaSelecionado: function (rowid) {
        var existe = $.grep(this.Valores, function (data) {
            return data == rowid;
        }).length > 0;
        return existe;
    }, //lerValores
    lerValoresObjeto: function (paObj, paColuna) {
        //
        var vaGrid = jQuery(this.GridNome);
        var vaRetorno = new generic.list();
        var vaValores = this.lerValores();
        //
        if (paColuna == undefined) { paColuna = "Nome"; }
        if (paObj == undefined) { paObj = "ObjetoListavel"; }
        //
        if (vaValores.length) {
            for (var i = 0; i < vaValores.length; i++) {
                vaRetorno.add(Agr.CriarObjetoLista(paObj, vaValores[i], vaGrid.jqGrid('getCell', vaValores[i], paColuna)));
            }
        }
        return vaRetorno.items;
    }, //lerValoresObjeto
    lerStringParametrosPersonalizadosUrl: function () {
        var queryString = '';
        for (key in this.ParametrosPersonalizadoUrl) {
            if ($.isArray(this.ParametrosPersonalizadoUrl[key])) {

                var str = "";

                $.each(this.ParametrosPersonalizadoUrl[key], function (paI, paV) {

                    str += key + '=' + paV + '&'

                })

                queryString += (!queryString ? '?' : '&') + str;

            } else {
                queryString += (!queryString ? '?' : '&') + key + '=' + this.ParametrosPersonalizadoUrl[key];
            }

        }
        return queryString;
    }, //lerParametrosPersonalizadosUrl
    lerLinhaObjeto: function (paIdLinha) {
        var objeto = $(this.GridNome).jqGrid('getRowData', paIdLinha);
        return objeto;
    }, //lerLinha
    busca: function (paValor, paCampo) {
        //
        // Somente ativa a barra de filtros quando não for Treeview e Multiselect ao mesmo tempo.
        // ToDo: Adaptar GridMultiSelect para permitir realização de filtros quando esta estiver configurada para TreeView e MultiSelect ao mesmo tempo.
        if (this.Parametros.treeGrid && this.Parametros.multiselect) return false;

        var vaSearch = (paValor == "") ? "False" : "True";

        var queryString;
        queryString = this.lerStringParametrosPersonalizadosUrl();
        queryString += (!queryString ? '?' : '&') + "_search=" + vaSearch + "&searchString=" + stripAccentsGridMultiSelecao(paValor) + "&searchField=" + paCampo;

        jQuery(this.GridNome).setGridParam({ url: this.EntidadeUrl + this.EntidadeMetodo + queryString, page: 1 }).trigger("reloadGrid");
    }, //busca
    configurar: function (paColNames, paColModel) {
        //
        var grid = $(this.GridNome);
        var vaJsonReader = null;
        //
        if (this.Parametros.datatype == "json") {
            vaJsonReader = {
                root: "Rows", page: "Page", total: "Total",
                records: "Records", repeatitems: false, userdata: "UserData",
                id: this.Parametros.columnid
            };
        }
        this.Colunas = { Nomes: paColNames, Modelo: paColModel };
        if ((this.EntidadeUrl == null) || (this.EntidadeUrl == "")) {
            this.Parametros.datatype = "local"; vaJsonReader = {};
        }

        if (!!this.Parametros.treeGrid && !!this.Parametros.multiselect) {
            // Por padrão o multiselect está desabilitado quando for tree grid. Assim, a implementação será feita na mão.
            // ToDo: Ativar o checkbox 'Selecionar Todos' na grid MultiSelect quando for treeGrid.
            //      paColNames.push("<input role='checkbox' id='ccb_" + this.GridNome.replace("#", "") + "' class='cbox' type='checkbox'/>");
            paColNames.push("");
            paColModel.push({ name: 'ccb', width: '20', sortable: false, resizable: false, hidedlg: true, search: false, fixed: true });
            this.Parametros.loadui = 'block';
        }

        /////////////////////////////////////////////////////////////////////////////////////////
        this.GridObj = grid.jqGrid({
            url: this.EntidadeUrl + this.EntidadeMetodo + this.lerStringParametrosPersonalizadosUrl(),
            caption: this.GridTitulo,
            datatype: this.Parametros.datatype, mtype: this.Parametros.mtype,
            sortname: this.Parametros.sortname, sortorder: this.Parametros.sortorder,
            width: this.Parametros.width, height: this.Parametros.height,
            pager: this.Parametros.pager,
            jsonReader: vaJsonReader,
            colNames: paColNames, colModel: paColModel,
            rowNum: this.Parametros.rowNum,
            rowList: this.Parametros.rowList,
            viewrecords: true,
            multiselect: this.Parametros.multiselect,
            treeGrid: this.Parametros.treeGrid,
            treeGridModel: 'adjacency',
            ExpandColumn: this.Parametros.ExpandColumn,
            shrinkToFit: this.Parametros.shrinkToFit,
            treeReader: this.Parametros.treeReader,
            rownumbers: this.Parametros.exibirNumeroLinhas != undefined ? this.Parametros.exibirNumeroLinhas : !this.Parametros.multiselect,
            afterInsertRow: function (rowid, rowdata, rowelem) {

                if (!!this.owner.Parametros.treeGrid && !!this.owner.Parametros.multiselect) {
                    // Por padrão o multiselect está desabilitado quando for tree grid. Assim, a implementação está sendo feita na mão.
                    var chkId = "jqg_" + this.owner.GridNome.replace("#", "") + "_" + rowid;
                    var chk = "<input role='checkbox' id='" + chkId + "' tree_parent='" + rowelem.tree_parent + "' class='cbox' type='checkbox'/>";
                    jQuery(this.owner.GridNome).jqGrid("setCell", rowid, 'ccb', chk);
                }

            },
            gridComplete: function () {
                if (this.owner != undefined) {
                    // Por padrão o multiselect está desabilitado quando for treeGrid. Assim, a implementação está sendo feita na mão.
                    if (!!this.owner.Parametros.treeGrid && !!this.owner.Parametros.multiselect) {
                        this.owner.GridObj.setGridParam({ multiselect: true });
                        $('.tree-leaf', $(this)).css('width', '0px'); //Hide leaf icons in treeView
                    }

                    if (this.owner.Valores != null) {
                        // Recupera a seleção após recarregar a grid.
                        // Obs.: Para a realização da iteração o array 'this.owner.Valores' é clonado
                        // pois ele é modificado ao alterar a seleção.
                        var ValoresClone = this.owner.Valores.slice(0);
                        for (var i = 0; i < ValoresClone.length; i++) {
                            jQuery(this.owner.GridNome).jqGrid("setSelection", ValoresClone[i]);
                        }
                    }
                    if (this.owner.CallBackCargaCompleta != null) { this.owner.CallBackCargaCompleta(); }
                }
            },
            onSelectAll: function (selarrrow, checked) {
                for (var i = 0; i < selarrrow.length; i++)
                    this.p.onSelectRow.call(this, selarrrow[i], checked);
            },
            beforeSelectRow: function (rowid, e) {


                if (this.owner.Parametros.onBeforeSelectRow && this.owner.Parametros.onBeforeSelectRow(rowid, e) === false) return;

                // o evento 'beforSelectRow' interno do JqGrid, por padrão, considera que a grid é single select,
                // marcando o checkbox apenas da table row que recebeu o click do usuário. Assim,
                // uma vez que este componente deve ser multi select, é feito este override do 'beforeSelectRow'
                // a fim de realizar o toogle do checkbox da table row clicada.
                this.owner.GridObj.setSelection(rowid);
                //
                if (this.owner.CallBackCheckBox != null) {
                    var statusSelecao = $('#jqg_' + this.owner.GridNome.substring(1) + '_' + rowid).attr('checked');
                    this.owner.CallBackCheckBox(rowid, statusSelecao);
                }
            },
            onSelectRow: function (id, status) {
                id = +id;        // convert para inteiro.
                if (!this.owner.Parametros.multiselect) {
                    this.owner.Valores = status ? [id] : [];
                } else {
                    if (status) {    // inclui item no array, tendo o cuidado de não duplicar o valor.
                        var tmpArray = this.owner.Valores.concat([id]).sort();
                        this.owner.Valores = $.grep(tmpArray, function (value, i) { return value != tmpArray[i - 1] });
                    } else {        //remove do array
                        this.owner.Valores = jQuery.grep(this.owner.Valores, function (value) { return value != id; });
                    }
                }
                $("#jqg_" + this.owner.GridNome.replace("#", "") + "_" + id).attr('checked', status ? 'checked' : '');

                if (this.owner.CallBackSelecionado)
                    this.owner.CallBackSelecionado(id, status);
            },
            loadError: function (xhr, st, err) {
                $.blockUI({ message: '<h1>' + "Erro ao carregar informação no grid ..." + '</h1><br /><h3>' + "Type: " + st + "; Response: " + xhr.status + " " + xhr.statusText + '</h3>' });
                setTimeout($.unblockUI, 6000);
            }
        });
        /////////////////////////////////////////////////////////////////////////////////////////

        if (grid != 'undefined' && grid[0] != 'undefined' && grid[0] != undefined) {
            grid[0].owner = this;
        }

        // Somente ativa a barra de filtros quando não for Treeview e Multiselect ao mesmo tempo.
        // ToDo: Adaptar GridMultiSelect para permitir realização de filtros quando esta estiver configurada para TreeView e MultiSelect ao mesmo tempo.
        if (!this.Parametros.treeGrid) {
            jQuery(this.GridNome).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: "cn" });
        }

        var vaMe = this;
        jQuery.each(paColModel, function (paIndex, paItem) {
            if (paItem == undefined) { return; }

            var vaObjSelector = "#gbox_" + vaMe.GridNome.replace("#", "") + " #gs_" + paItem.name;
            var vaObj = $(vaObjSelector);
            vaObj.unbind("keypress")
                .keypress(function (e) {
                    if (e.which == 13) vaMe.busca(vaObj.val(), paItem.name);
                });
        });
    } //configurar
};


////////// CORREÇÃO DE BUG DA VERSÃO 3.8.2 DO jqGRID //////////////
$.jgrid.extend({
    // Esta versão da função do collapseNode foi recuperada a partir do arquivo grid.treegrid.js  // da versão 4.3.2 do jqGrid.
    collapseNode: function (rc) {
        return this.each(function () {
            if (!this.grid || !this.p.treeGrid) { return; }
            var expanded = this.p.treeReader.expanded_field;
            if (rc[expanded]) {
                rc[expanded] = false;
                var id = $.jgrid.getAccessor(rc, this.p.localReader.id);
                var rc1 = $("#" + $.jgrid.jqID(id), this.grid.bDiv)[0];
                $("div.treeclick", rc1).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus");
            }
        });
    }
});

