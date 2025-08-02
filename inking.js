//ink-blotting, with math; march, 2024.
//contributors: arjun, shobhan & vivek.

/** Optimising this
    1. Only store active pixels instead of looking for every pixel in each iteration
    2. Using a map instead of storing every pixel in a flat array (faster to retrieve & check if if it has ink)
    3. Instead of updating each pixel at a time one, update pixels in groups to reduce overhead
    4. Dont check neighbours unnecessarily. if a pixel has no ink to offload, we don't check its neighbors
 * 
 */

let paper = new Map()  // Store only active pixels
let activePixels = new Set() // Only process pixels that need updates


// let paper = [] // a virtual array where each element corresponds to one-pixel on the screen.
let all_neighbours = {} //an object that stores the neighbours for each index.

let og_seed = 100000
let min_seed = og_seed // minimum seed that has to be dropped.
let max_seed = og_seed*100 //maximum seed that can be dropped.
const capacity = 555 //there is a fixed capacity of 255 for each cell.
const rate = og_seed / 2 //rate at which ink is spread.

/**
 * sets up the surface, changes the pixel density of the display to zero, initialises the paper array and drops ink at positions. default p5 function.
 * @setup
 */
function setup() {
  createCanvas(400, 400)
  pixelDensity(1) // always treat one-pixel as one-pixel in higher density displays.
  loadPixels()

  for(let i = 0; i < width * height; i++) {
    all_neighbours[i] = get_neighbours(i)
  }

  drop_ink(int(random(width / 2)), int(random(height / 2)), int(random(min_seed, max_seed)))
  drop_ink(int(random(width / 2)), int(random(height / 2)), int(random(min_seed, max_seed)))
}

/**
 * drops ink on a position. drops ink on the paper and displays it on the screen.
 * @param {int} x — x coordinate of the ink.
 * @param {int} y — y coordinate of the ink.
 * @param {int} seed — amount of ink dropped.
 */
function drop_ink(x, y, seed) {
  let centerIndex = pos(x, y)
  paper.set(centerIndex, seed)
  activePixels.add(centerIndex)
  change_rgba(centerIndex, seed)
}

/**
 * draws on the screen, every frame (typically 60 frames / second). default p5 function.
 * loads pixels, performs the computation and updates the pixels.
 * @draw
 */
function draw() {
  let newActivePixels = new Set()

  activePixels.forEach(index => {
    if(paper.get(index) > capacity) {
      blot(index, newActivePixels)
    }
    change_rgba(index, paper.get(index) || 0)
  })

  activePixels = newActivePixels
  updatePixels()

  console.log(`${frameCount} and ${frameRate()}`)
}

/**
 * blotting function.
 * @param {int} index — the index of the paper array to perform the blotting on.
 * @param {Set} newActivePixels — a set of active pixels
 */
function blot(index, newActivePixels) {
  let ink = paper.get(index) || 0
  let offload_desired = ink - capacity
  let neighbours = all_neighbours[index]

  if(offload_desired > 0) {
    let raw_differences = neighbours.map(neighbour => 
      Math.max(0, (paper.get(index) || 0) - (paper.get(neighbour) || 0))
    )

    let total_demand = raw_differences.reduce((acc, curr) => acc + curr, 0)
    let ink_to_give = Math.min(total_demand, rate, offload_desired)

    for(let i = 0; i < neighbours.length; i++) {
      let neighborIndex = neighbours[i]

      // check if corner
      if((paper.get(index) || 0) > (paper.get(neighborIndex) || 0) + (paper.get(index) || 0) / 16) {
        paper.set(index, (paper.get(index) || 0) - 1)
        paper.set(neighborIndex, (paper.get(neighborIndex) || 0) + 1)
        newActivePixels.add(neighborIndex)
      }

      let to_give = ink_to_give * (raw_differences[i] / total_demand) * (i % 2 === 0 ? 0.54 : 0.97)
      paper.set(index, (paper.get(index) || 0) - to_give)
      paper.set(neighborIndex, (paper.get(neighborIndex) || 0) + to_give)
      newActivePixels.add(neighborIndex)
    }
  }
}

/**
 * finds neighbour-pixels for an index.
 * @helper
 * @param {index} index
 * @returns an array of neighbour-indices.
 */
function get_neighbours(index) {
  //returns an array of neighbour-indices.
  let neighbours = []

  //we calculate naighbours based on the x, y position and not the index (because the index is one-dimensional.
  //so, we convert the index to x, y coordinates again:
  let indexCoordinate = inversePos(index)
  let x = indexCoordinate[0]
  let y = indexCoordinate[1]

  //list all 8 neighbour-possibilities for a position:
  let potentialNeighbours = [
    [x - 1, y - 1],   [x, y - 1],   [x + 1, y - 1],
    [x - 1, y],       /* [x, y] */  [x + 1, y],
    [x - 1, y + 1],   [x, y + 1],   [x + 1, y + 1]
  ]

  for(let [nx, ny] of potentialNeighbours) {
    if(nx >= 0 && nx < width && ny >= 0 && ny < height) {
      neighbours.push(pos(nx, ny))
    }
  }
  return neighbours
}

/**
 * finds the index-number in the paper array for a position on the screen
 * @param {int} x — x-coordinate on the screen
 * @param {int} y — y-coordinate on the screen
 * @returns the index number in the paper array
 */
function pos(x, y) { return floor(x) + floor(y) * width }

/**
 * finds the x & y coordinate for an index-number in the paper array
 * @param {int} index — index-number from the paper array
 * @returns the x & y coordinate on the screen
 */
function inversePos(index) { return [floor(index % width), floor(index / width)] }

/**
 * changes rgba values in the p5.pixels array
 * @param {int} index — index-number from the paper array
 * @param {float} c — rgb value
 */
function change_rgba(index, c = 255) {
  c = constrain(c, 0, 255)
  let alpha = scaleNumber(c, [min_seed, max_seed], [0, 255])

  index *= 4
  // pixels[index + 0] = pixels[index + 1] = pixels[index + 2] = 255 - c
  pixels[index + 0] = pixels[index + 1] = pixels[index + 2] = alpha
  pixels[index + 3] = 255
}

/**
 * given a number to scale, which initally lies within a domain, scales it between the specified range
 * 
 * @param {int} num - the numer to scale
 * @param {arr} domain - the initial domain within which the number is between
 * @param {arr} range - the final range within which the number should be scaled
 * @returns the number scaled to the new range
 */
function scaleNumber(num, domain, range) {
  return range[0] + ((num - domain[0]) * (range[1] - range[0])) / (domain[1] - domain[0])
}
