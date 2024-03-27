import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface INotificationConfig {
	friend: boolean;
	message: boolean;
	like: boolean;
	reply: boolean;
}

interface userConfig extends INotificationConfig {}

type UserResponse = ResponseResult<userConfig | boolean>;

class UserConfigServices {
	private static fact = new EndpointFactory<UserResponse>("/userConfig");

	static get = () => UserConfigServices.fact.get<userConfig>()();
	static update = (userConfig: userConfig) => UserConfigServices.fact.patch<boolean, userConfig>()(userConfig);
}

export type { INotificationConfig, userConfig };
export default UserConfigServices;