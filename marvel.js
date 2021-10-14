'use strict'
const PUBLIC_KEY = ''
const PRIVATE_KEY = ''
const base_url = 'https://gateway.marvel.com/v1/public/'
const template = document.querySelector('template')

const titulos = new Map()
titulos.set('1','Personajes')
titulos.set('2','Series')
titulos.set('3','Comics')
titulos.set('4','Historias')
titulos.set('5','Eventos')

registrarEventos()

function registrarEventos(){
    let opciones = document.querySelector('nav ul')
    Array.from(opciones.children).forEach(obj => {
        obj.children[0].addEventListener('click',opcionSeleccionada)
    })
}

function opcionSeleccionada(){
    let opcion = this.getAttribute('id')
    let path = this.getAttribute('path')
    let auth = autorizacion()
    let url = `${base_url}${path}?${auth}`
    let rpta = getDatosSevicio(url)
    rpta.then(res => procesarPeticion(opcion,res.json()))
}

function procesarPeticion(opcion,response){
    removerConsulta()
    agregarTitulo(titulos.get(opcion))
    response.then(rpta => mostrarDatos(rpta.data.results))    
}

function mostrarDatos(datos){
    let main = document.querySelector('main')
    datos.forEach(obj => {
        main.appendChild(generarItem(obj))
    })
}

async function getDatosSevicio(url){
    console.log(url)
    let parametros = {
        method : 'GET',
        headers : {
            'Content-Type':'application/json'
        }
    }
    return await fetch(url,parametros)
}

function autorizacion(){
    let apikey = PUBLIC_KEY
    let ts = Date.now()
    let hash = CryptoJS.MD5(ts+PRIVATE_KEY+PUBLIC_KEY).toString()

    let parametros = new URLSearchParams()

    parametros.append('ts',ts)
    parametros.append('apikey',apikey)
    parametros.append('hash',hash)

    return parametros
}

function removerConsulta(){
    let main = document.querySelector('main')
    main.textContent = ''
}

function generarItem(obj){
    let cardTemplate = document.importNode(template.content,true)
    let item = cardTemplate.querySelector('.card')
    let imagen = cardTemplate.querySelector('.card div img')
    let name = cardTemplate.querySelector('.card article b')
    let detail = cardTemplate.querySelector('.card article a')
    let des = cardTemplate.querySelector('.card article span')
    item.id = obj.id
    if(obj.thumbnail != null)
        imagen.setAttribute('src',`${obj.thumbnail.path}.${obj.thumbnail.extension}`)
    name.innerText = obj.name ? obj.name : obj.title
    des.innerText = obj.description
    if(obj.urls != null)
        detail.setAttribute('href',obj.urls[0].url)
    return item
}

function agregarTitulo(titulo){
    let padre = document.querySelector('main')
    let title = document.createElement('h1')
    title.textContent = titulo
    padre.appendChild(title)
}