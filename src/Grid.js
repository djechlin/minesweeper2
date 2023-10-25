import {useState} from 'react';

export function Grid(props) {

    const rows = 10;
    const columns = 15;

    const [gameInProgress, setGameInProgress] = useState(true);
    const [mines, setMines] = useState(newMines(rows, columns, 0.15));
    const [survey, setSurvey] = useState(newMatrix(rows, columns));

    function inspect(row, column) {
        const nextSurvey = copyMatrix(survey);
        if (mines[row][column]) {
            setGameInProgress(false);
            alert('Game over');
        }
        const queue = [[row, column]];
        while (queue.length > 0) {
            const next = queue.pop();
            const r = next[0];
            const c = next[1];
            nextSurvey[r][c] = true;
            if (detect(r, c) === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j ++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        if (r+i >= 0 && r+i < rows && c+i >= 0 && c+i < columns) {
                            if (!nextSurvey[r+i][c+j]) {
                                queue.push([r+i,c+j]);
                            }
                        }
                    }
                }
            }
        }
        setSurvey(nextSurvey);
    }

    function restart() {
        setMines(newMines(rows, columns, 0.15));
        setSurvey(newMatrix(rows, columns));
        setGameInProgress(true);
    }

    function detect(row, column) {
        function check(a, b) {
            if (a < 0 || a >= rows || b < 0 || b > columns) {
                return 0;
            }
            return mines[a][b] ? 1 : 0;
        }
        if (mines[row][column]) {
            return '💣';
        }
        return check(row-1, column-1) + check(row-1,column) + check(row-1,column+1)
        + check(row, column-1) + check(row, column+1)
        + check(row+1, column-1) + check(row+1, column) + check(row+1, column+1);
    }

    return (
    <div>
        { gameInProgress || <button onClick={restart}>Restart</button>}
        
        <table>
            <tbody>
            {
                Array.from({length: props.rows}).map((val, row) => (
                <Row key={row} 
                    row={row}
                    detect={detect}
                    columns={props.columns}
                    inspect={inspect}
                    survey={survey} />
                ))
            }
            </tbody>
        </table>
    </div>)
}

function Row(props) {
    return <tr>
        {
            Array.from({length: props.columns}).map((val, column) => {
                return <td key={column} onClick={() => { props.inspect(props.row, column)}}>{props.survey[props.row][column] ? props.detect(props.row, column) : '?'}</td>;
            })
        }
    </tr>;
}

function copyMatrix(matrix) {
    const next = newMatrix(matrix.length, matrix[0].length);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            next[i][j] = matrix[i][j];
        }
    }
    return next;
}

function newMatrix(m, n, value) {
    return undefinedArray(m).map(() => undefinedArray(n).fill(value));
}

function newMines(m, n, mineProbability) {
    const field = newMatrix(m, n);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const mine = Math.random() <= mineProbability;
            field[i][j] = mine;
        }
    }
    return field;
}

function newField(rows, columns, mineProbability) {
    const field = newMatrix(rows, columns);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            field[i][j] = {
                revealed: false,
                mine: Math.random() <= mineProbability
            };
        }
    }
    return field;
}

function undefinedArray(length) {
    return Array.from({length: length});
}