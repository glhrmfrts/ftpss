# ftpss
A module to sync server files with local files

Due to my previous ftp related module performance issues in my work computer (the python proccesses were frozing), i had to switch the platform and i'm very glad i did it. This nodejs module is way better and faster, as i use the built-in File System method `fs.watch()` to watch directories (also it's nicer to use with task runners). There's still things to improve, but since this is mainly for my own use (and learning), it will take some time.

## Installing
Simply

`npm install ftpss`

## Using
The main method looks like this:

`ftpss(options, config)`

Where `options` is an object containing the following properties:

- **local (String)**: Local path to a project
- **remote (String)**: Remote path (on the server) to a project
- **ignore (Array)**: List of files and folders to ignore

And `config` is also an object that contains:

- **host (String)**: The host domain of the server
- **user (String)**: Username for login
- **password (String)**: Password for login
- **port (Integer)**: (Optional) port to connect to the server, default is 21

A complete example looks like this:

```js
var ftpss = require('ftpss')

var options = {
  local: 'C:\\local\\path',
  remote: '/www/remote/path',
  ignore: ['node_modules', 'etc']
}

var config = {
  host: 'ftp.host.com.br',
  user: '****',
  password: '****',
  port: 21
}

ftpss(options, config)
```

Since the call to `ftpss(options, config)` is non-blocking, it's possible to watch multiple projects/directories. Just be kind to your CPU and memory.

That's it, Danke.
