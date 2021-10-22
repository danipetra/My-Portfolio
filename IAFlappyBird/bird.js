// Daniele Petracca, Vincenzo Ventrone
// Artficial Intelligence
// Flappy Bird

class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 64;
    this.r = 16;

    this.gravity = 1;//8
    this.lift = -20;//12
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 1);
    }

  }

  show() {
    strokeWeight(2);
    fill(255, 204, 0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2)
  }

  goUp() {
    this.velocity += this.lift;
  }

  mutate() {
    let mutationRate  = 0.1;//10
    this.brain.mutate(mutationRate);
  }

  think(pipes) {

    // Find the closest pipe
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = (pipes[i].x + pipes[i].w) - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }


    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10;

    let output = this.brain.predict(inputs);

    if (output[0] > 0.5) {
      this.goUp();
    }

  }

  offScreen() {
    return (this.y > height || this.y < 0);
  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    //this.velocity *= 0.9;
    this.y += this.velocity;
  }

}
