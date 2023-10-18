// create web server
// start server: node comments.js
// test in the browser: http://localhost:3000/comments.html
// test in the browser: http://localhost:3000/comments.html?user=1&comment=hello
// test in the browser: http://localhost:3000/comments.html?user=2&comment=world
// test in the browser: http://localhost:3000/comments.html?user=3&comment=bye

var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var comments = [];

var server = http.createServer(function(req, res) {
  var path = url.parse(req.url).pathname;
  var query = url.parse(req.url).query;
  var params = querystring.parse(query);

  if (path === '/comments.html') {
    if (req.method === 'POST') {
      var data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        var params = querystring.parse(data);
        comments.push(params);
        res.writeHead(302, {'Location': '/comments.html'});
        res.end();
      });
    } else {
      var html = fs.readFileSync('comments.html');
      var template = html.toString();
      var commentList = '';
      for (var i = 0; i < comments.length; i++) {
        commentList += '<li>' + comments[i].user + ': ' + comments[i].comment + '</li>';
      }
      var output = template.replace('<!-- comments -->', commentList);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(output);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
console.log('Server running at http://localhost:3000');
