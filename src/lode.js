// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

var sys = require("sys"),
  http = require('http'),
  url = require('url'),
  crc = require('./crc32'),
  shards = require('./shards');

var version = "0.0.1";
var debug = true;

function handle_request(client_request, client_response) {
  request_url_parsed = url.parse(client_request.url, true);
  path_parts = request_url_parsed['pathname'].match(/[^\/$]+/g);

  if(!path_parts) {
	client_response.sendHeader(200, {"Content-Type": "text/plain"});
	client_response.sendBody("lode version " + version);
	client_response.finish();
	return;
  }

  //This should probably turn into something like couch's *_handlers conf
  switch(path_parts.length) {
	case 1: //root space request (_all_tasks and the like)
	  handle_basic_request(client_request, client_response, path_parts);
	  break;
	case 2: //db request
	  handle_db_request(client_request, client_response, path_parts);
	  break;
	default:
	  client_response.sendHeader(200, {"Content-Type": "text/plain"});
	  client_response.sendBody("Check back soon...");
	  client_response.finish();
  }
};

function handle_basic_request(client_request, client_response, path_parts) {
  client_response.sendHeader(200, {"Content-Type": "text/plain"});
  client_response.sendBody("Nothing here yet");
  client_response.finish();
};

function handle_db_request(client_request, client_response, path_parts) {
  db_name = path_parts[0];
  client_response.sendHeader(200, {"Content-Type": "text/plain"});
  client_response.sendBody("Nothing here yet, but here are the replica uris by shard\n");
  shards.shards(db_name).forEach(
	function(repls, shard_no) {
	  client_response.sendBody("Shard " + shard_no + "\n");
	  repls.forEach(
		function(uri) {
		  client_response.sendBody("\t" + uri + "\n");
		});
	});
  client_response.finish();
}

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
