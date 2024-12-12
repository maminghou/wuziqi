import React, { useState } from 'react';
import './App.css';

function Square({ value, onClick }) {
    return (
        <button
            className={`square ${value ? `square-${value}` : ''}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
}

function Board({ squares, onClick }) {
    const renderSquare = (i) => {
        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
            />
        );
    };

    const boardSize = 15;
    const rows = [];
    for (let i = 0; i < boardSize; i++) {
        const cells = [];
        for (let j = 0; j < boardSize; j++) {
            cells.push(renderSquare(i * boardSize + j));
        }
        rows.push(
            <div key={i} className="board-row">
                {cells}
            </div>
        );
    }

    return <div className="board">{rows}</div>;
}

function Game() {
    const [history, setHistory] = useState([{
        squares: Array(225).fill(null),
        position: null
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [isBlackNext, setIsBlackNext] = useState(true);

    const handleClick = (i) => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const current = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = isBlackNext ? '●' : '○';
        setHistory(currentHistory.concat([{
            squares: squares,
            position: {
                row: Math.floor(i / 15) + 1,
                col: (i % 15) + 1
            }
        }]));
        setStepNumber(currentHistory.length);
        setIsBlackNext(!isBlackNext);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setIsBlackNext((step % 2) === 0);
    };

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            `跳转到第 ${move} 步 ${step.position ?
                `(${step.position.row}, ${step.position.col})` : ''}` :
            '游戏开始';
        return (
            <li key={move}>
                <button
                    className={`history-button ${move === stepNumber ? 'current' : ''}`}
                    onClick={() => jumpTo(move)}
                >
                    {desc}
                </button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = `获胜者: ${winner === '●' ? '黑棋' : '白棋'}`;
    } else {
        status = `下一步: ${isBlackNext ? '黑棋' : '白棋'}`;
    }

    return (
        <div className="game">
            <h1>五子棋</h1>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol className="history-list">{moves}</ol>
            </div>
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const size = 15;
    const winLength = 5;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!squares[row * size + col]) continue;

            // 检查水平
            if (col <= size - winLength) {
                let win = true;
                for (let i = 1; i < winLength; i++) {
                    if (squares[row * size + col] !== squares[row * size + col + i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return squares[row * size + col];
            }

            // 检查垂直
            if (row <= size - winLength) {
                let win = true;
                for (let i = 1; i < winLength; i++) {
                    if (squares[row * size + col] !== squares[(row + i) * size + col]) {
                        win = false;
                        break;
                    }
                }
                if (win) return squares[row * size + col];
            }

            // 检查对角线
            if (row <= size - winLength && col <= size - winLength) {
                let win = true;
                for (let i = 1; i < winLength; i++) {
                    if (squares[row * size + col] !== squares[(row + i) * size + col + i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return squares[row * size + col];
            }

            // 检查反对角线
            if (row <= size - winLength && col >= winLength - 1) {
                let win = true;
                for (let i = 1; i < winLength; i++) {
                    if (squares[row * size + col] !== squares[(row + i) * size + col - i]) {
                        win = false;
                        break;
                    }
                }
                if (win) return squares[row * size + col];
            }
        }
    }
    return null;
}

export default Game;