var child_process = require('child_process')
var path = require('path')

// This is only to avoid "undefined properties" errors
var defaultOptions = {
	local: '',
	remote: '',
	ignore: []
}

module.exports = function(options, config) {

	/* 
	 * Stringify the options and config objects, since we can only pass
	 * strings as arguments to child processes
	 */
	options = JSON.stringify(options || defaultOptions)
	config = JSON.stringify(config)

	var worker = child_process.fork(path.join(__dirname, 'worker'), [options, config])
	
	// This is temp
	return worker
}