
import { IFriend } from "./FriendServices";
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface IFriendRequest {
    _id: string;
    requesterId: string;
    recipientId: string;
}
type FriendResponse = ResponseResult<IFriendRequest>;

class FriendRequestServices {
	private static fact = new EndpointFactory<FriendResponse>("/friend/");

    static create = (recipientId: string) => this.fact.post<IFriendRequest, IFriendRequest>()({
        recipientId,
    });
    static accept = (recipientId: string) => this.fact.post<IFriend, IFriendRequest>("accept")({
        recipientId,
    })
    static decline = (recipientId: string) => this.fact.post<boolean, IFriendRequest>("decline")({
        recipientId,
    })
}

export type { IFriendRequest };
export default FriendRequestServices;