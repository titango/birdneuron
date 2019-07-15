/* Contributed by Tan */

/* This class will act as neural network class to be used for neural network games */
class BirdNeuron
{
	constructor(jsonNeuron)
	{
		if(jsonNeuron)
		{
			// this._totalPopulation = jsonNeuron.totalPopulation;
			// this._inputlayer = jsonNeuron.inputlayer;
			// this._hiddenlayer = jsonNeuron.hiddenlayer;
			// this._outputlayer = jsonNeuron.outputlayer;
			// this._brain = jsonNeuron.brain;
			// this._population = jsonNeuron.population;
			// this._activePopulation = jsonNeuron.activePopulation ;
		}else //Default
		{
			this._totalPopulation = 10;
			this._inputlayer = 1;
			this._hiddenlayer = 1;
			this._outputlayer = 1;
			this._brain = null; // Neural network

			this._population = [];
			this._activePopulation = [];
		}
	}

	// Next generation
	// presetFunc is used to reset all outside variables
	nextGeneration(preresetFunc)
	{
		if(preresetFunc)
		{
			preresetFunc();
		}
		this._normalizeFitness(this._population);

		var sortBirds = this._population.sort(function(a, b){
		    return b.fitness - a.fitness;
		});

		this._activePopulation = this._generateNewPopulation(sortBirds);
		this._population = this.activePopulation.slice();

		// console.log("pop: ", this._population);
		// console.log("active: ", this._activePopulation);
	}

	input(arrayObjects)
	{
		for(var i = 0; i < arrayObjects.length; i++)
		{
			let obj = arrayObjects[i];
			obj.brain = new NeuralNetwork(this._inputlayer,this._hiddenlayer, this._outputlayer);
			obj.action = function()
			{
				if(obj.inputs)
				{
					let outputs = obj.brain.predict(obj.inputs);
					  // console.log("outputs: ", outputs);
				      // if(output[0] > output[1] && this.velocity >= )
				      if(outputs[1] > outputs[0])
				      {
				        obj.up();
				      }
				}
				
			}
			this._addToPopulation(arrayObjects[i]);
			this._addToActivePopulation(arrayObjects[i]);
		}
	}

	output()
	{

	}

	_addToPopulation(object)
	{
		this._population.push(object);
	}

	_addToActivePopulation(object)
	{
		this._activePopulation.push(object);
	}

	_reset()
	{
		console.log("abc");
	}

	_normalizeFitness(objects)
	{

	  // Make score exponentially better?
	  for (let i = 0; i < objects.length; i++) {
	    objects[i].score = Math.pow(objects[i].score, 2);
	  }

	  // Add up all the scores
	  let sum = 0;
	  for (let i = 0; i < objects.length; i++) {
	    sum += objects[i].score;
	  }
	  // Divide by the sum
	  for (let i = 0; i < objects.length; i++) {
	    objects[i].fitness = objects[i].score / sum;
	  }

	}

	_generateNewPopulation(oldObjectArray)
	{
	  let newBirds = [];
	  for (let i = 0; i < oldObjectArray.length; i++) {
	    // Select a bird based on fitness
	    let bird = this._poolSelection(oldObjectArray);
	    newBirds[i] = bird;
	  }
	  return newBirds;
	}

	_poolSelection(objects)
	{
	  // Start at 0
	  let index = 0;

	  // Pick a random number between 0 and 1
	  let r = Math.random(1);

	  // Keep subtracting probabilities until you get less than zero.
	  // Higher probabilities will be more likely to be fixed since they will
	  // subtract a larger number towards zero
	  while (r > 0) {
	    r -= objects[index].fitness;
	    // And move on to the next
	    index += 1;
	  }

	  // Go back one
	  index -= 1;
	  // console.log("objects[index]: ", objects[index]);

	  // Make sure it's a copy!
	  // (this includes mutation)
	  // console.log("objects[index]: ", objects[index]);
	  var tempBrain = objects[index].brain;
	  let returnObj = objects[index].copy();
	  // let returnObj = objects[index].copy();
	  // console.log("return obj: ", returnObj);
	  returnObj.action = function()
			{
				if(returnObj.inputs)
				{
					let outputs = returnObj.brain.predict(returnObj.inputs);
					  // console.log("outputs: ", outputs);
				      // if(output[0] > output[1] && this.velocity >= )
				      if(outputs[1] > outputs[0])
				      {
				        returnObj.up();
				      }
				}
				
			}
	  returnObj.brain = tempBrain.copy();
	  returnObj.brain.mutate(function(x){
		if (Math.random(1) < 0.1) {
		  let offset = Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random()) * 0.5;
		  // let offsetold = birdP5.randomGaussian() * 0.5;
		  let newx = x + offset;
		  return newx;
		} else {
		  return x;
		}
	   });
	  return returnObj;
	}


	set inputlayer(num)
	{
		this._inputlayer = num;
	}

	set hiddenLayer(num)
	{
		this._hiddenlayer = num;
	}

	set outputlayer(num)
	{
		this._outputlayer = num;
	}

	set totalPopulation(num)
	{
		this._totalPopulation = num;
	}

	get totalPopulation()
	{
		return this._totalPopulation;
	}


	set population(num)
	{
		this._population = num;
	}

	get population()
	{
		return this._population;
	}

	set activePopulation(num)
	{
		this._activePopulation = num;
	}

	get activePopulation()
	{
		return this._activePopulation;
	}
}

// Other techniques for learning

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

// let tanh = new ActivationFunction(
//   x => Math.tanh(x),
//   y => 1 - (y * y)
// );


class NeuralNetwork {
  /*
  * if first argument is a NeuralNetwork the constructor clones it
  * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
  */
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
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
      this.output_nodes = out_nodes;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();

  }

  predict(input_array) {

    // console.log("input_array: ", input_array);

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);

    hidden.add(this.bias_h);

    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);

    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  // train(input_array, target_array) {
  //   // Generating the Hidden Outputs
  //   let inputs = Matrix.fromArray(input_array);
  //   let hidden = Matrix.multiply(this.weights_ih, inputs);
  //   hidden.add(this.bias_h);
  //   // activation function!
  //   hidden.map(this.activation_function.func);

  //   // Generating the output's output!
  //   let outputs = Matrix.multiply(this.weights_ho, hidden);
  //   outputs.add(this.bias_o);
  //   outputs.map(this.activation_function.func);

  //   // Convert array to matrix object
  //   let targets = Matrix.fromArray(target_array);

  //   // Calculate the error
  //   // ERROR = TARGETS - OUTPUTS
  //   let output_errors = Matrix.subtract(targets, outputs);

  //   // let gradient = outputs * (1 - outputs);
  //   // Calculate gradient
  //   let gradients = Matrix.map(outputs, this.activation_function.dfunc);
  //   gradients.multiply(output_errors);
  //   gradients.multiply(this.learning_rate);


  //   // Calculate deltas
  //   let hidden_T = Matrix.transpose(hidden);
  //   let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

  //   // Adjust the weights by deltas
  //   this.weights_ho.add(weight_ho_deltas);
  //   // Adjust the bias by its deltas (which is just the gradients)
  //   this.bias_o.add(gradients);

  //   // Calculate the hidden layer errors
  //   let who_t = Matrix.transpose(this.weights_ho);
  //   let hidden_errors = Matrix.multiply(who_t, output_errors);

  //   // Calculate hidden gradient
  //   let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
  //   hidden_gradient.multiply(hidden_errors);
  //   hidden_gradient.multiply(this.learning_rate);

  //   // Calcuate input->hidden deltas
  //   let inputs_T = Matrix.transpose(inputs);
  //   let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

  //   this.weights_ih.add(weight_ih_deltas);
  //   // Adjust the bias by its deltas (which is just the gradients)
  //   this.bias_h.add(hidden_gradient);

  //   // outputs.print();
  //   // targets.print();
  //   // error.print();
  // }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }



}

class Matrix {

  //Constructor create rows and cols like 2D array
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  // Copy the whole matrix
  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  // Create new matrix from an array
  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}


if (typeof module !== 'undefined') {
  module.exports = BirdNeuron;
}