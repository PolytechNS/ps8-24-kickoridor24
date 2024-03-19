const { MongoClient, ServerApiVersion } = require("mongodb");
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

async function handleBDD(request, response){
    await client.connect();
    if(request.method === "POST" && request.url === "/api/signup"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                const user = await findUser(data);
                if(user != null){
                    response.statusCode = 400;
                    await client.close();response.end("Username already taken");
                }
                else{
                const dataToHash = {
                    email: data.email,
                    password: data.password
                }
                token = generateAccessToken(dataToHash);
                await client.close();
                const dataToSend = {
                    username: data.username,
                    elo : '0',
                    img : 'images/mitro.jpg',
                    token: token,
                    friendList: [],
                    demandes : []
                }
                saveUser(dataToSend).then(r => {
                    response.statusCode = 200;
                    response.end("ok");
                }
                );
            } }catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if (request.method === "POST" && request.url === "/api/login") {
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
                    await client.close();
                    if (token.data.password === data.password) {
                        response.statusCode = 200;
                        response.end("ok");
                    } else {
                        response.statusCode = 401;
                        response.end("Invalid password");
                    }
                }else{
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/gameSave"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end",  async () => {
            let token;
            try {
                const data = JSON.parse(body);
                const dataToHash = {
                    board: data.board,
                    tour: data.tour,
                    typeDePartie : data.typeDePartie
                }
                token = generateAccessToken(dataToHash);
                await client.close();
                const dataToSend = {
                    username: data.username,
                    board: data.board,
                    tour: data.tour,
                    typeDePartie : data.typeDePartie
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
    }else if(request.method === "POST" && request.url === "/api/gameRetrieve"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const gameState = await findGameState(data)
                await client.close();
                if (gameState != null) {

                     response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(gameState));
                   response.end();
                }else{
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });

    }else if(request.method === "POST" && request.url === "/api/gameDelete") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const deleteGame = await deleteGameState(data);
                await client.close();
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
    }else if(request.method === "POST" && request.url === "/api/sendMessage") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const conversationID = await getConversationID(data);
                const dataToSend = await sendMessageData(data, conversationID._id);
                await client.close();
                response.statusCode = 200;
                response.end("ok");
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/getMessages") {
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const conversationID = await getConversationID(data);
                const messages = await getMessages(conversationID);
                await client.close();
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify(messages));
                response.end();
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });

    }
    else if(request.method === "POST" && request.url === "/api/FindFriends"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const players = await findFriends(data);
                await client.close();
                if (players != null) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));
                    response.end();
                }else{
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/askFriend"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                 await askFriend(data);
                await client.close();
                response.end();
                 }catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    } else if(request.method === "POST" && request.url === "/api/askFriendsList"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                const players = await askFriendsList(data);
                await client.close();
                if (players != null) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));
                    response.end();
                }else{
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);

                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/deleteAskFriend"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await deleteAskFriend(data);
                await client.close();
                response.end();
            }catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/validateAskFriend"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await validateAskFriend(data);
                await client.close();
                response.end();
            }catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/friendsList"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);

                var players = await friendsList(data);
                await client.close();

                if (players != null) {

                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(players));

                    response.end();

                }else{
                    response.statusCode = 404;
                    response.end("User not found");
                }
            } catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }else if(request.method === "POST" && request.url === "/api/deleteFriend"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            let token;
            try {
                const data = JSON.parse(body);
                await deleteFriend(data);
                await client.close();
                response.end();
            }catch (error) {
                console.error(error.message);
                response.statusCode = 400;
                response.end("Invalid JSON");
            }
        });
    }
}

async function getMessages(data){
    try {
        

        return await client.db("kickoridor").collection("chat").find({
            conversationID: data._id
        }).sort({ date: 1 }).toArray();
    } finally {
        
    }
}

async function getConversationID(data){
    try {
        
        return await client.db("kickoridor").collection("conversation").findOne();
    } finally {
        
    }
}

async function sendMessageData(data, conversationID){
    try {
        
        await client.db("kickoridor").collection("chat").insertOne({
            conversationID: conversationID,
            message: data.message,
            emetteur: data.username,
            receveur: data.ami,
            date : Date.now()
        }, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
        await client.db("kickoridor").collection("conversation").updateOne(
        { "_id": conversationID },
        { $set: { "date": Date.now() } }
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
        await client.close();
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
        }).sort({username : 1} ).toArray();
    } finally {
        
    }
}

async function askFriend(data) {
    try {
        
        return await client.db("kickoridor").collection("users").updateOne(
            { username: data.receveur.toString() },
            { $addToSet: { demandes: data.emetteur.toString() } }
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
                return await findUser({ username: demande });
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
            { username: data.emetteur.toString() },
            { $pull: { demandes: data.receveur.toString() } }
        );
    } finally {
        
    }
}

async function validateAskFriend(data) {
    try {
        
         await client.db("kickoridor").collection("users").updateOne(
            { username: data.emetteur.toString() },
            { $pull: { demandes: data.receveur.toString() }
            }
        );
         await client.db("kickoridor").collection("conversation").insertOne(
             {
                 ami1 : data.emetteur,
                 ami2 : data.receveur
             }

         )
         await client.db("kickoridor").collection("users").updateOne(
            { username: data.emetteur.toString() },
            { $addToSet: { friendList: data.receveur.toString() } }
        );
        return await client.db("kickoridor").collection("users").updateOne(
            { username: data.receveur.toString() },
            { $addToSet: { friendList: data.emetteur.toString() } }
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

                return await findUser({ username: friend });
            }));
            return friendsDetails;
        } else {
            return []; // Retourner un tableau vide si l'utilisateur n'a pas de demandes ou si l'utilisateur n'existe pas
        }
    } finally {
        
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

async function deleteFriend(data) {
    try {
        
        await client.db("kickoridor").collection("conversation").deleteOne(
            { $or: [
            { "ami1": data.emetteur.toString(), "ami2": data.receveur.toString() },
            { "ami1": data.receveur.toString(), "ami2": data.emetteur.toString() }
        ] }
        );
        await client.db("kickoridor").collection("users").updateOne(
            { username: data.receveur.toString() },
            { $pull: { friendList: data.emetteur.toString() } }
        );
        return await client.db("kickoridor").collection("users").updateOne(
            { username: data.emetteur.toString() },
            { $pull: { friendList: data.receveur.toString() } }
        );
    } finally {
        
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



exports.manage = handleBDD;
