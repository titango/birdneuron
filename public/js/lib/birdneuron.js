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
			this._bestpopulation = null;
		}
	}

	// Function to refresh active population to normal population
	refreshPopulation()
	{
		this._activePopulation = [];
		for(var i = 0; i < this._population.length; i++)
		{
			this._activePopulation.push(this.modelCopy(this._population[i]));
		}
	}

	// Function to return a new model with all retained attributes of the input model
	modelCopy(mod)
	{
	  var tempBrain = mod.brain;
      var returnObj = mod.copy();
      returnObj.score = 0;
      returnObj.fitness = 0;
      returnObj.outputs = function()
      {
        if(returnObj.inputs)
        {
          var outputs = returnObj.brain.predict(returnObj.inputs);
            return outputs;
        }
      }
      returnObj.brain = tempBrain.copy();
      returnObj.brain.mutate(function(x){
		if (Math.random(1) < 0.1) {
		  let offset = Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random()) * 0.5;
		  // let offset = birdP5.randomGaussian() * 0.5;
		  let newx = x + offset;
		  return newx;
		} else {
		  return x;
		}
	   });
      return returnObj;
	}

	// Next generation
	// presetFunc is used to reset all outside variables
	nextGeneration(preresetFunc)
	{
		console.log("next gen");
		if(preresetFunc)
		{
			preresetFunc();
		}

		this._normalizeFitness(this._population);

		var sortBirds = this._population.sort(function(a, b){
		    return b.fitness - a.fitness;
		});

		this._bestpopulation = [sortBirds[0]];
		this._activePopulation = this._generateNewPopulation(sortBirds);
		this._population = this._activePopulation.slice();
	}

	input(arrayObjects, useSavedData)
	{
		this._population = [];
		this._activePopulation = [];

		for(var i = 0; i < arrayObjects.length; i++)
		{
			let obj = arrayObjects[i];
			obj.score = 0;
			obj.fitness = 0;
			if(!useSavedData)
			{
				obj.brain = new NeuralNetwork(this._inputlayer,this._hiddenlayer, this._outputlayer);
			}
			obj.outputs = function()
			{
				if(obj.inputs)
				{
					var outputs = obj.brain.predict(obj.inputs);
				    return outputs;
				}
			}

			this._addToPopulation(arrayObjects[i]);	
		}
		this._activePopulation = this._population.slice();
	}

	// Export the whole population
	export()
	{
		var json = JSON.stringify(this._population);
		this._exportFunction(json);
	}

	// Export best previous generation
	exportBest()
	{
		var json = JSON.stringify(this._bestpopulation);
		this._exportFunction(json);
	}

	import(classParam)
	{
		this._importFunction(classParam);
	}

	//Data: As string json
	_exportFunction(data)
	{
	  //Using javascript
	  var a_element = document.createElement('a');
	  a_element.setAttribute("href", "data:" + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
	  a_element.setAttribute("download", "data.json");
	  a_element.click();
	  a_element = null;
	}

	_importFunction(classParam)
	{
	  var that = this;
	  var file_element = document.createElement('input');
	  file_element.setAttribute("type", "file");
	  file_element.addEventListener("change", function(){
	  	const fileList = this.files;

	  	var reader = new FileReader();
        reader.onload = function(){
	        var objArray = JSON.parse(JSON.parse(event.target.result));
	        console.log("objArray: ", objArray);

	        var tempArray = [];
	        for(var i = 0; i < objArray.length; i++)
	        {
	        	var b = new classParam();
	        	Object.assign(b, objArray[i]);
	        	var n = NeuralNetwork.deserialize(b.brain);
	        	b.brain = n;
	        	tempArray.push(b);
	        }

	        console.log(tempArray);
	        that.input(tempArray, true);
        };
        reader.readAsText(event.target.files[0]);

	  }, false);
	  file_element.click();
	  
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

	  // Make sure it's a copy!
	  // (this includes mutation)

	  var returnObj = this.modelCopy(objects[index]);
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
// From The Coding Train 
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


// From The Coding Train 
// Modified by Tan
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

// From The Coding Train
// Modified by Tan
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