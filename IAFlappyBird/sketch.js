// Daniele Petracca, Vincenzo Ventrone
// Artficial Intelligence
// Flappy Bird

const TOTAL = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let HighestScore = 0;
let GenerationCounter = 0;

//interface elements
let SpeedSlider;
let highScoreSpan;
let allTimeHighScoreSpan;
let GenerationSpan;

//saving to json for testing
function keyPressed() {
  if (key === 'S') {
    let bird = birds[0];
    saveJSON(bird.brain, 'bird.json');
  }
}

function setup() {
  let canvas =  createCanvas(640, 480);
  canvas.parent('canvascontainer');


  highScoreSpan = select('#hs');
  speedSpan = select('#speed');
  allTimeHighScoreSpan = select('#ahs');
  SpeedSlider = select('#speedSlider');
  //slider = createSlider(1, 10, 1);
  GenerationSpan  = select('#gen');

  //generation of the first population of birds
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  //updating game elements at the speed slider value
  for (let n = 0; n < SpeedSlider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
//updates all the pipes in the canvas
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
//checks if the birds hit the pipes
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          //delete the birds that collide with the pipes and
          //put the deleted birds in the savedBirds Array
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }
      //deletes the pipes that go offscreen
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
      //deletes the birds that go offscreen and
      //put the deleted birds in the savedBirds Array
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }
    //update every bird
    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    let tempHighestScore = 0;
    for (let i = 0; i < birds.length; i++) {
      let s = birds[i].score;
      if (s > tempHighestScore) {
        tempHighestScore = s;
      }
    }

    if (tempHighestScore > HighestScore) {
      HighestScore = tempHighestScore;
    }


  highScoreSpan.html(tempHighestScore);
  allTimeHighScoreSpan.html(HighestScore);
  GenerationSpan.html(GenerationCounter);
    //If all the birds of the generation die it will create a new generation
    if (birds.length === 0) {
      counter = 0;
      nextGeneration();
      GenerationCounter++;
      pipes = [];
    }
  }
//--------------------Drawing elements------------------------------------------
  // background Drawing
  background(184, 233, 250);
  // Birds Drawing
  for (let bird of birds) {
    bird.show();
  }
  //Pipes drawing
  for (let pipe of pipes) {
    pipe.show();
  }

}
