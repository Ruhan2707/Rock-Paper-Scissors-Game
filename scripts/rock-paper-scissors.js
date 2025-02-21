import { computerComment } from "./computer-comments.js";

export let winningScore = JSON.parse(localStorage.getItem('winningScore'));

let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

let gameFinish = JSON.parse(localStorage.getItem('gameFinish')) || 0;

if(!winningScore) {
  document.querySelector('.js-save-button').addEventListener('click', () => {
    winningScore = Number(document.querySelector('.js-winning-score-input').value);

    if(winningScore <= 0) {
      pickDefaultWinningScore();
    }

    localStorage.setItem('winningScore', JSON.stringify(winningScore));
    displayWinningScore();
  });

  document.querySelector('.js-winning-score-input').addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      winningScore = Number(document.querySelector('.js-winning-score-input').value);

      if(winningScore <= 0) {
        pickDefaultWinningScore();
      }

      localStorage.setItem('winningScore', JSON.stringify(winningScore));
      displayWinningScore();
      }
  });
}
else {
  displayWinningScore();
  updateScore();
  checkWonOrLose();
}

if(!gameFinish) {
  document.querySelectorAll('.js-player-move-button').forEach((button) => {
    button.addEventListener('click',() => {
      if(!winningScore) {
        pickDefaultWinningScore();
        localStorage.setItem('winningScore', JSON.stringify(winningScore));
        document.querySelector('.js-winning-score').innerHTML = winningScore;
      }
      playGame(button.dataset.move, pickComputerMove());
    });
  });
}

document.querySelector('.js-reset-button').addEventListener('click', () => {
  localStorage.removeItem('score');
  localStorage.removeItem('gameFinish');
  localStorage.removeItem('winningScore');
  location.replace('./index.html');
});

function displayWinningScore() {
  document.querySelector('.js-winning-score').innerText = winningScore;
}

// picks default winning score for the game
function pickDefaultWinningScore() {
  winningScore = 5;
}

// removes score from local storage
function resetScore() {
  localStorage.removeItem('score');
}

function pickComputerMove() {
  let randomNumber = Math.random();
  if(randomNumber >= 0 && randomNumber < (1 / 3)) {
    return 'Rock';
  }
  else if(randomNumber < (2 / 3)) {
    return 'Paper';
  }
  else {
    return 'Scissors';
  }
};

function updateScore() {
  document.querySelector('.js-wins-count').innerText = score.wins;
  document.querySelector('.js-losses-count').innerText = score.losses;
  document.querySelector('.js-ties-count').innerText = score.ties;
}

// checks if the game is finished or not
function checkWonOrLose() {
  if(score.wins === winningScore || score.losses === winningScore) {
    const winner = (score.wins === winningScore) ? ("player") : ("computer");
    document.querySelector('.js-result-container').innerHTML = `
      <div class="win-container">
        <img src="images/${winner}-icon.svg" class="player-icon">
        <span class="winning-text">IS THE WINNER</span>
      </div>

      <button class="play-again-button js-play-again-button">Play Again</button>
    `;
    document.querySelector('.js-play-again-button').addEventListener('click', () => {
      resetScore();
      location.replace('./index.html');
      gameFinish = 0;
      localStorage.setItem('gameFinish', JSON.stringify(gameFinish));
      localStorage.removeItem('winningScore');
    });
    
    if(!gameFinish) {
      gameFinish = 1;
      localStorage.setItem('gameFinish', JSON.stringify(gameFinish));
    }
  }
}

// displays clicking effect on the computer choice
function clickComputerChoice(computerMove) {
  const computerMoveButton = document.querySelector(`.js-computer-${computerMove.toLowerCase()}-button`);
    computerMoveButton.addEventListener('click', () => {
      computerMoveButton.style.backgroundColor = "rgb(94, 94, 94)";
      setTimeout(() => {
        computerMoveButton.style.backgroundColor = "black";
      }, 100);
    });

    computerMoveButton.click();
}

function getResult(playerMove, computerMove) {
  let result = '';
  if(playerMove == computerMove) {
    result = 'Tie';
  }
  else if(playerMove == 'Rock') {
    if(computerMove == 'Paper') {
      result = 'You Lose';
    }
    else if(computerMove == 'Scissors') {
      result = 'You Win';
    }
  }
  else if(playerMove == 'Paper') {
    if(computerMove == 'Scissors') {
      result = 'You Lose';
    }
    else if(computerMove == 'Rock') {
      result = 'You Win';
    }
  }
  else if(playerMove == 'Scissors') {
    if(computerMove == 'Rock') {
      result = 'You Lose';
    }
    else if(computerMove == 'Paper') {
      result = 'You Win';
    }
  }

  return result;
}

function displayResult(result) {
  const textElem = document.querySelector('.js-result-text');
  if(result === 'You Win') {
    textElem.style.color = 'rgb(90, 255, 90)';
  }
  else if(result === 'You Lose') {
    textElem.style.color = 'rgb(255, 90, 90)';
  }
  else if(result === 'Tie') {
    textElem.style.color = 'rgb(255, 255, 255)';
  }
  textElem.innerText = result;
}

function playGame(playerMove, computerMove) {
  let result = getResult(playerMove, computerMove);

  if(!gameFinish) {

    if(result === 'Tie') score.ties++;
    else if(result === 'You Win') score.wins++;
    else if(result === 'You Lose') score.losses++;

    localStorage.setItem('score', JSON.stringify(score));

    document.querySelector('.js-display-player-move').innerHTML = `
      <img src="images/${playerMove}-emoji.png" class="player-move">
    `;

    document.querySelector('.js-display-computer-move').innerHTML = `
      <img src="images/${computerMove}-emoji.png" class="player-move">
    `;

    displayResult(result);
    
    clickComputerChoice(computerMove);

    const computerStatement = computerComment(score);
    if(computerStatement !== '') {
      document.querySelector('.js-computer-statement').style.display = "block";
      document.querySelector('.js-computer-statement').innerText = computerStatement;
    }
    else {
      document.querySelector('.js-computer-statement').style.display = "none";
    }

    updateScore();
    checkWonOrLose();
  }
};
