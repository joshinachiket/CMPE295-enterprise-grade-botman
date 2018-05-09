var http = require('http');
var data = JSON.stringify({
    'id': '2'
});

var options = {
    host: 'host.com',
    port: '80',
    path: '/WebServiceUtility.aspx/CustomOrderService',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data.length
    }
};

var req = http.request(options, function(res) {
    var msg = '';

    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        msg += chunk;
    });
    res.on('end', function() {
        console.log(JSON.parse(msg));
    });
});

req.write(data);
req.end();