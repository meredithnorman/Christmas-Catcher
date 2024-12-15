var gameOver = true;
var score = 0;

const letters = "ABCDE";
const numbers = "123456";
var occupiedCells = [];

const timeLimit = 10000;
var counter = timeLimit;

const themeSound = new Audio("./sounds/theme.mp3");
const battleSound = new Audio("./sounds/battle.mp3");
const pokeballSound = new Audio("./sounds/pokeball.mp3");
const resetSound = new Audio("./sounds/reset.mp3");
const startSound = new Audio("./sounds/start.mp3");
const stopSound = new Audio("./sounds/stop.mp3");
const timerSound = new Audio("./sounds/timer.mp3");

function ceaseSound(sound) {
  sound.pause();
  sound.currentTime = 0;
}

function animateTimer() {
  timerSound.play();
  $("#timer-title, #timer-num")
    .animate({ color: "red" }, 50)
    .animate({ color: "yellow" }, 50)
    .animate({ color: "red" }, 50)
    .animate({ color: "yellow" }, 50)
    .animate({ color: "red" }, 50)
    .animate({ color: "yellow" }, 50)
    .animate({ color: "red" }, 50)
    .animate({ color: "yellow" }, 50);
}

function startTimer() {
  const timer = setInterval(function () {
    if (!gameOver && counter !== 0) {
      counter -= 500;
      if (counter % 1000 === 0) {
        $("#timer-num").text(`${counter / 1000} s`);
      }
      spawnPokemon();
    } else {
      if (counter === 0) {
        animateTimer();
      }
      clearInterval(timer);
      endGame();
    }
  }, 500);
}

function selectRandomCell() {
  while (true) {
    var randomLetterIndex = Math.floor(Math.random() * letters.length);
    var randomNumberIndex = Math.floor(Math.random() * numbers.length);
    var randomLetter = letters.charAt(randomLetterIndex);
    var randomNumber = numbers.charAt(randomNumberIndex);
    var randomCell = randomLetter + randomNumber;
    if (!occupiedCells.includes(randomCell)) {
      break;
    }
  }
  return randomCell;
}

function selectRandomPokemonImage() {
  const christmasImages = [
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/cherries-42904_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/christmas-160841_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/christmas-1782151_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/christmas-tree-1893414_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/gingerbread-1830137_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/heart-157895_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/pudding-31290_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/santa-claus-153309_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/snow-160956_1280.png",
    "https://raw.githubusercontent.com/meredithnorman/Christmas-Catcher/main/images/sock-4594124_1280.png"
    
  ];
  const randomIndex = Math.floor(Math.random() * christmasImages.length);
  return `<img src='${christmasImages[randomIndex]}' alt='Christmas Image' draggable='false' />`;
  //const randomPokemonIndex = Math.floor(Math.random() * 150) + 1;
  //return `<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonIndex}.png' draggable='false' />`;
}

function spawnPokemon() {
  const randomCell = selectRandomCell();
  const randomPokemon = selectRandomPokemonImage();
  $("#" + randomCell).prepend(randomPokemon);
  occupiedCells.push(randomCell);
  makeCapturable(randomCell);
  makeEscapable(randomCell);
}

function animatePokeball(cell) {
  pokeballSound.play();
  setTimeout(function () {
    $("#" + cell).prepend(
      "<img src='./images/pokeball.png' height=50 width=50 draggable='false' style='z-index: 22; object-fit: scale-down;' />"
    );
    $("#" + cell + " img")
      .fadeIn(50)
      .animate(
        {
          height: "+=50px",
          width: "+=50px",
        },
        100
      )
      .animate(
        {
          height: "-=50px",
          width: "-=50px",
        },
        100
      )
      .fadeOut(50)
      .fadeIn(50)
      .fadeOut(50)
      .fadeIn(50)
      .fadeOut(50);
  });
}

function makeCapturable(cell) {
  $("#" + cell + " img").click(function () {
    $(this).remove();
    incrementScore();
    ceaseSound(pokeballSound);
    animatePokeball(cell);
  });
}

function makeEscapable(cell) {
  setTimeout(function () {
    $("#" + cell + " img").remove();
  }, 2000);
}

function startGame() {
  battleSound.play();
  gameOver = false;
  startTimer();
  $("button").text("STOP");
}

function endGame() {
  gameOver = true;
  ceaseSound(battleSound);
  $("img").remove();
  $("button").off();
  $("button").text("RESET");
  $("button").click(function () {
    ceaseSound(themeSound);
    ceaseSound(timerSound);
    resetSound.play();
    resetGame();
  });
}

function incrementScore() {
  score++;
  $("#score-num").text(score);
}

function resetScore() {
  score = 0;
  $("#score-num").text(score);
}

function resetPokemon() {
  occupiedCells = [];
}

function resetTime() {
  counter = timeLimit;
  $("#timer-num").text(`${counter / 1000} s`);
}

function resetGame() {
  resetPokemon();
  resetScore();
  resetTime();
  restoreButton();
}

function restoreButton() {
  $("button").off();
  $("button").text("START");
  $("button").click(function () {
    ceaseSound(resetSound);
    if (gameOver) {
      ceaseSound(themeSound);
      startSound.play();
      startGame();
    } else {
      ceaseSound(themeSound);
      stopSound.play();
      endGame();
    }
  });
}

restoreButton();

$("#title").click(function () {
  if (gameOver) {
    themeSound.paused ? themeSound.play() : ceaseSound(themeSound);
  }
});
