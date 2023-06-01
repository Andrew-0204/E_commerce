'use strict';

const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

// Service
const { findByUserId } = require('../services/keyToken.service');
const asyncHandler = require('../helpers/asyncHandler')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

// Public key retrieved from MongoDB => converted to hash string and saved in MongoDB
// Private key is not stored in the database

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    // privateKey => signup will be sent to the browser
    // payload contains information to be transported from one site to another
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    // Verify using public token
    // Usually, only the privateKey is used for signing and verification,
    // so that others cannot verify our signature and create their own signatures
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify:', err);
      } else {
        console.log('decode verify:', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    // Handle error
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
      1 - Check userId missing?
      2 - Get accessToken
      3 - Verify token
      4 - Check user in the database
      5 - Check keyStore with this userId
      6 - All checks passed => return next()
  */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('KeyStore not found');

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
