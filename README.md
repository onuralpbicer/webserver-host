# Webserver
A webserver that routes traffic to multiple projects based on the subdomain and the url path. 

The incoming request gets routed to the relevant project based on subdomain. 

Then if the path of the request starts with `api` (configurable through `.env` file), it gets routed to the correct port. Otherwise, the matching file is served.

## Options (.env file)
```
HOSTNAME=your domain
HTTP_PORT=port to listen for incoming http requests
PROJECTS_BASE_LOCATION=base directory where the app will look for projects
PORT_FILE=name of the file used to read the port for the project (can be omitted if no backend for that project)
BASE_API_PATH=urls that start with this are considered "api" requests and are piped to the correct port
```

## Disclaimer
Use at your own risk. I am using this on my home raspberrypi but I do NOT guarantee any security with this code. There is no authentication. Any authN and authZ should be done in the child webservers hosting their own applications. This is only an entry point that serves webpages and tunnels into the port of the specific backend webserver for that project.

## TODO:
* HTTPs Support
* Test websocket/socketio support
* 