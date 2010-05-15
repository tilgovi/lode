var biginteger = require('./biginteger'),
    sys = require('sys'),
    sha1 = require('./sha1');

exports.fresh = function(shard_count, seed_node) {
    var max = biginteger.BigInteger(2).pow(160).subtract(1);
    var inc = max.divide(shard_count);
    var result = {pos:[], owner:[]};
    for (var i=0; i<shard_count; i++) {
	result.pos.push(inc.multiply(i).toString(16));
	result.owner.push(seed_node);
    }
    return result;
};

exports.to_host = function(key, a_hash) {
    var digest = sha1.hex_sha1(key);
    for (var i=0; i<a_hash.pos.length; i++) {
	if (a_hash.pos[i] > digest) {
	    return a_hash.owner[i];
	}
    }
    return a_hash.owner[0];
}
