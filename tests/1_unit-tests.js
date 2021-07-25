const chai = require('chai')
const assert = chai.assert

const Solver = require('../controllers/sudoku-solver.js')
let solver = new Solver()
let string =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let ans =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378'

suite('UnitTests', () => {
  // valid input test
  test('Logic handles a valid puzzle string of 81 characters', function (done) {
    assert.isTrue(solver.validate(string).result)
    done()
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function (done) {
    assert.isFalse(solver.validate('.23.4.34.5890.$.9032#').result)
    done()
  })

  test('Logic handles a puzzle string that is not 81 characters in length', function (done) {
    assert.isFalse(solver.validate('123.234.3.1.566....').result)
    done()
  })

  // row placement test
  test('Logic handles a valid row placement', function (done) {
    assert.isTrue(solver.checkRowPlacement(string, 0, 4, 3))
    done()
  })
  test('Logic handles an invalid row placement', function (done) {
    assert.isFalse(solver.checkRowPlacement(string, 0, 4, 2))
    done()
  })
  // column placement test

  test('Logic handles a valid column placement', function (done) {
    assert.isTrue(solver.checkColPlacement(string, 0, 4, 6))
    done()
  })

  test('Logic handles an invalid column placement', function (done) {
    assert.isFalse(solver.checkColPlacement(string, 0, 4, 2))
    done()
  })

  //  3*3 cell placement test

  test('Logic handles a valid region (3x3 grid) placement', function (done) {
    assert.isTrue(solver.checkRegionPlacement(string, 0, 4, 4))
    done()
  })

  test('Logic handles an invalid region (3x3 grid) placement', function (done) {
    assert.isFalse(solver.checkRegionPlacement(string, 0, 4, 5))
    done()
  })

  //  puzzle solver test
  test('Valid puzzle strings pass the solver', function (done) {
    assert.isOk(solver.solve(string))
    assert.isString(solver.solve(string))
    done()
  })

  test('Invalid puzzle strings fail the solver', function (done) {
    assert.isNotOk(solver.solve('123.234.3.1.566....'))
    done()
  })

  // solved puzzle test

  test('Solver returns the expected solution for an incomplete puzzle', function (done) {
    assert.isOk(solver.solve(string))
    assert.equal(solver.solve(string), ans)
    assert.isString(solver.solve(string))
    done()
  })
})
