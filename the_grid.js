let animationID, preparedString
// let sollString = "open source software tools lay the foundation for a new generation of artists and designers, using the internet to exchange, learn, teach, share, exhibit and connect, regardless of ethnicity, nationality, age, religion or gender. creative coding reveals completely new opportunities in many ways. and this is just the beginning of the story."
const quotes = [
  'Creators need an immediate connection to what they create',
  'Minimum viable planet',
  'The two golden rules of information design: Show the data. Show comparisons.',
  'It can take time to find a principle because finding a principle is essentially a form of self-discovery'
]
let sollString = quotes[Math.floor(Math.random() * quotes.length)]
const possibleCharacters = '.,:!ˉ-_ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890'
const placeholderChar = '_'

// ---- on load ----
const stage = createGrid(8, 20)
insertTextToGrid(sollString, stage)

/**
 * given cols and rows, create a grid of divs
 * 
 * @param {number} rows - the number of rows
 * @param {number} cols - the number of columns
 * @returns {htmlDOM} - the grid stage (set of <a> elements)
 */
function createGrid(rows, cols) {
  const stage = document.getElementById('stage')
  stage.innerHTML = ''

  for(let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('a')
    cell.textContent = placeholderChar
    stage.appendChild(cell)
  }

  return stage
}

/**
 * given text and the grid stage, insert the text into the grid
 * 
 * @param {str} txt - the text to insert on the grid
 * @param {htmlDOM} stage - the grid stage (set of <a> elements)
 */
function insertTextToGrid(txt, stage) {
  // prepare the text for the grid. This will remove all special characters and replace them with 'ˉ'
  const {prep_str, words} = prepareString(txt)
  animateGrid(prep_str, words, stage)
}


/**
 * given the sollString, prepare it for the grid
 * 
 * @param {string} str - the string to be prepared
 * @returns {object} - the prepared string and the single words
 */
function prepareString(str) {
  preparedString = str.replace(/’|\s|[^\w\s.,_]|ˉ{2,}/g, placeholderChar).toUpperCase()
  singleWords = preparedString.replace(/[.,]/g, '').toLowerCase().split(placeholderChar)

  return {
    'prep_str': preparedString,
    'words': singleWords
  }
}

/**
 * given the rows and cols, animate the grid with the prepared string
 * 
 * @param {htmlDOM} stage - the stage HTML object
 */
function animateGrid(preparedString, singleWords, stage) {

  // Assign the animation to a variable, so it can be stopped afterwards
  const stageElements = stage.childNodes
  const stageSize = stageElements.length

  let lastTime = 0
  let fps = 50 // frames per second
  let interval = 1000 / fps

  let possibleIndex = 0
  let currentIndex = 0
  let targetIndex = 0

  function theAnimation(timestamp) {
    // check if the time since the last frame is bigger than the interval (to control the speed of the animation)
    if(timestamp - lastTime >= interval) {
      lastTime = timestamp // Update last frame time

      // If the end of the string (last char) is reached, stop the animation
      if(currentIndex > preparedString.length - 1) {
        window.cancelAnimationFrame(animationID)
        return
      }

      // If the end of the grid is reached, go back to the first position
      if(currentIndex >= stageSize) { currentIndex = 0 }

      if(preparedString[targetIndex] == possibleCharacters[possibleIndex]) {
        // display matched char on the grid
        stageElements[currentIndex].innerHTML = preparedString[targetIndex]
        currentIndex++
        targetIndex++
        possibleIndex = 0
      } else {
        // display next possible char on the grid
        stageElements[currentIndex].innerHTML = possibleCharacters[possibleIndex]
        possibleIndex++
      }
    }
    animationID = window.requestAnimationFrame(theAnimation)
  }

  window.requestAnimationFrame(theAnimation)
}

/**
 * clears the grid and stops the grid animation
 * 
 */
function clearGrid(stage) {
  // Clear current animation
  window.cancelAnimationFrame(animationID)

  // const anchors = document.querySelectorAll('#stage a')
  const anchors = stage.childNodes
  const speed = 50 // fps

  anchors.forEach(a => a.classList.remove('active'))
  let clearCount = 0
  
  function clearingAnimation() {
    for(let i = 0; i < anchors.length + 1; i++) {
      const element = anchors[i]
      
      if(element && element.innerHTML !== placeholderChar) {
        const randomLetter = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)]
        element.innerHTML = randomLetter
      }
    }

    clearCount++
    if(clearCount < speed) {
      window.requestAnimationFrame(clearingAnimation)
    } else {
      anchors.forEach(a => {
        a.innerHTML = placeholderChar
        // a.classList.remove('active')
        // a.removeAttribute('title')
      })
    }
  }

  window.requestAnimationFrame(clearingAnimation)
}




document.addEventListener('click', (event) => {
  const target = event.target
  // if(target.tagName === 'A' && target.getAttribute('title')) {
  if(target.tagName === 'A') {
    clearGrid(stage)
    // load another text
    insertTextToGrid(quotes[Math.floor(Math.random() * quotes.length)], stage)
    // loadAPI(target.title)
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
