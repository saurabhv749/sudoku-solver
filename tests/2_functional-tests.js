const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = 'https://boilerplate-project-sudoku-solver.saurabhv749.repl.co'

chai.use(chaiHttp)
let string =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidCharString =
  '1.5..2.84..+-*6sh5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidLenString =
  '1.5......9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let ans =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378'

let invalidPuzzle =
  '..9..5.1.85.44...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

suite('Functional Tests', (done) => {
  // solve
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: string })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'solution')
        assert.equal(res.body.solution, ans)
      })

    done()
  })
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .type('form')
      .send({})
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Required field missing')
      })

    done()
  })

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: invalidCharString })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid characters in puzzle')
      })
    done()
  })
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: invalidLenString })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      })
    done()
  })
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: invalidPuzzle })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Puzzle cannot be solved')
      })
    done()
  })

  //    check
  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'a1', value: '8' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.isArray(res.body.conflict)
        assert.include(res.body.conflict, 'column')
      })
    done()
  })
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'a1', value: '6' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.isArray(res.body.conflict)
        assert.include(res.body.conflict, 'region')
      })
    done()
  })
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'E2', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.isArray(res.body.conflict)
        assert.include(res.body.conflict, 'region')
        assert.include(res.body.conflict, 'row')
        assert.include(res.body.conflict, 'column')
      })
    done()
  })
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'E2', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.isArray(res.body.conflict)
        assert.include(res.body.conflict, 'region')
        assert.include(res.body.conflict, 'row')
        assert.include(res.body.conflict, 'column')
      })
    done()
  })
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: '', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Required field(s) missing')
      })
    done()
  })
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: invalidCharString, coordinate: 'E2', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid characters in puzzle')
      })
    done()
  })
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: invalidLenString, coordinate: 'E2', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      })
    done()
  })
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'K2', value: '7' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid coordinate')
      })
    done()
  })
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: string, coordinate: 'E2', value: '56' })
      .end(function (err, res) {
        assert.isNull(err)
        assert.strictEqual(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid value')
      })
    done()
  })
})
