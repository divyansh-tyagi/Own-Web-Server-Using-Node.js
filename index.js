import http from 'http';
import url from 'url';
import https from 'https';
import fs from 'fs';
import querystring from 'querystring';
import { isStaticFile, serveStaticFile } from './file-serve.js';
function handleRequestResponse(request, response){
    console.log('Request url is', request.url);
    //Homepage
    //routing
    if(request.url ==='/'){  //checking home page request
        serveStaticFile('index.html', response);
    }
    else if(isStaticFile(request.url)){ //html css image js fonts (static content server)
        
        serveStaticFile(request.url, response);
    }
    else if(request.method==='GET' && request.url.startsWith('/do-login')){
        const url = new URLSearchParams(request.url);
        let userid= '';
        let pwd = '';
        for(let i of url.entries()){
            if(userid.length==0){
            userid = i[1];
            }
            else{
                pwd = i[1];
            }
        }
        console.log('userid', userid, 'password',pwd);
        //Dynamic content 


        // const obj = url.parse(request.url);
        // console.log('Obj is', obj.query);
        // const qs = querystring.parse(obj.query);
        // console.log('QS is', qs);

        response.writeHead(200, {'Content-Type':'text/html'});

        // if(qs.userid==='Divyansh' && qs.pwd ==='@123'){
        //     response.write('<h1>Welcome User ' + qs.userid+'</h1>');
        // }
        // else
        //     response.write('<h2>Invalid Userid or Password </h2>');
        // }

        if(userid==='Divyansh' && pwd ==='@123'){
            response.write('<h1>Welcome User ' +userid+'</h1>');
        }
        else{
            response.write('<h2>Invalid Userid or Password </h2>');
        }
        response.end();
    //head
    // response.writeHead(200, {'Content-Type':'text/html'});
    // response.write(`
    //     <html>
    //     <body>
    //     <h2>Hello user</h2>
    //     <p>This is just a demo of web server </p>
    //     <p> DIVYANSH TYAGI IS LEARNING <p>
    //     </body> 
    //     `); //body`
    // response.end();
    }
    else if(request.method === 'POST' && request.url==='/do-login'){
        response.writeHead(200, {'Content-Type':'text/html'});
        let myData = '';
          request.on('data', function(chunk){
            myData = myData + chunk;
            
          })
          request.on('end', function(){
            const obj = querystring.parse(myData);

            if(obj.userid==='Divyansh' && obj.pwd ==='@123'){
                response.write('<h1>Welcome User ' +obj.userid+'</h1>');
            }
            else{
                response.write('<h2>Invalid Userid or Password </h2>');
            }
            response.end();
          });
        }
        else if(request.method === 'POST' && request.url === '/api/login'){
            let jsonData = '';
            response.writeHead(200, {'Content-Type':'application/json'});
          request.on('data', function(chunk){
            console.log("Chunk", chunk.toString());
            jsonData = jsonData + chunk.toString();
          }); 
          request.on('end', function(){
            const obj = JSON.parse(jsonData); //Deserialise(string to object)
            console.log('OBJ', obj);
            response.write(JSON.stringify(obj)); //Serialisation(object to string)
            response.end();
          }) 
        }
        else{
            // 404 error page
            serveStaticFile('404.html', response);
        }
}
const options={
    key:fs.readFileSync('/Users/divyansh/Desktop/Study/MERN/VS CODE/server-demo/own-web-server/cert/key.pem'),
    cert:fs.readFileSync('/Users/divyansh/Desktop/Study/MERN/VS CODE/server-demo/own-web-server/cert/cert.pem')
};
const server = https.createServer(options, handleRequestResponse);
server.listen(7777, function(err){
    if(err){
        console.log('Server Crash', err);
    }
    else{
        console.log('HTTP Server Up and Running');
    }
});