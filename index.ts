const validStates: string = "XO";

type BoardType = [[string, string, string],
    [string, string, string],
    [string, string, string]];

type BoardIndex = 0 | 1 | 2;

const board = (() => {
    let boardState: BoardType = [["", "", ""],
    ["", "", ""],
    ["", "", ""]];

    const getBoardState = (x: BoardIndex, y: BoardIndex) => boardState[x][y];

    const setBoardState = (x: BoardIndex, y: BoardIndex, s: string) => {
        if (x >= 0 && x <= 2 && y >= 0 && y <= 2 && validStates.includes(s)
            && boardState[x][y] !== undefined) {
            boardState[x][y] = s;
        }
    };

    const resetBoardState = () => {
        boardState = [["", "", ""],
        ["", "", ""],
        ["", "", ""]];
    };

    const checkWin = (s: string): boolean => {
        if (!validStates.includes(s)) return false;

        let i: BoardIndex;
        for (i = 0; i < 3; i++) {
            if ((boardState[0][i] == s && boardState[1][i] == s && boardState[2][i] == s) ||
                (boardState[i]?.[0] == s && boardState[i]?.[1] == s && boardState[i]?.[2] == s) ||
                (boardState[0][0] == s && boardState[1][1] == s && boardState[2][2] == s) ||
                (boardState[2][0] == s && boardState[1][1] == s && boardState[0][2] == s)) {
                let winList: string[] = []

                // get list of buttons involved in winning line for updating styling
                // this implementation sucks and can probably be refactored but it's whatever
                if (boardState[0][i] == s && boardState[1][i] == s && boardState[2][i] == s) {
                    winList = [`0${i}`, `1${i}`, `2${i}`];
                } else if (boardState[i]?.[0] == s && boardState[i]?.[1] == s && boardState[i]?.[2] == s) {
                    winList = [`${i}0`, `${i}1`, `${i}2`];
                } else if (boardState[0][0] == s && boardState[1][1] == s && boardState[2][2] == s) {
                    winList = ["00", "11", "22"];
                } else {
                    winList = ["20", "11", "02"];
                }
                
                displayManager.updateGameButtonWin(winList);
                return true;
            }
        }

        return false;
    };

    const checkTie = (): boolean => {
        for (let x: BoardIndex = 0; x < 3; x++) {
            for (let y: BoardIndex = 0; y < 3; y++) {
                if (boardState?.[x]?.[y] === "") return false;
            }
        }
        return true;
    }

    return { resetBoardState, getBoardState, setBoardState, checkWin, checkTie };
})();

const gameManager = (() => {
    let currentTurn = "X";
    let isWin = false;
    let isTie = false;

    const startGame = () => {
        board.resetBoardState();
        isWin = false;
        isTie = false;
        currentTurn = "X";
    };

    const getCurrentTurn = () => currentTurn;
    const getWinStatus = () => isWin;
    const getTieStatus = () => isTie;

    const takeTurn = (boardX: BoardIndex, boardY: BoardIndex): boolean => {
        let boardPositionState = board.getBoardState(boardX, boardY);

        if (boardPositionState !== undefined && boardPositionState === "") {
            board.setBoardState(boardX, boardY, currentTurn);
            isWin = board.checkWin(currentTurn);
            isTie = board.checkTie();

            if (isWin) return true;
            if (isTie) return true;

            currentTurn = (currentTurn === "X") ? "O" : "X";
            return true;
        } else return false;
    };

    return { startGame, takeTurn, getCurrentTurn, getWinStatus, getTieStatus }
})();

const displayManager = (() => {
    const gameButtonElements = document.querySelectorAll<HTMLButtonElement>(".game-board-button");
    const gameStatusElement: HTMLDivElement = <HTMLDivElement>document.querySelector(".game-status");
    const playerXNameElement: HTMLInputElement = <HTMLInputElement>document.querySelector("input#playerX");
    const playerONameElement: HTMLInputElement = <HTMLInputElement>document.querySelector("input#playerO");
    const restartGameButtonElement: HTMLButtonElement = <HTMLButtonElement>document.querySelector(".game-restart-button");

    const initDisplay = () => {
        updateGameStatus();
        gameButtonElements.forEach((button) => {
            button.disabled = false;
            button.addEventListener("click", (e) => {
                e.preventDefault();
                updateGameButton(button);
            });
        });
        
        restartGameButtonElement.addEventListener("click", restartGame);

        playerXNameElement.addEventListener("change", updateGameStatus);
        playerONameElement.addEventListener("change", updateGameStatus);
    };

    const updateGameButton = (button: HTMLButtonElement) => {
        if (button.dataset.coordinates !== undefined) {
            if (button.dataset.coordinates[0] !== undefined &&
                button.dataset.coordinates[1] !== undefined) {
                let x = +button.dataset.coordinates[0];
                let y = +button.dataset.coordinates[1];
                let turn = gameManager.getCurrentTurn();
                let turnSuccessful = gameManager.takeTurn(x as BoardIndex, y as BoardIndex);
                console.log(turnSuccessful);
                if (turnSuccessful) {
                    button.innerHTML = turn;
                    button.disabled = true;
                    updateGameStatus();
                }
            }
        }
    };

    const updateGameStatus = () => {
        if (gameStatusElement !== undefined &&
            playerXNameElement !== undefined &&
            playerONameElement !== undefined) {
            let turn = gameManager.getCurrentTurn();
            if (gameManager.getWinStatus()) {
                gameStatusElement.textContent = (turn === "X") ? `${playerXNameElement.value} wins!`
                    : `${playerONameElement.value} wins!`;
                gameButtonElements.forEach((button) => button.disabled = true);
                return;
            }
            if (gameManager.getTieStatus()) {
                gameStatusElement.textContent = "It's a tie!";
                return;
            }
            gameStatusElement.textContent = (turn === "X") ? `${playerXNameElement.value}'s turn`
                : `${playerONameElement.value}'s turn`;
        }
    };

    const updateGameButtonWin = (winList: string[]) => {
        gameButtonElements.forEach((button) => {
            if (button.dataset.coordinates !== undefined) {
                if (winList.includes(button.dataset.coordinates)) {
                    button.classList.add("win");
                }
            }
        });
    }

    const restartGame = () => {
        gameManager.startGame();
        gameButtonElements.forEach((button) => {
            button.disabled = false;
            button.classList.remove("win");
            button.textContent = "";
        });
        updateGameStatus();
    }

    return { initDisplay, updateGameButtonWin }
})();

displayManager.initDisplay();