import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { AuthData } from "./Validators/AuthValidatorService";


type SignupResponse = boolean;
type LogoutResponse = boolean;
type LoginResponse = string;
type AuthResponse = string;

type UserResponse = ResponseResult<LoginResponse | SignupResponse | AuthResponse | LogoutResponse>;

class UserServices {
	private static fact = new EndpointFactory<UserResponse>("/user");

	static login = UserServices.fact.post<LoginResponse, AuthData>("/login");
	static signup = UserServices.fact.post<SignupResponse, AuthData>("/signup");
	static logout = () => UserServices.fact.post<LogoutResponse, undefined>("/logout")(undefined);
	static isAuth = () => UserServices.fact.get<AuthResponse>("/auth")("");
}

export default UserServices;