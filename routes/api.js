'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')
let solver = new SudokuSolver()

module.exports = function (app) {
  let solver = new SudokuSolver()

  app.route('/api/check').post((req, res) => {
    let { puzzle, coordinate, value } = req.body
    
    if (
      puzzle == '' ||
      puzzle == undefined ||
      value == '' ||
      value == undefined ||
      coordinate == '' ||
      coordinate == undefined
    )
     { res.json({ error:'Required field(s) missing'})}
    else {

///
    coordinate = coordinate.toUpperCase()
    const validRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    let row = validRows.indexOf(coordinate[0])
    let col = parseInt(coordinate[1]) - 1
    value = parseInt(value)
///

      let isvalid = solver.validate(puzzle)
      if (isvalid.result) {
        //preexisting
        if (value == puzzle[9 * row + col]) res.json({ valid: true })

        if (row <= 8 && row >= 0 && col >= 0 && col <= 8) {
          if (value >= 1 && value <= 9) {
            let conflict = []
            let regionConflict = solver.checkRegionPlacement(
              puzzle,
              row,
              col,
              value
            )
            let rowConflict = solver.checkRowPlacement(puzzle, row, col, value)
            let colConflict = solver.checkColPlacement(puzzle, row, col, value)

            if (!regionConflict) conflict.push('region')
            if (!rowConflict) conflict.push('row')
            if (!colConflict) conflict.push('column')
            // empty
            if (conflict.length > 0) res.json({ valid: false, conflict })
            else res.json({ valid: true })
          } else res.json({ error: 'Invalid value' })
        } else res.json({ error: 'Invalid coordinate' })
      } else res.json({ error: isvalid.error })
    }
  })

  app.route('/api/solve').post((req, res) => {
    let string = req.body.puzzle
    if (string == '' || string == undefined) {
      res.json({ error: 'Required field missing' })
    } else {
      let isvalid = solver.validate(string)
      if (isvalid.result) {
        let solution = solver.solve(string)
        if (solution) res.json({ solution })
        else res.json({ error: 'Puzzle cannot be solved' })
      } else res.json({ error: isvalid.error })
    }
  })
}
