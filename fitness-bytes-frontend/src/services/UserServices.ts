import { AuthData } from "./AuthValidatorService";
import ClientService, { ResponseResult } from "./ClientService";

interface LoginResponse {
	_id: string;
}

type SignupResponse = boolean;
type LogoutResponse = boolean;
type AuthResponse = string;

type UserResponse = ResponseResult<LoginResponse | SignupResponse | AuthResponse | LogoutResponse>;

class UserServices {
    private client: ClientService<UserResponse> | undefined;
    private res: ResponseResult<UserResponse> | undefined;
    private endpoint = "/user";

    async login(credentials: AuthData): Promise<LoginResponse | undefined> {
        this.client = new ClientService<UserResponse>(`${this.endpoint}/login`);

		try {
			this.res = await this.client.post(credentials);
		} catch {
			return undefined;
		}

        return this.client.checkResponse(this.res) as LoginResponse;
    }

    async signup(credentials: AuthData): Promise<SignupResponse | undefined> {
        this.client = new ClientService<UserResponse>(`${this.endpoint}/signup`);

		try {
			this.res = await this.client.post(credentials);
		} catch {
			return undefined;
		}

        return this.client.checkResponse(this.res) as SignupResponse;
    }

	async logout(): Promise<LogoutResponse | undefined> {
        this.client = new ClientService<UserResponse>(`${this.endpoint}/logout`);

		try {
			this.res = await this.client.post({});
		} catch {
			return undefined;
		}

        return this.client.checkResponse(this.res) as LogoutResponse;
    }

	async isAuth(): Promise<AuthResponse | undefined> {
        this.client = new ClientService<UserResponse>(`${this.endpoint}/auth`);

		try {
			this.res = await this.client.get();
		} catch {
			throw new Error("User is not authenticated");
		}

        return this.client.checkResponse(this.res) as AuthResponse;
    }
}

export default UserServices;