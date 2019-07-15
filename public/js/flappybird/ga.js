// Start the game over
function resetGame() {
  counter = 0;
  // Resetting best bird score to 0
  // if (bestBird) {
  //   bestBird.score = 0;
  // }
  pipes = [];
}

// Create the next generation
function nextGeneration() {
  console.log("next gen");
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(bn.population);

  //Sort by decending
  var sortBirds = bn.population.sort(function(a, b){
    return b.fitness - a.fitness;
  });
  
  // Generate a new set of birds
  bn.activePopulation = generate(sortBirds);
  // Copy those birds to another array
  bn.population = bn.activePopulation.slice();
}

// Generate a new population of birds
function generate(oldBirds) {
  let newBirds = [];

  console.log("old Birds:", oldBirds);
  for (let i = 0; i < oldBirds.length; i++) {
    // Select a bird based on fitness
    let bird = poolSelection(oldBirds);
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalize the fitness of all birds
function normalizeFitness(birds) {
  
  // Make score exponentially better?
  for (let i = 0; i < birds.length; i++) {
    birds[i].score = birdP5.pow(birds[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < birds.length; i++) {
    sum += birds[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < birds.length; i++) {
    birds[i].fitness = birds[i].score / sum;
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(birds) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = birdP5.random(1);
  // console.log("r: ", r);

  // Keep subtracting probabilities until you get less than zero.
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= birds[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;
  console.log("index: ", index);

  // Make sure it's a copy!
  // (this includes mutation)
  return birds[index].copy();
}