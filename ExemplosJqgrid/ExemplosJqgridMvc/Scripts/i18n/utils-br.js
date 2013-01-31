/**
* Biblioteca de funções internacionalizáveis.
*/

function toCode(valor) {
    return valor.toFixed(2).replace('.', ''); //Codigo não pode ter '.'
}

function toMoney(valor) {
    if ((valor < 0) && ( (valor == null) || (valor == '') )) {
        return '';
    }

    if (typeof (valor) == 'string') {
        //Converte para float
        valor = toFloatFromStr(valor);
    }

    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function toFormatedFloatFromMoney(valor) {
    return trim(valor.replace("R$", ""));
}

function toFloatFromMoney(valor) {
    var result = toFormatedFloatFromMoney(valor);
    result = toFloatFromStr(result);
    return result;
}

function toFormatedFloat(valor, decimals) {
    if (!decimals) {
        valor = valor + ''; //LES.2011.09.26.6 - converte para string.
        return valor.replace('.', ',');
    } else if (valor === "") {
        return valor;
    } else {
        return valor.toFixed(decimals).replace('.', ',');
    }
}

function toFloatFromStr(str) {
    var strNumber = trimInt(str.replace(',', '.'));
    if (strNumber == "") {
        return null;
    } else {
        return parseFloat(strNumber);
    }
}

function filterFloat(nomeCampo) {
    $("#" + nomeCampo).keyfilter(/[0-9,]/);
    $("#" + nomeCampo).bind("input paste", function (e) { e.preventDefault() });    // desabilita o colar (inclusive do Context Menu)
    $("#" + nomeCampo).attr("autocomplete", 'off');                                 // desabilita o autocomplete do browser
}

function toDatePicker(textBox) {
    $textBox = $("#" + textBox);
    $toDatePicker($textBox);
}

function $toDatePicker($textBox) {
    $textBox.datepicker("destroy");
    $textBox.datepicker({
        showOn: 'button',
        buttonImage: urlIconeCalendario,
        buttonImageOnly: true
    });
    $textBox.mask("99/99/9999");
}

function toDatePickerDefaultDate(paTextBox, addDays) {
    $("#" + paTextBox).datepicker("destroy");
    var va = new Date();
    if (addDays != null) {
        va.setDate(va.getDate() + addDays);
    }

    $("#" + paTextBox).datepicker({
        showOn: 'button',
        dateFormat: 'dd/mm/yy',
        minDate: va,
        buttonImage: urlIconeCalendario,
        buttonImageOnly: true
    });
    $("#" + paTextBox).mask("99/99/9999");
}

function getDateDatePicker(textBox) {
    var vaRetorno = $("#" + textBox).datepicker("getDate");

    return vaRetorno;
}

function convertDate(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
}

function daysDates(date1, date2) {

    var date1_unixtime = parseInt(date1.getTime() / 1000);
    var date2_unixtime = parseInt(date2.getTime() / 1000);
    var timeDifference = date2_unixtime - date1_unixtime;
    var timeDifferenceInHours = timeDifference / 60 / 60;
    var timeDifferenceInDays = timeDifferenceInHours / 24;

    return timeDifferenceInDays;
}

function compareDates(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = convertDate(a).valueOf()) &&
            isFinite(b = convertDate(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
}

function toHour(textBox) {
    $("#" + textBox).mask("99:99");
}

function disableDatePicker(textBox) {
    $("#" + textBox).datepicker("destroy");
    //
    $("#txtdatainicio").datepicker();
    //
    $("#" + textBox).mask("99/99/9999");
    $("#" + textBox).attr('disabled', 'disabled');
    $("#" + textBox).attr('class', 'fieldDisable');
}

function toBoolean(valor) {
    if (!valor) {
        return false;
    }
    valor = valor.toLowerCase();
    return (valor == 'verdadeiro' || valor == 'true' || valor == 'sim' || valor == '1');
}

function fromBooleanToYesNo(valor) {
    if (valor) {
        return "Sim";
    } else {
        return "Não";
    }
}

function getYesNo() {
    return "Sim:Não";
}

function addMoneyMask(nomeCampo) {
    filterFloat(nomeCampo);

    var controle = $("#" + nomeCampo);

    controle.focus(function () {
        //Remove o money
        controle.val(toFormatedFloatFromMoney(controle.val()));
    });

    controle.blur(function () {
        //Inclui o money
        controle.val(toMoney(controle.val()));
    });
}

function strToDate(text) {
    var parsed = DATETIME.parseData(text);
    var date = new Date(parsed.ano, parsed.mes, parsed.dia);
    return date;
}


/// ''' <history>
///'''    LES-2011.08.11.06 [christovam.cursino]
/// ''' </history>
////Controle de CEP
function addZipCodeMask(nomeCampo) {
    //Permite apenas numeros
    $("#" + nomeCampo).keyfilter(/[0-9]/);
    var controle = $("#" + nomeCampo);
    controle.focus(function () {
        //Remove o money
        controle.val(toIntFromZip(controle.val()));
    });
    controle.blur(function () {
        //Inclui o money
        controle.val(toZipCode(controle.val()));
    });
    $("#" + nomeCampo).bind("input paste", function (e) { e.preventDefault() });    // desabilita o colar (inclusive do Context Menu)
}

///Converte um integer para o formato de cep (#####-###)
function toZipCode(valor) {
    if ((valor == null) || (valor == '')) {
        return '';
    }
    if (typeof (valor) == 'string') {
        //Converte para inteiro
        valor = TryParseInt(valor, 0);
    }
    if (valor == 0) {
        return '';
    }

    var valorStr = valor + '';

    //Garante que o tamanho é 8 bytes
    while (valorStr.length < 8) {
        valorStr = '0' + valorStr;
    }

    //Retorna formatado
    return valorStr.substring(0, 5) + '-' + valorStr.substring(5, 8);
}

function toIntFromZip(valor) {
    valor = trimInt(valor.replace("-", ""));
    if (valor == 0) {
        return '';
    } else {
        return valor;
    }
}