import React from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
var firebase = require( 'firebase/app' );
require( 'firebase/database' );

function App() {
  const URL = "https://teachablemachine.withgoogle.com/models/OZ_M6rQ1D/";

  var firebaseConfig = {
   	  apiKey: "AIzaSyCegWkV7pueZRWQVrC1emc3TDkzOOywlrA",
  	  authDomain: "iot-lab-3-ab9cc.firebaseapp.com",
  	  databaseURL: "https://iot-lab-3-ab9cc.firebaseio.com",
  	  projectId: "iot-lab-3-ab9cc",
  	  storageBucket: "iot-lab-3-ab9cc.appspot.com",
  	  messagingSenderId: "637909053221",
  	  appId: "1:637909053221:web:136e4346f3b8c9fa6ff4cc"
  };

  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  let model, webcam, labelContainer, maxPredictions;

  // Load the image model and setup the webcam
  async function init() {
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
        database.ref('/').set({
  				faceTouch: false
  			});
      } else {
        database.ref('/').set({
  				faceTouch: true
  			});
      }

      for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
              prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;
      }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Teachable Machine Image Model</div>
        <button type='button' onClick={init}>Start</button>
        <div id="webcam-container"></div>
        <div id="label-container"></div>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
      </header>
    </div>
  );
}

export default App;
