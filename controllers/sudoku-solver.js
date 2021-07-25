class SudokuSolver {
  getBoard(string) {
    let board = []
    for (let i = 0; i < 9; i++) {
      let x = []
      for (let j = 0; j < 9; j++) {
        x.push(string[9 * i + j])
      }
      board.push(x)
    }
    return board
  }

  validate(puzzleString) {
    const arr = puzzleString.split('')
    let invalidChars = /[^1-9.]/.test(puzzleString)
    if (invalidChars)
      return { error: 'Invalid characters in puzzle', result: false }
    else if (arr.length !== 81)
      return {
        error: 'Expected puzzle to be 81 characters long',
        result: false,
      }
    else return { result: true }
  }

  checkRowPlacement(string, row, column, value) {
    const board = typeof string == 'string' ? this.getBoard(string) : string
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === `${value}`) return false
    }
    return true
  }

  checkColPlacement(string, row, col, value) {
    const board = typeof string == 'string' ? this.getBoard(string) : string
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === `${value}`) return false
    }
    return true
  }

  checkRegionPlacement(string, row, col, value) {
    const board = typeof string == 'string' ? this.getBoard(string) : string
    let rGroup = Math.floor(row / 3)
    let cGroup = Math.floor(col / 3)

    for (let i = 0; i < 9; i++) {
      ///same rowGroup
      if (Math.floor(i / 3) == rGroup)
        for (let j = 0; j < 9; j++)
          if (Math.floor(j / 3) == cGroup)
            if (board[i][j] == value) return false /////same Column group
    }
    return true
  }

  isValid(board, row, col, k) {
    let valid = true
    for (let i = 0; i < 9; i++) {
      ////for row and column entries
      if (board[row][i] == k || board[i][col] == k) {
        valid = false
      }
    }
    /// for minigrid
    if (!this.checkRegionPlacement(board, row, col, k)) valid = false
    return valid
  }

  sudokuSolver(board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] == '.') {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(board, i, j, k)) {
              board[i][j] = `${k}`

              if (this.sudokuSolver(board)) return board
              else board[i][j] = '.'
            }
          }
          return false
        }
      }
    }
    return { result: true }
  }

  solve(puzzleString) {
    if (this.validate(puzzleString).result) {
      let board = this.getBoard(puzzleString)
      let ans = this.sudokuSolver(board)
      if (ans) {
        return ans.flat(2).join('')
      } else return false
    }
  }
}

module.exports = SudokuSolver
