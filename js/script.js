const input = document.getElementById('conf-input');
const button = document.getElementById('conf-button');
const field = document.getElementById('field');

const info = {
    size: null,
    turn: !!Math.round(Math.random()),
    cells: [],
    active: true,
};

input.addEventListener('keyup', function () {
    button.disabled = parseInt(input.value) < 3;
});

button.addEventListener('click', function () {
    clearField();
    clearInfo();
    info.size = input.value;
    info.cells = buildField(info.size);
});

const cellClick = function (e) {
    if (this.classList.contains('used')) {
        return;
    }

    if (!info.active) {
        return;
    }

    this.classList.add('used');
    this.textContent = info.turn ? 'x' : 'o';

    const coordinates = e.target.id.split('-');
    const result = handle(...coordinates);

    info.turn = !info.turn;

    if (result !== null) {
        markWinner(result);
        info.active = false;
    }
}

function markWinner(who) {
    window.setTimeout(function () {
        who
            ? alert('крестики пабедили')
            : alert('нолики пабедили');
    }, 50);
}

function handle(row, cell) {
    info.cells[row][cell] = info.turn;

    const example = {
        parallels: {
            x1: true,
            o1: false,
            x2: true,
            o2: false,
        },
        diagonals: {
            x1: true,
            o1: false,
            x2: true,
            o2: false,
        }
    }

    let decision = null;
    let result = JSON.parse(JSON.stringify(example));

    for (let i = 0; i < info.size; i++) {
        result.parallels.x1 = true;
        result.parallels.o1 = false;

        result.parallels.x2 = true;
        result.parallels.o2 = false;

        for (let j = 0; j < info.size; j++) {
            result.parallels.x1 = result.parallels.x1 && info.cells[i][j];
            result.parallels.o1 = !isNull(info.cells[i][j])
                ? result.parallels.o1 || info.cells[i][j]
                : true;

            result.parallels.x2 = result.parallels.x2 && info.cells[j][i];
            result.parallels.o2 = !isNull(info.cells[j][i])
                ? result.parallels.o2 || info.cells[j][i]
                : true;

            if (i === j) {
                result.diagonals.x1 = result.diagonals.x1 && info.cells[i][j];
                result.diagonals.o1 = !isNull(info.cells[i][j])
                    ? result.diagonals.o1 || info.cells[i][j]
                    : true;
            }

            if (i === (info.size - j - 1)) {
                result.diagonals.x2 = result.diagonals.x2 && info.cells[j][i];
                result.diagonals.o2 = !isNull(info.cells[j][i])
                    ? result.diagonals.o2 || info.cells[j][i]
                    : true;
            }
        }

        Object.entries(result.parallels)
            .forEach((item) => {
                if (item[1] === example.parallels[item[0]]) {
                    decision = item[1];
                }
            });
    }

    Object.entries(result.diagonals)
        .forEach((item) => {
            if (item[1] === example.diagonals[item[0]]) {
                decision = item[1];
            }
        });

    return decision;
}

function isNull(value) {
    return value === null;
}

function buildField(size) {
    let cells = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            let node = document.createElement('div');
            node.id = i + '-' + j;
            node.className = 'cell'
            node.addEventListener('click', cellClick);

            field.appendChild(node);
            row.push(null);
        }
        cells.push(row);
    }

    field.style = getFieldStyle(size);

    return cells
}

function clearField() {
    [...field.children]
        .forEach((node) => {
            field.removeChild(node);
        });
}

function clearInfo() {
    info.size = null;
    info.turn = !!Math.round(Math.random());
    info.cells = [];
    info.active = true;
}

function getFieldStyle(size) {
    const width = 55 * size + 'px';
    let style = 'width:' + width + ' ;grid-template-columns: ';
    for (let i = 0; i < size; i++) {
        style += '1fr ';
    }

    return style;
}
