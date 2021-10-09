// ------------------------------ DECLARATION OF VARIABLES AND CONSTANTS ------------------------------ //


const sendButton = document.getElementById('sendButton')
const anotherQuestionBtn = document.getElementById('anotherQuestionBtn')
const respContent = document.getElementById('respContent')
const lastLine = document.querySelector('.intro-last-line')
let lastLineOn = true
let arrayProof = []

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

let dataFile = new XMLHttpRequest()
let dataArray = []

let totalPhrases = 0
let synchroNumber = 0


// ---------------------------------------- FUNCTIONS ---------------------------------------- //


// Activate and deactivate the blur effect
function blurry(){
    if(lastLineOn){
        let blur = document.getElementById('blur')
        blur.classList.toggle('active')
        let response = document.getElementById('response')
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
    // setTimeout(function reload(){
    //     location.reload()}, 700)
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
    
    
// Random function
function randomNumber(param){
    return Math.floor(Math.random() * param)
}
    
    
// XHR function
dataFile.open('GET', '../data/data.txt', true)
dataFile.addEventListener('load', function(){
    if(this.readyState == 4 && this.status == 200){
        dataArray = JSON.parse(dataFile.response)
        totalPhrases = dataArray.length
        console.log("totalPhrases is " + totalPhrases)
        synchroNumber = randomNumber(totalPhrases)
        
        console.log("SynchroNumber is :" + synchroNumber)
        console.log(dataArray[synchroNumber].phrase)
        
        respContent.innerHTML = dataArray[synchroNumber].phrase
    }
    else{
        console.log('XHR error')
}
})
dataFile.send()


// ---------------------------------------- EXECUTIONS ---------------------------------------- //


document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, newLineTime + 350)
})

