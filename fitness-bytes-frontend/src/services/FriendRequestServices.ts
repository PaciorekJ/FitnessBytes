
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
	private static fact = new EndpointFactory<FriendResponse>("/friendRequest");

    static create = (recipientId: string) => this.fact.post<IFriendRequest, IFriendRequest>()({
        recipientId,
    });
    static accept = (requesterId: string) => this.fact.post<IFriend, IFriendRequest>("/accept")({
        requesterId,
    })
    static decline = (requesterId: string) => this.fact.post<boolean, IFriendRequest>("/decline")({
        requesterId,
    })
}

export type { IFriendRequest };
export default FriendRequestServices;