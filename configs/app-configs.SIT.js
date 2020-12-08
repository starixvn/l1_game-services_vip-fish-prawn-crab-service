export default {
    hostingPort: 6504,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://10.2.189.51:6310",
        authUrl: "http://10.2.189.51:6313",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enabledApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://10.2.189.51:7778/sit/main/api",
        auth: {
            url: "http://10.2.189.51:6313",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend%40517@10.99.99.187:37301/?replicaSet=SabaL2SIT",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "http://c985e85c5a604b75985aaa25c1dcdca9@10.99.99.187:800/171",
        logIdentifier: "vip-fish-prawn-crab",
        env: "SIT",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: [
        "https://sit.sabagame.net",
        "http://sit.sabagame.net",
        "http://sit-admg.sabagame.net",
        "https://sit-admg.sabagame.net",
        "http://sit-adm.sabagame.net",
        "https://sit-adm.sabagame.net",
    ],
};
