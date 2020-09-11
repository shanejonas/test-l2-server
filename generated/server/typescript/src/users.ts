import { DIDTokenClaim } from "./generated-typings";

export interface ClaimPair {
  claim: DIDTokenClaim;
  proof?: string;
}

export interface User {
  lastLoginAt: number;
  address: string;
  claimPairs: ClaimPair[];
}

interface Users {
  [address: string]: User;
}

const users: Users = {};

export const getUserByAddress = (address: string) => {
  return users[address];
};

export const addUserClaim = (address: string, claim: DIDTokenClaim) => {
  if (users[address]) {
    users[address].claimPairs.push({
      claim,
    });
    users[address].lastLoginAt = claim.iat || Math.floor(Date.now() / 1000);
  } else {
    users[address] = {
      lastLoginAt: claim.iat || Math.floor(Date.now() / 1000),
      address,
      claimPairs: [{ claim }],
    };
  }
};

export const removeUserClaim = (address: string, claim: DIDTokenClaim) => {
  if (!users[address]) {
    return;
  }
  const remainingClaims = users[address].claimPairs.filter((claimPair: ClaimPair) => {
    return JSON.stringify(claimPair.claim) !== JSON.stringify(claim);
  });
  users[address].claimPairs = remainingClaims;
};

export const loginUser = (address: string, claim: DIDTokenClaim) => {
  if (users[address]) {
    users[address].lastLoginAt = Math.floor(Date.now() / 1000);
  }
};
