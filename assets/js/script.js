'use strict';

const musicData = [
  {
    posterUrl: "./assets/images/surahMuhammad-15.jpg",
    title: "Surah Muhammad - 15",
    artist: "Raad Mohammad Al Kurdi",
    year: "2018",
    audioPath: "./assets/audio/surahMuhammad-15.mp3"
  }, 
  {
    posterUrl: "./assets/images/surahAlMursalat.jpg",
    title: "Surah Al Mursalat",
    artist: "Sherif Mostafa",
    year: "2021",
    audioPath: "./assets/audio/surahAlMursalat.mp3"
  },
  {
    posterUrl: "./assets/images/surahAlInsan.jpg",
    title: "Surah Al Insan",
    artist: "Omar Hisham Al Arabi",
    year: "2016",
    audioPath: "./assets/audio/surahAlInsan.mp3"
  },
  {
    posterUrl: "./assets/images/surahAtTakwir.jpg",
    title: "Surah At Takwir",
    artist: "Raad Mohammad Al Kurdi",
    year: "2018",
    audioPath: "./assets/audio/surahAtTakwir.mp3"
  },
  {
    posterUrl: "./assets/images/surahArRahman(37-42).jpg",
    title: "Surah Ar Rahman (37-42)",
    artist: "Syed Sadaqat Ali",
    year: "2021",
    audioPath: "./assets/audio/surahArRahman(37-42).mp3"
  },
  {
   posterUrl: "./assets/images/ayatulKursi.jpg",
    title: "Ayatul Kursi",
    artist: "Islam Sobhi",
    year: "2021",
    audioPath: "./assets/audio/ayatulKursi.mp3" 
  }
]


/**
 * Add Event to Elements 
 */

const addEventOnElements = function (elements, type, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(type, callback);
  }
}

/**
 * PlayList 
 */

const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing":""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${musicData[i].posterUrl}" alt="${musicData[i].title}" class="img-cover" height="800" width="800">
      
      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}


/**
 * PlayList Sidebar Toggle 
 */

const playlistSidebar = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);


/**
 * PlayList item
 * 
 * change Active state 
 */

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0,
  lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem); 
  
  changePlaylistItem();
});


/**
 * Audio Source
 */
 
const audio = new Audio(musicData[currentMusic].audioPath);


/**
 * Player
 * 
 * Change Player info
 */

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title}`);
  playerTitle.textContent = musicData[currentMusic].title;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;
  
  document.body.style.backgroundImage = `url(${musicData[currentMusic].posterUrl})`;
  audio.src = musicData[currentMusic].audioPath;
  audio.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);


/**
 * Update Player Duration 
 */

const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** Convert seconds to TimeCode string */

const getTimeCode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0":""}${seconds}`;
  return timecode
}

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audio.duration);
  playerDuration.textContent = getTimeCode(playerSeekRange.max);
}

audio.addEventListener("loadeddata", updateDuration);


/**
 * Play Music
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audio.paused) {
    audio.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audio.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}

playBtn.addEventListener("click", playMusic);



/**
 * Update running time text
 */

const playerRunningTime = document.querySelector("[data-running-time]");

const updateRunningTime = function () {
  playerSeekRange.value = audio.currentTime;
  playerRunningTime.textContent = getTimeCode(audio.currentTime);
  
  updateRangeFill();
  isMusicEnd();
}


/**
 * Update Range Fill
 */

const playerRange = document.querySelector("[data-range]");
const playerRangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  const rangeValue = (playerRange.value / playerRange.max) * 100;
  playerRangeFill.style.width = `${rangeValue}%`;
}

playerRange.addEventListener("input", updateRangeFill);



/**
 * Seek
 */

const seek = function () {
  audio.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimeCode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);


/**
 * End Music
 */

const isMusicEnd = function () {
  if (audio.ended) {
    audio.currentTime = 0;
    playBtn.classList.remove("active");
    playerSeekRange.value = audio.currentTime;
    playerRunningTime.textContent = getTimeCode(audio.currentTime)
    updateRangeFill();
  }
}


/**
 * Skip Next
 */

const skipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;
  
  if (isShuffled) {
    currentMusic = shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }
  
  changePlayerInfo();
  changePlaylistItem();
}

skipNextBtn.addEventListener("click", skipNext);


/**
 * Skip Prev
 */

const skipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;
  
  if (isShuffled) {
    currentMusic = shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = musicData.length -1 : currentMusic--;
  }
  
  changePlayerInfo();
  changePlaylistItem();
}

skipPrevBtn.addEventListener("click", skipPrev);



/**
 * Repeat Music 
 */

const repeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audio.loop) {
    audio.loop = true;
    repeatBtn.classList.add("active");
  } else {
    audio.loop = false;
    repeatBtn.classList.remove("active");
  }
}

repeatBtn.addEventListener("click", repeat);


/**
 * Shuffle Music
 * 
 * Play Random Music
 */

const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => currentMusic = getRandomMusic();

const shuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  shuffleBtn.classList.toggle("active");
  
  isShuffled = isShuffled ? false : true; 
}

shuffleBtn.addEventListener("click", shuffle);
