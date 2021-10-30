// ------------------------------ DECLARATION OF VARIABLES AND CONSTANTS ------------------------------ //


const sendButton = document.getElementById('sendButton')
const anotherQuestionBtn = document.getElementById('anotherQuestionBtn')
const respContent = document.getElementById('respContent')
const lastLine = document.querySelector('.intro-last-line')
const userQuestion = document.getElementById('question-input')
const musicIcon = document.getElementById('cont-music')
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
const favsReloadBtn = document.getElementById('favs-reload-btn')
const contAudio = document.getElementsByTagName('audio')
const contMusicBtn = document.getElementById('cont-music')

let musicOn = false
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
let playlistCount = 0

let dataFile = new XMLHttpRequest()
let dataArray = []
let profilePhoto = new Image()
let iconImage = new Image()

let totalPhrases = 0
let synchroNumber = 0
let currentPhrase = ''
let currentPhoto = ''
let currentAuthor = ''
let localStAuthors = []
let localStPhrases = []
let favsActivator = []
let phrasesRender = false
let favsEnter = false
let likedPhrases = 0
let param = 0
let activatedReload = false


const favTemplate = (author, phrase) => {
    return(`<b>${author}</b> ` + ` - ` + `${phrase}` + `.`)
}


// ---------------------------------------- FUNCTIONS ---------------------------------------- //

// Audio functions
function automaticPlaylist(){
    contAudio[playlistCount].play()
    musicPlayer()
}

// Music player function
function musicPlayer(){
    setTimeout(function(){
        if(!contAudio[playlistCount].ended){
            musicPlayer()
        }
        else if(playlistCount === 5){
            playlistCount = 0
            automaticPlaylist()
        }
        else{
            playlistCount++
            contAudio[playlistCount].play()
            musicPlayer()
        }
    }, 3000)
}

// Authorized Music reproduction
function musicControl(){
    if(musicOn === false){
        musicOn = true
        createIconImage()
        automaticPlaylist()
        musicIcon.classList.add('active')
    }else{
        musicOn = false
        createIconImage()
        contAudio[playlistCount].pause()
        musicIcon.classList.remove('active')
    }
}

// Authorized Music reproduction listener
contMusicBtn.addEventListener('click', musicControl)


// Another question button or Return button
anotherQuestionBtn.addEventListener('keyup', e => {
    if(e.code === 'Enter'){
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
async function favsBlurry(){
    let blur = document.getElementById('blur')
    blur.classList.toggle('active')
    contFavs.classList.toggle('active')
    sendButton.disabled = true
    userQuestion.disabled = true
    contMusicBtn.disabled = true

    musicIcon.disabled = true
    
    localStAuthors = JSON.parse(localStorage.getItem('localStAuthors'))
    localStPhrases = JSON.parse(localStorage.getItem('localStPhrases'))

    for(let i=0; i < localStAuthors.length; i++){
        const favPhrase = document.createElement('p')
        favPhrase.classList.add('favs-p')
        favPhrase.innerHTML = favTemplate(localStAuthors[i], localStPhrases[i])
        favsP.appendChild(favPhrase)

        if(phrasesRender){
            favsP.removeChild(favPhrase)
        }
    }
    if(!favsEnter){
        likedPhrases = 0
        favsEnter = true
    }
}


// Back button from My favourites
function favsBlurryBack(){
    let blur = document.getElementById('blur')
    blur.classList.toggle('active')
    contFavs.classList.toggle('active')
    let input = document.getElementById('question-input')
    
    sendButton.disabled = false
    userQuestion.disabled = false
    contMusicBtn.disabled = false
    phrasesRender = true

    input.focus()
    input.value = '?'
    input.setSelectionRange(0, 0)
    musicIcon.disabled = false

    phrasesRender = true
    favsReloadBtn.disabled = false

    if(activatedReload){
        likedPhrases = 0
    }
}

// Reload function
function favsReload(){
    param = localStAuthors.length - likedPhrases
    for(let i = param; i < param + likedPhrases; i++){
        const addLastPhrases = document.createElement('p')
        addLastPhrases.classList.add('favs-p')
        addLastPhrases.innerHTML = favTemplate(localStAuthors[i], localStPhrases[i])
        favsP.appendChild(addLastPhrases)
    }
    favsReloadBtn.disabled = true
    activatedReload = true
}

// Reload Listener
favsReloadBtn.addEventListener('click', favsReload)

// Add author and phrase to My favourites function
function addPhrase(){
    if(localStAuthors === null && localStPhrases === null){
        localStAuthors = []
        localStPhrases = []
    }
    localStAuthors.push(currentAuthor)
    localStorage.setItem('localStAuthors', JSON.stringify(localStAuthors))
    localStPhrases.push(currentPhrase)
    localStorage.setItem('localStPhrases', JSON.stringify(localStPhrases))
    likedPhrases++
    if(navFavs.style.visibility = 'hidden'){
        navFavs.style.visibility = 'visible'
    }
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
        contMusicBtn.disabled = true
        userQuestion.disabled = true
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
        contMusicBtn.disabled = false
        userQuestion.disabled = false
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

// Create music icon function
function createIconImage(){
    if(musicOn){
        iconImage.src = './img/svg-musicon.svg'
        iconImage.id = 'music-on'
        iconImage.alt = 'music on icon'
        musicIcon.appendChild(iconImage)
    }else{
        iconImage.src = './img/svg-soundoff.svg'
        iconImage.id = 'music-off'
        iconImage.alt = 'music off icon'
        musicIcon.appendChild(iconImage)
    }
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
            synchroNumber = randomNumber(totalPhrases)
            
            currentPhrase = dataArray[synchroNumber].phrase
            currentPhoto = dataArray[synchroNumber].photo
            currentAuthor = dataArray[synchroNumber].author
            respContent.innerHTML = dataArray[synchroNumber].phrase
            createProfilePhoto()
        }
        else{
            console.error('XHR error')
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


// ---------------------------------------- INITIAL EXECUTIONS ---------------------------------------- //


document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, newLineTime + 350)

    favsActivator = JSON.parse(localStorage.getItem('localStAuthors'))
    if(favsActivator != null){
        navFavs.style.visibility = 'visible'
    }else{
        navFavs.style.visibility = 'hidden'
    }

    localStAuthors = JSON.parse(localStorage.getItem('localStAuthors'))
    localStPhrases = JSON.parse(localStorage.getItem('localStPhrases'))

    createIconImage()
})