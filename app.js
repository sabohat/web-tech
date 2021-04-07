const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 5000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

// routes
const allBlogs = require("./routes/all-blogs");
const archiveBlogs = require("./routes/archive-blogs");

// blogs urls
app.use("/all-blogs", allBlogs);
app.use("/archive", archiveBlogs);


// get create blog page
app.get('/add-blog', (req, res) => {
    res.render('add-blog')
})

//add blog to db
app.post('/add-blog', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const text = req.body.textarea

    if (title.trim() === '' && description.trim() === '') {
        res.render('add-blog', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            blogs.unshift({
                id: id(),
                title: title,
                description: description,
                text: text,
                archive: false
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
                if (err) throw err

                res.render('add-blog', { success: true })

            })
        })
    }
})




app.get('/blog', (req, res) => {
    res.render('blog')
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${PORT}`)
})

//Basic API
app.get('/api/v1/blogs', (req, res) =>{
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)
        res.json(blogs)

    })
})





function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// http://localhost:5000
app.get('/', (req, res) => {
    res.render('main')
})

