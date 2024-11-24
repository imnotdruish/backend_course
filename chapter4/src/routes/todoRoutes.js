import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all todos for logged-in user
router.get('/', (req, res) => {
  try {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Create a new todo
router.post('/', (req, res) => {
  try {
    const { task } = req.body
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?,?)')
    const result = insertTodo.run(req.userId, task)
    res.json({ id: result.lastInsertRowid, task, completed: 0 })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Update a todo
router.put('/:id', (req, res) => {
  try {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updatedTodo.run(completed, id)
    res.json({ message: "Todo completed" })

    if (result.changes === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Delete a todo Typically you should not perma delete, but instead soft delete by changing a boolean value to true.
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
    deleteTodo.run(id, userId)
    res.json({ message: "Todo deleted" })

    if (result.changes === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

export default router