class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initializeBoard();
    }

    initializeBoard() {
        // Exemple de grille de Sudoku (0 représente une case vide)
        const puzzle = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]
        ];
        
        this.board = puzzle.map(row => [...row]);
        this.solveSudoku([...puzzle]);
    }

    isValid(board, row, col, num) {
        // Vérifier la ligne
        for(let x = 0; x < 9; x++) {
            if(board[row][x] === num) return false;
        }

        // Vérifier la colonne
        for(let x = 0; x < 9; x++) {
            if(board[x][col] === num) return false;
        }

        // Vérifier le bloc 3x3
        let startRow = row - row % 3,
            startCol = col - col % 3;
        
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(board[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    solveSudoku(board) {
        for(let row = 0; row < 9; row++) {
            for(let col = 0; col < 9; col++) {
                if(board[row][col] === 0) {
                    for(let num = 1; num <= 9; num++) {
                        if(this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if(this.solveSudoku(board)) {
                                this.solution = board.map(row => [...row]);
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Sudoku();
    const board = document.getElementById('board');
    const validateButton = document.getElementById('validate-button');
    const solveButton = document.getElementById('solve-button');
    const newGameButton = document.getElementById('new-game-button');
    const messageDiv = document.getElementById('message');

    function createBoard() {
        board.innerHTML = '';
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if(game.board[i][j] !== 0) {
                    cell.classList.add('initial');
                    cell.textContent = game.board[i][j];
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = 1;
                    input.max = 9;
                    input.addEventListener('input', function() {
                        if(this.value.length > 1) {
                            this.value = this.value.slice(0,1);
                        }
                        if(this.value < 1 || this.value > 9) {
                            this.value = '';
                        }
                    });
                    cell.appendChild(input);
                }
                board.appendChild(cell);
            }
        }
    }

    function validateBoard() {
        const cells = board.children;
        let isValid = true;
        let isFull = true;

        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                const cell = cells[i * 9 + j];
                const value = cell.classList.contains('initial') ? 
                    parseInt(cell.textContent) : 
                    parseInt(cell.children[0].value);

                if(isNaN(value)) {
                    isFull = false;
                    continue;
                }

                if(value !== game.solution[i][j]) {
                    isValid = false;
                    cell.classList.add('error');
                } else {
                    cell.classList.remove('error');
                }
            }
        }

        if(!isFull) {
            messageDiv.textContent = 'Complétez toutes les cases!';
            return;
        }

        messageDiv.textContent = isValid ? 'Bravo! Sudoku résolu!' : 'Il y a des erreurs...';
    }

    function showSolution() {
        const cells = board.children;
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                const cell = cells[i * 9 + j];
                if(!cell.classList.contains('initial')) {
                    if(cell.children[0]) {
                        cell.children[0].value = game.solution[i][j];
                    }
                }
            }
        }
    }

    validateButton.addEventListener('click', validateBoard);
    solveButton.addEventListener('click', showSolution);
    newGameButton.addEventListener('click', () => {
        game.initializeBoard();
        createBoard();
        messageDiv.textContent = '';
    });

    createBoard();
});