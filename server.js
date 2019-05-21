const fs = require('fs');
const net = require('net');
let clients = [];
let messages = [];
let server = net.createServer(socket => {
    clients.push(socket);
    console.log(`Client ${clients.indexOf(socket).toString()} Connected\n`);
    for (let i = 0; i < clients.length; i++) {
        clients[i].write(`Client ${clients.indexOf(socket).toString()} Connected\n`);
    }
    socket.write(`welcome to the chatroom, you are Client ${clients.indexOf(socket).toString()}.`);
    socket.on('data', data => {
        console.log(`Client ${clients.indexOf(socket).toString()}: ${data}`);
        handleData(data, socket);
        messages.push(`Client ${clients.indexOf(socket).toString()}: ${data}`);
        fs.writeFile('data.txt', messages, 'utf8', function (err) {
            if (err) return console.log(err);
            // console.log('Messages Logged.');
        });
    });
    socket.on('end', () => {
        console.log(`Client ${clients.indexOf(socket).toString()} Disconnected.`);
        for (let i = 0; i < clients.length; i++) {
            if (clients[i] != clients[clients.indexOf(socket)]) {
                clients[i].write(`Client ${clients.indexOf(socket).toString()} Disconnected.`);
            }
        }
        // console.log(`Client ${clients.indexOf(socket).toString()} Disconnected.`);
        clients.splice(clients.indexOf(socket));
    });
}).listen(5000);
console.log('Server Listening on Port: 5000.');
server.on(`error`, (err)  => {
    console.log('error --');
    throw err;
});
server.on('data', data => {
    console.log(`Client: ${data}`);
    handleData(data)
});
function handleData(data, socket){
    if (data) {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i] != clients[clients.indexOf(socket)]) {
                clients[i].write(`Client ${clients.indexOf(socket).toString()}: ${data}`);
            }
        }
    }
}