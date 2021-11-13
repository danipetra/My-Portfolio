let lr_slider;
let nn;

/* Definiamo un training set con i dati relativi all'applicazione della disgiunzione esclusiva XOR.
   Lo XOR è un operatore logico che restituisce VERO solo se gli ingressi sono diversi tra di loro. */
let trainingSet=[
{
  inputs:[0,0],
  outputs:[0]
},
{
  inputs:[0,1],
  outputs:[1]
},
{
  inputs:[1,0],
  outputs:[1]
},
{
  inputs:[1,1],
  outputs:[0]
}
];


function setup() {
  /* Definizione degli elementi costituenti il comparo grafico e la rete neurale che si andrà ad utilizzare.
     La rete neurale è costituita da un livello di input, uno di hidden e uno di output.
     Il numero di neuroni scelto è necessario alla risoluzione del problema dello XOR */
  createCanvas(400,400);
  nn  = new NeuralNetwork(2,2,1);
  lr_slider = createSlider(0.01,0.5,0.1,0.01);

}

function draw() {
 /* Mostriamo graficamente i risultati. */
  background(0);
  for(let i=0;i<1000;i++){
    let data=random(trainingSet); // Assegniamo il training set
    nn.train(data.inputs,data.outputs); /*  Prendiamo in input i dati del training set, quindi richiamiamo
                                            la funzione di addestramento della rete */
  }

  nn.setLearningRate(lr_slider.value()); //  Assegnamo al learning rate il valore preso in input dallo slider

  /* Disegnamo la griglia di verifica che mostrerà le previsioni della rete neurale per ogni possibile valore
  assunto dai due valori di input che variano da 0 a 1 */
  let resolution = 10;
  //creiamo 40 colonne e 40 righe
  let cols = width/resolution;
  let rows = height/resolution;

  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      let x1=   i/cols;
      let x2 =  j/rows;
      let inputs=[x1,x2];
      let y = nn.predict(inputs); /* Avviamo la funzione di predizione della libreria nn.js
                                     La funzione predict prende in input i possibili valori
                                     e si comporta come formalizzato dal modello matematico
                                     di McCulloch e Pitts */
      fill(y*255); /* Coloriamo ogni casella della griglia creata precedentemente con un colore
                      della scala di grigio dove, il bianco rappresenta valori di output vicini
                      1 e il nero rappresenta valori vicini a 0*/
      rect(i*resolution,j*resolution,resolution,resolution);
    }
  }
}
