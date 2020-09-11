export const getSecret = () => {
  return process.env.ACCESS_TOKEN_SECRET || "default-secret";
};

export default getSecret;
