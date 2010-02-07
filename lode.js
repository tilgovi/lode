var sys = require("sys"),
  http = require('http'),
  url = require('url'),
  crc = require('./crc32');

var debug = true;

var shard_map = {
  'nodes': ['http://localhost:5984/', 'http://localhost:5984/'],
  'shards': [[0,1], [1,0]]
};

//dbname -> dbname$0, etc. Change for loop-back replication resharding.
var shard_index_sep = '$';

handle_request = function(client_request, client_response) {
  request_url_parsed = url.parse(client_request.url, true);
  path_parts = request_url_parsed['pathname'].match(/[^\/$]+/g);
  client_response.sendHeader(200, {"Content-Type": "text/plain"});
  client_response.sendBody("Check back soon...");
  client_response.finish();
};

http.createServer(
  function(request, response) {
	try {
	  handle_request(request, response);
	} catch(err) {
	  response.sendHeader(500, {"Content-Type": "text/plain"});
	  response.sendBody("Internal Server Error\n");
	  if(debug) {
		response.sendBody(err.stack);
	  }
	  response.finish();
	}
  }
).listen(6984);
sys.puts("Server running at http://127.0.0.1:6984/");
