let apiURL = 'https://swapi.py4e.com/api/people/';
let nextPageUrl = null;
let previousPageUrl = null;

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/akabab/starwars-api/master/api/id/';
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/300x470/333/gold?text=Imagen+No+Disp.';

const contenedorPrincipal = document.getElementById('contenido-principal');
const botonSiguiente = document.getElementById('boton-siguiente');
const botonAnterior = document.getElementById('boton-anterior');
const modal = document.getElementById('modal');
const contenidoModal = document.getElementById('modal-content');
const modalMessage = document.getElementById('modal-message');

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
        await cargarPersonajes(apiURL);
    } catch (error) {
        console.error(error);
        mostrarMensajeModal('Error al cargar los personajes. Por favor, inténtalo de nuevo más tarde.');
    }
};

async function cargarPersonajes(url) {
    contenedorPrincipal.innerHTML = '';
    ocultarMensajeModal();

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

        respuestaJSON.results.forEach((personaje) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "cards";
            
            const parts = personaje.url.split('/');
            const id = parts[parts.length - 2] || parts[parts.length - 1]; 
            const imageUrl = `${IMAGE_BASE_URL}${id}.json`;

            fetch(imageUrl)
                .then(res => {
                    if (!res.ok) {
                        if (res.status === 404) {
                            return Promise.reject('Image JSON not found');
                        }
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    const finalImageUrl = data.image;
                    const img = new Image();
                    img.src = finalImageUrl;
                    img.onload = () => {
                        tarjeta.style.backgroundImage = `url('${finalImageUrl}')`;
                    };
                    img.onerror = () => {
                        tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                    };
                })
                .catch(error => {
                    console.error('Error al obtener la imagen del personaje:', error);
                    tarjeta.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                });

            const nombreFondo = document.createElement("div");
            nombreFondo.className = "character-name-bg";

            const nombrePersonaje = document.createElement("span");
            nombrePersonaje.className = "character-name";
            nombrePersonaje.innerText = `${personaje.name}`;

            nombreFondo.appendChild(nombrePersonaje);
            tarjeta.appendChild(nombreFondo);
            contenedorPrincipal.appendChild(tarjeta);

            tarjeta.onclick = () => {
                modal.style.visibility = "visible";
                contenidoModal.innerHTML = '';

                const imagenPersonaje = document.createElement("div");
                imagenPersonaje.className = "character-image";
                
                fetch(imageUrl)
                    .then(res => {
                        if (!res.ok) {
                            if (res.status === 404) {
                                return Promise.reject('Image JSON not found for modal');
                            }
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        const finalModalImageUrl = data.image;
                        const modalImg = new Image();
                        modalImg.src = finalModalImageUrl;
                        modalImg.onload = () => {
                            imagenPersonaje.style.backgroundImage = `url('${finalModalImageUrl}')`;
                        };
                        modalImg.onerror = () => {
                            imagenPersonaje.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                        };
                    })
                    .catch(error => {
                        console.error('Error al obtener la imagen del modal:', error);
                        imagenPersonaje.style.backgroundImage = `url('${PLACEHOLDER_IMAGE_URL}')`;
                    });


                const nombre = document.createElement("span");
                nombre.className = "character-details";
                nombre.innerText = `Nombre: ${personaje.name}`;

                const altura = document.createElement("span");
                altura.className = "character-details";
                altura.innerText = `Altura: ${convertirAltura(personaje.height)}`;

                const peso = document.createElement("span");
                peso.className = "character-details";
                peso.innerText = `Peso: ${convertirPeso(personaje.mass)}`;

                const colorOjos = document.createElement("span");
                colorOjos.className = "character-details";
                colorOjos.innerText = `Color de ojos: ${convertirColorOjos(personaje.eye_color)}`;

                const nacimiento = document.createElement("span");
                nacimiento.className = "character-details";
                nacimiento.innerText = `Nacimiento: ${convertirNacimiento(personaje.birth_year)}`;

                contenidoModal.appendChild(imagenPersonaje);
                contenidoModal.appendChild(nombre);
                contenidoModal.appendChild(altura);
                contenidoModal.appendChild(peso);
                contenidoModal.appendChild(colorOjos);
                contenidoModal.appendChild(nacimiento);
            }
        });

    } catch (error) {
        console.error('Error al cargar la lista de personajes:', error);
        mostrarMensajeModal('No se pudieron cargar los personajes. ¿Es posible que la fuerza no esté contigo?');
    }
}

botonSiguiente.addEventListener('click', async () => {
    if (nextPageUrl) {
        try {
            await cargarPersonajes(nextPageUrl);
        } catch (error) {
            console.error(error);
            mostrarMensajeModal('Error al cargar la siguiente página de personajes.');
        }
    }
});

botonAnterior.addEventListener('click', async () => {
    if (previousPageUrl) {
        try {
            await cargarPersonajes(previousPageUrl);
        } catch (error) {
            console.error(error);
            mostrarMensajeModal('Error al cargar la página anterior de personajes.');
        }
    }
});

function ocultarModal() {
    modal.style.visibility = "hidden";
    contenidoModal.innerHTML = '';
}

function ocultarMensajeModal() {
    if (modalMessage) {
        modalMessage.innerText = '';
    }
}

function convertirColorOjos(color) {
    if (!color || color === 'n/a' || color === 'unknown') return "Desconocido";
    const colores = {
        blue: "Azul",
        brown: "Marrón",
        green: "Verde",
        yellow: "Amarillo",
        black: "Negro",
        pink: "Rosa",
        red: "Rojo",
        orange: "Naranja",
        hazel: "Avellana",
        white: "Blanco",
        gold: "Dorado",
        'blue-gray': "Azul-Gris",
        'red, blue': "Rojo, Azul",
        'gold, red': "Dorado, Rojo",
        'blue, green': "Azul, Verde",
        'red, orange': "Rojo, Naranja",
        'yellow, green': "Amarillo, Verde",
        'dark': "Oscuro",
    };
    return colores[color.toLowerCase()] || color.charAt(0).toUpperCase() + color.slice(1);
}

function convertirAltura(altura) {
    if (!altura || altura === 'unknown') {
        return "Desconocida";
    }
    return `${altura} cm`;
}

function convertirPeso(peso) {
    if (!peso || peso === 'unknown') {
        return "Desconocido";
    }
    return `${peso} kg`;
}

function convertirNacimiento(nacimiento) {
    if (!nacimiento || nacimiento === 'unknown') {
        return "Desconocido";
    }
    return nacimiento;
}
