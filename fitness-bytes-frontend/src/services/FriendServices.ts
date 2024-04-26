

import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { IUser } from "./UserServices";

interface IFriend {
    _id: string;
    userId1: string;
    userId2: string;
    timeCreated?: Date;
}

export enum FriendStatus {
    None = "None",
    Pending = "Pending",
    Friend = "Friend"
}

type FriendResponse = ResponseResult<IUser[]>;

class FriendServices {
	private static factFriend = new EndpointFactory<FriendResponse>("/friend/");

    static search = (query: string, pageNumber?: number, pageLength?: number) => FriendServices.factFriend.get<IUser[]>("", { params: { query, pageLength, pageNumber } })("");

    static isFriend = (friendUsername: string) => this.factFriend.get<FriendStatus>("/isFriend/")(friendUsername);
    static delete = this.factFriend.delete<boolean>();
}

export type { IFriend };
export default FriendServices;