const moneyButton = document.getElementById('money-button');
const multiRollCheck = document.getElementById('multiroll');
const rollAmountContainer = document.getElementById('roll-amount-container');
const rollAmountInput = document.getElementById('roll-amount');
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
            label: 'Amount of clicks'
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                display: true,
                text: 'amount'
            },
            y: {
                beginAtZero: true,
                display: true,
                text: 'rolls'
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
    const rollCounts = {};

    for (let roll of rollHistory) {
        if (!(roll in rollCounts)) rollCounts[roll] = 0;
        
        rollCounts[roll]++;
    }

    rollGraph.config.data.datasets[0].data = rollCounts;
    rollGraph.update();
}

function updateRollInfo(counterCol, moneyCol, rollAmount) {
    counterCol.innerText = `${rollAmount} ${rollAmount == 1 ? 'click' : 'clicks'}`;
    moneyCol.innerText = formatMoney(rollAmount * moneyPerRoll);
}

async function onRollClicked() {
    let rollAmount = 1;

    if (isMultiRoll && rollAmountInput.value >= 1) rollAmount = rollAmountInput.value;

    for (let i = 0; i < rollAmount; i++) {
        await roll(!isMultiRoll);
    }

    updateStats();
    updateGraph();
}

async function roll(playAnimation = true) {
    if (isFirstRoll) {
        isFirstRoll = false;
        rollHistoryTable.getElementsByClassName('placeholder')[0].remove();
    }

    let rollAmount = 0;

    const rollRow = document.createElement('tr');
    const counterCol = document.createElement('td');
    const moneyCol = document.createElement('td');

    rollRow.appendChild(counterCol);
    rollRow.appendChild(moneyCol);
    rollHistoryTable.prepend(rollRow);
    
    while(randomRange(0, 100) !== 0) {
        rollAmount++;

        if (playAnimation) {
            await sleep(rollDelayMs);

            updateRollInfo(counterCol, moneyCol, rollAmount);
        }
    }

    updateRollInfo(counterCol, moneyCol, rollAmount);

    rollHistory.push(rollAmount);
    // updateStats();
    // updateGraph();
}

function toggleMultiroll() {
    isMultiRoll = multiRollCheck.checked;
    // rollAmountInput.hidden = !isMultiRoll;
    rollAmountContainer.hidden = !isMultiRoll;
}

moneyButton.addEventListener('click', onRollClicked);
multiRollCheck.addEventListener('change', toggleMultiroll);
toggleMultiroll();