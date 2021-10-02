let sendButton = document.getElementById('sendButton')
let anotherQuestionBtn = document.getElementById('anotherQuestionBtn')

sendButton.addEventListener('click', () => {
    toggle()
})

anotherQuestionBtn.addEventListener('click', () => {
    toggle()
})

function toggle(){
    var blur = document.getElementById('blur')
    blur.classList.toggle('active')
}