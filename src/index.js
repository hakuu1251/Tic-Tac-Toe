import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return(
        <button className="square"
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, col, row) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i, col, row)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 1,1)}
                    {this.renderSquare(1, 2,1)}
                    {this.renderSquare(2, 3,1)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, 1,2)}
                    {this.renderSquare(4, 2,2)}
                    {this.renderSquare(5, 3,2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6,1,3)}
                    {this.renderSquare(7,2,3)}
                    {this.renderSquare(8,3,3)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: Array(2).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i, col, row){
        const history = this.state.history.slice(0, this.state.stepNumber + 1); //для удаления неактуальных ходов
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const position = current.position.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        position[i] = col + row;
        this.setState({
            squares: squares,
            history: history.concat([{
                squares: squares,
                position: position,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((history, move) => {
            const desc = move ?
                'Перейти к ' +  history.position[move] :
                'К началу игры';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Выиграл: ' + winner;
        }else if(!winner && this.state.stepNumber === 9){
            status = 'Ничья';
        }
        else if(!winner){
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
