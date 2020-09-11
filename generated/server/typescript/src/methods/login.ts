import { Login, DIDTokenClaim } from "../generated-typings";
import * as ethUtil from "ethereumjs-util";
import jwt from "jsonwebtoken";
import { recoverPublicKeyFromSig } from "@etclabscore/signatory-core/build/src/lib/sign";
import { stringToHex } from "@etclabscore/eserialize";
import { getSecret } from "../secret";
import { JSONRPCError } from "@open-rpc/server-js";
import { getUserByAddress, ClaimPair, removeUserClaim } from "../users";

const nbfBuffer = 1000;

const login: Login = async (DIDTokenString) => {
  try {
    const buff = Buffer.from(DIDTokenString, "base64");
    const decoded = buff.toString();
    const [proof, claim] = JSON.parse(decoded);
    const parsedClaim: DIDTokenClaim = JSON.parse(claim);
    if (!parsedClaim.iss) {
      throw new JSONRPCError("An error occured, Not logged in", 2399);
    }
    const add = parsedClaim.iss.split("did:ethr:")[1];
    const c = Buffer.from(claim);
    let signerPubkey;
    try {
      signerPubkey = recoverPublicKeyFromSig(Buffer.from(stringToHex(claim)), proof, 61);
    } catch (e) {
      console.log(e);
    }
    if (!signerPubkey) {
      throw new JSONRPCError("no pubkey found", 3399);
    }

    const address = "0x" + ethUtil.keccak256(signerPubkey).slice(-20).toString("hex");

    if (add === ethUtil.toChecksumAddress(address)) {
      if (!parsedClaim.nbf) {
        throw new JSONRPCError("An error occured, no nbf", 2399);
      }

      if ((parsedClaim.nbf - nbfBuffer) > Math.floor(Date.now() / 1000)) {
        throw new JSONRPCError("Claim Expired", 2600);
      }

      if (!parsedClaim.iat) {
        throw new JSONRPCError("An error occured, no iat", 2399);
      }

      const user = getUserByAddress(add);
      if (!user) {
        throw new JSONRPCError("No User found", 2700);
      }
      const exists = user.claimPairs.find((claimPair: ClaimPair) => {
        return JSON.stringify(claimPair.claim) === JSON.stringify(parsedClaim);
      });

      if (!exists) {
        throw new JSONRPCError("Invalid Claim. Request a Claim First", 2500);
      }

      console.log("Claim Successful:");

      console.log(JSON.stringify({
        address: add,
        claim: parsedClaim,
      }, null, 4));

      // one time use
      removeUserClaim(add, parsedClaim);

      console.log("Issuing 365d JWT Token for: ", add);

      const accessToken = jwt.sign({
        address: add,
        did: {
          proof,
          claim: parsedClaim,
        },
      }, getSecret(), {expiresIn: "365d"});
      return Promise.resolve(accessToken);
    } else {
      throw new JSONRPCError("An error occured, Not logged in", 2399);
    }
  } catch (e) {
    throw new JSONRPCError("An error occured, Not logged in", 2399, { message: e.message });
  }
};

export default login;
