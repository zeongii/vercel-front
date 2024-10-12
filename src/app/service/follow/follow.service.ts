import {FollowModel} from "@/app/model/follow.model";
import {follow} from "@/app/api/follow/follow.api";


export const fetchShowFollower = async (nickname: string): Promise<FollowModel[]> => {
    const data = follow.showFollower(nickname);
    return data;
}

export const fetchShowFollowing = async (nickname: string): Promise<FollowModel[]> => {
    const data = follow.showFollowing(nickname);
    return data;
}



