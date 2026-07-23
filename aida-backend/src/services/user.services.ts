import type {
    GetUserByIdRequest,
    PublicUser,
    UpsertGoogleUserRequest,
    UserWithId,
} from '@lib/interfaces/user.interfaces';

import { toPublicUser } from '@utils/auth.utils';
import { userModel } from '@schemas/user.schema';
import { NotFoundError } from '@utils/errors.utils';
import { Types } from 'mongoose';

export const upsertGoogleUser = async (params: UpsertGoogleUserRequest): Promise<PublicUser> => {
    const { googleSub, email, givenName, pictureUrl } = params;

    const user = await userModel
        .findOneAndUpdate(
            { google_sub: googleSub },
            {
                $set: {
                    email,
                    given_name: givenName,
                    picture_url: pictureUrl,
                },
                $setOnInsert: {
                    google_sub: googleSub,
                },
            },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
        )
        .lean();

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return toPublicUser(user);
};

export const getUserById = async (params: GetUserByIdRequest): Promise<UserWithId> => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundError('User not found');
    }

    const user = await userModel.findById(id).lean();

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
};
