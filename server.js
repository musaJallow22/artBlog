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
  for (title in artGallery) {
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
  for (title in artGallery) {
    artArray.push(artGallery[title]);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('index', {
    artpieces: artArray
  });
});

//Creating our dynamic pages.
app.get('/comment', function(request, response) {
  let commentInfo = JSON.parse(fs.readFileSync('data/comments.json'));
  let comment = request.params.comment;
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('comment', {
    comments: commentInfo[comment]
  });
});
app.get('/createaboutartists', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("createaboutartists");
});
app.get('/pieces/:titlename', function(request, response) {
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
//Posting comments.
app.post('/comment', function(request, response) {
  let comment = request.body.comment;
  let commenter = request.body.commenter;
  let date = request.body.date;
  let mood = request.body.mood;
  let commentInfo = JSON.parse(fs.readFileSync('data/comments.json'));
  let newComment = {
    "comment": comment,
    "commenter": commenter,
    "date": date,
    "mood": mood,
  }
  commentInfo[comment] = newComment;
  fs.writeFileSync('data/comments.json', JSON.stringify(commentInfo));
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.redirect("/commentpage");
});
app.post('/createaboutartists', function(request, response) {
  let artist = request.body.artist;
  let time = request.body.time;
  let piece = request.body.favphoto;
  let aboutyou = request.body.aboutyou;
  let artistInfo = JSON.parse(fs.readFileSync('data/artists.json'));
  let newInfo = {
    "artist": artist,
    "time": time,
    "piece": piece,
    "aboutyou": aboutyou,

  }
  artistInfo[artist] = newInfo;
  fs.writeFileSync('data/artists.json', JSON.stringify(artistInfo));
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.redirect("/individualartist/" + artist);
});

app.get('/commentpage', function(request, response) {
  let commentPage = JSON.parse(fs.readFileSync('data/comments.json'));
  let commentArray = [];

  for (comment in commentPage) {
    commentArray.push(commentPage[comment]);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('commentpage', {
    commentinfo: commentArray
  });
});

app.get('/aboutartists', function(request, response) {
  let artPage = JSON.parse(fs.readFileSync('data/artists.json'));
  let artistArray = [];

  for (artist in artPage) {
    artistArray.push(artPage[artist]);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('aboutartists', {
    aboutart: artistArray
  });
});

app.get('/comments', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render("comments");
});

app.get('/individualartist/:artist', function(request, response) {
  let aInfo = JSON.parse(fs.readFileSync('data/artists.json'));
  let artist = request.params.artist;
  response.status(200);
  response.setHeader('Content-Type', 'text/html');
  response.render('individualartist', {
    artinfotwo: aInfo[artist]
  });

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
