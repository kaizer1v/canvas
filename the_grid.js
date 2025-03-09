let animationID, istArray, preparedString
// First string to be injected
let sollString = "open source software tools lay the foundation for a new generation of artists and designers, using the internet to exchange, learn, teach, share, exhibit and connect, regardless of ethnicity, nationality, age, religion or gender. creative coding reveals completely new opportunities in many ways. and this is just the beginning of the story.";
const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.,:!ˉ';
// ---- on load ----
createGrid(8, 20)
insertTextToGrid(sollString)

/**
 * given cols and rows, create a grid of divs
 * 
 * @param {number} rows - the number of rows
 * @param {number} cols - the number of columns
 */
function createGrid(rows = 8, cols = 20) {
  const stage = document.getElementById('stage')
  stage.innerHTML = ''

  for(let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('a')
    cell.textContent = 'ˉ'
    stage.appendChild(cell)
  }
}


/**
 * given the sollString, prepare it for the grid
 * 
 * @param {string} str - the string to be prepared
 * @returns {object} - the prepared string and the single words
 */
function prepareString(str) {
  preparedString = str.replace(/’|\s|[^\w\s.,_-–]|ˉ{2,}/g, 'ˉ').toUpperCase()
  singleWords = preparedString.replace(/[.,]/g, '').toLowerCase().split('ˉ')

  return {
    'prep_str': preparedString,
    'words': singleWords
  }
}

/**
   * given the rows and cols, animate the grid with the prepared string
   * 
   * @param {int} rows - the number of rows
   * @param {int} cols - the number of columns
   */
function animateGrid(preparedString, singleWords, rows = 8, cols = 20) {
  // Assign the animation to a variable, so it can be stopped afterwards
  const stageElements = document.querySelectorAll("#stage a");
  let lastTime = 0;
  let fps = 50; // frames per second
  let interval = 1000 / fps;

  let possibleIndex = 0;
  let currentWord = 0;
  let currentIndex = 0;
  let targetIndex = 0;
  // The istArray represents all interim states of the grid
  istArray = [];

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

/**
 * clears the grid and stops the grid animation
 * 
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

function insertTextToGrid(txt) {
  const {prep_str, words} = prepareString(txt)
  animateGrid(prep_str, words)
}

document.addEventListener('click', (event) => {
  const target = event.target
  if(target.tagName === 'A' && target.getAttribute('title')) {
    clearGrid()
    loadAPI(target.title)
  }
})

document.querySelectorAll('a').forEach(a => {
  a.addEventListener('mouseenter', (event) => {
    const target = event.target
    if(target.getAttribute('title')) {
      const titleStr = target.getAttribute('title')
      document.querySelectorAll(`a[title='${titleStr}']`).forEach(a => a.classList.add('active'))
    }
  })

  a.addEventListener('mouseleave', (event) => {
    const target = event.target
    if(target.getAttribute('title')) {
      document.querySelectorAll('a').forEach(a => a.classList.remove('active'))
    }
  })

})

// Load stuff from the New York Times API
function loadAPI(keyword) {
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=f93f51e506ce414e8c5ef8b9afa5fb6d&q=${keyword}`

  fetch(url)
    .then(response => response.json())
    .then(result => {
      headline = result.response.docs[Math.floor(Math.random() * 10)].headline.main

      insertTextToGrid(headline)
    })
    .catch((err) => {
      const errorMsg = 'Error. the new york times api is currently not available. Please try again later';
      insertTextToGrid(errorMsg)
    })
}
