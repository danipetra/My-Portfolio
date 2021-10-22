// Daniele Petracca, Vincenzo Ventrone
// Artficial Intelligence
// Flappy Bird


class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

class NeuralNetwork {
  constructor(a, b, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }


    this.setActivationFunction();

  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }
  
  copy() {
    return new NeuralNetwork(this);
  }


  mutate(rate) {

    this.weights_ih.map(mutateValues);
    this.weights_ho.map(mutateValues);
    this.bias_h.map(mutateValues);
    this.bias_o.map(mutateValues);

    function mutateValues(val) {
      //10% for the child to have a mutation

      if (Math.random()< rate) {//(Math.random() *100) < rate(rate=10)

        // mutation for a maximum of the 1% of the starting value
        return val + randomGaussian(0, 0.1);

      } else {
        return val;
      }
    }

  }



}
