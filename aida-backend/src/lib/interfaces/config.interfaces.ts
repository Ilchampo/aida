interface MongoConfig {
    uri: string;
    dbName: string;
}

interface OpenRouterConfig {
    apiKey: string;
    interviewerModel: string;
    evaluationModel: string;
    sttModel: string;
    ttsModel: string;
    ttsVoice: string;
    ttsResponseFormat: 'mp3' | 'pcm';
}

interface AppConfig {
    port: number;
    env: string;
}

interface CorsConfig {
    whitelist: string[];
}

interface JwtConfig {
    secret: string;
    expiresIn: string;
}

interface GoogleConfig {
    clientId: string;
}

export interface Config {
    app: AppConfig;
    cors: CorsConfig;
    mongo: MongoConfig;
    openRouter: OpenRouterConfig;
    jwt: JwtConfig;
    google: GoogleConfig;
}
