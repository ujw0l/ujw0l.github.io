
var http = require('http');

http.createServer(function(request, response) {     
  request.on('data', function (chunk) {  
    console.log("Received body data", chunk.toString());
    // chunk is received, process it as you need
  }); 
  request.on('end', function() {
    // http request is competed, send response to client
    response.writeHead(200, "OK", {'Content-Type': 'text/html'});
    response.end("this is server response");
  })
}).listen(3000);