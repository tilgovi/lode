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
  http = require('http'),
  proxy = require('./proxy'),
  chash = require('./chash'),
  sha1 = require('./sha1');

var my_chash = chash.fresh(3, {'host':'localhost', 'port':5984});

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

var port = 6984;

http.createServer(function(request, response) {
    request_url_parsed = url.parse(request.url, true);
    path_parts = request_url_parsed['pathname'].match(/[^\/$]+/g);
    if (!path_parts) {
	    response.writeHead(200, {"Content-Type": "text/plain"});
	    response.write(version);
	    response.write("\n");
	    response.end();
    }
    switch (path_parts.length) {
    case 2:
	    var db = path_parts[0];
	    var doc = path_parts[1];
	    var shard = chash.to_host(doc, my_chash);
	    proxy.proxy(shard.port, shard.host, request, response);
	    break;
    default:
	    response.writeHead(400, {"Content-Type": "text/plain"});
	    response.write(path_parts + " not handled yet.\n");
	    response.end();
	    break;
    }
  }).listen(port);
sys.puts("relax, lode listening on port " + port);
