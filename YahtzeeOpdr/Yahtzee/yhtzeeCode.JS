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

// De dice roll
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

// Een andere versie van dezelfde calculate?
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

// Gewoon aanpassen van de text, scores, etc.
function updateDisplay() {
    document.querySelectorAll(".dice").forEach((el, i) => {
        el.textContent = diceRolls[i];
        el.style.backgroundColor = heldDice[i] ? "lightgreen" : "white";
    });
    document.getElementById("rollsLeft").textContent = `Worpen over: ${rollsLeft}`;
}

function updateScores() {
    Object.keys(scores).forEach(key => {
        let scoreCell = document.getElementById(key);
        scoreCell.textContent = scores[key] !== null ? scores[key] : "-";
        scoreCell.style.color = scores[key] !== null ? "gray" : "black";
    });
}

// Score kun je nu aanklikken via dit
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(scores).forEach(key => {
        let cell = document.getElementById(key);
        if (cell) {
            cell.addEventListener("click", () => placeScore(key));
        }
    });
});

// De turn reset zelf
function resetTurn() {
    if (rollsLeft === 3) {  
        alert("Mag niet resetten zonder score te plaatsen!");
        return;
    }
    
    rollsLeft = 3;
    diceRolls = rollDice();
    heldDice.fill(false);
    updateDisplay();
}