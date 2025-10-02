const express = require("express")
const cors = require("cors")
const app = express()
const todos = [
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false
  },
  {
    "id": 2,
    "title": "Finish React project",
    "completed": true
  },
  {
    "id": 3,
    "title": "Walk the dog",
    "completed": false
  },
  {
    "id": 4,
    "title": "Call mom",
    "completed": false
  },
  {
    "id": 5,
    "title": "Read 20 pages of a book",
    "completed": true
  }
]

app.use(express.json())
app.use(cors())

app.get('/api/todos', (req, res) => {
    try {
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json('error')
    }
})

app.post('/api/todos', (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: "Title is required" })
        }

        const newTodo = {
            id: todos.length + 1, 
            title: req.body.title,
            completed: req.body.completed ?? false
        }

        todos.push(newTodo)
        res.status(201).json(newTodo)
    } catch (error) {
        res.status(500).json('error')
    }
})


const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log("Listening on", PORT))