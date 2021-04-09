document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const miniGrid = document.querySelector(".mini-grid");

    for (let i = 0; i < 200; i++) {
        const div = document.createElement("div");
        grid.appendChild(div);
    }

    for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.classList.add("taken");
        grid.appendChild(div);
    }

    for (let i = 0; i < 16; i++) {
        const div = document.createElement("div");
        miniGrid.appendChild(div);
    }

    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.getElementById("score");
    const startButton = document.getElementById("start-button");
    const width = 10;
    let nextRandom = 0;
    let timerId;

    document.addEventListener("keyup", control);

    startButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            displayNextShape();
        }
    });
    
    // the tetrominoes.
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width *2 + 2],
        [1, width + 1, width * 2 + 1, width *2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let selectedRandomTetromino = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[0][0]

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("tetromino");
        });
    }

    function erase() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove("tetromino");
        });
    }

    // const timerId = setInterval(moveDown, 1000);

    function moveDown() {
        erase();
        currentPosition += width;
        draw();
        freeze();
    }

    function moveLeft() {
        erase();
        const isAtLeftEdge = current
                                .some(index => 
                                        (currentPosition + index) % width === 0
                                );

        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }

        const squareContainsTakenClass = current.some(index => squares[currentPosition + index].classList.contains("taken"));
        if (squareContainsTakenClass) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        erase();

        const isAtRightEdge = current
                                .some(index => 
                                    (currentPosition + index) % width === width - 1
                                );
                            
        if (!isAtRightEdge) {
            currentPosition += 1;
        }

        const squareContainsTakenClass = current.some(index => squares[currentPosition + index].classList.contains("taken"));
        if (squareContainsTakenClass) {
            currentPosition -= 1;
        }

        draw();
    }

    function rotate() {
        erase();

        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }

        current = tetrominoes[selectedRandomTetromino][currentRotation];

        draw();
    }

    function freeze() {
        const squareContainsTakenClass = current
                                            .some(index => 
                                                squares[currentPosition + index + width]
                                                .classList
                                                .contains("taken")
                                            )
        if (squareContainsTakenClass) {
            current
                .forEach(index => 
                    squares[currentPosition + index]
                    .classList
                    .add("taken"));

            // start a new tetromino falling.
            // todo: potential bug... with the random values...
            const random = selectedRandomTetromino;
            selectedRandomTetromino = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayNextShape();
        }
    }

    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, width + 1, width * 2 + 1, 2],
        [0, width, width + 1, width * 2 + 1],
        [1, width, width + 1, width + 2],
        [0, 1, width, width + 1],
        [1, width + 1, width * 2 + 1, width * 3 + 1]
    ];

    function displayNextShape() {
        displaySquares.forEach(squares => {
            squares.classList.remove("tetromino");
        });

        upNextTetrominoes[selectedRandomTetromino].forEach(index => {
            displaySquares[displayIndex + index].classList.add("tetromino");
        });
    }

    

    function control(event) {
        if (event.keyCode === 37) {
            moveLeft();
        } else if (event.keyCode === 38) {
            rotate();
        } else if (event.keyCode === 39) {
            moveRight();
        } else if (event.keyCode === 40) {
            moveDown();
        }
    }
});