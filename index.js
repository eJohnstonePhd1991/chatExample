var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
app.get('/', (req,res)=> {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{

    // sends a message to other users that a new user has joined
    
    
    //Event that sends new messages to everyone on the server
    socket.on('sent message', (data)=>{
        socket.broadcast.emit('recieve message', data);
    });
    
    //new user logs in
    socket.on('newUsername', (data)=>{
        console.log("username is " + data);
        socket.name = data;
        //Adds name to current users
        users.push(data);
        //Notifies all other users
        console.log(users);
        socket.broadcast.emit('online', data);
        
        //TODO send list of current users to new socket
        io.emit('updateUsers', users);
    })
    socket.on('disconnect', ()=>{
        // sends a message to other users that a user has left
        socket.broadcast.emit('offline', socket.name);
        //remove name from list
        var index = users.indexOf(socket.name);
        users.splice(index,1);
        
        console.log(users);
        io.emit('updateUsers', users);
    })
});

http.listen(3000, ()=>{
    console.log('listening on *:3000');
});