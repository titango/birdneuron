/* Generic Algorithm */

function nextGeneration()
{
	calculateFitness();
	for(let i = 0; i < TOTAL; i++)
	{
		birds[i] = pickOne();
	}

	savedBirds = []; // Empty
}

function calculateFitness()
{
	let sum = 0;
	for(let bird of savedBirds)
	{
		sum += bird.score;
	}

	for(let bird of savedBirds)
	{
		bird.fitness = bird.score / sum;
	}
}

// function pickOne()
// {
// 	let bird = birdP5.random(savedBirds);
// 	let child = new Bird(bird.brain);
// 	child.mutate();
// 	return child;
// }

function pickOne(list, prob)
{
	var index = 0;
	var r = birdP5.random(1);

	while(r > 0)
	{
		r = r - savedBirds[index].fitness;
		index++;
	}
	index--;
	let bird = savedBirds[index];
	let child = new Bird(bird.brain);
	child.mutate();
	return child;
}