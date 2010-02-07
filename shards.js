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

var shard_map = {
  'nodes': ['http://localhost:5984/', 'http://localhost:5984/'],
  'shards': [[0,1], [1,0]]
};

//dbname -> dbname$0, etc. Change for loop-back replication resharding.
var shard_index_sep = '$';

exports.shards = function(db_name) {
  return shard_map['shards'].map(
	function(repls, shard_no) {
	  return repls.map(
		function(node_idx) {
		  return shard_map['nodes'][node_idx] +	[db_name, shard_no].join(shard_index_sep);
		});
	  });
};

exports.hash = function(key) {
  return (require('./crc32').crc32(key) >> 16) % shard_map['shards'].length;
};
