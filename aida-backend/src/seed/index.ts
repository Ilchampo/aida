import { SEED_JOBS } from '@seed/data/jobs.seed';
import { interviewModel } from '@schemas/interview.schema';
import { jobModel } from '@schemas/job.schema';
import { userModel } from '@schemas/user.schema';
import { mongooseInstance } from '@instances/mongoose.instance';

import config from '@lib/config';

const clearLegacyUsers = async (): Promise<void> => {
    console.log('Clearing users (Google auth only — no seed accounts)...');

    const result = await userModel.deleteMany({});
    console.log(`  ✓ Deleted ${result.deletedCount} users`);
};

const dropLegacyInterviewIndexes = async (): Promise<void> => {
    const indexes = await interviewModel.collection.indexes();
    const legacyUnique = indexes.find(
        (index) => index.name === 'candidate_id_1_job_id_1' && index.unique,
    );

    if (!legacyUnique) {
        return;
    }

    await interviewModel.collection.dropIndex('candidate_id_1_job_id_1');
    console.log('  Dropped legacy unique index on candidate_id + job_id');
};

const dropLegacyRoleUniqueIndex = async (): Promise<void> => {
    const indexes = await jobModel.collection.indexes();
    const roleIndex = indexes.find((index) => index.name === 'role_1' && index.unique);

    if (!roleIndex) {
        return;
    }

    await jobModel.collection.dropIndex('role_1');
    console.log('  Dropped legacy unique index on role');
};

const cleanupStaleData = async (): Promise<void> => {
    const seedSlugs = SEED_JOBS.map((job) => job.slug);

    console.log('Cleaning up interviews and stale jobs...');

    await dropLegacyInterviewIndexes();

    const interviewResult = await interviewModel.deleteMany({});
    console.log(`  ✓ Deleted ${interviewResult.deletedCount} interviews`);

    const jobResult = await jobModel.deleteMany({ slug: { $nin: seedSlugs } });
    console.log(`  ✓ Deleted ${jobResult.deletedCount} stale jobs`);
};

const seedJobs = async (): Promise<void> => {
    console.log('Seeding jobs...');

    await dropLegacyRoleUniqueIndex();
    await cleanupStaleData();

    for (const job of SEED_JOBS) {
        const result = await jobModel.findOneAndUpdate(
            {
                $or: [{ slug: job.slug }, { role: job.role, slug: { $exists: false } }],
            },
            {
                $set: {
                    slug: job.slug,
                    title: job.title,
                    role: job.role,
                    description: job.description,
                    tags: job.tags,
                    rubric: job.rubric,
                    question_bank: job.question_bank,
                },
            },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
        );

        console.log(
            `  ✓ ${result.slug} (${result.role}) — ${result.question_bank.length} questions, ${result.rubric.length} rubric skills`,
        );
    }
};

const runSeed = async (): Promise<void> => {
    if (!config.mongo.uri) {
        throw new Error('MONGO_URI is not set. Check your .env file.');
    }

    console.log('Connecting to MongoDB...');
    await mongooseInstance.connect();

    try {
        await clearLegacyUsers();
        await seedJobs();
        // Ensure new interview indexes exist after wiping data
        await interviewModel.syncIndexes();
        console.log('  ✓ Synced interview indexes');
        console.log('\nSeed completed successfully.');
    } finally {
        await mongooseInstance.disconnect();
    }
};

runSeed().catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
