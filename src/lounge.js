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

var http = require('http'),
  couch = require('./node-couch'),
  crc = require('./crc32');

var lounge = {
  couch_api_version : "0.11.0",

  shard_map : {
	nodes : [[5984, 'localhost'], [5984, 'localhost']],
	shards : [[0,1], [1,0]]
  },

  shard_sep : '$',

  shards : function(db_name) {
	return this.shard_map['shards'].map(
	  function(repls, shard_no) {
		return couch.CouchDB.db.apply(
		  repls.map(
			function(node_idx) {
			  return [[db_name, shard_no].join(this.shard_sep)].concat(this.shard_map['nodes'][node_idx]);
			}));
	  });
  },

  hash : function(key) {
	return((crc.crc32(key) >> 16) % this.shard_map['shards'].length);
  }
};

exports.createServer = function(request_listener, options) {
	return http.createServer(
	  function(request, response) {
		request_listener.call(lounge, request, response);
	  });
};
