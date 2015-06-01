var fs = require('fs')
var path = require('path')
var Client = require('ftp')

// this class does all the "work"
function Worker(options, config) {
	this.options = JSON.parse(options)
	this.config = JSON.parse(config)
	this.localCwd = ''
	this.remoteCwd = ''
	this.client = new Client()
}

// main method, connects to the server and start the all the works
Worker.prototype.run = function() {
	var self = this
	self.client.on('ready', function() {
		self.readDir(self.options.local)
	})
	self.client.connect(self.config)
}
 
// read the root directory recursively
Worker.prototype.readDir = function(dirName) {
	var self = this
	self.watch(dirName)
	fs.readdir(dirName, function(err, files) {
		if (err) {
			return false
		}
		files.forEach(function(file) {
			var abspath = dirName + '\\'+ file
			var fileStat = fs.statSync(abspath)
			if (fileStat.isDirectory() && self.options.ignore.indexOf(file) < 0) {
				self.readDir(abspath)
			}
		})
	})
} 
 
// Watch a directory and upload the files as they are changed
Worker.prototype.watch = function(dir) {
	var info = this.getInfo(dir), self = this
	fs.watch(dir, function(evnt, filename) {
		if (evnt === 'change') {
			self.client.cwd(info.remote, function(err) {
				if (err) {
					self.handleError(err.code, info, filename, self.put.bind(self))
				} else {
					self.put(info, filename)
				}
			})
		}
	})
}

// Handles any errors 
Worker.prototype.handleError = function(code, currentInfo, currentFile, callback) {
	var self = this
	if (code === 550) {
		self.client.mkdir(currentInfo.remote, true, function(err) {
			if (err) {
				self.handleError(err.code, currentInfo, currentFile, callback)
			} else {
				callback(currentInfo, currentFile)
			}
		})
	} else {
		console.log(err)
	}
}

// Put files on the server
Worker.prototype.put = function(info, filename) {
	var self = this
	self.client.put(path.join(info.local, filename), filename, function(err) {
		if (err) {
			self.handleError(err.code, info, filename, self.put.bind(self))
		} else {
			self.notifyPutEvent(info, filename)
		}
	})
}

// prints to stdout the "put" event
Worker.prototype.notifyPutEvent = function(info, filename) {
	var self = this
	var output = ''
	output += filename
	output += "  |  "
	output += this.config.host
	console.log(output) 
}

// get useful info about a given directory
Worker.prototype.getInfo = function(dir) {
	var offset = dir.replace(this.options.local, '')
	return {
		local: dir,
		offset: offset,
		remote: this.getRemotePath(offset)
	}
}

// get the local absolute path
Worker.prototype.getLocalPath = function(path) {
	return this.options.local + '\\'+ path
}

// get the remote absolute path
Worker.prototype.getRemotePath = function(path) {
	return this.options.remote + path.replace(/\\/g, '/')
}

var args = process.argv.slice(2)
var worker = new Worker(args[0], args[1])
worker.run()