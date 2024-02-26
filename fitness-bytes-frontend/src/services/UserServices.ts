import { AuthData } from "./AuthValidatorService";
import ClientService, { ResponseResult } from "./ClientService";

interface LoginResponse {
	token: string;
	userId: string;
}

type SignupResponse = boolean;

type UserResponse = ResponseResult<LoginResponse | SignupResponse>;

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
}

export default UserServices;