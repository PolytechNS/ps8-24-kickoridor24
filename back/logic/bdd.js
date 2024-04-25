const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const jwt = require("jsonwebtoken");

const argument = process.argv[2];

let uri = "http://kickoridor.ps8.academy//:27017";
if(argument === "dev"){
    console.log("mongo dev on localhost");
    uri = 'mongodb://localhost:27017';
}else if(argument === "prod"){
    console.log("mongo prod on mongo");
    uri = 'mongodb://mongo:27017';
}

const client = new MongoClient(uri, {
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
                        elo: '250',
                        img: 'images/photoProfil/Mitroglu.png',
                        celebration: 'images/celebration/SIUU',
                        token: token,
                        friendList: [],
                        demandes: [],
                        achiev: [],
                        invite: [],
                    }
                    saveUser(dataToSend).then(async () => {
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
    } else if (request.method === "POST" && request.url === "/api/retrieveUser") {
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
                    jsonResponse["_id"] = user._id;
                    jsonResponse["username"] = user.username;
                    jsonResponse["img"] = user.img;
                    jsonResponse["celebration"] = user.celebration;
                    jsonResponse["email"] = token.data.email;
                    jsonResponse["password"] = token.data.password;
                    jsonResponse["achiev"] = user.achiev;
                    //await client.close();
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
    } else if (request.method === "POST" && request.url === "/api/gameSave") {
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
    } else if (request.method === "POST" && request.url === "/api/getConversation") {
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
    } else if (request.method === "POST" && request.url === "/api/getConversation") {
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
    } else if (request.method === "POST" && request.url === "/api/changeCelebration") {
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
    } else if (request.method === "POST" && request.url === "/api/changeImg") {
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
    } else if (request.method === "POST" && request.url === "/api/changeMDP") {
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
    } else if (request.method === "POST" && request.url === "/api/changeMail") {
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
    } else if (request.method === "POST" && request.url === "/api/changeName") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                await changeName(data);
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/addAchiev") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                await addAchiev(data);
                response.end("ok");

            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/getAllUsers") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const users = await allPlayersList();
                if (users != null) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(users));
                    response.end();
                } else {
                    response.statusCode = 404;
                    response.end("No users found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 500;
                response.end("Internal Server Error");
            }
        });
    } else if (request.method === "POST" && request.url === "/api/getElo") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const user = await findUser(data);
                if (user != null) {
                    response.statusCode = 200;
                    response.end(user.elo);
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
    } else if (request.method === "POST" && request.url === "/api/updateElo") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                await updateElo(data);
                response.end("ok");
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/inviteFriend") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                console.log(data);
                await inviteFriend(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/askInviteList") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const players = await askInviteList(data);
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
    }else if (request.method === "POST" && request.url === "/api/refuseAskInvite") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await refuseAskInvite(data);
                // await client.close();
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }

}

async function inviteFriend(data) {
    try {
        console.log("inviteFriend : ",data);
        const userTmp = await findUser({ username: data.emetteur });
        const inviteMap = {}; // Création de la carte pour stocker les invitations

        // Créer une entrée dans la carte avec l'ID de l'utilisateur et la salle
        inviteMap[userTmp["_id"]] = data.room;

        // Mettre à jour la collection des utilisateurs avec la carte d'invitation
        return await client.db("kickoridor").collection("users").updateOne(
            { username: data.receveur.toString() },
            { $addToSet: { invite: inviteMap } }
        );
    } finally {
        // Code à exécuter après la mise à jour si nécessaire
    }
}

async function allPlayersList() {
    try {
        const users = await client.db("kickoridor").collection("users").find().toArray();

        // Vérifier s'il y a des utilisateurs dans la base de données
        if (users.length > 0) {
            // Utiliser Promise.all pour exécuter les requêtes findUser de manière asynchrone
            const usersDetails = await Promise.all(users.map(async (user) => {
                return await findUserById({_id: user._id}); // Supposant que findUserById est une fonction qui trouve un utilisateur par son ID
            }));

            return usersDetails;
        } else {
            return []; // Retourner un tableau vide si aucun utilisateur n'est trouvé dans la base de données
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        throw error;
    }
}

async function getMessages(data, idConversation) {
    try {


        const messages = await client.db("kickoridor").collection("chat").find({
            conversationID: idConversation._id
        }).sort({date: 1}).toArray();
        var receveur = await findUser({username: data.username});
        var emetteur = await findUser({username: data.ami});
        await client.db("kickoridor").collection("chat").updateMany({
            receveur: receveur["_id"],
            emetteur: emetteur["_id"],
            lu: false
        }, {
            $set: {lu: true}
        });
        return messages;

    } finally {

    }
}

async function updateElo(data) {
    try {
        //
        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.username},
            {
                $set: {
                    "elo": data.elo.toString()
                }
            });
    } finally {
        //
    }
}

async function getConversationID(data) {
    try {
        var ami1 = await findUser({username: data.username});
        var ami2 = await findUser({username: data.ami});
        return await client.db("kickoridor").collection("conversation").findOne({
            $or: [
                {ami1: ami1["_id"], ami2: ami2["_id"]},
                {ami1: ami2["_id"], ami2: ami1["_id"]}
            ]
        });
    } finally {

    }
}

async function sendMessageData(data, conversationID) {
    try {
        var emetteur = await findUser({username: data.username});
        var receveur = await findUser({username: data.ami});

        const msg = await client.db("kickoridor").collection("chat").insertOne({
            conversationID: conversationID,
            message: data.message,
            emetteur: emetteur["_id"],
            receveur: receveur["_id"],
            date: Date.now(),
            lu: false
        }, function (err, res) {
            if (err) throw err;
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

async function findUserById(data) {
    try {

        var idTmp = new ObjectId(data._id);
        return await client.db("kickoridor").collection("users").findOne({
            _id: idTmp
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
        const friendListUsers = await Promise.all(currentUser.friendList.map(async (friendID) => {
            const tmp = await findUserById({_id: friendID});
            return tmp["username"];
        }));
        const demandeListUsers = await Promise.all(currentUser.demandes.map(async (friendID) => {
            const tmp = await findUserById({_id: friendID});
            return tmp["username"];
        }));
        const exclusions = [currentUser.username, ...friendListUsers, ...demandeListUsers];

        return await client.db("kickoridor").collection("users").find({
            username: {
                $regex: "^" + data.recherche.toString(),
                $nin: exclusions
            }
        }).sort({username: 1}).toArray();
    } finally {

    }
}

async function askFriend(data) {
    try {

        const userTmp = await findUser({username: data.emetteur});

        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.receveur.toString()},
            {$addToSet: {demandes: userTmp["_id"]}}
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
                return await findUserById({_id: demande});
            }));
            return demandeDetails;
        } else {
            return []; // Retourner un tableau vide si l'utilisateur n'a pas de demandes ou si l'utilisateur n'existe pas
        }
    } finally {

    }
}

async function askInviteList(data) {
    try {
        const user = await client.db("kickoridor").collection("users").findOne({
            username: data.username.toString()
        });

        if (user && user.invite) {
            const inviteList = user.invite;
            const updatedInviteList = [];

            for (const invite of inviteList) {
                const userId = Object.keys(invite)[0];
                const roomId = invite[userId];

                const invitedUser = await findUserById({_id : userId});


                if (invitedUser) {
                    updatedInviteList.push({ user: invitedUser, room: roomId });
                }
            }

            return updatedInviteList;

        } else {
            return [];
        }
    } finally {
        // Traitements de nettoyage ou finalisation
    }
}

async function deleteAskFriend(data) {
    try {
        const userTmp = await findUser({username: data.receveur});

        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.emetteur.toString()},
            {$pull: {demandes: userTmp["_id"]}}
        );
    } finally {

    }
}

async function refuseAskInvite(data) {
    try {
        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.emetteur.toString()},
            { $set: { invite: [] } }
        );
    } finally {
        // Actions à exécuter après la suppression si nécessaire
    }
}

async function validateAskFriend(data) {
    try {
        const userTmp = await findUser({username: data.receveur});
        await client.db("kickoridor").collection("users").updateOne(
            {username: data.emetteur.toString()},
            {
                $pull: {demandes: userTmp["_id"]}
            }
        );
        var ami1 = await findUser({username: data.emetteur});
        var ami2 = await findUser({username: data.receveur});

        await client.db("kickoridor").collection("conversation").insertOne(
            {
                ami1: ami1["_id"],
                ami2: ami2["_id"]
            }
        )
        await client.db("kickoridor").collection("users").updateOne(
            {username: data.emetteur.toString()},
            {$addToSet: {friendList: userTmp["_id"]}}
        );
        const userTmp2 = await findUser({username: data.emetteur});
        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.receveur.toString()},
            {$addToSet: {friendList: userTmp2["_id"]}}
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
                return await findUserById({_id: friend});
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
        const ami1 = await findUser({username: data.emetteur});
        const ami2 = await findUser({username: data.receveur});
        await client.db("kickoridor").collection("conversation").deleteOne(
            {
                $or: [
                    {"ami1": ami1["_id"], "ami2": ami2["_id"]},
                    {"ami1": ami2["_id"], "ami2": ami1["_id"]}
                ]
            }
        );
        await client.db("kickoridor").collection("users").updateOne(
            {username: data.receveur.toString()},
            {$pull: {friendList: ami1["_id"]}}
        );
        return await client.db("kickoridor").collection("users").updateOne(
            {username: data.emetteur.toString()},
            {$pull: {friendList: ami2["_id"]}}
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
            const conversationID = await getConversationID({username: data.username, ami: friend.username});
            const date = await getdateConversation(conversationID);
            const lastMsg = await getLastMessage(conversationID); // Fonction à implémenter

            // Créer un objet avec les détails de l'ami et le dernier message
            const friendWithLastMsg = {
                _id: friend._id,
                username: friend.username,
                img: friend.img,
                lastMsg: lastMsg,
                date: date
            };

            // Ajouter l'ami avec le dernier message au tableau des conversations
            conversations.push(friendWithLastMsg);
        }

        conversations.sort((a, b) => {
            return b.date - a.date;
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
                projection: {lastMsg: 1} // Ne renvoie que l'attribut lastMsg
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
                projection: {date: 1} // Ne renvoie que l'attribut lastMsg
            });
            return conversation.date != undefined ? conversation.date : 0;
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
            {username: data.username},
            {$set: {celebration: data.celebration}}
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
            {username: data.username},
            {$set: {img: data.img}}
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
            {username: data.username},
            {$set: {token: token}}
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
            {username: data.username},
            {$set: {token: token}}
        );
        return true;
    } finally {
        //
    }
}

async function changeName(data) {
    try {
        //
        await client.db("kickoridor").collection("users").updateOne(
            {username: data.username},
            {$set: {username: data.name}}
        );
    } finally {
        //
    }
}

async function addAchiev(data) {
    try {
        //
        await client.db("kickoridor").collection("users").updateOne(
            {username: data.username},
            {$addToSet: {achiev: data.achiev}}
        );
    } finally {
        //
    }
}

function verifyAccessToken(token) {
    const secret = 'kc-blue-wall';

    try {
        const decoded = jwt.verify(token, secret);
        return {success: true, data: decoded};
    } catch (error) {
        return {success: false, error: error.message};
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
