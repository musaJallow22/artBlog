//Eli Rapport and Musa Jallow
//1.4.2022
//Using Express, FS, and EJS.
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

//Creating an Object.
const app = express();

//Parsing JSON, encoding URLS, accessing assets, and specifying things.
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library,

//Setting landing page to index.ejs?
app.get('/', function(request, response) {
  let artGallery = JSON.parse(fs.readFileSync('data/artposts.json'));
  let artArray = [];
  for(title in artGallery){
    artArray.push(artGallery[title]);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('index', {
    artpieces: artArray
  });
});

app.get('/index', function(request, response) {

  let artGallery = JSON.parse(fs.readFileSync('data/artposts.json'));
  let artArray = [];
  for(title in artGallery){
    artArray.push(artGallery[title]);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('index', {
    artpieces: artArray
  });
});

//Creating our dynamic pages.
app.get('/createaboutartists', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("createaboutartists");
});
app.get('/pieces/:titlename', function(request, response){
  let artInfo = JSON.parse(fs.readFileSync('data/artposts.json'));
  let titlename = request.params.titlename;
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('artpage', {
    art: artInfo[titlename]
  });
});
app.get('/post', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("post");
});
//Posting to post page.
app.post('/post', function(request, response) {
  let titlename = request.body.titlename;
  let artistname = request.body.artistname;
  let datetime = request.body.datetime;
  let photolink = request.body.photolink;
  let artiststatement = request.body.artiststatement;
  //Writing it to the JSON.
  let artInfo = JSON.parse(fs.readFileSync('data/artposts.json'));
  let newPiece = {
    "title": titlename,
    "artist": artistname,
    "date": datetime,
    "photo": photolink,
    "statement": artiststatement,
  }
  artInfo[titlename] = newPiece;
  fs.writeFileSync('data/artposts.json', JSON.stringify(artInfo));

  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  //Redirecting.
  response.redirect("/pieces/" + titlename);


});
/*
app.get('/artpage', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("artpage");
});
*/
app.get('/aboutartists', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("aboutartists");
});

app.get('/comments', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("comments");
});

//In case of an error or invalid path.
app.use("", function(request, response) {
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode": "404"
  });
});

//Start server.
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started at http://localhost:' + port + '.')
});
