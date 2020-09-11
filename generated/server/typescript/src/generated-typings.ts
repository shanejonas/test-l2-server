/**
 *
 * Issued at timestamp
 *
 */
export type IssuedAt = number;
/**
 *
 * Expiration timestamp
 *
 */
export type Expiration = number;
/**
 *
 * Not valid before timestamp
 *
 */
export type NotValidBefore = number;
/**
 *
 * Issuer - Decentralized Identifier: https://w3c-ccg.github.io/did-primer/#the-format-of-a-did
 *
 */
export type Issuer = string;
/**
 *
 * Subject of the request, could be a nonce or uuid provided by the server.
 *
 */
export type Subject = string;
/**
 *
 * Audience
 *
 */
export type Audience = string;
/**
 *
 * Optiona, additional signed data
 *
 */
export type Additional = string;
/**
 *
 * DID TokenID
 *
 */
export type TokenID = string;
export type StringDoaGddGA = string;
export type Address = string;
/**
 *
 * JWT Token
 *
 */
export type StringAhqTyMBz = string;
export interface DIDTokenClaim {
  iat?: IssuedAt;
  ext?: Expiration;
  nbf?: NotValidBefore;
  iss?: Issuer;
  sub?: Subject;
  aud?: Audience;
  add?: Additional;
  tid?: TokenID;
  [k: string]: any;
}
/**
 *
 * random string data returned from auth required method
 *
 */
export type StringYQEGSIt6 = string;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export type AnyOfStringDoaGddGAAddressStringDoaGddGAStringAhqTyMBzDIDTokenClaimStringYQEGSIt6 = StringDoaGddGA | Address | StringAhqTyMBz | DIDTokenClaim | StringYQEGSIt6;
export type Login = (DIDTokenString: StringDoaGddGA) => Promise<StringAhqTyMBz>;
export type AuthLoginWithAddress = (address: Address) => Promise<DIDTokenClaim>;
export type AuthRequiredMethod = (JWTToken: StringDoaGddGA) => Promise<StringYQEGSIt6>;
