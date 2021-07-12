// primera funcion: Fetch
const fileUrl = 'src/assets/crystalgems.lrc';

//no olvidar esto y que hay que abrirlo con el ok 200 server
window.onload = getFileData;

const getFileData = () => {

};
// solicitud de traer el archivo 
fetch(fileUrl)
  //espera la respuesta y la convierte en texto
  .then(response => response.text())
  //una vez que tiene el texto, lo asigna a la variable global
  .then(text => { })

let lrcFile;
lrcFile = text;

//luego llama a la funcion que imprime el texto en el dom
printLyrics();

// print text on dom
const printLyrics = () => {

}
//obtenemos la referencia al elemento html donde se insertara el texto
const htmlPlace = document.getElementById('lyrics-placeholder');

//parseamos el contenido del archivo lrc
const splitText = lrcFile.split('[');
const mapArray = splitText.map(line => {
  let newLine = line.split(']');
  return newLine;
})

//sacamos solo la parte que necesitamos del archivo
lyricsParse = mapArray.slice(6, 37);

// iteramos por cada linea de texto
lyricsParse.forEach(miniArray => {

  //creamos un elemento parrafo para añadirle el texto dentro
  let lyricP = document.createElement('p');
  let text = document.createTextNode(miniArray[1]);

  //importante! le asignamos el valor del tiempo al id para poder identificarlo mas tarde
  lyricP.setAttribute('id', miniArray[0]);


  //vinculamos el texto con el p, y el p con el elemento section
  lyricP.appendChild(text);
  htmlPlace.append(lyricP);
})

// funcion n3 actualizar el dom con el audio
const getCurrentLine = (e) => {

}

// obtenemos la referencia al elemento de audio nativo de html
const audioElement = e.target;

// obtenemos la "Html collection" de todas las lineas de texto en pantalla  
const pList = document.getElementsByTagName('p');
// lo convertimos a array usando el spread operator
const pArray = [...pList];

// nos suscribimos al evento del audio, cada vez que se actualicen los segundos que lleva la cancion, se ejecuta esta accion
audioElement.addEventListener('timeupdate', () => {

  let time = audioElement.currentTime;

  // iteramos por cada parrafo para buscar cual es el que corresponde a la parte de la cancion que estamos escuchando
  pArray.forEach((p) => {

    //parseamos el id del elemento para obtener el tiempo en un formato que nos sirva para compararlo con la propiedad currenTime /tipo number
    let splitTime = p.id.split(':');

    let minute = Number(splitTime[0]);
    let seconds = Number(splitTime[1]);

    //como sabemos que cada min tiene 60 seg, si vemos que el tiempo es por sobre 1 min, le agregaremos 60 para igualar el formato de currentTime
    if (minute > 0) {
      seconds = seconds + 60;
    }

    // por último, sabemos que si el tiempo es mayor a los segundos de esa linea, es que la canción ya empezo esta parte y tenemos que mostrarlo cambiando la clase o el color del parrafo.
    if (time > seconds) {
      p.style.color = 'red';
    } else {
      p.style.color = 'green';
    }

  })
})

// lo mismo usando filter
const getCurrentLine = (e) => {
  const audioElement = e.target;
  const pList = document.getElementsByTagName('p');
  const pArray = [...pList];
  audioElement.addEventListener('timeupdate', () => {
    let time = audioElement.currentTime;
    let nextLine;
    let prevLine;
    let currentLine = pArray.find((p, i) => {
      let pTime = timeFormate(p.id)
      nextLine = pArray[i + 1];
      prevLine = pArray[i - 1];
      if (nextLine) {
        // para activar el devolverse
        nextLine.classList.remove('active');
        let nextLineTime = timeFormate(nextLine.id);
        if (time > pTime && time < nextLineTime) {
          return p;
        }
        // para que funcione la ultima linea
      } else if (i === pArray.length - 1 && time >= pTime) {
        return p
      }
    });
    currentLine && currentLine.classList.add('active');
    currentLine && currentLine.scrollIntoView();
    if (prevLine) {
      prevLine.classList.remove('active');
      prevLine.classList.add('prev-line')
    }
  })
}

// formatear tiempo
const timeFormate = (time) => {
  let splitTime = time.split(':');
  let minute = Number(splitTime[0]);
  let seconds = Number(splitTime[1]);
  if (minute > 0) {
    seconds = seconds + (minute * 60);
  }
  return seconds;
}

// agregar titulo
let songTitle;

songTitle = mapArray[2][0].split('ti:')[1];
const titlePlace = document.getElementById('song-title');
titlePlace.innerHTML = songTitle;