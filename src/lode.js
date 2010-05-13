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
    url = require('url'),
    lounge = require('./lounge');

var debug = true;

var version = toJSON(
  {
	couchdb : "Welcome",
	version : "0.10.0",
	lounge : {
	  lode : "Totally nodular, dude",
	  version : "0.0.1"
	}
  }
);

function toJSON(obj) {
    return obj !== null ? JSON.stringify(obj) : null;
}

function handle_request(client_request, client_response) {
  request_url_parsed = url.parse(client_request.url, true);
  path_parts = request_url_parsed['pathname'].match(/[^\/$]+/g);

  if(!path_parts) {
	client_response.writeHead(200, {"Content-Type": "text/plain"});
	client_response.write(version);
	client_response.end();
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
	client_response.writeHead(400, {"Content-Type": "text/plain"});
	client_response.write("Check back soon...\n");
	client_response.end();
  }
};

function handle_basic_request(client_request, client_response, path_parts) {
  client_response.writeHead(400, {"Content-Type": "text/plain"});
  client_response.write("Nothing here yet.\n");
  client_response.end();
};

function handle_db_request(client_request, client_response, path_parts) {
  db_name = path_parts[0];
  client_response.writeHead(400, {"Content-Type": "text/plain"});
  client_response.write("Nothing here yet.\n");
  client_response.end();
}

var port=6984;
lounge.createServer(
  function(request, response) {
	try {
	  handle_request(request, response);
	} catch(err) {
	  response.writeHead(500, {"Content-Type": "text/plain"});
	  response.write("Internal Server Error\n");
	  if(debug) {
		response.write(err.stack);
	  }
	  response.end();
	}
  }
).listen(port);
sys.puts("relax, lode listening on port " + port);
