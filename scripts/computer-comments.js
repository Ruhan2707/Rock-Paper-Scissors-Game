import { winningScore } from "./rock-paper-scissors.js";

const winningStatements = ["I have the lead", "I am winning", "I will win", "I can smell victory"];
const lossingStatements = ["You are good at this game", "I need to make a comeback", "Don't be cocky because you got the lead", "I will overtake you soon"];
const tiedStatements = ["Scores are level", "Equal Scores"];
const lostStatement = "Well played, wanna play again?";
const winStatement = "That way easy, want to try your luck again?";

function getWinningStatement() {
  let length = winningStatements.length;
  let index = Math.round((Math.random() * 100)) % length;
  return winningStatements[index];
}

function getLossingStatement() {
  let length = lossingStatements.length;
  let index = Math.round((Math.random() * 100)) % length;
  return lossingStatements[index];
}

function getTiedStatement() {
  let length = tiedStatements.length;
  let index = Math.round((Math.random() * 100)) % length;
  return tiedStatements[index];
}

export function computerComment(score) {
  if(score.wins === winningScore) {
    return lostStatement;
  }
  if(score.losses === winningScore) {
    return winStatement;
  }
  
  let randomNumber = Math.random();
  if(randomNumber >= 0.5) {
    if(score.wins > score.losses) {
      return getLossingStatement();
    }
    else if(score.wins < score.losses) {
      return getWinningStatement();
    }
    else return getTiedStatement();
  }
  return '';
}