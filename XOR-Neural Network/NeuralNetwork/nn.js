
class ActivationFunction {
  //funzione di inizializzazione delle funzioni di attivazione
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  /*implementazione della funzione di attivazione sigmoidale introdotta precedentemente,
  che verrà utilizzata nella fase di elaborazione del neutrone*/
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  /*implementazione della funzione tangente, che verrà utilizzata nella fase di training della rete*/
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
/*implementazine della rete neurale, che viene rappresentata come un insieme di vettori e di matrici*/
  constructor(in_nodes, hid_nodes, out_nodes) {
    if (in_nodes instanceof NeuralNetwork) {
      let a = in_nodes;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      //definizione del numero di nodi che compongono la rete
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
      this.output_nodes = out_nodes;
      /*creazione di due matrici, che rappresentano rispettivamente i pesi tra nodi di input e nodi hidden
      e i pesi tra nodi hidden e nodi di output*/
      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      /*assegnazione di valori casuali ai pesi*/
      this.weights_ih.randomize();
      this.weights_ho.randomize();
      /*creazione di due matrici, che rappresentano rispettivamente i i bias dei nodi hidden e quelli dei
      nodi di output*/
      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      /*assegnazione di valori casuali ai bias*/
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    //Creazione del learning rate della rete e della funzione di attivazione
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {
//FASE DI FORWARD PROPAGATION
    // Generazione degli output dei nodi hidden
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    //aggiunta del numero di bias
    hidden.add(this.bias_h);
    //applicazione della Funzione di attivazione agli elementi della matrice
    hidden.map(this.activation_function.func);

    // Generazione degli output dei nodi di output
    let output = Matrix.multiply(this.weights_ho, hidden);
    //aggiunta del numero di bias
    output.add(this.bias_o);
    //applicazione della Funzione di attivazione agli elementi della matrice
    output.map(this.activation_function.func);

    //da in output le predizioni della rete in un vettore
    return output.toArray();
  }

//funzione per impostare il valore del learning rate
  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }
//funzione per impostare la funzione di attivazione
  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    /*generazione delle predizioni attraverso la fase di forward propagation, in modo
    analogo alla funzione predict*/
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);

    hidden.map(this.activation_function.func);


    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.func);

    // conversione del vettore in una matrice
    let targets = Matrix.fromArray(target_array);

    // CALCOLO DELL'ERRORE PER I NODI DI OUTPUT
    let output_errors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calcolo del gradiente per diminuire l'errore
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    //moltiplicazione del gradiente agli errori di output e successivamente al learning rate
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);


    // Calcolo dei valori delta per la modifica di pesi e bias
    //trasposta degli output dei nodi hidden
    let hidden_T = Matrix.transpose(hidden);
    //Calcolo dei delta per i pesi tra nodi di output e quelli hidden
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // modifica dei pesi tra nodi hidden e di output con i valori delta calcolati
    this.weights_ho.add(weight_ho_deltas);
    // modifica dei bias dei nodi di output con i valori delta calcolati
    this.bias_o.add(gradients);

    // CALCOLO DELL'ERRORE PER I NODI HIDDEN
    //trasposta della matrice dei pesi tra nodi hidden e di output
    let who_t = Matrix.transpose(this.weights_ho);
    //Calcolo degli errori dei nodi hidden
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calcolo del gradiente per i nodi hidden
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcolo dei delta con cui modificare i pesi tra nodi di input e nodi hidden
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
    //modifica dei pesi tra nodi di input e nodi hidden
    this.weights_ih.add(weight_ih_deltas);
    // modifica dei bias dei nodi hidden
    this.bias_h.add(hidden_gradient);

  }

}
