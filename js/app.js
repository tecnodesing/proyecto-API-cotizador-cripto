const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda : '',
    criptomoneda : ''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await  obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();
    //validar
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //consultar la API
    consultarAPI();
}

function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error');
    if (!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostrarSpinner();

    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function mostrarCotizacionHtml(cotizacion){
    limpiarHTML(resultado);

    const {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML =  `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML =  `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML =  `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML =  `<p>Variación en las útimas 24 Horas: <span>${CHANGEPCT24HOUR}%</span> </p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML =  `<p>Última actualización: <span>${LASTUPDATE}</span> </p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML(resultado);
    const spiner = document.createElement('div');
    spiner.classList.add('loader', 'JS_on');
    spiner.innerHTML = `
        <span class="binary"></span>
        <span class="binary"></span>
        <span class="getting-there">Cotizando Cripto...</span>
    `;
    
    resultado.appendChild(spiner);
}