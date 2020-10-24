var estados = ['O', 'R', 'A', 'V'];
var lenguaje = ['0', '1'];
var estadoActual;
var stopEvaluation = false;

$(document).ready(function() {
    $('#btn-evaluar-cadena').click(function() {
        var cadena = $('#txt-cadena').val();
        if (cadena === '') {
            Swal.fire('Cadena No Procesada', 'Ingrese la cadena a procesar.', 'warning');
            $('#txt-cadena').focus();
            return false;
        }
        stopEvaluation = false;
        $('#txt-procesando').show();
        switchButtonState();
        cambiarEstadoSemaforo('O');
        evaluarCadena(cadena);
    });

    $('#btn-parar-evaluacion').click(function() {
        cambiarEstadoSemaforo('O');
        stopEvaluation = true;
        switchButtonState();
        $('#txt-procesando').hide();
    });
});

function switchButtonState() {
    var startBtnState = $('#btn-evaluar-cadena').is(':disabled');
    
    if ( startBtnState ) {
        $('#btn-evaluar-cadena').attr('disabled', false);
        $('#btn-parar-evaluacion').attr('disabled', true);
    }
    else {
        $('#btn-evaluar-cadena').attr('disabled', true);
        $('#btn-parar-evaluacion').attr('disabled', false);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cambiarEstadoSemaforo(nuevoEstado) {
    var imgNombre = '';

    switch (nuevoEstado) {
        case 'R': imgNombre = 'rojo'; break;
        case 'A': imgNombre = 'amarillo'; break;
        case 'V': imgNombre = 'verde'; break;
        case 'O': imgNombre = 'apagado'; break;
    }

    var imgPath = 'img/' + imgNombre + '.jpg';
    $('#semaforo').attr('src', imgPath);
    estadoActual = nuevoEstado;
}

function evaluarSimbolo(simbolo) {
    return lenguaje.includes(simbolo);
}

async function evaluarCadena(cadena) {
    var simbolos = cadena.split('');

    for (var i = 0; i < simbolos.length; i++) {
        if (!stopEvaluation) {
            var simboloActual = simbolos[i];
            var esValido = evaluarSimbolo(simboloActual);
            $('#txt-simbolo').text(simboloActual);

            if (esValido) {
                if (simboloActual == '1') {
                    switch (estadoActual) {
                        case 'O': cambiarEstadoSemaforo('R'); break;
                        case 'R': cambiarEstadoSemaforo('A'); break;
                        case 'A': cambiarEstadoSemaforo('V'); break;
                        case 'V': cambiarEstadoSemaforo('R'); break;
                    }
                }
            }
            else {
                setTimeout(function() {
                    alertCadenaInvalida(simboloActual);
                    $('#btn-parar-evaluacion').trigger('click');
                }, 500);
                return false;
            }

            await sleep(1000);
        }
        else {
            return false;
        }
    }
    
    if (estadoActual === 'V') {
        Swal.fire('Cadena Valida', 'La cadena <b>['+ cadena +']</b> es valida.', 'success');
    }
    else {111
        Swal.fire('Cadena Invalida', 'La cadena no termina en el estado final declarado <b>[verde]</b>.', 'error');
    }
    $('#btn-parar-evaluacion').trigger('click');
}

function alertCadenaInvalida(simbolo) {
    Swal.fire('Cadena Invalida', 'El simbolo <b>"' + simbolo + '"</b> no es parte del lenguaje del automata.', 'error');
}