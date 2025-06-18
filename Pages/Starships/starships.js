let apiURL = 'https://swapi.py4e.com/api/starships/';
let nextPageUrl = null;
let previousPageUrl = null;

const IMAGE_BASE_URL = 'https://starwars-visualguide.com/assets/img/starships/'; 
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/300x470/333/gold?text=Nave+No+Disp.';
const MODAL_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/200x200/333/gold?text=Nave+No+Disp.';

const contenedorPrincipal = document.getElementById('contenido-naves');
const botonSiguiente = document.getElementById('boton-siguiente');
const botonAnterior = document.getElementById('boton-anterior');
const modal = document.getElementById('modal-naves');
const contenidoModal = document.getElementById('modal-content-naves');

function mostrarMensajeModal(mensaje) {
    contenidoModal.innerHTML = '';
    const messageElement = document.createElement('span');
    messageElement.className = 'character-details';
    messageElement.innerText = mensaje;
    contenidoModal.appendChild(messageElement);
    modal.style.visibility = 'visible';
}

window.onload = async () => {
    try {
        await cargarNaves(apiURL);
    } catch (error) {
        console.error('Error al cargar la página inicialmente:', error);
        mostrarMensajeModal('Error al cargar las naves. Por favor, inténtalo de nuevo más tarde.');
    }
};

async function cargarNaves(url) {
    contenedorPrincipal.innerHTML = '';
    
    if (botonSiguiente) botonSiguiente.style.display = 'inline-block';
    if (botonAnterior) botonAnterior.style.display = 'inline-block';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const responseJson = await response.json();

        nextPageUrl = responseJson.next;
        previousPageUrl = responseJson.previous;

        if (botonSiguiente) botonSiguiente.disabled = !nextPageUrl;
        if (botonAnterior) botonAnterior.disabled = !previousPageUrl;

        responseJson.results.forEach(async (nave) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "cards";
            
            const parts = nave.url.split('/');
            const id = parts[parts.length - 2] || parts[parts.length - 1]; 
            let imageUrl = `${IMAGE_BASE_URL}${id}.jpg`;

            try {
                const imgResponse = await fetch(imageUrl);
                if (imgResponse.status === 404) {
                    imageUrl = PLACEHOLDER_IMAGE_URL;
                }
            } catch (imgError) {
                console.warn(`Error al verificar la imagen para ID ${id}:`, imgError);
                imageUrl = PLACEHOLDER_IMAGE_URL;
            }
            
            tarjeta.style.backgroundImage = `url('${imageUrl}')`;

            const nombreFondo = document.createElement("div");
            nombreFondo.className = "character-name-bg";

            const nombreNave = document.createElement("span");
            nombreNave.className = "character-name";
            nombreNave.innerText = `${nave.name}`;

            nombreFondo.appendChild(nombreNave);
            tarjeta.appendChild(nombreFondo);
            contenedorPrincipal.appendChild(tarjeta);

            tarjeta.onclick = () => {
                modal.style.visibility = "visible";
                contenidoModal.innerHTML = '';

                const imagenNave = document.createElement("div");
                imagenNave.className = "character-image";
                imagenNave.style.backgroundImage = `url('${imageUrl}')`;
                
                const nombre = document.createElement("span");
                nombre.className = "character-details";
                nombre.innerText = `Nombre: ${nave.name}`;

                const modelo = document.createElement("span");
                modelo.className = "character-details";
                modelo.innerText = `Modelo: ${convertirTexto(nave.model)}`;

                const fabricante = document.createElement("span");
                fabricante.className = "character-details";
                fabricante.innerText = `Fabricante: ${convertirTexto(nave.manufacturer)}`;
                
                const costo = document.createElement("span");
                costo.className = "character-details";
                costo.innerText = `Costo en créditos: ${convertirCosto(nave.cost_in_credits)}`;

                const longitud = document.createElement("span");
                longitud.className = "character-details";
                longitud.innerText = `Longitud: ${convertirTexto(nave.length)} metros`;

                const tripulacion = document.createElement("span");
                tripulacion.className = "character-details";
                tripulacion.innerText = `Tripulación: ${convertirTexto(nave.crew)}`;

                const pasajeros = document.createElement("span");
                pasajeros.className = "character-details";
                pasajeros.innerText = `Pasajeros: ${convertirTexto(nave.passengers)}`;

                const capacidadCarga = document.createElement("span");
                capacidadCarga.className = "character-details";
                capacidadCarga.innerText = `Capacidad de carga: ${convertirTexto(nave.cargo_capacity)} kg`;

                const ratingHiperespacial = document.createElement("span");
                ratingHiperespacial.className = "character-details";
                ratingHiperespacial.innerText = `Rating Hiperespacial: ${convertirTexto(nave.hyperdrive_rating)}`;

                const mglt = document.createElement("span");
                mglt.className = "character-details";
                mglt.innerText = `MGLT: ${convertirTexto(nave.MGLT)}`;

                const claseNave = document.createElement("span");
                claseNave.className = "character-details";
                claseNave.innerText = `Clase de Nave: ${convertirTexto(nave.starship_class)}`;


                contenidoModal.appendChild(imagenNave);
                contenidoModal.appendChild(nombre);
                contenidoModal.appendChild(modelo);
                contenidoModal.appendChild(fabricante);
                contenidoModal.appendChild(costo);
                contenidoModal.appendChild(longitud);
                contenidoModal.appendChild(tripulacion);
                contenidoModal.appendChild(pasajeros);
                contenidoModal.appendChild(capacidadCarga);
                contenidoModal.appendChild(ratingHiperespacial);
                contenidoModal.appendChild(mglt);
                contenidoModal.appendChild(claseNave);
            }
        });

    } catch (error) {
        console.error('Error al cargar la lista de naves:', error);
        mostrarMensajeModal('No se pudieron cargar las naves. ¡La comunicación está interferida!');
    }
}

botonSiguiente.addEventListener('click', async () => {
    if (nextPageUrl) {
        try {
            await cargarNaves(nextPageUrl);
        } catch (error) {
            console.error('Error al cargar la siguiente página de naves:', error);
            mostrarMensajeModal('Error al cargar la siguiente página de naves.');
        }
    }
});

botonAnterior.addEventListener('click', async () => {
    if (previousPageUrl) {
        try {
            await cargarNaves(previousPageUrl);
        } catch (error) {
            console.error('Error al cargar la página anterior de naves:', error);
            mostrarMensajeModal('Error al cargar la página anterior de naves.');
        }
    }
});

function ocultarModal() {
    modal.style.visibility = "hidden";
    contenidoModal.innerHTML = '';
}

function convertirTexto(texto) {
    if (!texto || texto === 'n/a' || texto === 'unknown') return "Desconocido";
    return texto.split(', ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(', ');
}

function convertirCosto(costo) {
    if (!costo || costo === 'unknown' || costo === 'n/a') {
        return "Desconocido";
    }
    return parseInt(costo).toLocaleString() + ' créditos';
}
