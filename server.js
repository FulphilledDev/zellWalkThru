// First AFTER creating a 'server.js' file
console.log('May Node be with you')


// This AFTER 'npm install express --save'
// --> To use express by requiring it
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();


// =====================
// Link to Database
// =====================

// Update environment variables
// @see https://zellwk.com/blog/environment-variables/
// require('./dotenv')

// Replace provess.env.DB_URL with actual connection string
let dbconnectionString = 'mongodb+srv://dev_phits:Coder4Life@cluster0.lus2c.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(dbconnectionString, { useUnifiedTopology: true })
    .then(client => {

        // Log notification we are connected to client
        console.log('Connected to Database');

        // Renaming  db to remember what we are working on
        const db = client.db('star-wars-quotes');

        // Create a collection to store items in db ('db.collection('name'))
        const quotesCollection = db.collection('quotes');

        // ====================
        // Middlewares
        // ====================

        // After installing EJS, 'set' the 'view engine' to 'ejs'
        app.set('view engine', 'ejs')

        // 'urlencoded' within bodyParser extracts data from <form> and ADD to 'body' 
        // property in REQ object
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json()); // This was not in my original code
        app.use(express.static('public')); // ^^Same

        // ====================
        // Routes
        // ====================

        // To show quotes now in MongoDb back to users...
        // --> 1. Get from db ('.find')
        // --> 2. Render quotes in html with a template engine
        // to show list of quotes to users
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(quotes => {
                    res.render('index.ejs', { quotes: quotes })
                    // *** THIS KEEPS SAYING 'data' is NOT DEFINED *** when requesting localhost:3000
                })
                .catch(error => console.error(error))
        })

        // POST
        app.post('/quotes', (req, res) => {
            // Inserted following 4 lines of code [excluding commented out log] @page 18: ended up only logging as object, not a 'big scary' thing like zell said
            // --> 'insertOne' allows us to store object in collection of db
            quotesCollection.insertOne(req.body)
                .then(result => {
                    // At this point, browser is is expecting a response, but NO NEED for this submission of information..
                    // --> so 'redirect' them to the mainpage instead ('/')
                    res.redirect('/')
                })
                //console.log(req.body);
                .catch(error => console.error(error))
        });

        // DELETE
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vada\'s quote')
                })
                .catch(error => console.error(error))
        });

        // UPDATE




        // ==================
        // Listen
        // ==================

        // Creating a server that browsers can connect to...
        const isProduction = process.env.NODE_ENV === 'production';
        const port = isProduction ? 8000 : 3000;
        app.listen(port, function () {
            console.log(`listening on ${port}`);
        })
    })
    .catch(console.error)


/////
/////   --> and render the HTML ***** WHERE THE FUCK DOES THIS GO!?! *****
/////   res.render(view, locals)
/////
/////
/////
/////
/////   To handle a 'GET' request, in express, use its 'GET' method
/////   --> Example: app.get(endpoint, callback)
/////   'endpoint' is the value that comes AFTER the DOMAIN NAME
/////   'callback' tells server what to do WHEN requested endpoint matches. Takes in 2 arguments: 'request', 'response'
/////
/////    To serve up an 'index.html' file page back to the browser: Use 'sendFile' method provided by 'res' (response) object
/////
/////    app.get('/', (req, res) => {
/////        res.sendFile(__dirname + '/index.html'); //'__dirname' is current directory we are in;
/////    })
/////
/////    Now PAUSE and make the 'index.html' file that we dont have yet...HA!
/////
/////    THEN install nodemon for live updates to server
/////    BUT
/////    ONLY use WHEN DEVELOPING stuff, NOT on ACTUAL SERVER
/////       // For a little bit of EXTRA: can run nodemon by './node_modules/.bin/nodemon server.js'
/////       // --> More simply: in 'package.json' add ' "scripts": { "dev": "nodemon server.js" } '
/////       // --> --> THEN In terminal: 'npm run dev' to trigger nodemon sever.js
/////
/////    ------ CRUD ------
/////    CREATE: only if send POST req
/////    --> Can be triggered through a <form> element
/////    Form requires 3 things:
/////    --> 'action=' attribute: WHERE (file) to send req (In server.js file, req is same as PATH value)
/////    --> 'method=' attribute
/////    --> 'name=' attribute for each '<input>' element
/////
/////         // ***** IMPORTANT NOTE *****: Express doesnt handle reading data from form on its own...
/////         // SOOOOO, ADD another package 'body-parser'(middleware): 'npm install body-parser --save'
/////         // --> ** ^^ ** Place 'body-parser' BEFORE CRUD handlers (get, post, etc.) [Check back at top under 'app.listen']
/////         // --> To USE middleware: 'USE' method of EXPRESS
/////
/////    NEXT: Enter MongoDB --> Store information to REMEMBER and RETRIEVE information of viewers
/////    --> Terminal: 'npm install mongodb --save'
/////    --> Connect to MongoDB through 'MongoClient...'
/////
/////    After installing EJS, 'set' the 'view engine' to 'ejs'
/////    app.set('view engine', 'ejs')
/////
/////    // ***** // --> and render the HTML ***** WHERE THE FUCK DOES THIS GO!?! *****
/////    // ***** // res.render(view, locals)
/////
/////    Put previous request handlers from express (that are commented about above) into the MongoClient's '.then' call here...


