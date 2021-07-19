let lrcFile;
let songTitle;
let lyricsParse;
let songsDictionary;
// html elements: 
const htmlSongsList = document.getElementById('listSongs');
const songDetail = document.getElementById('songPlayer');
const htmlPlace = document.getElementById('lyrics-placeholder');
const titlePlace = document.getElementById('song-title');
const back = document.getElementById('backBtn');
const img = document.getElementById('songImg');
const audio = document.getElementById('audioElement');

const getSongsList = () => {
  fetch('src/assets/data.json')
    .then(response => response.json())
    .then(data => {
      songsDictionary = data.songs;
      printSongsList()
    })
}

const printSongsList = () => {
  songsDictionary.forEach(song => {
    let songOption = document.createElement('button');
    let blur = document.createElement('div');
    songOption.setAttribute('id', song.id);
    songOption.setAttribute('class', 'songOption');
    blur.setAttribute('class', 'blur');
    songOption.style.backgroundImage = `url(${song.cover})`
    let title = document.createTextNode(song.title);
    songOption.appendChild(blur)
    blur.appendChild(title)
    htmlSongsList.append(songOption)
    songOption.addEventListener('click', () => getFileData(song));
  })
}

const getFileData = (song) => {
  fetch(song.lrc)
    .then(response => response.text())
    .then(text => {
      lrcFile = text;
      showSongDetail(song);
      printLyrics();
    });
}

const showSongDetail = (song) => {
  htmlSongsList.style.display = 'none';
  songDetail.style.display = 'block';
  back.style.display = 'block';
  titlePlace.innerHTML = song.title;
  img.setAttribute('src', song.cover);
  audio.setAttribute('src', song.mp3);
}

const onBack = () => {
  htmlPlace.scrollTop = - htmlPlace.offsetTop;
  htmlSongsList.style.display = 'block';
  songDetail.style.display = 'none';
  back.style.display = 'none';
  while (htmlPlace.firstChild) {
    htmlPlace.removeChild(htmlPlace.firstChild);
  }
}

const printLyrics = () => {
  const splitText = lrcFile.split('[');
  const mapArray = splitText.map(line => {
    let newLine = line.split(']');
    return newLine;
  })
  let firstPosition;
  let findSongStart = mapArray.find(line => {
    if (line[0].includes('00:')) {
      firstPosition = mapArray.indexOf(line)
      return line;
    }
  })

  lyricsParse = mapArray.slice(firstPosition, mapArray.length);
  lyricsParse.forEach(miniArray => {
    let lyricP = document.createElement('p');
    lyricP.setAttribute('id', miniArray[0]);
    let text = document.createTextNode(miniArray[1]);
    lyricP.appendChild(text);
    htmlPlace.append(lyricP);
  })
}

const getCurrentLine = (e) => {
  const pList = document.getElementsByTagName('p');
  const pArray = [...pList];
  const audioElement = e.target;
  let nextLine;
  let prevLine;
  audioElement.addEventListener('timeupdate', () => {
    let time = audioElement.currentTime;

    let currentLine = pArray.find((p, i) => {
      let pTime = timeFormate(p.id)
      nextLine = pArray[i + 1];
      prevLine = pArray[i - 1];
      if (nextLine) {
        nextLine.classList.remove('active');
        let nextLineTime = timeFormate(nextLine.id);
        if (time >= pTime && time <= nextLineTime) {
          return p;
        }
      } else if (i === pArray.length - 1 && time >= pTime) {
        return p
      }
    });

    if (currentLine && currentLine.parentNode) {
      currentLine.classList.add('active');
      currentLine.parentNode.scrollTop = currentLine.offsetTop - currentLine.parentNode.offsetTop;
    }

    if (prevLine) {
      prevLine.classList.remove('active');
      prevLine.classList.add('prev-line')
    }
  })
}

const timeFormate = (time) => {
  let splitTime = time.split(':');
  let minute = Number(splitTime[0]);
  let seconds = Number(splitTime[1]);
  if (minute > 0) {
    seconds = seconds + (minute * 60);
  }
  return seconds;
}

window.onload = getSongsList;

