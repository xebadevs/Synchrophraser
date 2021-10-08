// -------------------- DECLARATION OF VARIABLES AND CONSTANTS -------------------- //


const sendButton = document.getElementById('sendButton')
const anotherQuestionBtn = document.getElementById('anotherQuestionBtn')
let lastLineOn = true

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

let dataFile = new XMLHttpRequest()
let dataArray = []


// -------------------- FUNCTIONS -------------------- //


// Activate and deactivate the blur effect
function blurry(){
    if(lastLineOn){
        var blur = document.getElementById('blur')
        blur.classList.toggle('active')
        var response = document.getElementById('response')
        response.classList.toggle('active')
        lastLineOn = false
    }
    else{
        lastLineOn = true
    }
}

sendButton.addEventListener('click', () => {
    blurry()
})

// Aclaration: the function 'blurry()' executes tree times because with only one demands double click,
// and with one repetition the program fails
anotherQuestionBtn.addEventListener('click', () => {
    let input = document.getElementById('question-input')
    input.focus()
    input.value = '?'
    input.setSelectionRange(0, 0)
    blurry()
    blurry()
    blurry()
})

// Typing function
function machineType(){
    if(charIndex < lastLineArray[linesIndex].length && lastLineOn){
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

// XHR function
dataFile.open('GET', '../data/data.txt')
dataFile.addEventListener('load', function(){
    if(dataFile.status == 200){
        dataArray = dataFile.response
        console.log(dataArray)
    }
})
dataFile.send()


// -------------------- EXECUTION -------------------- //


document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, newLineTime + 350)
})      