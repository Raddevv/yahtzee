/*dice number generator*/
function rollDice() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

function rollNewDice() {
    let newRolls = rollDice();
    document.getElementById("p1").textContent = newRolls.join(", ");
}

/*dice selection*/
function selectDice() {
    
}

/*dice = saved*/
let diceRolls = rollDice();

/*dice roll display*/
document.getElementById("p1").textContent = diceRolls.join(", ");







/*opgeslagen
function rollDice() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

function rollNewDice() {
    let newRolls = rollDice();
    document.getElementById("p1").textContent = newRolls.join(", ");
}

function selectDice() {
}

let diceRolls = rollDice();

document.getElementById("p1").textContent = diceRolls.join(", ");
*/