
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { AuthData } from "./Validators/AuthValidatorService";

interface IUser {
    _id: string;
    username: string;
	bio: string;
}

type UserResponse = ResponseResult<string | boolean | string | boolean>;

class UserServices {
	private static fact = new EndpointFactory<UserResponse>("/user");

	static get = (username: string) => UserServices.fact.get<IUser>("/user/"
	)(username);

	static login = UserServices.fact.post<string, AuthData>("/login");
	static signup = UserServices.fact.post<boolean, AuthData>("/signup");
	static logout = () => UserServices.fact.post<boolean, undefined>("/logout")(undefined);
	static isAuth = () => UserServices.fact.get<string>("/auth")("");
	static search = (query: string) => UserServices.fact.get<IUser[]>("/search", { params: { query } })("");
	static setBio = (bio: string) => UserServices.fact.patch<boolean, IUser>("/bio")({ bio })
}

export type { IUser };
export default UserServices;