
const fileUrl = 'src/assets/crystalgems.lrc';
let lrcFile;
let songTitle;
let lyricsParse;

const getFileData = () => {
  fetch(fileUrl)
    .then(response => response.text())
    .then(text => {
      lrcFile = text;
      printLyrics();
    })
};

const printLyrics = () => {
  const htmlPlace = document.getElementById('lyrics-placeholder');
  const splitText = lrcFile.split('[');
  const mapArray = splitText.map(line => {
    let newLine = line.split(']');
    return newLine;
  })
  songTitle = mapArray[2][0].split('ti:')[1];
  const titlePlace = document.getElementById('song-title');
  titlePlace.innerHTML = songTitle;
  lyricsParse = mapArray.slice(6, 37);
  lyricsParse.forEach(miniArray => {
    let lyricP = document.createElement('p');
    lyricP.setAttribute('id', miniArray[0]);
    let text = document.createTextNode(miniArray[1]);
    lyricP.appendChild(text);
    htmlPlace.append(lyricP);
  })
}

const getCurrentLine = (e) => {
  const audioElement = e.target;
  const pList = document.getElementsByTagName('p');
  const pArray = [...pList];
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
    currentLine && currentLine.classList.add('active');
    currentLine && currentLine.scrollIntoView();
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

window.onload = getFileData;

