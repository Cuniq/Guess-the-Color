'use strict';
let mainWindow = document.getElementById('main-window');

/*
    Number of rows based on difficulty. EZ = 1, MEDIUM = 2, HARD = 3, WHITE = 5.    
*/
let difficultyRows = 1;
const BLOCKS_PER_ROW = 3;
let randomSelectedColor = null;

function setBodySize() {
    const headerHeight = document.getElementsByTagName('header')[0].offsetHeight;
    const menuHeight = document.getElementById('menu-bar').offsetHeight;

    mainWindow.style.height = 'calc(100vh - ' + headerHeight + 'px - ' + menuHeight + 'px)'
}

/*
    Well mr. web browsers are caching input values and it fucking triggers me :)
    Just set it to default god damn it.
*/
function resetInput() {
    const checkbox = document.getElementById('enable3D');
    const xSlider = document.getElementById('rotateXdeg');
    const ySlider = document.getElementById('rotateYdeg');

    xSlider.value = 0;
    ySlider.value = 0;
    checkbox.checked = false;
}

function setMenuCallback() {
    const difficultyAnchors = document.getElementById('difficultyMenu').children;
    for (let i = 0; i < difficultyAnchors.length; i++) {
        difficultyAnchors[i].onclick = function () {
            if ((i + 1) !== difficultyRows) {
                difficultyRows = i + 1;
                startGame();
            }
        };
    }
    const newColorsAnchor = document.getElementById('newGame').onclick = function () {
        startGame();
    };
}

function enable3DChangeHandler() {
    mainWindow.classList.toggle('perspective-3d');
}

function sliderRotateXHandler(e) {
    const style = document.documentElement.style;
    style.setProperty('--rotateXdeg', e.value + 'deg');
}

function sliderRotateYHandler(e) {
    const style = document.documentElement.style;
    style.setProperty('--rotateYdeg', e.value + 'deg');
}

function generateRandomRGBColorString() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}

function createColorsRows() {
    for (let i = 0; i < difficultyRows; i++) {
        const colorRowDiv = createColorsRowDiv();
        for (let j = 0; j < BLOCKS_PER_ROW; j++) {
            colorRowDiv.appendChild(createColorBox());
        }
        mainWindow.appendChild(colorRowDiv);
    }
}

function createColorsRowDiv() {
    const colorRowDiv = document.createElement('div');
    colorRowDiv.classList.add(...['d-flex', 'justify-content-center', 'container']);
    return colorRowDiv;
}

function clearGrid() {
    const cleanMainWindow = mainWindow.cloneNode(false);
    mainWindow.parentNode.replaceChild(cleanMainWindow, mainWindow);
    mainWindow = cleanMainWindow;
}

function createColorBox() {
    const colorBox = document.createElement('div');
    colorBox.classList.add('box');

    setBoxColors();
    setClickCallback();
    return colorBox;

    function setBoxColors() {
        const randomColor = generateRandomRGBColorString();
        colorBox.style.backgroundColor = randomColor;
        colorBox.style.boxShadow = '0px 20px 35px -25px ' + randomColor;
    }

    function setClickCallback() {
        colorBox.onclick = function () {
            const backgroundColor = this.style.backgroundColor;
            if (backgroundColor === randomSelectedColor) {
                endGame();
            } else {
                this.classList.add('hide-animated');
                document.getElementById('tryAgainSpan').classList.remove('hidden');
            }
        }
    }
}

function selectRandomColor() {
    const boxElements = document.querySelectorAll('#main-window .box');
    const randomIndex = Math.floor((Math.random() * boxElements.length));
    return boxElements[randomIndex].style.backgroundColor;
}

function setColorNamePara() {
    document.getElementById('colorNamePara').textContent = randomSelectedColor.toUpperCase();
}

function startGame() {
    const style = document.documentElement.style;
    style.setProperty('--header-background', 'var(--header-default-color)');
    clearGrid();
    createColorsRows();
    randomSelectedColor = selectRandomColor();
    setColorNamePara();
}

function endGame() {
    const boxElements = document.querySelectorAll('#main-window .box');
    for (let index = 0; index < boxElements.length; index++) {
        if (boxElements[index].classList.contains('hide-animated')) {
            boxElements[index].classList.remove('hide-animated');
            boxElements[index].classList.add('show-animated');
        }
        boxElements[index].style.backgroundColor = randomSelectedColor;
        boxElements[index].style.boxShadow = '0px 20px 35px -25px ' + randomSelectedColor;
    }

    document.getElementById('tryAgainSpan').classList.add('hidden');
    const style = document.documentElement.style;
    style.setProperty('--header-background', randomSelectedColor);
}
