var http = require('http');
var fs = require('fs');
var mammoth = require('mammoth');

http.createServer(function (req, res) {
    // Read the DOCX file
    fs.readFile('vamsi.docx', function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('File not found');
            return res.end();
        }

        // Convert DOCX to HTML using Mammoth
        mammoth.convertToHtml({ buffer: data })
            .then(function(result) {
                var html = result.value; // The generated HTML
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(html); // Send the HTML content
                return res.end();
            })
            .catch(function(err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Error processing document');
                return res.end();
            });
    });
}).listen(3030);

console.log("Server is connected and running on port 3030");
