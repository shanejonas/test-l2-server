import { AuthRequiredMethod } from "../generated-typings";
import jwt from "jsonwebtoken";
import { getSecret } from "../secret";
import { JSONRPCError } from "@open-rpc/server-js";

const auth_required_method: AuthRequiredMethod = async (JWTToken) => {
  try {
    const decoded: any = jwt.verify(JWTToken, getSecret(), {
      maxAge: "365d",
    });
    if (decoded) {
      return "logged in with: " + decoded.address;
    } else {
      throw new JSONRPCError("Something went wrong.", 32099);
    }
  } catch (err) {
    // err
    throw new JSONRPCError("Something went wrong.", 32099, err);
  }
};

export default auth_required_method;
