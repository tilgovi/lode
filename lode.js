var sys = require("sys"),
  http = require('http'),
  url = require('url'),
  crc = require('./crc32');

var shard_map = {
  'nodes': ['http://localhost:5984/', 'http://localhost:5984/'],
  'shards': [[0,1], [1,0]]
};

//dbname -> dbname$0, etc. Change for loop-back replication resharding.
var shard_index_sep = '$';

http.createServer(
  function (client_request, client_response) {
	request_url_parsed = url.parse(client_request.url, true);
	path_parts = request_url_parse['pathname'].split('/');
  }).listen(6984);
sys.puts("Server running at http://127.0.0.1:6984/");
