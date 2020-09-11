import { AuthLoginWithAddress } from "../generated-typings";
import { v4 as uuidv4 } from "uuid";
import { userInfo } from "os";
import { addUserClaim, getUserByAddress } from "../users";
const lifespan = 100000;

const auth_login_with_address: AuthLoginWithAddress = (address) => {
  const claim = {
    iat: Math.floor(Date.now() / 1000),
    ext: Math.floor(Date.now() / 1000) + lifespan,
    iss: `did:ethr:${address}`,
    sub: "did:sig.tools:login",
    aud: `did:sig.tools:${uuidv4()}`,
    nbf: Math.floor(Date.now() / 1000),
    tid: uuidv4(),
  };
  addUserClaim(address, claim);
  return Promise.resolve(claim);
};

export default auth_login_with_address;
