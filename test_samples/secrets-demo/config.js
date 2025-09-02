// Intentionally contains patterns that scanners look for.
// DO NOT USE REAL KEYS.

export const CONFIG = {
  jwtSecret: "hardcoded-very-secret-key-12345", // hardcoded secret
  stripeApiKey: "sk_live_51Kf9aFakeFAKEFAKEFAKEFAKE000000000", // fake pattern
  githubToken: "ghp_FAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKEF",    // fake pattern
  aws: {
    accessKeyId: "AKIAFAKEFAKEFAKEFAKE",
    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY", // fake pattern
  },
};
