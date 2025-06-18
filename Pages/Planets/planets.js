let apiURL = 'https://swapi.py4e.com/api/planets/';
let nextPageUrl = null;
let previousPageUrl = null;

const AKABAB_PLANET_JSON_BASE_URL = 'https://raw.githubusercontent.com/akabab/starwars-api/master/api/planets/';
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/300x470/333/gold?text=Planeta+No+Disp.';
const MODAL_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/200x200/333/gold?text=Planeta+No+Disp.';

const contenedorPrincipal = document.getElementById('contenido-planetas');
const botonSiguiente = document.getElementById('boton-siguiente');
const botonAnterior = document.getElementById('boton-anterior');
const modal = document.getElementById('modal-planetas');
const contenidoModal = document.getElementById('modal-content-planetas');

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
        await cargarPlanetas(apiURL);
    } catch (error) {
        console.error(error);
        mostrarMensajeModal('Error al cargar los planetas. Por favor, inténtalo de nuevo más tarde.');
    }
};

async function cargarPlanetas(url) {
    contenedorPrincipal.innerHTML = '';
    
    if (botonSiguiente) botonSiguiente.style.display = 'inline-block';
    if (botonAnterior) botonAnterior.style.display = 'inline-block';

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const respuestaJSON = await respuesta.json();

        nextPageUrl = respuestaJSON.next;
        previousPageUrl = respuestaJSON.previous;

        if (botonSiguiente) botonSiguiente.disabled = !nextPageUrl;
        if (botonAnterior) botonAnterior.disabled = !previousPageUrl;

        respuestaJSON.results.forEach((planeta) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "cards";
            
            const parts = planeta.url.split('/');
            const id = parts[parts.length - 2] || parts[parts.length - 1]; 
            const akababJsonUrl = `${AKABAB_PLANET_JSON_BASE_URL}${id}.json`;

            fetch(akababJsonUrl)
                .then(res => {
                    if (!res.ok) {
                        if (res.status === 404) {
                            console.warn(`JSON de imagen de Akabab no encontrado para el planeta ID ${id}. Usando placeholder.`);
                            tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                            return Promise.reject('JSON no encontrado');
                        }
                        throw new Error(`Error HTTP! estado: ${res.status} al obtener JSON de imagen de Akabab.`);
                    }
                    return res.json();
                })
                .then(data => {
                    const finalImageUrl = data.image;
                    if (finalImageUrl) {
                        const img = new Image();
                        img.src = finalImageUrl;
                        img.onload = () => {
                            tarjeta.style.backgroundImage = `url('${finalImageUrl}')`;
                        };
                        img.onerror = () => {
                            console.warn(`Error al cargar la imagen final del planeta ID ${id} desde ${finalImageUrl}. Usando placeholder.`);
                            tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                        };
                    } else {
                        console.warn(`No se encontró URL de imagen en el JSON de Akabab para el planeta ID ${id}. Usando placeholder.`);
                        tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                    }
                })
                .catch(error => {
                    console.error(`Error al procesar la imagen del planeta ID ${id}:`, error);
                    tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                });

            const nombreFondo = document.createElement("div");
            nombreFondo.className = "character-name-bg";

            const nombrePlaneta = document.createElement("span");
            nombrePlaneta.className = "character-name";
            nombrePlaneta.innerText = `${planeta.name}`;

            nombreFondo.appendChild(nombrePlaneta);
            tarjeta.appendChild(nombreFondo);
            contenedorPrincipal.appendChild(tarjeta);

            tarjeta.onclick = () => {
                modal.style.visibility = "visible";
                contenidoModal.innerHTML = '';

                const imagenPlaneta = document.createElement("div");
                imagenPlaneta.className = "character-image";
                
                fetch(akababJsonUrl)
                    .then(res => {
                        if (!res.ok) {
                            if (res.status === 404) {
                                console.warn(`JSON de imagen de Akabab no encontrado para modal ID ${id}. Usando placeholder.`);
                                imagenPlaneta.style.backgroundImage = `url('${MODAL_PLACEHOLDER_IMAGE_URL}')`;
                                return Promise.reject('JSON no encontrado para modal');
                            }
                            throw new Error(`Error HTTP! estado: ${res.status} al obtener JSON de imagen para modal.`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        const finalModalImageUrl = data.image;
                        if (finalModalImageUrl) {
                            const modalImg = new Image();
                            modalImg.src = finalModalImageUrl;
                            modalImg.onload = () => {
                                imagenPlaneta.style.backgroundImage = `url('${finalModalImageUrl}')`;
                            };
                            modalImg.onerror = () => {
                                console.warn(`Error al cargar la imagen del modal del planeta ID ${id} desde ${finalModalImageUrl}. Usando placeholder.`);
                                imagenPlaneta.style.backgroundImage = `url('${MODAL_PLACEHOLDER_IMAGE_URL}')`;
                            };
                        } else {
                            console.warn(`No se encontró URL de imagen en el JSON del modal para ID ${id}. Usando placeholder.`);
                            imagenPlaneta.style.backgroundImage = `url('${MODAL_PLACEHOLDER_IMAGE_URL}')`;
                        }
                    })
                    .catch(error => {
                        console.error(`Error al procesar la imagen del modal del planeta ID ${id}:`, error);
                        imagenPlaneta.style.backgroundImage = `url('${MODAL_PLACEHOLDER_IMAGE_URL}')`;
                    });

                const nombre = document.createElement("span");
                nombre.className = "character-details";
                nombre.innerText = `Nombre: ${planeta.name}`;

                const periodoRotacion = document.createElement("span");
                periodoRotacion.className = "character-details";
                periodoRotacion.innerText = `Período de Rotación: ${convertirTexto(planeta.rotation_period)} horas`;

                const periodoOrbital = document.createElement("span");
                periodoOrbital.className = "character-details";
                periodoOrbital.innerText = `Período Orbital: ${convertirTexto(planeta.orbital_period)} días`;
                
                const diametro = document.createElement("span");
                diametro.className = "character-details";
                diametro.innerText = `Diámetro: ${convertirTexto(planeta.diameter)} km`;

                const clima = document.createElement("span");
                clima.className = "character-details";
                clima.innerText = `Clima: ${convertirTexto(planeta.climate)}`;

                const gravedad = document.createElement("span");
                gravedad.className = "character-details";
                gravedad.innerText = `Gravedad: ${convertirTexto(planeta.gravity)}`;

                const terreno = document.createElement("span");
                terreno.className = "character-details";
                terreno.innerText = `Terreno: ${convertirTexto(planeta.terrain)}`;

                const aguaSuperficie = document.createElement("span");
                aguaSuperficie.className = "character-details";
                aguaSuperficie.innerText = `Agua en superficie: ${convertirTexto(planeta.surface_water)}%`;

                const poblacion = document.createElement("span");
                poblacion.className = "character-details";
                poblacion.innerText = `Población: ${convertirPoblacion(planeta.population)}`;

                contenidoModal.appendChild(imagenPlaneta);
                contenidoModal.appendChild(nombre);
                contenidoModal.appendChild(periodoRotacion);
                contenidoModal.appendChild(periodoOrbital);
                contenidoModal.appendChild(diametro);
                contenidoModal.appendChild(clima);
                contenidoModal.appendChild(gravedad);
                contenidoModal.appendChild(terreno);
                contenidoModal.appendChild(aguaSuperficie);
                contenidoModal.appendChild(poblacion);
            }
        });

    } catch (error) {
        console.error('Error al cargar la lista de planetas:', error);
        mostrarMensajeModal('No se pudieron cargar los planetas. ¿Se ha desalineado la fuerza?');
    }
}

botonSiguiente.addEventListener('click', async () => {
    if (nextPageUrl) {
        try {
            await cargarPlanetas(nextPageUrl);
        } catch (error) {
            console.error(error);
            mostrarMensajeModal('Error al cargar la siguiente página de planetas.');
        }
    }
});

botonAnterior.addEventListener('click', async () => {
    if (previousPageUrl) {
        try {
            await cargarPlanetas(previousPageUrl);
        } catch (error) {
            console.error(error);
            mostrarMensajeModal('Error al cargar la página anterior de planetas.');
        }
    }
});

function ocultarModal() {
    modal.style.visibility = "hidden";
    contenidoModal.innerHTML = '';
}

function convertirTexto(texto) {
    if (!texto || texto === 'n/a' || texto === 'unknown') return "Desconocido";
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(/, /g, ', ');
}

function convertirPoblacion(poblacion) {
    if (!poblacion || poblacion === 'unknown' || poblacion === 'n/a') {
        return "Desconocida";
    }
    return parseInt(poblacion).toLocaleString();
}
