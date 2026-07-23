export interface LeaderboardEntryBase {
    rank: number;
    userId: string;
    givenName: string;
    pictureUrl: string | null;
}

export interface GlobalLeaderboardEntry extends LeaderboardEntryBase {
    averageBestScore: number;
    rolesCounted: number;
}

export interface JobLeaderboardEntry extends LeaderboardEntryBase {
    bestScore: number;
}

export interface GlobalLeaderboardResponse {
    items: GlobalLeaderboardEntry[];
}

export interface JobLeaderboardResponse {
    jobId: string;
    items: JobLeaderboardEntry[];
}
