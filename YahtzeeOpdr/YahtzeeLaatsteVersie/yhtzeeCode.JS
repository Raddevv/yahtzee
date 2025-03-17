/*
Info over die "Object" die steeds wordt gevonden in de code, bijvoorbeeld bij Object.Keys worden de dice apart opgenoemd
Een key = Een die's waarde tussen 1 - 6, oftewel een key kan een zijn, vijf of drie.
De objects zelf zijn een deel van JavaScript, een built-in global
Ik heb de objects "Counts" & "Scores": Counts is de teller en houdt bij hoe vaak een dice nummer voor komt
Scores houdt bij de totale punten van de speler, het werkt met totale waardes van bijvoorbeeld een grote straat
//---------------------------------------------------------------------------------------------------------------
ik voeg een uitleg toe aan wat ik kan 
*/

function rollDice() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}
let diceRolls = rollDice();
let heldDice = [false, false, false, false, false];
let rollsLeft = 3;
let scores = {
    eenen: null, tweeën: null, drieën: null, vieren: null, vijfen: null, zessen: null,
    threeOfKind: null, fourOfKind: null, fullHouse: null, kleineStraat: null, groteStraat: null,
    yahtzee: null, chance: null, totaal: 0
};

// De dice roll (map maakt een nieuwe array aan op basis van huidige "diceRolls")
function rollNewDice() {
    if (rollsLeft > 0) {
        diceRolls = diceRolls.map((val, i) => heldDice[i] ? val : Math.floor(Math.random() * 6) + 1);
        rollsLeft--;
        updateDisplay();
    } else {
        alert("Geen worpen meer!");
    }
}

function toggleHold(index) {
    heldDice[index] = !heldDice[index];
    updateDisplay();
}

// Een andere versie van dezelfde calculate? (? = if statement verkort,)
function calculatePossibleScores() {
    let counts = {};
    diceRolls.forEach(die => counts[die] = (counts[die] || 0) + 1);
    let possibleScores = {};
    
    for (let i = 1; i <= 6; i++) {
        possibleScores[["eenen", "tweeën", "drieën", "vieren", "vijfen", "zessen"][i - 1]] = (counts[i] || 0) * i;
    }
    
    possibleScores.threeOfKind = Object.values(counts).some(count => count >= 3) ? diceRolls.reduce((a, b) => a + b, 0) : 0;
    possibleScores.fourOfKind = Object.values(counts).some(count => count >= 4) ? diceRolls.reduce((a, b) => a + b, 0) : 0;
    possibleScores.fullHouse = Object.values(counts).includes(3) && Object.values(counts).includes(2) ? 25 : 0;
    let uniqueDice = [...new Set(diceRolls)].sort();
    let smallStraightPatterns = [[1,2,3,4], [2,3,4,5], [3,4,5,6]];
    let largeStraightPatterns = [[1,2,3,4,5], [2,3,4,5,6]];
    possibleScores.kleineStraat = smallStraightPatterns.some(p => p.every(n => uniqueDice.includes(n))) ? 30 : 0;
    possibleScores.groteStraat = largeStraightPatterns.some(p => p.every(n => uniqueDice.includes(n))) ? 40 : 0;
    possibleScores.yahtzee = Object.values(counts).includes(5) ? 50 : 0;
    possibleScores.chance = diceRolls.reduce((a, b) => a + b, 0);
    
    return possibleScores;
}

// Score plaatsen
function placeScore(category) {
    if (scores[category] !== null) {
        alert("Deze categorie is al gekozen!");
        return;
    }
    let possibleScores = calculatePossibleScores();
    scores[category] = possibleScores[category];

    scores.totaal = Object.keys(scores)
        .filter(key => key !== "totaal")
        .map(key => scores[key] || 0)
        .reduce((a, b) => a + b, 0);

    resetTurn();
    updateScores();
}

// 
// Gewoon aanpassen van de text, scores, etc.
function updateDisplay() {
    document.querySelectorAll(".dice").forEach((el, i) => {
        el.textContent = diceRolls[i];
        el.style.backgroundColor = heldDice[i] ? "lightgreen" : "white";
    });
    document.getElementById("rollsLeft").textContent = `Worpen over: ${rollsLeft}`;
    // een ${...} werkt als interpolatie, de string: "rollsLeft" wordt teruggebracht bij ${rollsLeft}
}

function updateScores() {
    Object.keys(scores).forEach(key => {
        let scoreCell = document.getElementById(key);
        scoreCell.textContent = scores[key] !== null ? scores[key] : "-";
        scoreCell.style.color = scores[key] !== null ? "gray" : "black";
        /* deze functie werkt als een check, als je namelijk niks hebt staan dan zal er "-" worden weergegeven
        bij (!== null ? gray), dit is de kleur zelf van de scores, deze [key] zoals eerder besproken wordt
        uiteindelijk laten zien als '0' of 'score', de scoreCell variabele geeft aan dat de Element (key)
        als de scoreCell functioneert*/
    });
}

// Score kun je nu aanklikken via dit
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(scores).forEach(key => {
        let cell = document.getElementById(key);
        if (cell) {
            cell.addEventListener("click", () => placeScore(key));
        }
    });s
    //de DOMContentLoaded werkt gewoon als een check voor wanneer de pagina geladen is
});

// De turn reset zelf
function resetTurn() {
    if (rollsLeft === 3) {  // gewoon de rollsLeft van het begin helemaal, hier worden ze gereset
        alert("Mag niet resetten zonder score te plaatsen");
        return;
    }
    
    rollsLeft = 3;
    diceRolls = rollDice();
    heldDice.fill(false); // fill, werkt met arrays en geeft een soort opvulling van verwachte 'length'
    updateDisplay(); 
    /* updateDisplay werkt dat zodra er een verandering wordt gemaakt dat het dan
    dat ook daadwerkelijk weergeeft*/
}