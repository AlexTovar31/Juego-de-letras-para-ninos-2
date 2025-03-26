// Datos del juego
const letras = ['p', 'm', 'l', 's', 'n', 'a', 'e', 'i', 'o', 'u'];
const silabas = ['pa', 'pe', 'pi', 'ma', 'me', 'mi', 'la', 'le', 'li', 'sa', 'se', 'si', 'na', 'ne', 'ni'];
const palabras = {
    'pato': './imagenes/pato.jpg',
    'mapa': './imagenes/mapa.jpg',
    'luna': './imagenes/luna.jpg',
    'sopa': './imagenes/sopa.jpg',
    'nido': './imagenes/nido.jpg'
};

// Elementos del DOM
const cuadroLetras = document.getElementById('cuadro-letras');
const imagenActual = document.getElementById('imagen-actual');
const areaPalabra = document.getElementById('area-palabra');
const retroalimentacion = document.getElementById('retroalimentacion');
const botonReiniciar = document.getElementById('reiniciar');

// Variables del juego
let palabraActual = '';
const synth = window.speechSynthesis; // API de voz

// Iniciar juego al cargar la página
document.addEventListener('DOMContentLoaded', iniciarJuego);

// Función principal
function iniciarJuego() {
    // Limpiar áreas
    cuadroLetras.innerHTML = '';
    areaPalabra.innerHTML = '';
    retroalimentacion.textContent = '';
    retroalimentacion.style.color = '#ff7675';

    // Generar palabra aleatoria
    const palabrasDisponibles = Object.keys(palabras);
    palabraActual = palabrasDisponibles[Math.floor(Math.random() * palabrasDisponibles.length)];
    imagenActual.src = palabras[palabraActual];
    imagenActual.alt = `Imagen de ${palabraActual}`;

    // Crear letras/sílabas seleccionables por clic
    letras.forEach(letra => crearElementoClickeable(letra, 'letra'));
    silabas.forEach(silaba => crearElementoClickeable(silaba, 'silaba'));
}

// Crear elementos clickeables
function crearElementoClickeable(texto, tipo) {
    const elemento = document.createElement('div');
    elemento.textContent = texto;
    elemento.classList.add(tipo);
    
    // Al hacer clic: agregar al área y reproducir sonido
    elemento.addEventListener('click', () => {
        agregarLetraAlArea(texto);
        reproducirSonido(texto);
    });
    
    cuadroLetras.appendChild(elemento);
}

// Agregar letra al área
function agregarLetraAlArea(letra) {
    // Verificar si ya existe
    const letrasEnArea = Array.from(areaPalabra.children).map(el => el.textContent);
    if (letrasEnArea.includes(letra)) {
        retroalimentacion.textContent = '¡Ya usaste esta letra!';
        return;
    }

    const letraElemento = document.createElement('div');
    letraElemento.textContent = letra;
    letraElemento.classList.add('letra-seleccionada');
    areaPalabra.appendChild(letraElemento);

    // Verificar si la palabra está completa
    verificarPalabra();
}

// Verificar palabra
function verificarPalabra() {
    const palabraFormada = Array.from(areaPalabra.children)
        .map(letra => letra.textContent)
        .join('');

    if (palabraFormada === palabraActual) {
        retroalimentacion.textContent = '¡Correcto! 🎉';
        retroalimentacion.style.color = '#2ecc71';
        reproducirSonido(palabraActual, true); // Sonido de éxito
    } else if (palabraFormada.length === palabraActual.length) {
        retroalimentacion.textContent = '¡Ups! Intenta otra vez';
    }
}

// Función de sonido
function reproducirSonido(texto, esExito = false) {
    if (synth.speaking) synth.cancel(); // Detener si hay algo en reproducción

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    
    if (esExito) {
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.text = `¡Muy bien! ${texto}`;
    } else {
        utterance.rate = 0.8;
    }
    
    synth.speak(utterance);
}

// Reiniciar juego
botonReiniciar.addEventListener('click', iniciarJuego);