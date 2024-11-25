import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// Get all todos for logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.userId
      }
    })
    res.json(todos)
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const { task } = req.body
    const todo = await prisma.todo.create({
      data: {
        task,
        userId: req.userId
      }
    })
    res.json(todo)
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { completed } = req.body
    const { id } = req.params
    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
        userId: req.userId
      },
      data: {
        completed: !!completed
      }
    })
    res.json(updatedTodo)

    if (result.changes === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// Delete a todo Typically you should not perma delete, but instead soft delete by changing a boolean value to true.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId
      }  
    })
    res.send({ message: "Todo deleted" })

    if (result.changes === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

export default router
