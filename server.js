const app = require('express')()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000
const cors = require ('cors')
const { createUser, getUser, deleteUser, validateUser } = require('./users')


//Inicializo la instancia de Socket.io y le pago el servidor HTTP
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

/// creo 3 eventos, el login o inicio de chat y parametros, sendmessage envio de mensajes y el disconnect, para finalizacion del usuario
//io.on = eventos de escucha => los activara el front.
io.on('connection', (socket) => {
    //pasamos user y room a la funcion add user
    socket.on('login', (nickname, room) => {
        //si hay un error, devolvemos los errores expuestos en user
        const error = validateUser(nickname, room)
        if (error) {
            io.emit('error', `${error}`)
            console.error(error)
        } else {
            const user = createUser(socket.id, nickname, room)
            if (user) {
                //sino hay error, el socket.join, ingresara el usuario a la room correspondiente
                socket.join(user.room)
                console.log('el usuario', user.nickname, 'fue incluido en la sala', user.room)
                io.to(user.room).emit('notify', `${user.nickname} se unio al chat`)
            }
        }
    })

    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('broadcast', user.nickname, message);
        console.log(message)

    })

    socket.on('disconnect', () => {

        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('logout', `${user.nickname} dejo el chat`)
        }

    })
})


app.get('/', (req, res) => res.send('hello!'));

http.listen(3000, () => {
    console.log('listening on *:3000');
});
