let rock = document.getElementById('rock')
let paper = document.getElementById('paper')
let scissors = document.getElementById('scissors')

let ChoiceText = document.getElementById('choiceDiv')
let Result = document.getElementById('result')
let userScore_span = document.getElementById('userScore')
let compScore_span = document.getElementById('compScore')

let LogoutBtn = document.getElementById('logoutbtn')

function getCompChoice() {
    const Choices = ['r', 'p', 's']
    return (Choices[Math.floor(3 * Math.random())])
}

function decode(encodedStr) {
    if (encodedStr == 's') {
        return 'Scissors'
    }
    else if (encodedStr == 'p') {
        return 'Paper'
    }
    else {
        return 'Rock'
    }
}

function draw(userChoice, compChoice) {
    ChoiceText.innerHTML = 'You chose, ' + decode(userChoice) + ' while the Computer chose, ' + decode(compChoice)
    Result.innerHTML = 'Woah, what a Coincidence !!!'
}

function win(userChoice, compChoice) {
    ChoiceText.innerHTML = 'You chose, ' + decode(userChoice) + ' while the Computer chose, ' + decode(compChoice)
    Result.innerHTML = 'Yayy, you Won!!'
    userScore_span.innerHTML = Number(userScore_span.innerHTML) + 1
}

function loss(userChoice, compChoice) {
    ChoiceText.innerHTML = 'You chose, ' + decode(userChoice) + ' while the Computer chose, ' + decode(compChoice)
    Result.innerHTML = 'Better Luck Next Time'
    compScore_span.innerHTML = Number(compScore_span.innerHTML) + 1
}

function game(userChoice) {
    compChoice = getCompChoice()
    switch (userChoice + compChoice) {
        case ('rr'):
        case ('pp'):
        case ('ss'):
            {
                draw(userChoice, compChoice)
                break
            }
        case ('rp'):
        case ('ps'):
        case ('sr'):
            {
                loss(userChoice, compChoice)
                break
            }
        case ('pr'):
        case ('sp'):
        case ('rs'):
            {
                win(userChoice, compChoice)
                break
            }
    }
}

function main() {
    rock.addEventListener('click', function () {
        game('r')
    })
    paper.addEventListener('click', function () {
        game('p')
    })
    scissors.addEventListener('click', function () {
        game('s')
    })
    if (LogoutBtn) {
        LogoutBtn.addEventListener('click', function () {
            scores = {
                'user': userScore_span.innerHTML,
                'comp': compScore_span.innerHTML
            }
            $.post('http://127.0.0.1:5000/logout', JSON.stringify(scores))
        })
    }
}

main()