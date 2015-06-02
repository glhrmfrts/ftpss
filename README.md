# ftpss
A module to sync server files with local files

Due to my previous ftp related module performance issues in my work computer (the python proccesses were frozing), i had to switch the platform and i'm very glad i did it. This nodejs module is way better and faster, as i use the built-in File System method `fs.watch()` to watch directories (also it's nicer to use with task runners). There's still things to improve, but since this is mainly for my own use (and learning), it will take some time.

## Installing
Simply

`npm install ftpss`

## Using
Just

```js
var ftpss = require('ftpss')

var options = {
  
  // local path to the project
  local: 'C:\\local\\path',
  
  // remote path to the project
  remote: '/www/remote/path',
  
  // list of files and folders to ignore
  ignore: ['node_modules', 'etc']
}

var config = {

  // the host domain
  host: 'ftp.host.com.br',
  
  // user for login
  user: '****',
  
  // password for login
  password: '****' 
}

ftpss(options, config)
```

That's it, Danke.
