$(document).ready(function () {
    $('#txtValorDevido').mask('000.000.000,00', { placeholder: ' ', reverse: true });
    $('#txtValorPago').mask('000.000.000,00', { placeholder: ' ', reverse: true });
});

var pattern = /[^0-9.-]+/g;

var lstTrocoDB = [
    { Valor: parseFloat('100.00'), Descricao: 'cem reais' },
    { Valor: parseFloat('50.00'), Descricao: 'cinquenta reais' },
    { Valor: parseFloat('20.00'), Descricao: 'vinte reais' },
    { Valor: parseFloat('10.00'), Descricao: 'dez reais' },
    { Valor: parseFloat('0.50'), Descricao: 'cinquenta centavos' },
    { Valor: parseFloat('0.10'), Descricao: 'dez centavos' },
    { Valor: parseFloat('0.05'), Descricao: 'cinco centavos' },
    { Valor: parseFloat('0.01'), Descricao: 'um centavo' },
];
var lstTrocoFinal = [];

function calcularTroco(e) {
    if ($('#txtValorDevido').val() != "" && $('#txtValorPago').val() != "") {
        var lblTroco = $('#lblTroco');
        var fValorDevido = parseFloat($('#txtValorDevido').val().replace('.', '').replace(',', '.'));
        var fValorPago = parseFloat($('#txtValorPago').val().replace('.', '').replace(',', '.'));

        if (fValorPago != 0) {
            var troco = fValorPago - fValorDevido;

            if (validarValorDevidoXValorPg(troco)) {
                var i = 0;

                lblTroco.text(troco.formatMoney(2, ',', '.'));

                while (troco != 0)
                    if (parseFloat(troco).toFixed(2) >= lstTrocoDB[i].Valor) {
                        troco = parseFloat(troco).toFixed(2) - lstTrocoDB[i].Valor;
                        lstTrocoFinal.push(lstTrocoDB[i].Descricao);
                    }
                    else
                        i++;
            }
            else
                lblTroco.text('0');

            alimentarListTroco(lstTrocoFinal);

            lstTrocoFinal = [];
        }
    }
}
function alimentarListTroco(lstTroco) {
    $('#lstTrocoDescricao').empty();

    $.each(lstTroco, function (key, value) {
        $('#lstTrocoDescricao').append($('<li style="background-color:aqua"></li>').text(value));

        if (key != lstTroco.length - 1) $('#lstTrocoDescricao').append($('<li></li>').text('+'));
    });
}


function validarValorDevidoXValorPg(troco) {
    $('#lblValorSuperior').hide();

    if (troco < 0) {
        $('#lblValorSuperior').show();
        $('#lblValorSuperior').text("Valor pago não pode ser inferior ao devido.");
        return false;
    }
    else if (troco == 0)
        return false;
    else
        return true;
}

function salvar() {
    $.ajax({
        type: "POST",
        url: "/CalculoValores/SalvarTransacaoFinanceira",
        data: {
            ValorDevido: $('#txtValorDevido').val().replace('.', ''),
            ValorPago: $('#txtValorPago').val().replace('.', ''),
            ValorTroco: $('#lblTroco').text().replace('.','')
        },
        success: function (result) {
            console.log(result);
            $('#mdlInformativo').modal('show');
        },
        error: function (result) {
            console.log(result.ResponseText);
        }
    });
}

function recarregar() {
    location.reload();
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};