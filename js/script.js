//let's select all required tag or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

//load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) +1) ;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function ones windows is loaded
    playingNow()
})

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
    
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
  }
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
  }

  //next Music function
  function nextMusic(){
    //here we will just increment of index by 1
    musicIndex++;
    // if musicIndex is greater the array length then music index will be one so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  }
  //prev Music function
  function prevMusic(){
    //here we will just decrement of index by 1
    musicIndex--;
    // if musicIndex is less the 1 then music index will be array length so the first song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  }

//play and pause music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pause;Music else call playMusic
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow();
});

//next music btn event
nextBtn.addEventListener("click", ()=>{
  nextMusic();
})

//prev music btn event
prevBtn.addEventListener("click", ()=>{
  prevMusic();
})

//update progress bar width according to music time
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //getting current time of song
  const duration = e.target.duration; //getting total duration time of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
          
     //update song total duration
     let audioDuration = mainAudio.duration;
     let totalMin = Math.floor(audioDuration / 60);
     let totalSec = Math.floor(audioDuration % 60);
     if(totalSec < 10){ //adding 0 if sec is less then 10
      totalSec = `0${totalSec}`;
     }
     musicDuration.innerText = `${totalMin}:${totalSec}`;

    });
     //update song total duration
     let currentMin = Math.floor(currentTime / 60);
     let currentSec = Math.floor(currentTime % 60);
     if(currentSec < 10){ //adding 0 if sec is less then 10
      currentSec = `0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

});

//now updating song current time according to the progress bar width 
progressArea.addEventListener("click", (e)=>{
  let progresswidthval = progressArea.clientWidth; //gettig width of progress bar
  let clickedOffSetX = e.offsetX; //getting off set x value
  let songDuration = mainAudio.duration; // getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progresswidthval) * songDuration;
  playMusic();
})

//now working on repeat, shuffle song according to the progress bar

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  //first we get the innertext of the icon then we will change accordingly
  let getText = repeatBtn.innerText; //getting inner text of icon
  //now changing a diffrent icon click using switch
  switch(getText){
    case "repeat": //if the icon is repeat then change it to repeat_one
    repeatBtn.setAttribute("title", "song looped")
      repeatBtn.innerText = "repeat_one";
      break;

    case "repeat_one": //if the icon is repeat_one then change it to shuffle
    repeatBtn.setAttribute("title", "Playback shuffle")
        repeatBtn.innerText = "shuffle";
        break;
    case "shuffle": //if the icon is shuffle then change it to repeat
    repeatBtn.setAttribute("title", "Playlist looped")
        repeatBtn.innerText = "repeat";
        break;
  }
})

//Above we just change the icon, now lets work on what to do
//after the song ended

mainAudio.addEventListener("ended", ()=>{
//we'll do according to the icon means if user has set icon to loop song then we will repeat
//the current song and further accordingly 
let getText = repeatBtn.innerText; //getting inner text of icon
 //now changing a diffrent icon click using switch
 switch(getText){
  case "repeat": //if the icon is repeat then simply we call the nextMusic function so the song will play
    nextMusic();
    break;

  case "repeat_one": //if the icon is repeat_one then we will change the current playing song current time to 0 so song will play from beginning
  mainAudio.currentTime = 0;
  loadMusic(musicIndex);
  playMusic(); //calling playMusic function
      break;

  case "shuffle": //if the icon is shuffle then change it to repeat
  //genrating random index between the max range of array length
  let randIndex = Math.floor((Math.random() * allMusic.length) +1) ;
    do{
      randIndex = Math.floor((Math.random() * allMusic.length) +1) ;
    }while(musicIndex == randIndex); // this loop run untill the next random number wont't be the same of current music index
    musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
    loadMusic(musicIndex); //calling loadMusic function
    playMusic(); //calling playMusic function
    playingNow();
      break;
}
})

showMoreBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show")
});

hideMusicBtn.addEventListener("click", ()=>{
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
  <div class="row">
    <span>${allMusic[i].name}</span>
    <p>${allMusic[i].artist}</p>
  </div>
  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
  <span id=${allMusic[i].src} class="audio-duration">3:40</span>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 


let liAudioDuration  = ulTag.querySelector(`#${allMusic[i].src}`);
let liAudioTag= ulTag.querySelector(`.${allMusic[i].src}`);

liAudioTag.addEventListener("loadeddata", ()=>{
  let audioDuration = liAudioTag.duration;
     let totalMin = Math.floor(audioDuration / 60);
     let totalSec = Math.floor(audioDuration % 60);
     if(totalSec < 10){ //adding 0 if sec is less then 10
      totalSec = `0${totalSec}`;
     }
     liAudioDuration.innerText = `${totalMin}:${totalSec}`;
     //adding t-duration attribute which we will use below
     liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);

});

}

//now play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
  for (let j=0; j<allLiTags.length; j++){
    let AudioTag = allLiTags[j].querySelector(".audio-duration")
    //let's remove playing class for all other li expect the last one which is playing music
    if (allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing");
      //let's get the audio duration value and pass to .audio-duration innertext
      let adDuration = AudioTag.getAttribute("t-duration");
      AudioTag.innerText = adDuration; //passing t-duration value to audio duration innertext
    }
    //if there is an li tag which li-index is equal to musicIndex
    //then this music is playing now and we will style it
  if(allLiTags[j].getAttribute("li-index") == musicIndex){
  allLiTags[j].classList.add("playing");
    AudioTag.innerText = "playing";
  }
  //adding onclick attribute in all li tags
  allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//lets play song on click
function clicked(element){
//getting li index of particular clicked li tag
let getLiIndex = element.getAttribute("li-index");
musicIndex = getLiIndex; //passing the LiIndex to MusicIndex
loadMusic(musicIndex);
playMusic();
playingNow();
}