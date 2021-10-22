// Daniele Petracca, Vincenzo Ventrone
// Artficial Intelligence
// Flappy Bird

function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = selectionPool();
  }
  savedBirds = [];
}

function selectionPool() {
  let index = 0;
  let r = random(1);
  //this allows to select the birds for every position of the next generation birds Array
  //with r gives more chances to the best birds(highest fitness) to be selected (round-wheel selection)
  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  //returns in the position
  index--;
  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  //mutation of the selected bird
  child.mutate();
  return child;
}

function calculateFitness() {
  //sum is used to normalize the score
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.score;
  }
  //operation to normalize the birds score
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}
