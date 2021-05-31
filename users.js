const users =[]

//toma el id, el nombre y la sala, y verifica errores: 
const createUser = (id, nickname, room) => {
    const existingUser = users.find(user => user.nickname === nickname)
    if (existingUser){
        return undefined;
    }
    // En caso de no haberse creado uno, se hace push en users[]
    const user = { id, nickname, room }
    users.push(user)
    users.forEach(function(nickname){
        console.log(users)
    })
    return user 
}

//funcion solo validacion de errores
const validateUser = (nickname,room) =>{
let error = ''
    if(!nickname){
        error = 'No existe nickname'
    } else if (!room){
        error = 'No existe room'
    }else if (users.find(user => user.nickname === nickname)){
        error = 'Usuario existente, por favor usar otro'
    }      
return error
}

//toma o busca el usuario de acuerdo a su ID 
const getUser = id =>{

    let user = users.find(user => user.id ==id)
    return user

}

//Elimino usuarios tomando como base su ID
const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0]; //Splice elimina elementos de un array o agrega uno nuevo.
}

//Devuelvo usuarios de la matriz users.
const getUsers = (room) => users.filter(user => user.room === room)

module.exports = { createUser, getUser, deleteUser, getUsers, validateUser}
