import type { Application } from 'express';

import { errorHandler, notFoundHandler } from '@middlewares/error.middleware';
import { mongooseInstance } from '@instances/mongoose.instance';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import config from '@lib/config';
import authRouter from '@routes/auth.routes';
import interviewRouter from '@routes/interview.routes';
import jobsRouter from '@routes/jobs.routes';
import leaderboardRouter from '@routes/leaderboard.routes';
import speechRouter from '@routes/speech.routes';

const connectToMongoDB = async (): Promise<void> => {
    console.log('Connecting to MongoDB...');

    await mongooseInstance.connect();

    if (!mongooseInstance.isConnected) {
        throw new Error('MongoDB connection not established');
    }

    console.log('MongoDB connection established');
};

const createApp = async (): Promise<Application> => {
    const app = express();

    if (config.app.env === 'production') {
        app.use(
            cors({
                origin: (origin, callback) => {
                    if (!origin || config.cors.whitelist.includes(origin)) {
                        callback(null, true);
                        return;
                    }

                    callback(new Error('Not allowed by CORS'));
                },
                credentials: true,
            }),
        );
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    await connectToMongoDB();

    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: config.app.env,
        });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/jobs', jobsRouter);
    app.use('/api/interviews', interviewRouter);
    app.use('/api/leaderboard', leaderboardRouter);
    app.use('/api/speech', speechRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

export const startServer = async (): Promise<void> => {
    const app = await createApp();
    const port = config.app.port;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Environment: ${config.app.env}`);
        console.log(`Health check: http://localhost:${port}/health`);
    });
};
