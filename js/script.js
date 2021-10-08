// -------------------- DECLARATION OF VARIABLES AND CONSTANTS -------------------- //

let sendButton = document.getElementById('sendButton')
let anotherQuestionBtn = document.getElementById('anotherQuestionBtn')

const lastLineArray = [
                    "enjoy Jung's synchronicity",
                    "reveals \"the hidden law of a probable outcome\"",
                    "see whats random's magic offers",
                    "plays \"the sacred geommetry of chance\"",
                    "choose yourself the meaning of it"
                    ]

const typingTime = 80
const deleteTime = 50
const newLineTime = 3000
let linesIndex = 0
let charIndex = 0

const lastLine = document.querySelector('.intro-last-line')


// -------------------- FUNCTIONS -------------------- //

// Activate and deactivate the blur effect
function blurry(){
    var blur = document.getElementById('blur')
    blur.classList.toggle('active')
    var response = document.getElementById('response')
    response.classList.toggle('active')
}

sendButton.addEventListener('click', () => {
    blurry()
})

anotherQuestionBtn.addEventListener('click', () => {
    blurry()
})

// Typing function
function machineType(){
    if(charIndex < lastLineArray[linesIndex].length){
        lastLine.textContent += lastLineArray[linesIndex].charAt(charIndex)
        charIndex++
        setTimeout(machineType, typingTime)
    }
    else{
        setTimeout(deleteLines, newLineTime)
    }
}

// Delete function
function deleteLines(){
    if(charIndex > 0){
        lastLine.textContent = lastLineArray[linesIndex].substring(0, charIndex - 1)
        charIndex--
        setTimeout(deleteLines, deleteTime)
    }
    else{
        linesIndex++
        if(linesIndex >= lastLineArray.length){
            linesIndex = 0
        }
        setTimeout(machineType, typingTime + 1100)
    }
}

// -------------------- EXECUTION -------------------- //

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, newLineTime + 350)
})      