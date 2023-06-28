import * as secp from "ethereum-cryptography/secp256k1";
import hashMessage from "./hashedMessage";

const signMessage = async(msg , privateKey) =>{
    const hashedMessage = hashMessage(msg);
    const signedMesage = await secp.secp256k1.sign(hashedMessage, privateKey, {recovered: true});
    return signedMesage;
}

export default signedMesage;