import { ObjectId } from "mongodb";

interface User {
    _id?: ObjectId | undefined;
    username: string;
    password: string;
}

export default User;