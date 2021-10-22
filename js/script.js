// ------------------------------ DECLARATION OF VARIABLES AND CONSTANTS ------------------------------ //


const sendButton = document.getElementById('sendButton')
const anotherQuestionBtn = document.getElementById('anotherQuestionBtn')
const respContent = document.getElementById('respContent')
const lastLine = document.querySelector('.intro-last-line')
const userQuestion = document.getElementById('question-input')
const respQuestion = document.getElementById('resp-question')
const respContainer = document.getElementById('response')
const copyToClipboardBtn = document.getElementById('resp-copy')
const addToFavoritesBtn = document.getElementById('resp-favs')
const respIcon = document.getElementById('resp-icon')
const respPhotoCont = document.getElementById('resp-photo-cont')
const navFavs = document.getElementById('nav-favs')
const contFavs = document.getElementById('cont-favs')
const favsP = document.getElementById('favs-p')
const favsBackBtn = document.getElementById('favs-back-btn')

let lastLineOn = true
let userQuestionValue = document.getElementById('resp-question').value

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
let profilePhoto = new Image()

let totalPhrases = 0
let synchroNumber = 0
let currentPhrase = ''
let currentPhoto = ''
let currentAuthor = ''
let localStAuthors = []
let localStPhrases = []


const favTemplate = (author, phrase) => {
    return(`
        <b>${author}</b> ` + ` - ` + `${phrase}` + `.
    `)
}



// ---------------------------------------- FUNCTIONS ---------------------------------------- //

// Another question button or Return button
anotherQuestionBtn.addEventListener('keyup', e => {
    if(e.code === 'Enter'){
        console.log(e)
        anotherQuestionBtn.click()
    }
})


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


// Blur from My favourites
function favsBlurry(){
    let blur = document.getElementById('blur')
    blur.classList.toggle('active')
    contFavs.classList.toggle('active')
    sendButton.disabled = true
    userQuestion.disabled = true

    localStAuthors = JSON.parse(localStorage.getItem('localStAuthors'))
    localStPhrases = JSON.parse(localStorage.getItem('localStPhrases'))

    for(let i=0; i < localStAuthors.length; i++){
        const favPhrase = document.createElement('p')
        favPhrase.classList.add('favs-p')
        favPhrase.innerHTML = favTemplate(localStAuthors[i], localStPhrases[i])
        favsP.appendChild(favPhrase)
        console.log(favPhrase)
    }
}

function favsBlurryBack(){
    let blur = document.getElementById('blur')
    blur.classList.toggle('active')
    contFavs.classList.toggle('active')
    let input = document.getElementById('question-input')
    input.focus()
    input.value = '?'
    input.setSelectionRange(0, 0)
    sendButton.disabled = false
    userQuestion.disabled = false
}


// Add author and phrase to My favourites function
function addPhrase(){
    // const favPhrase = document.createElement('p')
    // favPhrase.classList.add('favs-p')
    // favPhrase.innerHTML = favTemplate(currentAuthor, currentPhrase)
    // favsP.appendChild(favPhrase)
    localStAuthors.push(currentAuthor)
    localStorage.setItem('localStAuthors', JSON.stringify(localStAuthors))
    localStPhrases.push(currentPhrase)
    localStorage.setItem('localStPhrases', JSON.stringify(localStPhrases))
}


// My favourites Listener
navFavs.addEventListener('click', favsBlurry)


// My favourites Back Listener
favsBackBtn.addEventListener('click', favsBlurryBack)


// Send button listener
sendButton.addEventListener('click', () => {
        blurry()
        showUserQuestion()
        createResponse()
        let input = (userQuestion.value = '?')
        sendButton.disabled = true
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
        sendButton.disabled = false
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
    

// Show user question
function showUserQuestion(){
    respQuestion.innerHTML = userQuestion.value
}


// Create profile photo function
function createProfilePhoto(){
    profilePhoto.src = './img/profiles/' + currentPhoto + '.jpg'
    profilePhoto.id = 'profilePhoto'
    profilePhoto.alt = 'profile photo'
    respPhotoCont.appendChild(profilePhoto)
}

    
// Random function
function randomNumber(param){
    return Math.floor(Math.random() * param)
}
    
    
// XHR function
function createResponse(){
    dataFile.open('GET', '../data/data.txt', true)
    dataFile.addEventListener('load', function(){
        if(this.readyState == 4 && this.status == 200){
            dataArray = JSON.parse(dataFile.response)
            totalPhrases = dataArray.length
            console.log("totalPhrases is: " + totalPhrases)
            synchroNumber = randomNumber(totalPhrases)
            
            console.log("SynchroNumber is: " + synchroNumber)
            console.log("Phrase is: " + dataArray[synchroNumber].phrase)
            
            currentPhrase = dataArray[synchroNumber].phrase
            currentPhoto = dataArray[synchroNumber].photo
            currentAuthor = dataArray[synchroNumber].author
            respContent.innerHTML = dataArray[synchroNumber].phrase
            createProfilePhoto()
        }
        else{
            console.log('XHR error')
        }
    })
    dataFile.send()
}


// Copy to clipboard listener
copyToClipboardBtn.addEventListener('click', copyToClipboard, false)


// Copy to clipboard function: DEPRECATED ONE!
// function copyToClipboard(){
//         const textarea = document.createElement('textarea')
//         textarea.setAttribute('readonly', '')
//         textarea.style.position = 'absolute'
//         textarea.value = currentPhrase
//         document.body.appendChild(textarea)
//         textarea.select()
//         document.execCommand('copy')
//         textarea.hidden =  true
//     }


// Copy to clipboard function with Clipboard API
function copyToClipboard(){
    navigator.clipboard.writeText(currentPhrase)
    respIcon.innerHTML = 'Copied!'
    setTimeout(deleteRespIconValue, 2000)
}


// Add to favorites listener
addToFavoritesBtn.addEventListener('click', addToFavorites, false)


// Add to Favorites function
function addToFavorites(){
    respIcon.innerText = 'Added!'
    addPhrase()
    setTimeout(deleteRespIconValue, 2000)
}


// Delete respIcon value
function deleteRespIconValue(){
    respIcon.innerHTML = ''
}


// ---------------------------------------- EXECUTIONS ---------------------------------------- //


document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, newLineTime + 350)
})