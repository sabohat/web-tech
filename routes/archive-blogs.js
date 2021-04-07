const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 5000

const router = express.Router()

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

// get archived blogs
router.get('/', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogsList = JSON.parse(data)
        const archiveBlogs = blogsList.filter(blog=> blog.archive === true)
        res.render('archive', {blogs: archiveBlogs})

    })
})

//get blog
router.get("/:id", (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json', (err, data) => {
        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]


        res.render('blog', {blog: blog})

    })
})

//delete archived log
router.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err
        
        const blogs = JSON.parse(data)
        const blogsfilter = blogs.filter(blog => blog.id != id)
        const archiveBlogs = blogsfilter.filter(blog=> blog.archive === true)

        fs.writeFile('./data/blogs.json', JSON.stringify(blogsfilter), err => {
            if (err) throw err

            res.render('archive', {blogs: archiveBlogs})
        })
    })
})

// Unarchive
router.get('/:id/unarchive', (req, res) => {
    const id = req.params.id
 
    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]
        blog.archive = false
        
        const blogFilter = blogs.filter(blog=> blog.archive == true)

        fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
            if (err) throw err
        })
        res.render('archive', {blogs: blogFilter})
    })

})

module.exports = router;