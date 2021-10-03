let sendButton = document.getElementById('sendButton')
let anotherQuestionBtn = document.getElementById('anotherQuestionBtn')

sendButton.addEventListener('click', () => {
    toggle()
})

anotherQuestionBtn.addEventListener('click', () => {
    toggle()
})

// Activate and deactivate the blur effect
function toggle(){
    var blur = document.getElementById('blur')
    blur.classList.toggle('active')
    var response = document.getElementById('response')
    response.classList.toggle('active')
}