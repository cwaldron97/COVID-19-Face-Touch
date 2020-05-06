import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let count = 0;
let canIncrement = true;

async function startNow() {
  ReactDOM.render(
      <App started={true} touch={false} start={startNow} changeTouching={changeTouching} count={count}/>,
    document.getElementById('root')
  );
}

async function changeTouching(touch) {
  if (touch && canIncrement) {
    count += 1;
    canIncrement = false;
    setTimeout(() => {canIncrement = true;}, 5000);
  }
  ReactDOM.render(
      <App started={true} touch={touch} start={startNow} changeTouching={changeTouching} count={count}/>,
    document.getElementById('root')
  );
}

ReactDOM.render(
    <App started={false} touch={false} start={startNow} changeTouching={changeTouching} count={count}/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
