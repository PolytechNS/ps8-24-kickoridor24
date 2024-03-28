const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const jwt = require("jsonwebtoken");

const argument = process.argv[2];

let uri;
if(argument === "dev"){
    console.log("mongo dev on localhost");
    uri = 'mongodb://localhost:27017';
}else{
    console.log("mongo prod on mongo");
    uri = 'mongodb://mongo:27017';
}

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            useUnifiedTopology: true
        }
    }
);

async function handleBDD(request, response) {
    await client.connect();
    if (request.method === "POST" && request.url === "/api/signup") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                const user = await findUser(data);
                if (user != null) {
                    response.statusCode = 400;
                    // await client.close();
                    response.end("Username already taken");
                } else {
                    const dataToHash = {
                        email: data.email,
                        password: data.password
                    }
                    token = generateAccessToken(dataToHash);

                    const dataToSend = {
                        username: data.username,
                        elo: '0',
                        img: 'images/photoProfil/Mitroglu.png',
                        celebration:'images/celebration/SIUU',
                        token: token,
                        friendList: [],
                        demandes: []
                    }
                    saveUser(dataToSend).then(async() => {
                            response.statusCode = 200;
                            // await client.close();
                            response.end("ok");
                        }
                    );

                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/login") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const user = await findUser(data)
                if (user != null) {
                    const token = verifyAccessToken(user.token);
                    // await client.close();
                    if (token.data.password === data.password) {
                        response.statusCode = 200;
                        response.end("ok");
                    } else {
                        response.statusCode = 401;
                        response.end("Invalid password");
                    }
                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }  else if (request.method === "POST" && request.url === "/api/retrieveUser") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {

                const data = JSON.parse(body);

                const user = await findUser(data)

                if (user != null) {
                    const token = verifyAccessToken(user.token);
                    const jsonResponse = {};
                    jsonResponse["username"] = user.username;
                    jsonResponse["img"] = user.img;
                    jsonResponse["celebration"] = user.celebration;
                    jsonResponse["email"] = token.data.email;
                    jsonResponse["password"] = token.data.password;
                    await client.close();
                        response.statusCode = 200;
                        response.write(JSON.stringify(jsonResponse));

                        response.end();
                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/gameSave") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                const dataToHash = {
                    board: data.board,
                    tour: data.tour,
                    typeDePartie: data.typeDePartie
                }
                token = generateAccessToken(dataToHash);
                // await client.close();
                const dataToSend = {
                    username: data.username,
                    board: data.board,
                    tour: data.tour,
                    typeDePartie: data.typeDePartie
                }

                saveGameState(dataToSend).then(r => {
                    response.statusCode = 200;
                    response.end("ok");
                });
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/gameRetrieve") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const gameState = await findGameState(data)
                // await client.close();
                if (gameState != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(gameState));
                    response.end();
                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });

    } else if (request.method === "POST" && request.url === "/api/gameDelete") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const deleteGame = await deleteGameState(data);
                // await client.close();
                if (deleteGame != null) {
                    response.end("ok");
                } else {
                    response.statusCode = 404;
                    response.end("No player found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/sendMessage") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const conversationID = await getConversationID(data);
                const dataToSend = await sendMessageData(data, conversationID._id);
                // await client.close();
                response.statusCode = 200;
                response.end("ok");
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/getMessages") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {

                const data = JSON.parse(body);

                const conversationID = await getConversationID(data);

                const messages = await getMessages(data, conversationID);


                // await client.close();

                response.setHeader('Content-Type', 'application/json');

                response.write(JSON.stringify(messages));

                response.end();

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });

    } else if (request.method === "POST" && request.url === "/api/FindFriends") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const players = await findFriends(data);
                // await client.close();
                if (players != null) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));
                    response.end();
                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/askFriend") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await askFriend(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/askFriendsList") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                const players = await askFriendsList(data);
                // await client.close();
                if (players != null) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));
                    response.end();
                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);

                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/deleteAskFriend") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await deleteAskFriend(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/validateAskFriend") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await validateAskFriend(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/friendsList") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                var players = await friendsList(data);
                // await client.close();

                if (players != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));

                    response.end();

                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/deleteFriend") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await deleteFriend(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/getMsgById") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                var message = await getMsgById(data);
    ;
                // await client.close();

                if (message != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(message));

                    response.end();

                } else {
                    response.statusCode = 404;
                    response.end("Message not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/getConversation") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                var players = await getConversations(data);

                // await client.close();

                if (players != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));

                    response.end();

                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/getConversation") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                var players = await getConversations(data);

                // await client.close();

                if (players != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));

                    response.end();

                } else {
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/changeCelebration") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
               await changeCelebration(data);
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/changeImg") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                await changeImg(data)
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/changeMDP") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                await changeMDP(data);
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/changeMail") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                await changeMail(data);
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }
}

    async function getMessages(data, idConversation) {
        try {


            const messages = await client.db("kickoridor").collection("chat").find({
                conversationID: idConversation._id
            }).sort({date: 1}).toArray();

            await client.db("kickoridor").collection("chat").updateMany({
                receveur: data.username,
                emetteur: data.ami,
                lu: false
            }, {
                $set: {lu: true}
            });
            return messages;

        } finally {

        }
    }

    async function getConversationID(data) {
        try {

            return await client.db("kickoridor").collection("conversation").findOne({
                $or: [
                    {ami1: data.username, ami2: data.ami},
                    {ami1: data.ami, ami2: data.username}
                ]
            });
        } finally {

        }
    }

    async function sendMessageData(data, conversationID) {
        try {

            const msg = await client.db("kickoridor").collection("chat").insertOne({
                conversationID: conversationID,
                message: data.message,
                emetteur: data.username,
                receveur: data.ami,
                date: Date.now(),
                lu: false
            }, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
            await client.db("kickoridor").collection("conversation").updateOne(
                {"_id": conversationID},
                {
                    $set: {
                        "date": Date.now(),
                        "lastMsg": msg.insertedId
                    }
                }
            )
        } finally {

        }
    }

    async function saveUser(data) {
        try {

            await client.db("kickoridor").collection("users").insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
        } finally {

        }
    }

    async function findUser(data) {
        try {
            //
            return await client.db("kickoridor").collection("users").findOne({
                username: data.username
            });
        } finally {
            //
        }
    }

    async function saveGameState(data) {
        try {
            await client.connect();
            await client.db("kickoridor").collection("gameState").insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
        } finally {
            // await client.close();
        }
    }

    async function findGameState(data) {
        try {

            return await client.db("kickoridor").collection("gameState").findOne({
                username: data.username.toString()
            });
        } finally {

        }
    }

    async function deleteGameState(data) {
        try {

            return await client.db("kickoridor").collection("gameState").deleteOne({
                username: data.username.toString()
            });
        } finally {

        }
    }

    async function findFriends(data) {
        try {
            const currentUser = await findUser(data);

            return await client.db("kickoridor").collection("users").find({
                username: {
                    $regex: "^" + data.recherche.toString(),
                    $nin: [currentUser["username"].toString(), ...currentUser["friendList"], ...currentUser["demandes"]] //
                }
            }).sort({username: 1}).toArray();
        } finally {

        }
    }

    async function askFriend(data) {
        try {

            return await client.db("kickoridor").collection("users").updateOne(
                {username: data.receveur.toString()},
                {$addToSet: {demandes: data.emetteur.toString()}}
            );
        } finally {

        }
    }

    async function askFriendsList(data) {
        try {

            const user = await client.db("kickoridor").collection("users").findOne({
                username: data.username.toString()
            });

            if (user && user.demandes) {
                // Utiliser Promise.all pour exécuter les requêtes findUser de manière asynchrone
                const demandeDetails = await Promise.all(user.demandes.sort().map(async (demande) => {
                    return await findUser({username: demande});
                }));
                return demandeDetails;
            } else {
                return []; // Retourner un tableau vide si l'utilisateur n'a pas de demandes ou si l'utilisateur n'existe pas
            }
        } finally {

        }
    }

    async function deleteAskFriend(data) {
        try {

            return await client.db("kickoridor").collection("users").updateOne(
                {username: data.emetteur.toString()},
                {$pull: {demandes: data.receveur.toString()}}
            );
        } finally {

        }
    }

    async function validateAskFriend(data) {
        try {

            await client.db("kickoridor").collection("users").updateOne(
                {username: data.emetteur.toString()},
                {
                    $pull: {demandes: data.receveur.toString()}
                }
            );
            await client.db("kickoridor").collection("conversation").insertOne(
                {
                    ami1: data.emetteur,
                    ami2: data.receveur
                }
            )
            await client.db("kickoridor").collection("users").updateOne(
                {username: data.emetteur.toString()},
                {$addToSet: {friendList: data.receveur.toString()}}
            );
            return await client.db("kickoridor").collection("users").updateOne(
                {username: data.receveur.toString()},
                {$addToSet: {friendList: data.emetteur.toString()}}
            );

        } finally {

        }
    }

    async function friendsList(data) {
        try {

            const user = await client.db("kickoridor").collection("users").findOne({
                username: data.username.toString()
            });

            if (user && user.friendList) {
                var friends = user.friendList;
                // Utiliser Promise.all pour exécuter les requêtes findUser de manière asynchrone
                const friendsDetails = await Promise.all(friends.sort().map(async (friend) => {

                    return await findUser({username: friend});
                }));

                return friendsDetails;
            } else {
                return []; // Retourner un tableau vide si l'utilisateur n'a pas de demandes ou si l'utilisateur n'existe pas
            }
        } finally {

        }
    }



    async function deleteFriend(data) {
        try {

            await client.db("kickoridor").collection("conversation").deleteOne(
                {
                    $or: [
                        {"ami1": data.emetteur.toString(), "ami2": data.receveur.toString()},
                        {"ami1": data.receveur.toString(), "ami2": data.emetteur.toString()}
                    ]
                }
            );
            await client.db("kickoridor").collection("users").updateOne(
                {username: data.receveur.toString()},
                {$pull: {friendList: data.emetteur.toString()}}
            );
            return await client.db("kickoridor").collection("users").updateOne(
                {username: data.emetteur.toString()},
                {$pull: {friendList: data.receveur.toString()}}
            );
        } finally {

        }
    }
    async function getMsgById(data) {
        try {
            //

            var idTmp = new ObjectId(data.idMsg);
            return await client.db("kickoridor").collection("chat").findOne({
                _id: idTmp
            });
        } finally {
            //
        }
    }
async function getConversations(data) {
    try {
        const friends = await friendsList(data); // Récupérer la liste des amis de l'utilisateur
        const conversations = []; // Initialiser un tableau pour stocker les conversations

        // Pour chaque ami, obtenir l'ID de la conversation et le dernier message
        for (const friend of friends) {
            const conversationID = await getConversationID({ username: data.username, ami: friend.username });
            const date = await getdateConversation(conversationID);
            const lastMsg = await getLastMessage(conversationID); // Fonction à implémenter

            // Créer un objet avec les détails de l'ami et le dernier message
            const friendWithLastMsg = {
                _id : friend._id,
                username: friend.username,
                img : friend.img,
                lastMsg: lastMsg,
                date : date
            };

            // Ajouter l'ami avec le dernier message au tableau des conversations
            conversations.push(friendWithLastMsg);
        }

        conversations.sort((a, b) => {
            return b.date -a.date;
        });

        return conversations;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getLastMessage(conversationID) {
    try {
        if (conversationID) {
            const conversation = await client.db("kickoridor").collection("conversation").findOne({
                _id: conversationID._id
            }, {
                projection: { lastMsg: 1 } // Ne renvoie que l'attribut lastMsg
            });
            return conversation ? conversation.lastMsg : null;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getdateConversation(conversationID) {
    try {
        if (conversationID) {
            const conversation = await client.db("kickoridor").collection("conversation").findOne({
                _id: conversationID._id
            }, {
                projection: { date: 1 } // Ne renvoie que l'attribut lastMsg
            });
            return conversation.date!=undefined ? conversation.date : 0;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function changeCelebration(data) {
    try {
        //
        await client.db("kickoridor").collection("users").updateOne(
            { username: data.username },
            { $set: { celebration: data.celebration } }
        );
        return true;
    } finally {
        //
    }
}

async function changeImg(data) {
    try {
        //
        await client.db("kickoridor").collection("users").updateOne(
            { username: data.username },
            { $set: { img: data.img } }
        );
        return true;
    } finally {
        //
    }
}

async function changeMDP(data) {
    try {
        //
      const user = await client.db("kickoridor").collection("users").findOne({
            username: data.username
        });
        var tokenTmp = verifyAccessToken(user.token);
        const dataToHash = {
            email: tokenTmp.data.email,
            password: data.password
        }
        var token = generateAccessToken(dataToHash);
        await client.db("kickoridor").collection("users").updateOne(
            { username: data.username },
            { $set: { token: token } }
        );
        return true;
    } finally {
        //
    }
}

async function changeMail(data) {
    try {
        //
        const user = await client.db("kickoridor").collection("users").findOne({
            username: data.username
        });
        var tokenTmp = verifyAccessToken(user.token);
        const dataToHash = {
            email: data.email,
            password: tokenTmp.data.password
        }
        var token = generateAccessToken(dataToHash);
        await client.db("kickoridor").collection("users").updateOne(
            { username: data.username },
            { $set: { token: token } }
        );
        return true;
    } finally {
        //
    }
}
function verifyAccessToken(token) {
    const secret = 'kc-blue-wall';

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
function generateAccessToken(data) {
    const payload = {
        email: data.email,
        password: data.password
    };

    const secret = 'kc-blue-wall';

    return jwt.sign(payload, secret);
}


exports.manage = handleBDD;
