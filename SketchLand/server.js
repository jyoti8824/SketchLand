const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const path = require( 'path' );

const app = express();
const port = 3000;

// Middleware
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );


// Serve static files from the 'public' directory
app.use( express.static( path.join( __dirname ) ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Error handling middleware
app.use( ( err, req, res, next ) => {
    console.error( err.stack );
    res.status( 500 ).send( 'Something broke!' );
} );

// Routes

app.get( '/favicon.ico', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'favicon.ico' ) );
} );

app.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'index.html' ) );
} );

app.get( '/gallery', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'gallery.html' ) );
} );

app.get( '/learn', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'learn.html' ) );
} );

app.get( '/about', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public', 'about.html' ) );
} );

// In-memory storage for comments (replace with a database in a production environment)
// comment handling
let comments = [];

app.post( '/submit-comment', ( req, res ) => {
    const { name, comment } = req.body;
    const newComment = { name, comment, date: new Date().toLocaleString() };
    comments.push( newComment );
    res.json( newComment );
} );

app.get( '/get-comments', ( req, res ) => {
    res.json( comments );
} );

//server debugging 
process.on( 'uncaughtException', ( err ) => {
    console.error( 'Uncaught Exception:', err );
    process.exit( 1 );
} );

process.on( 'unhandledRejection', ( reason, promise ) => {
    console.error( 'Unhandled Rejection at:', promise, 'reason:', reason );
    // Application specific logging, throwing an error, or other logic here
} );

// Start the server
app.listen( port, () => {
    console.log( `Server running at http://localhost:${port}` );
} );