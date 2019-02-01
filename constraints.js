const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const getGridCells = () => {
    return Array.from(document.getElementById('grid').querySelectorAll('td'))
}

const setupClickHandlers = () => {
    cells.forEach((x, i) => x.onclick = () => selectCell(i))
}

const selectCell = (index) => {
    cells.forEach(x => x.classList.remove('selected'))
    cells[index].classList.add('selected')
    selectedCell = index
}

const setCellNumber = (index, number) => {
    cells
        .filter(x => x.innerHTML.trim() == number)
        .forEach(x => x.innerHTML = '')
    cells[index].innerHTML = number
}

const verifyAllNineUnique = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].every(x => cells.some(c => c.innerHTML == `${x}`))
}

const addSecretNumbers = (indices) => {
    return indices.reduce((total, i) => total += secretArray[i], 0)
}

const addGridNumbers = (indices) => {
    return indices.reduce((total, i) => total + (parseInt(cells[i].innerHTML, 10) || 0), 0)
}

const verifyConstraint = (indices) => {
    return addSecretNumbers(indices) == addGridNumbers(indices)
}

const verifyIteration = () => {
    const verifications = [
        verifyAllNineUnique(),
        verifyConstraint([2, 5, 8]),
        verifyConstraint([0, 1, 2]),
        verifyConstraint([2, 4, 6])
    ].slice(0, iteration)
    return verifications.every(x => x === true)
}

const nextIteration = () => {
    iteration++
    const goalElement = document.getElementById(`iteration${iteration}Goal`)
    if (goalElement) {
        goalElement.classList.remove('hidden')
    }
}

const arrowMap = {
    "ArrowRight": [1, 2, 0, 4, 5, 3, 7, 8, 6],
    "ArrowLeft": [2, 0, 1, 5, 3, 4, 8, 6, 7],
    "ArrowUp": [6, 7, 8, 0, 1, 2, 3, 4, 5],
    "ArrowDown": [3, 4, 5, 6, 7, 8, 0, 1, 2]
}

const setupKeyboard = () => {
    document.onkeydown = (e) => {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
            setCellNumber(selectedCell, e.key)
            selectCell((selectedCell + 1) % secretArray.length)
            if (verifyIteration()) {
                nextIteration()
            }
            return
        }
        if (e.key == "Enter") {
            selectCell((selectedCell + 1) % secretArray.length)
            return
        }
        if (arrowMap[e.key]) {
            selectCell(arrowMap[e.key][selectedCell])
            return
        }
    }
}

const setGoal = (direction, indicies) => {
    document.getElementById(`${direction}Goal`).innerHTML = addSecretNumbers(indicies)
}

const secretArray = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
let cells
let selectedCell
let iteration = 1
let started = null

const init = () => {
    cells = getGridCells()
    setGoal('right', [2, 5, 8])
    setGoal('top', [0, 1, 2])
    setGoal('diagonal', [2, 4, 6])
    setupClickHandlers()
    setupKeyboard()
    selectCell(0)
}
