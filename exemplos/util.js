//''' <history>
//'''   TRI-2012.08.09 [felipe.santos]
//'''   LES-2011.05.11.1
//'''   LES-2011.05.27.2
//'''   LES-2011.06.30.1
//''' </history>

//////////////////////////////////////////////////////////////////////////////////
function parseJsonDate(jsonDate) {
    if (jsonDate != null) {
        var offset = new Date().getTimezoneOffset() * 60000;
        var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate);

        if (parts != null) {

            if (parts[2] == undefined)
                parts[2] = 0;

            if (parts[3] == undefined)
                parts[3] = 0;
            return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
        } else {
            return "";
        }


    } else {
        return "";
    }
};

//////////////////////////////////////////////////////////////////////////////////
function limpaCampos(campos) { $.each(campos, function () { limpaCampo(this); }); }

//////////////////////////////////////////////////////////////////////////////////
//Função que limpa um campo e o coloca com cor de fundo branca
function limpaCampo(dataField) {
    var field = document.getElementById(dataField);
    var nTipo = $("#" + dataField).attr('type');
    if (nTipo == 'text') { field.value = ''; pintaBranco(dataField); }
    else if (nTipo == 'select-one') {
        $("#" + dataField).html(''); $("#" + dataField).append($('<option value=0>...</option>'));
        pintaBranco(dataField); 
    }
    else if (nTipo == 'checkbox') { field.checked = false; pintaBranco(dataField); }
    else if (nTipo == 'textarea') { field.value = ''; pintaBranco(dataField); }
    else if (nTipo == 'hidden') { field.value = ''; }
    else { /*alert(nTipo + ' não mapeado no metodo Site.Util.limpaCampo' );*/ }
}

//////////////////////////////////////////////////////////////////////////////////
function pintaBranco(dataField) { $("#" + dataField).css("background-color", ""); }

//////////////////////////////////////////////////////////////////////////////////
//Função que remove os espaços à direita e à esquerda de uma string
function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g, ""); }

//////////////////////////////////////////////////////////////////////////////////
//Verifica se o campo está em branco 
function validateEmpty(fld) {
    var error = 0; fld.value = trim(fld.value);
    if (fld.value.length == 0) { /* fld.style.background = 'Yellow'; */error = 1; }
    else { /* fld.style.background = 'White'; */ }
    return error;
}

//////////////////////////////////////////////////////////////////////////////////
//Verifica se o item selecionado está com o valor 0 (zero)
function validateValue(fld) {
    var error = "";
    if (fld.value == 0) { /* fld.style.background = 'Yellow'; */error = 1; }
    else { /* fld.style.background = 'White'; */ }
    return error;
}

//////////////////////////////////////////////////////////////////////////////////
function validateCheckBox(fld) {
    var lista = document.getElementById(fld);
    var elementos = lista.getElementsByTagName("input");
    var count = 0; var error = 0;
    for (var i = 0; i < elementos.length; i++) { if (elementos[i].checked) { count++; } }
    if (count == 0) { error = 1; }
    return error;
}

//////////////////////////////////////////////////////////////////////////////////
//Valida se um campo foi preenchido.
function exvalidateField(fld, mensagem) {
    if (validateField(fld) > 0) { exibirMensagemErro(mensagem); $("#" + fld).focus(); return false; }
    return true;
}

//////////////////////////////////////////////////////////////////////////////////
//Valida se um campo foi preenchido.
function validateField(fld) {
    var nFld = document.getElementById(fld);
    var nTipo = $("#" + fld).attr('type') || nFld.type;
    var error = 0;

    //Verifica o tipo de controle
    if (nTipo == 'text') {
        //TextBox
        error = validateEmpty(nFld);

        //verifica se é um campo date
        if (error == 0 && $("#" + fld).attr('class').indexOf('hasDatepicker') >= 0) {
            if (!ValidaData(fld)) { nFld.value = ""; error = validateEmpty(nFld); }
        }
        //verifica se é um campo integer
        if (error == 0 && $("#" + fld).attr('class').indexOf('integer') >= 0) {
            if (!ValidaInteger(fld)) { nFld.value = ""; error = validateEmpty(nFld); }
        }
        return error;
    }
    else if (nTipo == 'select-one') { /*ComboBox*/error = validateValue(nFld); return error; }
    return 1;
}

//////////////////////////////////////////////////////////////////////////////////
//Retorna uma data no formato JSON.
function JDate(date) {
    return "\/Date(" + date.getTime() + ")\/";
}

//////////////////////////////////////////////////////////////////////////////////
function JDateFromField(dateField, allowNull) {
    var text = $("#" + dateField).val(); return prJDateFromField(text, allowNull);
}

//////////////////////////////////////////////////////////////////////////////////
function prJDateFromField(text, allowNull) {
    if (allowNull == null) { allowNull = false; }
    if (text == null || text == "") {
        if (allowNull) { return null; }
        else { return "\/Date(" + new Date(0).getTime() + ")\/"; }
    } else {
        var parsed = DATETIME.parseData(text);
        var date = new Date(Date.UTC(parsed.ano, parsed.mes, parsed.dia, 0));
        return "\/Date(" + date.getTime() + ")\/";
    }
}

//////////////////////////////////////////////////////////////////////////////////
function JTimeFromField(dateField) {
    //Formato esperado: hh:mm
    var text = $("#" + dateField).val();
    if (text == null || text == "") {
        return "\/Date(" + new Date(0).getTime() + ")\/";
    } else {
        var hora = parseInt(text.substring(0, 2), 10);
        var minuto = parseInt(text.substring(3), 10);
        var vTime = minuto * 60000;
        vTime = vTime + (hora * 3600000);
        return "\/Date(" + vTime + ")\/";
    }
}

//////////////////////////////////////////////////////////////////////////////////
function JDateTimeFromDateTime(dateTime) {
    var ms = Date.UTC(dateTime.getYear(), dateTime.getMonth(), dateTime.getDate(),
        dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds(), dateTime.getMilliseconds());

    return "\/Date(" + ms + ")\/";
}

//////////////////////////////////////////////////////////////////////////////////
function TimeFromField(dateField) {
    //Formato esperado: hh:mm
    var text = $("#" + dateField).val();
    if (text == null || text == "") {
        return "\/Date(" + new Date(0).getTime() + ")\/";
    } else {
        var hora = parseInt(text.substring(0, 2), 10);
        var minuto = parseInt(text.substring(3), 10);
        var vTime = minuto * 60000;
        vTime = vTime + (hora * 3600000);
        return vTime;
    }
}

//////////////////////////////////////////////////////////////////////////////////
//Formato esperado: hh:mm
function ValidaHora(dateField) { var text = $("#" + dateField).val(); return prValidaHora(text); }

//////////////////////////////////////////////////////////////////////////////////
function prValidaHora(sHora) {
    if (sHora == null || sHora == "" || sHora == "__:__") { return true; }
    else {
        var hora = parseInt(sHora.substring(0, 2), 10);
        var minuto = parseInt(sHora.substring(3), 10);
        return ((minuto < 60) && (hora < 24));
    }
}

//////////////////////////////////////////////////////////////////////////////////
//Formato esperado: dd/mm/yyyy
function ValidaData(dateField) { var data = $("#" + dateField).val(); return prValidaData(data); }

//////////////////////////////////////////////////////////////////////////////////
function IsValidDate(data, permiteBranco) {
    if (permiteBranco == null) { permiteBranco = false; }
    if ((data == null) || (data == "")) { return permiteBranco; }
    if (data instanceof Date) { return true; }
    else if (data.substring(0, 5) == '/Date') { return true; }
    else { /*E uma string no formato de data*/return prValidaData(data); }
}

//////////////////////////////////////////////////////////////////////////////////
function validaDat(valor) {
    var date = valor; var ardt = new Array;
    var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
    ardt = date.split("/"); erro = false;
    if (date.search(ExpReg) == -1) { erro = true; }
    else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
        erro = true;
    else if (ardt[1] == 2) {
        if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
            erro = true;
        if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
            erro = true;
    }

    // Existe uma limitação na função Date.UTC que é utilizada como base para as funções (javascript) de manipulação de data da aplicação, por isso foi
    // decidido em 14/10/2011 pelo Roberto que datas inferiores a 01/01/1900 serão consideradas inválidas.
    if (ardt[2] < 1900) { erro = true; }

    if (erro) { return false; }
    return true;
}

//////////////////////////////////////////////////////////////////////////////////
function prValidaData(data, permiteBranco) {
    data = trim(data);
    if (permiteBranco && ((data == "") || data == "__/__/____")) { return true; }
    var formatoValido = /\d{2}\/\d{2}\/\d{4}/;
    var valido = false;
    if (formatoValido.test(data)) { valido = validaDat(data); }
    return valido;
}

//////////////////////////////////////////////////////////////////////////////////
function ValidaInteger(intField) {
    var valor = $("#" + intField).val(); var tmp = trimInt(valor);
    if (valor != tmp) { $("#" + intField).val(tmp); }
    return (TryParseInt(tmp, null) != null);
}

//////////////////////////////////////////////////////////////////////////////////
// Converte uma data no formato Json para DateTime @param jsonDate: Data no formato "/Date(ticks)/"
function DateFromJDate(jsonDate) {
    if (jsonDate instanceof Date) { return jsonDate; }
    else {
        if (jsonDate != null && jsonDate != "") {
            if (jsonDate.substring(0, 5) == '/Date') { return new Date(parseInt(jsonDate.substr(6), 10)); }
            else {
                //E uma string no formato de data
                if (prValidaData(jsonDate)) { return strToDate(jsonDate); }
                else { return null; }
            }
        }
        else { return null; }
    }
}

//////////////////////////////////////////////////////////////////////////////////
// Converte uma data no formato Json para data @param jsonDate: Data no formato "/Date(ticks)/"
function ReturnDataFromJDate(jsonDate) { return ReturnData(DateFromJDate(jsonDate)); }

//////////////////////////////////////////////////////////////////////////////////
// Função que retorna uma data @param Data que tem a informação de data @return Data no formato dd/mm/aaaa
function ReturnData(data) {
    if (data == null || data == "") { return ""; }
    else {
        var dia = data.getDate();
        if (dia < 10) { dia = "0" + dia + "/"; }
        else { dia = dia + "/"; }
        var mes = data.getMonth() + 1;
        if (mes < 10) { mes = "0" + mes + "/"; }
        else { mes = mes + "/"; }
        return dia + mes + data.getFullYear();
    }
}

//////////////////////////////////////////////////////////////////////////////////
//Função que formata uma hora @param Data que tem a informação da hora e minutos @return Hora no formato hh:mm
function ReturnTime(data) {
    if (data == null || data == "") { return ""; }
    else {
        var horas = data.getHours();
        if (horas < 10) { horas = "0" + horas + ":"; }
        else { horas = horas + ":"; }
        var minutos = data.getMinutes();
        if (minutos < 10) { minutos = "0" + minutos; }
        return horas + minutos;
    }
}

//////////////////////////////////////////////////////////////////////////////////
//Retorna um objeto listavel com o codigo da combo.
function NewObjetoListavel(comboName) {
    var combo = document.getElementById(comboName);
    if (combo == null) { alert(comboName + ' nao encontrado'); return null; }
    if (!combo.value) { return null; }
    else {
        var obj = new Ingresso.ObjetoListavel; obj.Codigo = parseInt(combo.value, 10);
        return obj;
    }
}

//////////////////////////////////////////////////////////////////////////////////
//Retorna um boolean dado um Check.
function JBooleanFromCheck(checkBox) {
    var check = document.getElementById(checkBox);
    if (check.checked) { return "true"; }
    else { return "false"; }
}

//////////////////////////////////////////////////////////////////////////////////
//Retorna um boolean dado um Check.
function BooleanFromCheck(checkBox) { var check = document.getElementById(checkBox); return (check.checked); }

//////////////////////////////////////////////////////////////////////////////////
//Retorna uma coleção de objetos listaveis selecionados de um checkBoxList.
function getCheckBoxListSelectedItens(nomeLista) {

    /*var gridDados = $('#' + nomeLista).find("tbody tbody input[type='checkbox']").attr('checked', true);
    $.each(gridDados, function (ind, objeto) {
    alert($(objeto).val());
    });*/
    var divCheckBox = document.getElementById(nomeLista);
    if (!divCheckBox) { return null; }
    var chkElementos = divCheckBox.getElementsByTagName("input");
    var result = new generic.list();
    for (var i = 0; i < chkElementos.length; i++) {
        if (chkElementos[i].checked) {
            var vObj = new Ingresso.ObjetoListavel;
            with (vObj) { Codigo = chkElementos[i].value; };
            result.add(vObj);
        }
    }
    return result.items;
}

function getCheckBoxListSelectedItens2(nomeLista) {

    /*var gridDados = $('#' + nomeLista).find("tbody tbody input[type='checkbox']").attr('checked', true);
    $.each(gridDados, function (ind, objeto) {
    alert($(objeto).val());
    });*/
    var divCheckBox = document.getElementById(nomeLista);
    if (!divCheckBox) { return null; }
    var chkElementos = $(divCheckBox).find("input");
    var result = new generic.list();
    for (var i =0; i < chkElementos.length; i++) {
        if (chkElementos[i].checked) {
            var vObj = new Ingresso.ObjetoListavel;
            with (vObj) {
                Codigo = chkElementos[i].value;
            }
            
            result.add(vObj);
        }
    }
    return result.items;
}

//////////////////////////////////////////////////////////////////////////////////
//Seleciona itens de uma checkBoxList.
function selectCheckBoxList(nomeLista, dados) {
    var divCheckBox = document.getElementById(nomeLista);
    if (!divCheckBox) { return; }
    var chkElementos = divCheckBox.getElementsByTagName("input");
    var value; var found;
    for (var i = 0; i < chkElementos.length; i++) {
        //Verifica se o elemento consta no vetor dados
        value = chkElementos[i].value; found = false;
        if (dados != null) {
            for (var t = 0; t < dados.length; t++) {
                if (dados[t].codigo) {
                    if (value == dados[t].codigo) {
                        found = true; break;
                    }
                }
                else if (dados[t].Codigo)
                    if (value == dados[t].Codigo) {
                        found = true; break;
                    }
            }
        }
        chkElementos[i].checked = found;
    }
}

//////////////////////////////////////////////////////////////////////////////////
function TryParseInt(str, defaultValue) {
    if (typeof str == "number")
        return parseInt(str);
    var retValue = defaultValue;
    if (str != null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(trimInt(str), 10);
                if (isNaN(str)) { retValue = defaultValue; }
            }
        }
    }
    return retValue;
}

//////////////////////////////////////////////////////////////////////////////////
function TryParseFloat(str, defaultValue) {
    if (str == null)
        str = '';
    if (typeof str == 'number')
        return str;
    str = str
            .replace('.', '')
            .replace(',', '.'); 
    var retValue = defaultValue;
    if (str != null) {
        if (str.length > 0) { if (!isNaN(str)) { retValue = parseFloat(str); } }
    }
    return retValue;
}

//////////////////////////////////////////////////////////////////////////////////
function trimInt(str) {
    var result = trim(str); result = result.replace(/^0+/, "");
    if (result == "") { result = "0"; }
    return result;
}

//////////////////////////////////////////////////////////////////////////////////
function validaCNPJ(cnpj) {
    var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais; //Declaração as variáveis
    if (cnpj.length == 0) { return false; } //Verificando se o campo é nulo

    //Filtrar o campo para verificar se está com máscara
    var filtro = /\d{2,3}.\d{3}.\d{3}\/\d{4}-\d{2}/; if (!filtro.test(cnpj)) { return false; }
    //Ultilização expressão regular para retirar o que não for número
    cnpj = cnpj.replace(/\D+/g, ''); digitos_iguais = 1;

    for (i = 0; i < cnpj.length - 1; i++)
        if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
            digitos_iguais = 0; break;
        }
    if (!digitos_iguais) {
        tamanho = cnpj.length - 2;
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0; pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) { return false; }
        tamanho = tamanho + 1; numeros = cnpj.substring(0, tamanho);
        soma = 0; pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) { return false; }
        return true;
    }
    return false;
}

//////////////////////////////////////////////////////////////////////////////////
function setFocus(controle) { $("#" + controle).focus(); /*TODO: CLICK NA ABA*/ }

//////////////////////////////////////////////////////////////////////////////////
function toNullableInt(controle) {
    var valor = $("#" + controle).val(); valor = trimInt(valor);
    if (trim(valor) == "") { return null; }
    else { return valor; }
}

//////////////////////////////////////////////////////////////////////////////////
function isEmpty(controle) { return (trim($("#" + controle).val()).length == 0); }

//////////////////////////////////////////////////////////////////////////////////
function setNome(controle, objeto) {
    var textbox = $("#" + controle);
    if (objeto == null) { textbox.val(""); }
    else { textbox.val(objeto.Nome); }
}

//////////////////////////////////////////////////////////////////////////////////
function nvl(string, defaultValue) {
    if (!defaultValue) { defaultValue = ""; }
    if (string && string != "") { return string; }
    else { return defaultValue; }
}

//////////////////////////////////////////////////////////////////////////////////
function registerClickChkList(nomeLista, sub) {
    $("#" + nomeLista).find(":checkbox").click(function (evento) {
        if (sub) { sub(evento); }
        //INI - LES-2011.06.30.1 [christovam.cursino]
        var gridBody = $("#" + nomeLista + " .ui-jqgrid-bdiv:first");
        var gridHead = $("#" + nomeLista + " .ui-jqgrid-hdiv:first");
        if ((gridBody != null) && (gridHead != null)) {
            var ckHead = gridHead.find(":checkbox:first");
            if (ckHead != null) {
                var mustCheck = (gridBody.find(":input:not(:checked)").size() == 0);
                ckHead.attr('checked', mustCheck);
            }
        }
        //FIM - LES-2011.06.30.1 [christovam.cursino]
    });
}

//////////////////////////////////////////////////////////////////////////////////
function registerEvent(nomeControle, eventName, sub) { $("#" + nomeControle).bind(eventName, sub); }

//////////////////////////////////////////////////////////////////////////////////
var dateDif = {
    dateDiff: function (strDate1, strDate2) {
        return (((Date.parse(strDate2)) - (Date.parse(strDate1))) / (24 * 60 * 60 * 1000)).toFixed(0);
    }
}

//////////////////////////////////////////////////////////////////////////////////
function diasEntreDatas(dataInicial, dataFinal) {
    var mes, dataAtual, arrDataInicial, novaDataInicial, diasEntreDatas;
    mes = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    arrDataFinal = dataFinal.split('/');
    arrDataInicial = dataInicial.split('/');
    novaDataInicial = mes[(arrDataInicial[1] - 1)] + ' ' + arrDataInicial[0] + ' ' + arrDataInicial[2];
    novaDataFinal = mes[(arrDataFinal[1] - 1)] + ' ' + arrDataFinal[0] + ' ' + arrDataFinal[2];
    diasEntreDatas = dateDif.dateDiff(novaDataInicial, novaDataFinal);
    return diasEntreDatas;
}

//////////////////////////////////////////////////////////////////////////////////
function convertToJsonDate(valor) {
    var date = convertToDate(valor);
    if (date == null || isNaN(date))
        return null;
    var dataUtc = formatUTCDate(date);
    var dataJson = "/Date(" + dataUtc + ")/";
    return dataJson;
}

function convertToJsonDateSemUTC(valor) {
    var date = convertToDate(valor);
    if (date == null || isNaN(date))
        return null;
    var dataSemUTC = date.getTime();
    var dataJson = "/Date(" + dataSemUTC + "+" + date.getTimezoneOffset() + ")/";
    return dataJson;
}

var formatUTCDate = function (d) {
    var utcStr = d.getTime() + (d.getTimezoneOffset() * 60000);
    return utcStr;
};

//////////////////////////////////////////////////////////////////////////////////
function getDataFormatoDDMMYYYY(data, separador) {
    data = convertToDate(data);
    if (data == null) {
        return "";
    }
    
    if (separador == null) {
        separador = "/";
    }
    
    var dia = "";
    var mes = "";
    var ano = "";

    if (data.getDate() < 10) {
        dia += "0";
    }

    if ((data.getMonth() + 1) < 10) {
        mes += "0";
    }

    dia += data.getDate();
    mes += data.getMonth() + 1;
    ano += data.getFullYear();

    return dia + separador + mes + separador + ano;
}

//////////////////////////////////////////////////////////////////////////////////
function getDataFormatoDDMMYYYYHHMMSS(data, separador) {
    data = convertToDate(data);
    if (data == null) {
        return "";
    }

    if (separador == null) {
        separador = "/";
    }

    var dia = "";
    var mes = "";
    var ano = "";
    var hora = "";
    var minuto = "";
    var segundo = "";

    if (data.getDate() < 10) {
        dia += "0";
    }

    if ((data.getMonth() + 1) < 10) {
        mes += "0";
    }

    dia += data.getDate();
    mes += data.getMonth() + 1;
    ano += data.getFullYear();

    hora += data.getHours();
    minuto += data.getMinutes();
    segundo += data.getSeconds();

    return dia + separador + mes + separador + ano + " " + hora + ":" + minuto + ":" + segundo;
}

//////////////////////////////////////////////////////////////////////////////////
function convertToDate(data) {
    if (data instanceof Date) {
        return data;
    }
    if (data == null || $.trim(data) == "")
        return null;

    if (data.indexOf("/Date(") == 0) {
        data = parseJsonDate(data);
    } else if (data.indexOf('T') == 10) {
        var separado = data.split("-");
        var ano = separado[0];
        var mes = separado[1];
        var resto = separado[2].split("T");
        var dia = resto[0];
        var hora = resto[1];
        return new Date(mes + "/" + dia + "/" + ano + " " + hora);
    } else {
        var mes = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var arrData = data.split('/');
        var dataFormatada = mes[(arrData[1] - 1)] + ' ' + arrData[0] + ' ' + arrData[2];
        data = new Date(dataFormatada);
    }
    return data;
}

//////////////////////////////////////////////////////////////////////////////////
//Simula o click em um objeto.
function fireOnclick(objID) {
    var target = document.getElementById(objID);
    if (!target) { return; }
    if (document.dispatchEvent) { // W3C
        var oEvent = document.createEvent("MouseEvents");
        oEvent.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, target);
        target.dispatchEvent(oEvent);
    }
    else if (document.fireEvent) { /* IE */target.fireEvent("onclick"); }
}

//////////////////////////////////////////////////////////////////////////////////
//Implemente goTabInicialExtend caso tenha mais abas com accordion
var goTabInicialExtend;
function goTabInicial() {
    if (goTabInicialExtend) { goTabInicialExtend(); }
    $('#tabs').tabs("select", 0); $("#accordion").accordion("activate", 0);
    reiniciaGridsRegistradas(); //Reseta as grids
}

//////////////////////////////////////////////////////////////////////////////////
function startAccordion(id) {
    $("#" + id).accordion({ autoHeight: false, navigation: false, header: "h3" });
    // Now the hack to implement the disabling functionnality
    var accordion = $("#" + id).data("accordion");
    if (accordion) {
        accordion._std_clickHandler = accordion._clickHandler;
        accordion._clickHandler = function (event, target) {
            var clicked = $(event.currentTarget || target);
            if (!clicked.hasClass("ui-state-disabled"))
                this._std_clickHandler(event, target);
        };
    }
}

//////////////////////////////////////////////////////////////////////////////////
function tb_fast_remove() {
    $('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();
    $("#TB_load").remove();
    if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
        $("body", "html").css({ height: "auto", width: "auto" });
        $("html").css("overflow", "");
    }
    document.onkeydown = ""; document.onkeyup = ""; return false;
}

//////////////////////////////////////////////////////////////////////////////////
function ie7() { return ($.browser.msie) && ($.browser.version < 8); }

//////////////////////////////////////////////////////////////////////////////////
function iniciaAccordion(nomeAcordion) {
    startAccordion(nomeAcordion);
    if (ie7()) {
        $("#" + nomeAcordion).bind("accordionchangestart", function (event, ui) {
            //Verifica se tem uma grid neste accordion
            var grid = getFirstGrid(ui.newContent);
            if (grid != null) { if (!grid.Iniciada) { grid.Grid.refresh(); grid.Iniciada = true; } }
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////
function isAcessible(nomeControle) {
    var controle = $("#" + nomeControle);
    if (controle.data('blockUI.isBlocked')) { return false; }
    if (controle.is(":hidden")) { return false; }
    return true;
}

//////////////////////////////////////////////////////////////////////////////////
//Datas
Date.prototype.addDays = function (days) { this.setDate(this.getDate() + days); }
Date.prototype.setValue = function (data) { this.setTime(data.getTime()); }
Date.prototype.getValue = function () { var resultado = new Date(); resultado.setTime(this.getTime()); return resultado; }
Date.prototype.isDateEquals = function (data) { return (Math.abs(this - data) < 1); }

//////////////////////////////////////////////////////////////////////////////////
//Listas
findAndGet = function (genericList, comparer) {
    var result = null;
    for (var i = 0; i < genericList.items.length; i++) {
        if (comparer(genericList.items[i])) { result = genericList.items[i]; break; }
    }
    return result;
}

//////////////////////////////////////////////////////////////////////////////////
//PRO-2011.06.01.1
findAndGetIndex = function (genericList, comparer) {
    var result = null;
    for (var i = 0; i < genericList.items.length; i++) {
        if (comparer(genericList.items[i])) { result = i; break; }
    }
    return result;
}

//////////////////////////////////////////////////////////////////////////////////
//Enables
function setEnabled(nomeComponente) {
    if ($('#' + nomeComponente).is(".hasDatepicker")) {
        $('#' + nomeComponente).datepicker('enable'); //Tratamento para datepicker
    }
    else { $('#' + nomeComponente).removeAttr('disabled'); }
}
function setDisabled(nomeComponente) {
    if ($('#' + nomeComponente).is(".hasDatepicker")) {
        $('#' + nomeComponente).datepicker().datepicker('disable'); //Tratamento para datepicker
    }
    else { $('#' + nomeComponente).attr('disabled', 'disabled'); }
}

//////////////////////////////////////////////////////////////////////////////////
function toGenericList(vArray) {
    if (!vArray) { return new generic.list(); }
    if (!(vArray instanceof Array)) { return vArray; }
    var retorno = new generic.list(); retorno.addRange(vArray);
    return retorno;
}

//////////////////////////////////////////////////////////////////////////////////
function fromGenericListToArray(vGenericList) {
    if (!vGenericList) { return []; }
    if (vGenericList instanceof Array) { return vGenericList; }
    return vGenericList.items;
}

//////////////////////////////////////////////////////////////////////////////////
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) { s = 'array'; }
            else if (value instanceof generic.list) { s = 'generic.list'; }
        }
        else { s = 'null'; }
    }
    return s;
}

//////////////////////////////////////////////////////////////////////////////////
function compareValues(a, b) {
    if (a.ordem && b.ordem) {
        var v = a.ordem - b.ordem;
        if (v == 0) { return v; }
        else { return v / Math.abs(v); }
    }
    else if (a.ordem) { return -1; }
    else if (b.ordem) { return 1; }
    else { return 0; }
}

//////////////////////////////////////////////////////////////////////////////////
String.prototype.format = function () {
    var s = this, i = arguments.length;
    while (i--) { s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]); }
    return s;
};

//////////////////////////////////////////////////////////////////////////////////
// Implementacao em js da classe .net StringBuilder
function StringBuilder() { this.buffer = []; }
StringBuilder.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};
StringBuilder.prototype.toString = function toString() {
    return this.buffer.join("");
};

//////////////////////////////////////////////////////////////////////////////////
CarregarGridFullChecked = function (paNomeGrid) { $(paNomeGrid).find("input[type='checkbox']").attr('checked', true); };

//////////////////////////////////////////////////////////////////////////////////
function somenteDouble(nomeCampo) {
    $('#' + nomeCampo).keyfilter(/[\0-9\.]/);
    $("#" + nomeCampo).bind("input paste", function (e) { e.preventDefault(); });     // desabilita o colar (inclusive do Context Menu)
    $("#" + nomeCampo).attr("autocomplete", 'off');                                 // desabilita o autocomplete do browser
};

function $somenteDouble($campo) {
    $campo.keyfilter(/[\0-9\.\,]/);
    $campo.bind("input paste", function (e) { e.preventDefault(); });     // desabilita o colar (inclusive do Context Menu)
    $campo.attr("autocomplete", 'off');                                 // desabilita o autocomplete do browser
};

//////////////////////////////////////////////////////////////////////////////////
//LES-2011.05.11.2
function isNullOrEmpty(valor) { return ((valor == null) || (trim(valor) == "")); }

function isInteger(n) {
    return (typeof n == 'number' && /^-?\d+$/.test(n + ''));
}

/////////////////////////////////////////////////////////////////////////////////
// Preenche string com caracteres (esquerda, direita ou ambos)
function pad(str, len, pad, dir) {

    if (typeof (len) == "undefined") { var len = 0; }
    if (typeof (pad) == "undefined") { var pad = ' '; }
    if (typeof (dir) == "undefined") { var dir = 'RIGHT'; }

    if (len + 1 >= str.length) {
        switch (dir.toString().toUpperCase()) {

            // Esquerda    
            case 'LEFT':
                str = Array(len + 1 - str.length).join(pad) + str;
                break;
            // Ambos    
            case 'BOTH':
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;
            // Direita    
            default:
                str = str + Array(len + 1 - str.length).join(pad);
                break;

        } // switch
    } //if

    return str;
}

function desabilitarAccordion($divHeader) {
    $divHeader.addClass("ui-state-disabled");
}


function habilitarAccordion($divHeader) {
    $divHeader.removeClass("ui-state-disabled");
};

function instanciarData(data) {
    if (data === undefined || data == null)
        return "";
    var separado = data.split("-");
    var ano = separado[0];
    var mes = separado[1];
    var resto = separado[2].split("T");
    var dia = resto[0];
    var hora = resto[1].substring(0, 8);
    return new Date(mes + "/" + dia + "/" + ano + " " + hora);
}

function adicionarDias(data, dias) {
    return new Date(data.getTime() + (dias * 24 * 60 * 60 * 1000));
}

String.prototype.padLeft = function (n, str) {
    return Array(n - String(this).length + 1).join(str || '0') + this;
}


Date.prototype.format = function (formatString) {
    var month = this.getMonth() + 1,
    day = this.getDate(),
    year = this.getFullYear(),
    hours24 = this.getHours(),
    hours = (hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24),
    meridiem = hours24 >= 12 ? "PM" : "AM",
    minutes = this.getMinutes(),
    seconds = this.getSeconds();
    formatString = formatString.replace(/(MM)/g, month.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(M)/g, month);
    formatString = formatString.replace(/(dd)/g, day.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(d)/g, day);
    formatString = formatString.replace(/(yyyy)/ig, year);
    formatString = formatString.replace(/(yy)/ig, year.toString().substring(2, 4));
    formatString = formatString.replace(/(hh)/g, hours.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(h)/g, hours);
    formatString = formatString.replace(/(HH)/g, hours24.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(H)/g, hours24);
    formatString = formatString.replace(/(mm)/g, minutes.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(m)/g, minutes);
    formatString = formatString.replace(/(ss)/g, seconds.toString().padLeft(2, '0'));
    formatString = formatString.replace(/(s)/g, seconds);
    formatString = formatString.replace(/(tt)/g, meridiem.toLowerCase());
    formatString = formatString.replace(/(TT)/g, meridiem);
    return formatString;
};