import {api} from "src/app/api/request";
import {strategy} from "src/app/api/api.strategy";
import {FollowModel} from "@/app/model/follow.model";


const showFollower = async (nickname : string): Promise<FollowModel[]> => {
    try {
        const resp = await strategy.GET(`${api.follow}/findMyFollower/${nickname}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to fetch user counts");
        throw new Error("Failed to fetch user counts");
    }
};

const showFollowing = async (nickname : string): Promise<FollowModel[]> => {
    try {
        const resp = await strategy.GET(`${api.follow}/findMyFollowing/${nickname}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to fetch user counts");
        throw new Error("Failed to fetch user counts");
    }
};

export const follow = {showFollower, showFollowing}