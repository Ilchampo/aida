export interface UserQuotaSummary {
    distinctRolesUsed: number;
    distinctRolesLimit: number;
    maxTriesPerRole: number;
}

export interface PublicUser {
    _id: string;
    email: string;
    given_name: string;
    picture_url: string | null;
    created_at: string;
}

export interface MeUser extends PublicUser {
    quota: UserQuotaSummary;
}
