const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");


const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

function handleBDD(request, response){
    if(request.method === "POST" && request.url === "/api/signup"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString();
        });
        request.on("end", () => {
            let token;
            try {
                const data = JSON.parse(body);
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
                    response.end(JSON.stringify({ token: token }));

                });
                response.end("ok");
            } catch (error) {
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
        request.on("end", () => {
            try {
                const data = JSON.parse(body);
                const user = findUser(data);
                console.log("user : " + user);
                if(user){
                    const token = verifyAccessToken(user.token);
                    console.log(token);
                    if(token.data.password === data.password) {
                        response.statusCode = 200;
                        response.end(JSON.stringify({token: user.token}));
                    }else{
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