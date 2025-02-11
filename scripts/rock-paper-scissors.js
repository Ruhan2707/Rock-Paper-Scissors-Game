import { computerComment } from "./computer-comments.js";

export let winningScore = JSON.parse(localStorage.getItem('winningScore'));
if(!winningScore) {
  document.querySelector('.js-save-button').addEventListener('click', () => {
    winningScore = Number(document.querySelector('.js-winning-score-input').value);
    if(winningScore === 0) {
      winningScore = 5;
    }
    localStorage.setItem('winningScore', JSON.stringify(winningScore));
    document.querySelector('.js-winning-score').innerHTML = winningScore;
  });

  document.querySelector('.js-winning-score-input').addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      winningScore = Number(document.querySelector('.js-winning-score-input').value);
      if(winningScore === 0) {
        winningScore = 5;
      }
      localStorage.setItem('winningScore', JSON.stringify(winningScore));
      document.querySelector('.js-winning-score').innerHTML = winningScore;
      }
  });
}
else {
  document.querySelector('.js-winning-score').innerHTML = winningScore;
}

let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

let gameFinish = JSON.parse(localStorage.getItem('gameFinish')) || 0;

document.querySelector('.js-reset-button').addEventListener('click', () => {
  localStorage.removeItem('score');
  localStorage.removeItem('gameFinish');
  localStorage.removeItem('winningScore');
  location.replace('./rock-paper-scissors.html');
});

updateScore();
checkWonOrLose();

if(!gameFinish) {
  document.querySelectorAll('.js-player-move-button').forEach((button) => {
    button.addEventListener('click',() => {
      if(!winningScore) {
        winningScore = 5;
        localStorage.setItem('winningScore', JSON.stringify(winningScore));
        document.querySelector('.js-winning-score').innerHTML = winningScore;
      }
      playGame(button.dataset.move, pickComputerMove());
    });
  });
}

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
  document.querySelector('.js-wins-count').innerHTML = score.wins;
  document.querySelector('.js-losses-count').innerHTML = score.losses;
  document.querySelector('.js-ties-count').innerHTML = score.ties;
}

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
      location.replace('./rock-paper-scissors.html');
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

function playGame(playerMove, computerMove) {
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

  if(result === 'Tie') score.ties++;
  else if(result === 'You Win') score.wins++;
  else if(result === 'You Lose') score.losses++;

  if(!gameFinish) {
    localStorage.setItem('score', JSON.stringify(score));

    document.querySelector('.js-display-player-move').innerHTML = `
      <img src="images/${playerMove}-emoji.png" class="player-move">
    `;

    document.querySelector('.js-display-computer-move').innerHTML = `
      <img src="images/${computerMove}-emoji.png" class="player-move">
    `;

    document.querySelector('.js-result-text').innerHTML = result;
    
    const computerMoveButton = document.querySelector(`.js-computer-${computerMove.toLowerCase()}-button`);
    computerMoveButton.addEventListener('click', () => {
      computerMoveButton.style.backgroundColor = "rgb(94, 94, 94)";
      setTimeout(() => {
        computerMoveButton.style.backgroundColor = "black";
      }, 100);
    });

    computerMoveButton.click();

    const computerStatement = computerComment(score);
    if(computerStatement !== '') {
      document.querySelector('.js-computer-statement').style.display = "block";
      document.querySelector('.js-computer-statement').innerHTML = computerStatement;
    }
    else {
      document.querySelector('.js-computer-statement').style.display = "none";
    }
    updateScore();
    checkWonOrLose();
  }
};

