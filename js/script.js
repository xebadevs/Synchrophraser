// ------------------------------ DECLARATION OF VARIABLES AND CONSTANTS ------------------------------ //


const LASTLINE = document.querySelector('.intro-last-line')
const SENDBUTTON = document.getElementById('sendButton')
const ANOTHERQUESTIONBTN = document.getElementById('anotherQuestionBtn')
const USERQUESTION = document.getElementById('question-input')
const RESPCONTENT = document.getElementById('respContent')
const RESPQUESTION = document.getElementById('resp-question')
const RESPICON = document.getElementById('resp-icon')
const RESPPHOTOCONT = document.getElementById('resp-photo-cont')
const COPYTOCLIPBOARDBTN = document.getElementById('resp-copy')
const ADDTOFAVORITESBTN = document.getElementById('resp-favs')
const NAVFAVS = document.getElementById('nav-favs')
const CONTFAVS = document.getElementById('cont-favs')
const FAVSP = document.getElementById('favs-p')
const FAVSBACKBTN = document.getElementById('favs-back-btn')
const FAVSRELOADBTN = document.getElementById('favs-reload-btn')
const MUSICICON = document.getElementById('cont-music')
const CONTAUDIO = document.getElementsByTagName('audio')
const CONTMUSICBTN = document.getElementById('cont-music')

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

const TYPINGTIME = 80
const DELETETIME = 50
const NEWLINETIME = 3000
let linesIndex = 0
let charIndex = 0
let playlistCount = 0
let dataFile = new XMLHttpRequest()
let dataArray = []
let profilePhoto = new Image()
let iconImage = new Image()

let totalPhrases = 0
let synchroNumber = 0
let likedPhrases = 0
let param = 0
let currentPhrase = ''
let currentPhoto = ''
let currentAuthor = ''
let localStAuthors = []
let localStPhrases = []
let favsActivator = []
let phrasesRender = false
let favsEnter = false
let activatedReload = false


const FAVSTEMPLATE = (author, phrase) => {
    return(`<b>${author}</b> ` + ` - ` + `${phrase}` + `.`)
}


// ---------------------------------------- FUNCTIONS ---------------------------------------- //

// Automatic Playlist functions
function automaticPlaylist(){
    CONTAUDIO[playlistCount].play()
    musicPlayer()
}


// Music player function
function musicPlayer(){
    setTimeout(function(){
        if(!CONTAUDIO[playlistCount].ended){
            musicPlayer()
        }
        else if(playlistCount === 5){
            playlistCount = 0
            automaticPlaylist()
        }
        else{
            playlistCount++
            CONTAUDIO[playlistCount].play()
            musicPlayer()
        }
    }, 3000)
}


// Manual Music reproduction
function musicControl(){
    if(musicOn === false){
        musicOn = true
        createIconImage()
        automaticPlaylist()
        MUSICICON.classList.add('active')
    }else{
        musicOn = false
        createIconImage()
        CONTAUDIO[playlistCount].pause()
        MUSICICON.classList.remove('active')
    }
}


// Manual Music reproduction listener
CONTMUSICBTN.addEventListener('click', musicControl)


// Disabler function
function disabler(){
    SENDBUTTON.disabled = true
    CONTMUSICBTN.disabled = true
    USERQUESTION.disabled = true
}


// Enabler function
function enabler(){
    SENDBUTTON.disabled = false
    CONTMUSICBTN.disabled = false
    USERQUESTION.disabled = false
}


// Resp Return button
ANOTHERQUESTIONBTN.addEventListener('keyup', e => {
    if(e.code === 'Enter'){
        ANOTHERQUESTIONBTN.click()
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


// Blur and Response generator function
async function favsBlurry(){
    let blur = document.getElementById('blur')
    blur.classList.toggle('active')
    CONTFAVS.classList.toggle('active')
    disabler()
    MUSICICON.disabled = true
    lastLineOn = false
    
    localStAuthors = await JSON.parse(localStorage.getItem('localStAuthors'))
    localStPhrases = await JSON.parse(localStorage.getItem('localStPhrases'))

    for(let i=0; i < localStAuthors.length; i++){
        const favPhrase = document.createElement('p')
        favPhrase.classList.add('favs-p')
        favPhrase.innerHTML = FAVSTEMPLATE(localStAuthors[i], localStPhrases[i])
        FAVSP.appendChild(favPhrase)

        if(phrasesRender){
            FAVSP.removeChild(favPhrase)
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
    CONTFAVS.classList.toggle('active')
    let input = document.getElementById('question-input')
    
    enabler()
    phrasesRender = true
    lastLineOn = true

    input.focus()
    input.value = '?'
    input.setSelectionRange(0, 0)
    
    MUSICICON.disabled = false
    FAVSRELOADBTN.disabled = false

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
        addLastPhrases.innerHTML = FAVSTEMPLATE(localStAuthors[i], localStPhrases[i])
        FAVSP.appendChild(addLastPhrases)
    }
    FAVSRELOADBTN.disabled = true
    activatedReload = true
}


// Reload Listener
FAVSRELOADBTN.addEventListener('click', favsReload)


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
    if(NAVFAVS.style.visibility = 'hidden'){
        NAVFAVS.style.visibility = 'visible'
    }
}


// My favourites Listener
NAVFAVS.addEventListener('click', favsBlurry)


// My favourites Back Listener
FAVSBACKBTN.addEventListener('click', favsBlurryBack)


// Send button listener
SENDBUTTON.addEventListener('click', () => {
        blurry()
        showUserQuestion()
        createResponse()
        let input = (USERQUESTION.value = '?')
        disabler()
})


// Aclaration: the function 'blurry()' executes tree times because with only one demands double click,
// and with one repetition the program fails. I didn't know yet how to fix it
ANOTHERQUESTIONBTN.addEventListener('click', () => {
        let input = document.getElementById('question-input')
        input.focus()
        input.value = '?'
        input.setSelectionRange(0, 0)
        blurry()
        blurry()
        blurry()
        enabler()
})


// Typing function
function machineType(){
    if(charIndex < lastLineArray[linesIndex].length && lastLineOn){
        LASTLINE.textContent += lastLineArray[linesIndex].charAt(charIndex)
        charIndex++
        setTimeout(machineType, TYPINGTIME)
    }
    else{
        setTimeout(deleteLines, NEWLINETIME)
    }
}
    
    
// Delete function (for Automatic Typing)
function deleteLines(){
    if(charIndex > 0){
        LASTLINE.textContent = lastLineArray[linesIndex].substring(0, charIndex - 1)
        charIndex--
        setTimeout(deleteLines, DELETETIME)
    }
    else{
        linesIndex++
        if(linesIndex >= lastLineArray.length){
            linesIndex = 0
        }
        setTimeout(machineType, TYPINGTIME + 1100)
    }
}
    

// Show user question
function showUserQuestion(){
    RESPQUESTION.innerText = USERQUESTION.value
}


// Create profile photo function
function createProfilePhoto(){
    profilePhoto.src = './img/profiles/' + currentPhoto + '.jpg'
    profilePhoto.id = 'profilePhoto'
    profilePhoto.alt = 'profile photo'
    RESPPHOTOCONT.appendChild(profilePhoto)
}


// Create music icon function
function createIconImage(){
    if(musicOn){
        iconImage.src = './img/svg-musicon.svg'
        iconImage.id = 'music-on'
        iconImage.alt = 'music on icon'
        MUSICICON.appendChild(iconImage)
    }else{
        iconImage.src = './img/svg-soundoff.svg'
        iconImage.id = 'music-off'
        iconImage.alt = 'music off icon'
        MUSICICON.appendChild(iconImage)
    }
}

    
// Random function
function randomNumber(param){
    return Math.floor(Math.random() * param)
}
    
    
// XHR function
function createResponse(){
    // General local route
    // dataFile.open('GET', './data/data.txt', true)
    // GitHub Pages route
    dataFile.open('GET', './Synchrophraser/data/data.txt', true)
    dataFile.addEventListener('load', function(){
        if(this.readyState == 4 && this.status == 200){
            dataArray = JSON.parse(dataFile.response)
            totalPhrases = dataArray.length
            synchroNumber = randomNumber(totalPhrases)
            
            currentPhrase = dataArray[synchroNumber].phrase
            currentPhoto = dataArray[synchroNumber].photo
            currentAuthor = dataArray[synchroNumber].author
            RESPCONTENT.innerHTML = dataArray[synchroNumber].phrase
            createProfilePhoto()
        }
        else{
            console.error('XHR error')
        }
    })
    dataFile.send()
}


// Copy to clipboard listener
COPYTOCLIPBOARDBTN.addEventListener('click', copyToClipboard, false)

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
    RESPICON.innerHTML = 'Copied!'
    setTimeout(deleteRespIconValue, 2000)
}


// Add to favorites listener
ADDTOFAVORITESBTN.addEventListener('click', addToFavorites, false)


// Add to Favorites function
function addToFavorites(){
    RESPICON.innerText = 'Added!'
    addPhrase()
    setTimeout(deleteRespIconValue, 2000)
}


// Delete respIcon value
function deleteRespIconValue(){
    RESPICON.innerHTML = ''
}


// ---------------------------------------- INITIAL EXECUTIONS ---------------------------------------- //


document.addEventListener("DOMContentLoaded", function(){
    setTimeout(machineType, NEWLINETIME + 350)

    favsActivator = JSON.parse(localStorage.getItem('localStAuthors'))
    if(favsActivator != null){
        NAVFAVS.style.visibility = 'visible'
    }else{
        NAVFAVS.style.visibility = 'hidden'
    }

    localStAuthors = JSON.parse(localStorage.getItem('localStAuthors'))
    localStPhrases = JSON.parse(localStorage.getItem('localStPhrases'))

    createIconImage()
})