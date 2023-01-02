const express = require('express')
const path = require('path')
const cors = require('cors')
const books = require('./models/books')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 8080
const uri = `mongodb://localhost:27017`
const client = new MongoClient(uri, { 
    useNewUrlParser : true, 
    useUnifiedTopology: true
})

app.use(cors())
/* 
    Serve static content from directory "public",
    it will be accessible under path /static, 
    e.g. http://localhost:8080/static/index.html
*/

app.use('/static', express.static(__dirname + '/public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('./index.html', options, function(err){
        if(err==undefined){ return }
        console.log(err)
    })
})

var exphbs = require('express-handlebars')
const { ObjectID } = require('bson')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/books', function(req, res){
    //let bookSavedList = books.listOfBooks()

    client.connect()
    .then(() => {
        const collection = client.db("BookDB").collection("books")
        let query = { }
        let options = {
            projection : {
                _id : 0,
                id : 1,
                title : 1,
                author : 1,
                review : 1,
                image : 1
            }
        }
        return collection.find(query, options)
    })
    .then( cursor => cursor.toArray())
    .then( bookSavedList => {
        console.log('List Of Favorite Books (FindReq)\n ', bookSavedList)
        res.render('favorite_books', {
            books: bookSavedList
        })
    })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        console.log('Close connection\n')
        console.log('-------------------------------------------\n')
        client.close()
    })

    // res.render('favorite_books', {
    //     books: bookSavedList
    // })
})

app.get('/books/details/:id', function(req, res){
    //let book = books.search(req.params.id);
    //res.render('details', book)

    client.connect()
    .then(() => {
        const collection = client.db("BookDB").collection("books")
        console.log("Details Request From Client Contains : ",
                    req.params )
        let query = { id :  req.params.id}
        let options = {
            projection : {
                _id : 0,
                id : 1,
                title : 1,
                author : 1,
                review : 1,
                image : 1
            }
        }
        return collection.findOne(query, options)
    })
    .then( book => {
        console.log('FindOne ', book)
        res.render('details', book)
    })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        console.log('Close connection\n')
        console.log('-------------------------------------------\n')
        client.close()
    })
})

app.get('/books/:keywords', function(req, res){
    let keywords = req.params.keywords.split(" ")
    console.log(keywords)
    let collection
    if(keywords.length != 0)
    {
        // let bookWithKeywords = books.booksWithKeywords(keywords)
        // res.status(200).json(bookWithKeywords)
        client.connect()
        .then(() => {
            collection = client.db("BookDB").collection("books")
            for(let i = 0; i < keywords.length; i++)
            {
                keywords[i] = { $or: [ {title : {$regex: keywords[i] , $options: "i"} }, { author : {$regex: keywords[i] , $options: "i"} } ] }
            }
            console.log(keywords)
            let query = { $and: keywords}
            let options = {
                projection : {
                    _id : 0,
                    id : 1,
                    title : 1,
                    author : 1,
                    review : 1,
                    image : 1
                }
            }
            return collection.find(query, options)
        })
        .then( cursor => cursor.toArray())
        .then( bookWithKeywords => {
            console.log('List Of Favorite Books With Keywords (FindReq)\n ', bookWithKeywords)
            res.status(200).json(bookWithKeywords)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            console.log('Close connection\n')
            console.log('-------------------------------------------\n')
            client.close()
        })
    }
    else
    {
        res.status(200).json(books.listOfBooks())
    }
})

app.post('/book/update', function(req, res){
    // books.delete(req.body.id);
    // let Book = books.constructor
    // books.add(new Book(req.body.id, req.body.title, req.body.author, req.body.review, req.body.image))

    client.connect()
    .then(() => {
        const collection = client.db("BookDB").collection("books")
        console.log("Update Request From Client Contains : ",
                    req.body )
        let bookId = req.body.id
        while(bookId.length < 24)
        {
            bookId = "0" + bookId
        }
        console.log(bookId)
        let filter = { _id : new ObjectID(bookId) }
        let update = {
            $set: {
                id : req.body.id,
                title : req.body.title,
                author : req.body.author,
                review : req.body.review,
                image : req.body.image
            }
        }
        return collection.updateOne(filter, update)
    })
    .then( result => {
        console.log('Updated ', result)
        if(result.matchedCount)
        {
            res.status(201).json("Book Updated")
        }
    })
    .catch(err => {
        console.log(err)
    })
    .finally(() => {
        console.log('Close connection\n')
        console.log('-------------------------------------------\n')
        client.close()
    })

    //res.status(201).json("Updated book")
})

app.post('/book', function(req, res){
    // let Book = books.constructor
    // let book = new Book(    
    //                     req.body.id,
    //                     req.body.title,
    //                     req.body.author,
    //                     '',
    //                     req.body.image
    //                 )

    client.connect()
    .then(() => {
        const collection = client.db("BookDB").collection("books")
        console.log("Save Request From Client Contains : ",
                    req.body )
        let bookId = req.body.id
        while(bookId.length < 24)
        {
            bookId = "0" + bookId
        }
        let book = {
            _id : new ObjectID(bookId),
            id : req.body.id,
            title : req.body.title,
            author : req.body.author,
            review : '',
            image : req.body.image
        }
        return collection.insertOne(book)
    })
    .then( result => {
        console.log('Inserted ', result)
        res.status(201).json("Created book")
    })
    .catch(err => {
        console.log(err)
        res.status(409).json("Book already exist")
    })
    .finally(() => {
        console.log('Close connection\n')
        console.log('-------------------------------------------\n')
        client.close()
    })

    // if(books.add(book))
    // {
    //     res.status(201).json("Created book")
    // }
    // else
    // {
    //     res.status(409).json("Book already exist")
    // }
})

app.delete('/book/:id', function(req, res){
    //books.delete(req.params.id)
    console.log("Delete Request From Client Contains : ",
                    req.params )
    client.connect()
        .then(() => {
            const collection = client.db("BookDB").collection("books")
            let bookId = req.params.id;
            while(bookId.length < 24)
            {
                bookId = "0" + bookId
            }
            return collection.deleteOne( { _id : new ObjectID(bookId)} )
        })
        .then( result => {
            console.log('Deleted ', result)
            if(result.deletedCount)
            {
                res.status(200).json("Book Deleted")
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            console.log('Close connection\n')
            console.log('-------------------------------------------\n')
            client.close()
        })
    //res.status(200).json("Delete book")
})

app.listen(port)
