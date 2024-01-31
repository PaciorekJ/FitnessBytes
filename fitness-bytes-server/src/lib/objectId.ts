import { ObjectId } from "mongodb";

function objectIdToNumber(objectId: string): bigint {
    const hexString = new ObjectId(objectId).toHexString();
    return BigInt('0x' + hexString);
}

function numberToObjectId(number: bigint): string {
    const hexString = number.toString(16);
    return ObjectId.createFromHexString(hexString).toHexString();
}

export {numberToObjectId, objectIdToNumber}