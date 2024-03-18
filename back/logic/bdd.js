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

    }else if(request.method === "POST" && request.url === "/api/gameDelete") {
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

}

async function getMessages(data){
    try {
        await client.connect();
        console.log(data.conversationID+"fffffffffffffffffffffff");
        return await client.db("kickoridor").collection("chat").find({
            conversationID: data._id
        }).toArray();
    } finally {
        await client.close();
    }
}

async function getConversationID(data){
    try {
        await client.connect();
        return await client.db("kickoridor").collection("conversation").findOne();
    } finally {
        await client.close();
    }
}

async function sendMessageData(data, conversationID){
    try {
        await client.connect();
        await client.db("kickoridor").collection("chat").insertOne({
            conversationID: conversationID,
            message: data.message,
            username: data.username,
            ami: data.ami
        }, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    } finally {
        await client.close();
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
