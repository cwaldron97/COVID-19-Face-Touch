import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

async function startNow() {
  ReactDOM.render(
      <App started={true} touch={false} start={startNow} changeTouching={changeTouching}/>,
    document.getElementById('root')
  );
}

async function changeTouching(touch) {
  ReactDOM.render(
      <App started={true} touch={touch} start={startNow} changeTouching={changeTouching}/>,
    document.getElementById('root')
  );
}

ReactDOM.render(
    <App started={false} touch={false} start={startNow} changeTouching={changeTouching}/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
