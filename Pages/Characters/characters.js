// 1. URL actualizada a la que proporcionaste
let apiURL = 'https://akabab.github.io/starwars-api/api/all.json';

window.onload = async () => {
    try {
        await cargarPersonajes(apiURL);
    } catch (error) {
        console.log(error);
        alert('Error al cargar los personajes!');
    }
};

async function cargarPersonajes(url) {
    const contenedorPrincipal = document.getElementById('contenido-principal');
    contenedorPrincipal.innerHTML = '';

    // Ocultar los botones porque esta API no tiene paginación
    const contenedorBotones = document.querySelector('.botones');
    if (contenedorBotones) {
        contenedorBotones.style.display = 'none';
    }

    try {
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();

        // 2. La nueva API devuelve un array directamente, no un objeto con ".results"
        respuestaJSON.forEach((personaje) => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "cards";
            
            // 3. La URL de la imagen ya viene completa en la propiedad "image"
            tarjeta.style.backgroundImage = `url('${personaje.image}')`;

            const nombreFondo = document.createElement("div");
            nombreFondo.className = "character-name-bg";

            const nombrePersonaje = document.createElement("span");
            nombrePersonaje.className = "character-name";
            nombrePersonaje.innerText = `${personaje.name}`;

            nombreFondo.appendChild(nombrePersonaje);
            tarjeta.appendChild(nombreFondo);
            contenedorPrincipal.appendChild(tarjeta);

            tarjeta.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const contenidoModal = document.getElementById("modal-content");
                contenidoModal.innerHTML = '';

                const imagenPersonaje = document.createElement("div");
                imagenPersonaje.className = "character-image";
                
                // Se usa la propiedad "image" directamente aquí también
                imagenPersonaje.style.backgroundImage = `url('${personaje.image}')`;

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
                // 4. Los nombres de las propiedades cambian (de eye_color a eyeColor)
                colorOjos.innerText = `Color de ojos: ${convertirColorOjos(personaje.eyeColor)}`;

                const nacimiento = document.createElement("span");
                nacimiento.className = "character-details";
                // De birth_year a birthYear
                nacimiento.innerText = `Nacimiento: ${convertirNacimiento(personaje.birthYear)}`;

                contenidoModal.appendChild(imagenPersonaje);
                contenidoModal.appendChild(nombre);
                contenidoModal.appendChild(altura);
                contenidoModal.appendChild(peso);
                contenidoModal.appendChild(colorOjos);
                contenidoModal.appendChild(nacimiento);
            }
        });

    } catch (error) {
        console.log(error);
        alert('Error al cargar la lista de personajes!');
    }
}

function ocultarModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

function convertirColorOjos(color) {
    // Esta función puede que no sea necesaria si los colores ya vienen bien, pero la dejamos por si acaso
    if (!color) return "Desconocido";
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
        unknown: "Desconocido"
    };
    return colores[color.toLowerCase()] || color.charAt(0).toUpperCase() + color.slice(1);
}

function convertirAltura(altura) {
    if (!altura) {
        return "Desconocida";
    }
    // La altura en esta API viene en metros, así que la mostramos así
    return `${altura} m`;
}

function convertirPeso(peso) {
    if (!peso) {
        return "Desconocido";
    }
    return `${peso} kg`;
}

function convertirNacimiento(nacimiento) {
    if (!nacimiento) {
        return "Desconocido";
    }
    return nacimiento;
}

// 5. Se eliminaron las funciones cargarSiguientePagina y cargarPaginaAnterior porque no son necesarias.