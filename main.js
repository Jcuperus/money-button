const moneyButton = document.getElementById('money-button');
const multiRollCheck = document.getElementById('multiroll');
const rollAmountInput = document.getElementById('roll-amount');
const rollAmountLabel = document.querySelector('label[for=\'roll-amount\']');
const rollHistoryTable = document.querySelector('#roll-history > tbody');
const totalRollText = document.getElementById('total-rolls');
const averageRollText = document.getElementById('average-rolls');
const medianRollText = document.getElementById('median-rolls');
const totalMoneyText = document.getElementById('total-money');
const averageMoneyText = document.getElementById('average-money');
const medianMoneyText = document.getElementById('median-money');

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const config = {
    type: 'bar',
    data: {
        datasets: [{
            data: [],
            backgroundColor: '#9e0027',
            label: 'Roll distribution'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const rollGraph = new Chart(document.getElementById('roll-graph'), config);

const moneyPerRoll = 5000;
const rollDelayMs = 20;

const rollHistory = [];

let isFirstRoll = true;
let isMultiRoll = false;

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function median(numbers) {
    numbers = numbers.sort();
    const middleIndex = Math.floor((numbers.length - 1) / 2);

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

function updateGraph() {
    const maxRoll = rollHistory.reduce((previousValue, currentValue) => currentValue > previousValue ? currentValue : previousValue);

    const rollCounts = {};

    for (let roll of rollHistory) {
        if (!(roll in rollCounts)) rollCounts[roll] = 0;
        
        rollCounts[roll]++;
    }

    rollGraph.config.data.datasets[0].data = rollCounts;
    rollGraph.update();
}

function multiRoll() {
    for (let i = 0; i < 100; i++) {
        roll();
    }
}

function onRollClicked() {
    let rollAmount = 1;

    if (isMultiRoll && rollAmountInput.value >= 1) rollAmount = rollAmountInput.value;

    for (let i = 0; i < rollAmount; i++) {
        roll();
    }
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
    updateGraph();
}

function toggleMultiroll(event) {
    isMultiRoll = multiRollCheck.checked;
    rollAmountInput.hidden = !isMultiRoll;
    rollAmountLabel.hidden = !isMultiRoll;
}

moneyButton.addEventListener('click', onRollClicked);
multiRollCheck.addEventListener('change', toggleMultiroll);
toggleMultiroll();