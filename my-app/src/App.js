import React from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
var firebase = require( 'firebase/app' );
require( 'firebase/database' );

function App(props) {
  let database;
  const URL = "https://teachablemachine.withgoogle.com/models/OZ_M6rQ1D/";

  let model, webcam, labelContainer, maxPredictions;

  // Load the image model and setup the webcam
  async function init() {
      var firebaseConfig = {
        apiKey: "AIzaSyA_orcl2ieR8tLwJkr8pI7Hnt80wdSaQgU",
        authDomain: "iot-face-project.firebaseapp.com",
        databaseURL: "https://iot-face-project.firebaseio.com",
        projectId: "iot-face-project",
        storageBucket: "iot-face-project.appspot.com",
        messagingSenderId: "139300741130",
        appId: "1:139300741130:web:d97547c8c762e9f85abff3",
        measurementId: "G-XLRDPJEPSX"
      };

      firebase.initializeApp(firebaseConfig);

      database = firebase.database();
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      // load the model and metadata
      // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
      // or files from your local hard drive
      // Note: the pose library adds "tmImage" object to your window (window.tmImage)
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      // Convenience function to setup a webcam
      const flip = true; // whether to flip the webcam
      webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
      await webcam.setup(); // request access to the webcam
      await webcam.play();
      window.requestAnimationFrame(loop);

      // append elements to the DOM
      document.getElementById("webcam-container").appendChild(webcam.canvas);
      labelContainer = document.getElementById("label-container");
      for (let i = 0; i < maxPredictions; i++) { // and class labels
          labelContainer.appendChild(document.createElement("div"));
      }
      await props.start();
  }

  async function loop() {
      webcam.update(); // update the webcam frame
      await predict();
      window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
      // predict can take in an image, video or canvas html element
      const prediction = await model.predict(webcam.canvas);

      if (prediction[0].probability >= [prediction[1].probability]) {
        await props.changeTouching(false);
        database.ref('/').set({
  				faceTouch: false
  			});
      } else {
        await props.changeTouching(true);
        database.ref('/').set({
  				faceTouch: true
  			});
      }

      for (let i = 0; i < maxPredictions; i++) {
          let name;
          if (prediction[i].className === 'Class 3') {
              name = 'Not Touching'
          } else {
              name = 'Touching Face'
          }
          const classPrediction =
              name + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;
      }
  }
// <header className={started ? (touch ? "App-header-red" : "App-header-green") : "App-header"}>
  return (
    <div className="App">
      <header className={props.started ? (props.touch ? "App-header-red" : "App-header-green") : "App-header"}>
        <div>Teachable Machine Image Model</div>
        {!props.started && <button type='button' onClick={init}>Start</button>}
        <div id="webcam-container"></div>
        <div id="label-container"></div>
        {props.started && <div>Total Face Touches: {props.count}</div>}
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
      </header>
    </div>
  );
}

export default App;
