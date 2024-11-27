var gameOver = true;
var score = 0;

var occupiedCells = [];
const letters = "ABCDE";
const numbers = "123456";

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
  const randomPokemonIndex = Math.floor(Math.random() * 150) + 1;
  return `<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPokemonIndex}.png' draggable='false' />`;
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
      "<img src='./images/pokeball.png' height=50 width=50  draggable='false' />"
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

function incrementScore() {
  score++;
  $("#score-num").text(score);
}

function resetScore() {
  score = 0;
  $("#score-num").text(score);
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
  setTimeout(function () {
    $("button").text("STOP");
  }, 200);
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

function endGame() {
  gameOver = true;
  ceaseSound(battleSound);
  $("img").remove();
  $("button").off();
  $("button").text("RESET");
  $("button").click(function () {
    ceaseSound(timerSound);
    resetSound.play();
    resetGame();
  });
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
  resetTime();
  resetScore();
  restoreButton();
}

function restoreButton() {
  $("button").off();
  $("button").text("START");
  $("button").click(function () {
    ceaseSound(resetSound);
    startSound.play();
    if (gameOver) {
      startGame();
    } else {
      stopSound.play();
      endGame();
    }
  });
}

restoreButton();
