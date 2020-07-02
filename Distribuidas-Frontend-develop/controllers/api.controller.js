import axios from "axios";

export let token; 
const movieKey = "bca1fa37079b46ecff7e9b5b7a7ad2e3"

export const register = async function (data) {
  const url = "https://streamp.herokuapp.com/api/users/registration";
  const newUser = {
    name: data.name,
    email: data.email,
    password: data.password,
  };
  console.log("user", newUser);
  try {
    const resp = await axios.post(url, newUser);//hace conexion con el servicio/endopiont del back. Espera la respuesta del back
    token = resp.data.token; //Guarda el token que recibió del backend
    return true;
  } catch (error) {
    console.log("error", error);
  }
};

export const login = async function (login) {
  const url = "https://streamp.herokuapp.com/api/users/login";
  //armo
  console.log("Datos Login", login);
  const userCredentials = {
    email: login.email,
    password: login.password,
  };
  try {
    const resp = await axios.post(url, userCredentials);
    token = resp.data.token;
    return { rdo: 0, mensaje: "Ok" }; //correcto
  } catch (error) {
    console.log("error", error);
  }
};

const createDataGeneros = (item, idArray) => {
  return {
    id: item.id,
    name: item.name,
  };
};

const crearDataPeliculas = (item, idArray) => {
  //console.log("entreCreate Data",idArray)
  const baseURLImg = "https://image.tmdb.org/t/p/w200";

  return {
    id: item.id,
    imagen: `${baseURLImg}${item.poster_path}`,
    title: item.title,
    release: item.release_date,
    resumen: item.overview,
    vote_count: item.vote_count,
    vote_average: item.vote_average,
  };
};

const createTvShows = (item, idArray) => {
  //console.log("entreCreate Data",idArray)
  const baseURLImg = "https://image.tmdb.org/t/p/w200";

  return {
    id: item.id,
    imagen: `${baseURLImg}${item.poster_path}`,
    title: item.original_name,
    release: item.first_air_date,
    resumen: item.overview,
    vote_count: item.vote_count,
    vote_average: item.vote_average,
  };
};

export const Busqueda = async function (votos, puntuacion, tipo, cines) {
  //Parametros de conexion
  const url = "https://api.themoviedb.org/3/discover/";
  const valor = `${tipo}`;
  const key = "?api_key=";
  const discover =
    "&language=en-US&sort_by=popularity.desc&timezone=America%2FNew_York&include_video=fals&include_null_first_air_dates=false";
  const apiKEY = "b30e0ad15033e6b21396c161f114120c";
  let page = `&page=`;
  const vote_count = "&&vote_count.gte=" + `${votos}`;
  const vote_average = "&&vote_average.gte=" + `${puntuacion}`;
  const screened = "&screened_theatrically=" + `${cines}`;
  let endpoint = `${url}${valor}${key}${apiKEY}${discover}`;
  if (cines == true) {
    endpoint = `${endpoint}${screened}`;
  }
  if (votos > 0) {
    endpoint = `${endpoint}${vote_count}`;
  }
  if (puntuacion > 0) {
    endpoint = `${endpoint}${vote_average}`;
  }
  const endpointo = endpoint;
  let rtaApi;
  let pagina = 1;
  let resultadob;
  let busquedaAMostrar = [];
  let i;
  let j;
  let busqueda;
  for (i = 1; i <= pagina && i < 3; i++) {
    endpoint = `${endpointo}${page}+${i}`;
    resultadob = await fetch(endpoint);
    rtaApi = await resultadob.json();
    pagina = rtaApi.total_pages;
    busqueda = rtaApi.results;
    for (j = 0; j < busqueda.length; j++) {
      if (tipo == "movie") {
        busquedaAMostrar.push(createDataPeliculas(busqueda[j], j));
      } else {
        busquedaAMostrar.push(createTvShows(busqueda[j], j));
      }
    }
  }

  return busquedaAMostrar;
};

export const getGenres = async function () {//El que va!
  const url = "https://api.themoviedb.org/3/genre/movie/list?api_key=bca1fa37079b46ecff7e9b5b7a7ad2e3&language=es-Ar&sort_by=popularity.desc&include_adult=false&include_video=false";
  try{
    const res = await axios.get(url);
    return res.data;
  }catch (error) {
    console.log("error", error);
  }
}

export const getGeneros = async function () {
  const endpoint =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=b30e0ad15033e6b21396c161f114120c&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false";
  let resultado = await fetch(endpoint);
  let rtaApi = await resultado.json();
  const generos = rtaApi.genres;
  let generosAMostrar = [];
  let i;
  for (i = 0; i < genders.length; i++) {
    generosAMostrar.push(createDataGeneros(genders[i], i));
  }
  return generosAMostrar;
};

export const getEstrenos = async function () {
  //Parametros de conexion
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=";
  const discover =
    "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
  const apiKEY = "b30e0ad15033e6b21396c161f114120c";

  const endpoint = `${url}${apiKEY}${discover}`;
  //console.log("Buscando",endpoint);
  let resultado = await fetch(endpoint);
  //console.log("resultado",resultado);
  let rtaApi = await resultado.json();
  //console.log("respuesta bruta",rtaApi);
  //Obtengo estrenos
  const estrenos = rtaApi.results;
  //Dar formato a los datos para mostrar en la grilla
  let estrenosAMostrar = [];
  let i;
  for (i = 0; i < estrenos.length; i++) {
    estrenosAMostrar.push(createDataPeliculas(estrenos[i], i));
  }
  return estrenosAMostrar;
};

export const getEstrenosTV = async function () {
  //Parametros de conexion
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=";
  const discover =
    "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
  const apiKEY = "b30e0ad15033e6b21396c161f114120c";

  const endpoint = `${url}${apiKEY}${discover}`;
  //console.log("Buscando",endpoint);
  let resultado = await fetch(endpoint);
  //console.log("resultado",resultado);
  let rtaApi = await resultado.json();
  //console.log("respuesta bruta",rtaApi);
  //Obtengo estrenos
  const estrenos = rtaApi.results;
  //Dar formato a los datos para mostrar en la grilla
  let estrenosAMostrar = [];
  let i;
  for (i = 0; i < estrenos.length; i++) {
    estrenosAMostrar.push(createTvShows(estrenos[i], i));
  }
  return estrenosAMostrar;
};
