const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 5000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

// http://localhost:5000
app.get('/', (req, res) => {
    res.render('main')
})


// get create blog page
app.get('/add-blog', (req, res) => {
    res.render('add-blog')
})

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
                text: text
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
                if (err) throw err

                res.render('add-blog', { success: true })

            })
        })
    }
})

// get all blogs
app.get('/all-blogs', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)
        res.render('all-blogs', {blogs: blogs})

    })
})

app.get('/blog', (req, res) => {
    res.render('blog')
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${PORT}`)
})

app.get("/all-blogs/:id", (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json', (err, data) => {
        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]


        res.render('blog', {blog: blog})

    })
  })
app.get('/api/v1/notes', (req, res) =>{
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)
        res.json(blogs)

    })
})

app.get('/all-blogs/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err
        
        const blogs = JSON.parse(data)
        const blogsfilter = blogs.filter(blog => blog.id != id)

        fs.writeFile('./data/blogs.json', JSON.stringify(blogsfilter), err => {
            if (err) throw err

            res.render('all-blogs', {blogs : blogsfilter})
        })
    })
})

app.get('/all-blogs/:id/edit', (req, res) => {
    const id = req.params.id
 
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]
        const blogsfilter = blogs.filter(blog => blog.id != id)

        fs.writeFile('./data/blogs.json', JSON.stringify(blogsfilter), err => {
            if (err) throw err
        })
        
        res.render('edit-blog', {blog: blog})

    })

})
function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
