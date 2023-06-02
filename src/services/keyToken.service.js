'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) });
  }  

  static removeKeyById = async (id) => {
    return await keytokenModel.findOneAndDelete({ _id: id });
  }
  static findByRefreshTokenUsed = async ( refreshToken ) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  }
  static findByRefreshToken = async ( refreshToken ) => {
    return await keytokenModel.findOne({ refreshToken });
  }
  static deleteKeyById = async ( userId ) => {
    return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  }
  
  
}

module.exports = KeyTokenService;
