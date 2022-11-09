const moneyButton = document.getElementById('money-button');
const rollHistoryTable = document.querySelector('#roll-history > tbody');
const totalRollText = document.getElementById('total-rolls');
const averageRollText = document.getElementById('average-rolls');
const medianRollText = document.getElementById('median-rolls');
const totalMoneyText = document.getElementById('total-money');
const averageMoneyText = document.getElementById('average-money');
const medianMoneyText = document.getElementById('median-money');

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const moneyPerRoll = 5000;
const rollDelayMs = 20;

const rollHistory = [];

let isFirstRoll = true;

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function median(numbers) {
    numbers = numbers.sort();
    const middleIndex = Math.floor((numbers.length - 1) / 2);
    
    console.log(middleIndex);

    if (numbers.length % 2 != 0) {
        return numbers[middleIndex];
    }
    else {
        return (numbers[middleIndex] + numbers[middleIndex + 1]) / 2;
    }
}

function sleep(delayMs) {
    return new Promise(resolve => setTimeout(resolve, delayMs));
}

function formatMoney(amount) {
    return moneyFormatter.format(amount);
}

function updateStats() {
    const rollSum = rollHistory.reduce((previousValue, currentValue) => previousValue + currentValue);
    const medianRolls = median(rollHistory);
    const averageRolls = rollSum / rollHistory.length;
    const moneySum = rollSum * moneyPerRoll;
    const averageMoney = averageRolls * moneyPerRoll;

    totalRollText.innerText = rollHistory.length;
    medianRollText.innerText = medianRolls;
    averageRollText.innerText = averageRolls.toFixed(2);
    totalMoneyText.innerText = moneyFormatter.format(moneySum);
    medianMoneyText.innerText = moneyFormatter.format(medianRolls * moneyPerRoll);
    averageMoneyText.innerText = moneyFormatter.format(averageMoney);
}

async function roll() {
    if (isFirstRoll) {
        isFirstRoll = false;
        rollHistoryTable.getElementsByClassName('placeholder')[0].remove();
    }

    let rollAmount = 0;

    const rollRow = document.createElement('tr');
    const counterCol = document.createElement('td');
    const moneyCol = document.createElement('td');
    
    counterCol.innerText = `${rollAmount} ${rollAmount == 1 ? 'roll' : 'rolls'}`;
    moneyCol.innerText = formatMoney(rollAmount * moneyPerRoll);

    rollRow.appendChild(counterCol);
    rollRow.appendChild(moneyCol);
    rollHistoryTable.prepend(rollRow);
    
    while(randomRange(0, 100) !== 0) {
        await sleep(rollDelayMs);
        
        rollAmount++;

        counterCol.innerText = `${rollAmount} ${rollAmount == 1 ? 'roll' : 'rolls'}`;
        moneyCol.innerText = formatMoney(rollAmount * moneyPerRoll);
    }

    rollHistory.push(rollAmount);
    updateStats();
}

moneyButton.addEventListener('click', roll);