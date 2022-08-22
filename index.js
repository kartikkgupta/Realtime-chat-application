// Node server which will handle socket io connections
const io = require('socket.io')(8000)//using socket io at 8000 port

const users = {};

io.on('connection', socket =>{ //io.on listens to every connection while socket.on listens to that particular connection
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        console.log("New user",name)
        users[socket.id] = name;       //gives new user their key as name
        socket.broadcast.emit('user-joined', name);   //announces joining of user to all user except new one
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
    
    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})