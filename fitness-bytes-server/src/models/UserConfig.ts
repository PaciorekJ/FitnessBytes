import mongoose, { Schema } from "mongoose";

interface INotificationConfig {
    username: string;
	friend: boolean;
	message: boolean;
	like: boolean;
	reply: boolean;
}

interface IUserConfig extends INotificationConfig {}

const UserConfigSchema: Schema = new Schema({
    username: {type: String, unique: true, ref: 'User', require: true},
    friend: {type: Boolean, default: true},
    message: {type: Boolean, default: true},
    like: {type: Boolean, default: true},
    reply: {type: Boolean, default: true},
  });
  
  const UserConfigModel = mongoose.model<IUserConfig>('UserConfig', UserConfigSchema);
  
  export type { INotificationConfig, IUserConfig };
  export default UserConfigModel;