// the animationID for the requestAnimationFrame
let animationID;

let istArray;

// First string to be injected
let sollString = "creative coding is a rising discipline, inspiring and connecting thousands of people worldwide. open source software tools lay the foundation for a new generation of artists and designers, using the internet to exchange, learn, teach, share, exhibit and connect, regardless of ethnicity, nationality, age, religion or gender. creative coding reveals completely new opportunities in many ways. and this is just the beginning of the story.";

let preparedString;


// These are the characters that are possible to display
var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.,:!ˉ';


/**
 * given cols and rows, create a grid of divs
 * 
 * @param {number} rows - the number of rows
 * @param {number} cols - the number of columns
 */
function createGrid(rows = 8, cols = 20) {
  const stage = document.getElementById('stage');
  stage.innerHTML = ''; // Clear any existing content

  for(let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('a');
    cell.textContent = 'ˉ';
    stage.appendChild(cell);
  }
}


/***
 * given a string, inject it into the grid
 *  
 * @param {string} sollString - the string to be injected
 */
function injectString(sollString) {

  let currentWord = 0;

  // Needed for linking the single words
  let singleWords;

  // The istArray represents all interim states of the grid
  let word = [];
  istArray = [];
  let countUp = 0;

  // The current index of the possible characters
  let possibleIndex = 0;

  // The current index of the grid
  


  /**
   * given the sollString, prepare it for the grid
   * 
   * @param {string} sollString - the string to be prepared
   */
  function prepareString(sollString) {
    preparedString = sollString.replace(/’|\s|[^\w\s.,_-–]|ˉ{2,}/g, 'ˉ').toUpperCase()
    singleWords = preparedString.replace(/[.,]/g, "").toLowerCase().split('ˉ')
  }

  function animateGrid(rows = 8, cols = 20) {

    // Assign the animation to a variable, so it can be stopped afterwards
    const stageElements = document.querySelectorAll("#stage a");
    let lastTime = 0;
    let fps = 50; // frames per second
    let interval = 1000 / fps;

    let currentIndex = 0;
    let targetIndex = 0;

    function theAnimation(timestamp) {

      // check if the time since the last frame is bigger than the interval (to control the speed of the animation)
      if(timestamp - lastTime >= interval) {
        lastTime = timestamp; // Update last frame time
        // If the end of the preparedString is not reached
        if(currentIndex < preparedString.length) {

            // If the end of the grid is reached, go back to the first position
          if(currentIndex >= cols * rows) {
            currentIndex = 0;
          }

          // If the letter is not the right one yet
          if(istArray[currentIndex] != preparedString[targetIndex]) {
            // rotate the letter one more step
            istArray[currentIndex] = possibleCharacters[possibleIndex];
            stageElements[currentIndex].innerHTML = istArray[currentIndex];
            possibleIndex++;
          } else {

            // If the letter is the right one
            // Add a title to the element, if it is part of a word
            if(preparedString[currentIndex] != 'ˉ' &&
              preparedString[currentIndex] != '.' &&
              preparedString[currentIndex] != ',') {
              stageElements[currentIndex].setAttribute("title", singleWords[currentWord]);
            }

            // Go to next letter
            possibleIndex = 0;
            currentIndex++;
            targetIndex++;

            // If the end of a word is reached
            if(preparedString[targetIndex] == 'ˉ') {
              currentWord++;
            }

          }

        }

      }
      animationID = window.requestAnimationFrame(theAnimation)
    };

    window.requestAnimationFrame(theAnimation)
  }

  prepareString(sollString)
  animateGrid()
}

// Create The Grid
createGrid(8, 20);

// Inject The String
injectString(sollString);



/**
 * clears the grid and stops the grid animation
 */
function clearGrid() {
  // Clear current animation
  window.cancelAnimationFrame(animationID)

  const anchors = document.querySelectorAll('#stage a')
  anchors.forEach(a => a.classList.remove('active'))

  let clearCount = 0;
  function clearingAnimation() {
    for(let i = 0; i < istArray.length + 1; i++) {
      const element = document.querySelector(`#stage a:nth-child(${i})`);
      if(element && element.innerHTML !== 'ˉ') {
        const randomLetter = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
        element.innerHTML = randomLetter;
      }
    }

    clearCount++;
    if(clearCount < 10) { // Run the clearing animation for 10 frames
      window.requestAnimationFrame(clearingAnimation)
    } else {
      anchors.forEach(a => {
        a.innerHTML = 'ˉ';
        a.classList.remove('active');
        a.removeAttribute('title');
      });
    }
  }

  window.requestAnimationFrame(clearingAnimation)
}


// Launch the API-loader, when a word is clicked
document.addEventListener("click", function(event) {
  const target = event.target;
  if(target.tagName === 'A' && target.getAttribute('title')) {
    clearGrid()
    loadAPI(target.title)
  }
})


// blue color on mouse hover
document.querySelectorAll("a").forEach(a => {
  a.addEventListener("mouseenter", function () {
    if(this.getAttribute('title')) {
      const titleStr = this.getAttribute("title");
      document.querySelectorAll(`a[title="${titleStr}"]`).forEach(a => a.classList.add('active'));
    }
  });

  a.addEventListener("mouseleave", function () {
    if(this.getAttribute('title')) {
      document.querySelectorAll("a").forEach(a => a.classList.remove('active'));
    }
  });
});

// Load stuff from the New York Times API
function loadAPI(keyword) {
  const errorMsg = 'Error. the new york times api is currently not available. Please try again later';
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=f93f51e506ce414e8c5ef8b9afa5fb6d&q=${keyword}`;

  fetch(url)
    .then(response => response.json())
    .then(result => {
      headline = result.response.docs[Math.floor(Math.random() * 10)].headline.main;
      // console.log(headline);
      injectString(headline);
    })
    .catch(err => {
      injectString(errorMsg);
    });
}
