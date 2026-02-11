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

    const startGame = () => {
        board.resetBoardState();
        takeTurn();
    };

    const takeTurn = () => {
        let input;
        let move;
        let x;
        let y;

        while (x === undefined || y === undefined || x < 0 || x > 2 || y < 0 || y > 2) {
            input = prompt(`${currentTurn}'s turn. Type board coordinates:`);
            if (input === '') continue

            move = input?.replace(/[^0-2]/g, '');
            x = Number(move?.[0]);
            y = Number(move?.[1]);
        }

        let boardX: BoardIndex = x as BoardIndex;
        let boardY: BoardIndex = y as BoardIndex;
        let boardPositionState = board.getBoardState(boardX, boardY);

        if (boardPositionState !== undefined && boardPositionState === "") {
            board.setBoardState(boardX, boardY, currentTurn);
            let isWin = board.checkWin(currentTurn);
            let isTie = board.checkTie();

            if (isWin) { alert(`${currentTurn} wins!`); return; }
            if (isTie) { alert("It's a tie!"); return; }

            currentTurn = (currentTurn === "X") ? "O" : "X";
        } else alert("Move invalid");

        takeTurn();
    }

    return { startGame }
})();

// gameManager.startGame();