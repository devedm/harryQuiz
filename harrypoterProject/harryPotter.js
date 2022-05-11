
let globalCounter = 1;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Randomize the array
const arrayRandomizer = (array) => {
    array.sort(function() {
        return Math.random() - .5;
    }); 
};

const backgroundList = [
    'https://images.unsplash.com/photo-1618944847023-38aa001235f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1539103377911-4909a1eae382?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1618944616516-83edb69a1adc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1618944616545-1aac141d8d5d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1196&q=80',
    'https://images.unsplash.com/photo-1618945034844-cfb8094ac26b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1598153346810-860daa814c4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1241&q=80',
    'https://images.unsplash.com/photo-1548630826-2ec01a41f48f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
];

// Fetch the characters from the begining to avoid waiting when the game starts
let filteredCharacters = [];
fetch('http://hp-api.herokuapp.com/api/characters')
    .then(response => response.json())
    .then(data => filteredCharacters = data.filter(elemento => elemento.image && elemento.house));



// List of questions

const questionList = [
    '¿Cómo se llama este personaje?',
    '¿A qué casa pertenece el personaje?',
    '¿Cómo se llama el actor que interpreta este personaje?',
]

const housesList = [
    'Gryffindor',
    'Slytherin',
    'Ravenclaw',
    'Hufflepuff'
]

const playerList = [];

// HTML Elements

const htmlBody = document.querySelector('body')
htmlBody.setAttribute('style',`background-size: cover; background-image: url(${backgroundList[getRandomInt(0,backgroundList.length)]}); background-attachment: fixed` );
const resultContainer = document.createElement('div');
const buttonRestart = document.querySelector('#buttonRestart');
resultContainer.id = 'results';
resultContainer.innerHTML = `
            <div id='results-container'>
            <span class="close">&times;</span>
                <h2>Puntuacion!</h2>
                <p id='score-text'></p>
                <button id="buttonRestart" onClick="restartGame()">Restart</button>
            </div>
            `;

function restartGame() {
    resultContainer.style.display = "none"
    document.querySelector('#contendorDePreguntas').innerHTML = ''
    globalCounter = 1
    playerList.length = 0;
}


document.querySelector('#boton').onclick = () => {

    if (globalCounter < 11) {
        const randomChar = getRandomInt(0,filteredCharacters.length-1);
        console.log(randomChar);
        console.log(filteredCharacters[randomChar]);
        questionMaker(filteredCharacters[randomChar]);
        htmlBody.setAttribute('style',`background-size: cover; background-image: url(${backgroundList[getRandomInt(0,backgroundList.length)]}); background-attachment: fixed` )
        if (globalCounter == 10) {
            document.querySelector('#boton2').disabled = false;
        }
    } else if (globalCounter == 11) {
        alert("Juego completado")
        document.querySelector('#boton2').disabled = false;
    } else {
        globalCounter = 0
        document.querySelector('#boton2').disabled = true;
    }
    
}



document.querySelector('#boton2').onclick = () => {
    const questionsAmount = document.querySelector('#contendorDePreguntas').children;
    const questionsSelected = document.querySelectorAll('input[type=radio]:checked')
    if (questionsAmount.length === questionsSelected.length) {
        const playerName = prompt('Escriba su nombre');
        const trueAnswers = Array.from(questionsSelected).filter(elemento => elemento.attributes.value.value === 'true');
        const score = (trueAnswers.length / questionsSelected.length) * 100;
        playerList.push(`Name: ${playerName} Score: ${score}`);
        htmlBody.appendChild(resultContainer);
        document.querySelector('#score-text').textContent = playerList
        resultContainer.style.display = "block";
        
    } else {
        alert('Por favor responda todas las preguntas.');
    };
}

document.querySelector('#boton2').disabled = true;

const charNames = (rightChar) => {
    const charList = [];
    charList.push(rightChar.name);

    let charName = filteredCharacters[getRandomInt(0,filteredCharacters.length-1)].name;

    while (charList.length < 4) {
        if (charList.includes(charName)) {
            charName = filteredCharacters[getRandomInt(0,filteredCharacters.length-1)].name
        } else {
            charList.push(charName);
        }
    };

    arrayRandomizer(charList)
    
    return (charList)
}

const actorNames = (rightChar) => {
    const actorList = [];
    actorList.push(rightChar.actor);

    let actorName = filteredCharacters[getRandomInt(0,filteredCharacters.length-1)].actor;

    while (actorList.length < 4) {
        if (actorList.includes(actorName)) {
            actorName = filteredCharacters[getRandomInt(0,filteredCharacters.length-1)].actor
        } else {
            actorList.push(actorName);
        }
    };

    arrayRandomizer(actorList)
    
    return (actorList)
}

const questionMaker = (characterFromList) => {
    let questionNumber = getRandomInt(0,3); // this returns a number between 0 and 2 for 3 index lists
    const nameList = charNames(characterFromList)
    const actorList = actorNames(characterFromList)
    if (questionNumber === 0) {
        
        document.querySelector('#contendorDePreguntas').innerHTML += `

        <div class="questionBox">
            
            <div class="questionBox-image">
                <h1 class="question-title">Question #${globalCounter}</h1>
                <img src="${characterFromList.image}">
                
    
            </div>
            <div class="questionBox-answers">
                <p>${questionList[questionNumber]}</p>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.name === nameList[0] ? true : false}"><label>${nameList[0]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.name === nameList[1] ? true : false}"><label>${nameList[1]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.name === nameList[2] ? true : false}"><label>${nameList[2]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.name === nameList[3] ? true : false}"><label>${nameList[3]}</label><br>
            </div>
        </div>

        `
    } else if (questionNumber === 1) {
        arrayRandomizer(housesList);
        document.querySelector('#contendorDePreguntas').innerHTML += `

        <div class="questionBox">
            
            <div class="questionBox-image">
                <h1 class="question-title">Question #${globalCounter}</h1>
                <img src="${characterFromList.image}">
                
    
            </div>
            <div class="questionBox-answers">
                <p>${questionList[questionNumber]}</p>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.house === housesList[0] ? true : false}"><label>${housesList[0]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.house === housesList[1] ? true : false}"><label>${housesList[1]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.house === housesList[2] ? true : false}"><label>${housesList[2]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.house === housesList[3] ? true : false}"><label>${housesList[3]}</label><br>
            </div>
        </div>

        `
    } else {
        document.querySelector('#contendorDePreguntas').innerHTML += `

        <div class="questionBox">
            
            <div class="questionBox-image">
                <h1 class="question-title">Question #${globalCounter}</h1>
                <img src="${characterFromList.image}">
                
    
            </div>
            <div class="questionBox-answers">
                <p>${questionList[questionNumber]}</p>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.actor === actorList[0] ? true : false}"><label>${actorList[0]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.actor === actorList[1] ? true : false}"><label>${actorList[1]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.actor === actorList[2] ? true : false}"><label>${actorList[2]}</label><br>
                <input type="radio" name="question${globalCounter}" value="${characterFromList.actor === actorList[3] ? true : false}"><label>${actorList[3]}</label><br>
            </div>
        </div>

        `
    }
    globalCounter += 1;
}

document.querySelector('#boton').textContent = "Continuar"
document.querySelector('#boton2').textContent = "Finalizar"
