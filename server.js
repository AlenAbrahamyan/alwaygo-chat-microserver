const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(8080).sockets;
let msg_arr;
let aaaa = 1;



// Connect to mongo
mongo.connect('mongodb://alwaygo:alwaygo123@ds249967.mlab.com:49967/alwaygo', function(err, db){
    if(err){
        throw err;
    } 

    console.log('MongoDB connected...');


    // Connect to Socket.io
    client.on('connection', function(socket){
        const MessagesStore = db.collection('messagesstores');

        let user, friend_user, location;

        socket.on('location', function(data){
            location = data.location;
            client.emit('get_location', {location_f: data.location});
        })

        socket.on('info', function(data){
            user = data.user;
            friend_user = data.friend_user;

            

            MessagesStore.findOne({username: user.username}).then(data_msg=>{
                data_msg.messages.map( obj_chat => {
                    if(obj_chat.friend === friend_user.username){
                        client.emit('get_messages', {user:user.username, friend:obj_chat.friend, msg:obj_chat.msg});
                    }
                })
            })


        })

      



        socket.on('send_msg', (data) => {
            let message = data.message;

            if(message == ''){
               
                //nothing

            } else {


              
 
                MessagesStore.findOne({username: user.username}).then(data_msg=>{
                    data_msg.messages.map( obj_chat => {
                        if(obj_chat.friend === friend_user.username){
                            obj_chat.msg.push({name:user.username, msg: message })
                            client.emit('get_messages', {user:user.username, friend:friend_user.username, msg:obj_chat.msg});
                           
                            
                        }
                    })
                    MessagesStore.updateOne( {username: user.username} , data_msg, function(err){
                        if(err){
                        console.log(err); 
                        return;} else {}});

                    MessagesStore.findOne({username: friend_user.username}).then(data_msg2=>{
                        data_msg2.messages.map( obj_chat2 => {
                            if(obj_chat2.friend === user.username){
                                obj_chat2.msg.push({name:user.username, msg: message })
                                client.emit('get_messages', {user:friend_user.username, friend:user.username, msg:obj_chat2.msg});
                            }
                        })

                        MessagesStore.updateOne( {username: friend_user.username} , data_msg2, function(err){
                            if(err){
                            console.log(err); 
                            return;} else {}});

                    })


                    
                })
                
            }
        });

    });
});