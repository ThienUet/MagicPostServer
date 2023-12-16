if (process.env.BROWSER) {
    throw new Error(
      "Do not import `config.js` from inside the client-side code."
    );
  }
  
module.exports = {
    port: process.env.PORT || 6666,
    trustProxy: process.env.TRUST_PROXY || 'loopback',
    secret: process.env.SECRET,
    privateKey: process.env.PRIVATE_KEY,
    dbConnection: {
        mongoURI: process.env.DATABASE_CONNECT,
    },
    auth: {
        jwt: {secretJwt: process.env.SECRET_JWT || 'React Starter Kit'},
    }
}