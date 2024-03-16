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
                    response.end("Username already taken");
                }
                else{
                const dataToHash = {
                    email: data.email,
                    password: data.password
                }
                token = generateAccessToken(dataToHash);
                const dataToSend = {
                    username: data.username,
                    elo : '0',
                    img : 'images/mitro.jpg',
                    listFriend : '',
                    demandesAmis :'',
                    token: token
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
        request.on("end", () => {
            let token;
            try {
                const data = JSON.parse(body);
                const dataToHash = {
                    board: data.board,
                    tour: data.tour,
                    typeDePartie : data.typeDePartie
                }
                token = generateAccessToken(dataToHash);
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
    }else if(request.method === "POST" && request.url === "/api/gameDelete"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const deleteGame = await deleteGameState(data);
                if (deleteGame != null) {
                    response.end("ok");
                }else{
                    response.statusCode = 404;
                    response.end("No player found");
                }
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
                console.log("PLAYERS : " + players);
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
    }
}


async function saveUser(data) {
    try {
        await client.connect();
        await client.db("kickoridor").collection("users").insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    } finally {
        await client.close();
    }
}
async function findUser(data) {
    try {
        await client.connect();
        return await client.db("kickoridor").collection("users").findOne({
            username: data.username
        });
    } finally {
        await client.close();
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
        await client.connect();
        return await client.db("kickoridor").collection("gameState").findOne({
            username: data.username.toString()
        });
    } finally {
        await client.close();
    }
}
async function deleteGameState(data) {
    try {
        await client.connect();
        return await client.db("kickoridor").collection("gameState").deleteOne({
            username: data.username.toString()
        });
    } finally {
        await client.close();
    }
}

async function findFriends(data) {
    try {
        await client.connect();
        return await client.db("kickoridor").collection("users").find({
            username: { $regex: "^" + data.username.toString() }
        }).toArray();
    } finally {
        await client.close();
    }
}

async function askFriend(data) {
    try {
        await client.connect();
        return await client.db("kickoridor").collection("users").updateOne(
            { username: data.receveur.toString() },
            { $addToSet: { demandes: data.emetteur.toString() } }
        );
    } finally {
        await client.close();
    }
}
async function askFriendsList(data) {
    try {
        await client.connect();
        const user = await client.db("kickoridor").collection("users").findOne({
            username: data.username.toString()
        });

        if (user && user.demandes) {
            // Utiliser Promise.all pour exécuter les requêtes findUser de manière asynchrone
            const demandeDetails = await Promise.all(user.demandes.map(async (demande) => {
                return await findUser({ username: demande });
            }));
            return demandeDetails;
        } else {
            return []; // Retourner un tableau vide si l'utilisateur n'a pas de demandes ou si l'utilisateur n'existe pas
        }
    } finally {
        await client.close();
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
