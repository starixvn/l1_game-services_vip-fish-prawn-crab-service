export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2_game_api_AWS:5000",
        authUrl: "http://l2_auth_api_AWS:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        placeBetTimeout: 4000,
        requestTimeout: 10000, // 10s
        enabledApiLogs: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:ilthODrRz8C4s2%5D%7B%7CLV%3Du%5D2vsf6o%5Ex0m@10.99.99.56:37101/?replicaSet=L2_SabaAWS&appName=VIPFishPrawnCrab",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "http://c6c009440d6544b6bc8aca47f6ff8058@10.99.99.187:803/120",
        logIdentifier: "vip-fish-prawn-crab",
        env: "AWS",
    },
    authenticateSettings: {
        url: "http://l2_auth_api_AWS:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://localhost:8004/api",
    },
    adminSecretKey: "asWDEer4yGdgsdqR4uqmKQZgh",
    chips: [20_000_000, 10_000_000, 5_000_000, 2_000_000, 1_000_000, 500_000, 200_000, 100_000],
    otel: {
        system: "VG",
        enabled: false,
        endpoint: "http://10.10.50.69:4318/v1/traces",
    },
};
