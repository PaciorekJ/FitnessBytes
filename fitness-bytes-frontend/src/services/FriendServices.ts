

import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { IUser } from "./UserServices";

interface IFriend {
    _id: string;
    userId1: string;
    userId2: string;
    timeCreated?: Date;
}

type FriendResponse = ResponseResult<IUser[]>;

class FriendServices {
	private static factFriend = new EndpointFactory<FriendResponse>("/friend/");

    static search = (query: string) => FriendServices.factFriend.get<IUser[]>("", { params: { query } })("");
}

export type { IFriend };
export default FriendServices;