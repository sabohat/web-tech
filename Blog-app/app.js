const express = require('express')
const app = express()

const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))


// http://localhost:8000
app.get('/', (req, res) => {
    res.render('main')
})

// get all blogs
app.get('/all-blogs', (req, res) => {
    res.render('all-blogs')
})

// get create blog page
app.get('/add-blog', (req, res) => {
    res.render('add-blog')
})

app.get('/blog', (req, res) => {
    res.render('blog')
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${PORT}`)
})
