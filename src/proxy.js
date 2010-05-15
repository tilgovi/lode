var http = require('http');

exports.proxy = function(proxy_port, proxy_host, client_req, client_resp) {
    var proxy_req = http.createClient(proxy_port, proxy_host).request(
	client_req.method, client_req.url, client_req.headers);
    proxy_req.addListener('response', function (proxy_resp) {
	    client_resp.writeHeader(proxy_resp.statusCode, proxy_resp.headers);
	    proxy_resp.addListener('data', function (chunk) {
		    client_resp.write(chunk);
		});
	    proxy_resp.addListener('end', function () {
		    client_resp.end();
		});
	});
    client_req.addListener('data', function (chunk) {
	    proxy_req.write(chunk);
	});
    client_req.addListener('end', function() {
	    proxy_req.end();
	});
};
