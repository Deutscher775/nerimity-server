import { CustomResult } from '../common/CustomResult';
import { decryptToken } from '../common/JWT';
import { redisClient } from '../common/redis';
import { AccountModel } from '../models/AccountModel';
import { User } from '../models/UserModel';

// keys
const ACCOUNT_CACHE_KEY = (userId: string) => `ACCOUNT:${userId}`;


export interface AccountCache {
  _id: string;
  passwordVersion: number;
  user: {
    username: string;
    tag: string;
    avatar?: string;
  }
}


export async function getAccountCache(userId: string): Promise<AccountCache | null> {
  // First, check in cache
  const cacheKey = ACCOUNT_CACHE_KEY(userId);
  const cacheAccount = await redisClient.get(cacheKey);
  if (cacheAccount) {
    return JSON.parse(cacheAccount);
  }
  // If not in cache, fetch from database
  const account = await AccountModel.findById(userId).populate<{user: User}>('user');
  if (!account) return null;

  const accountCache: AccountCache = {
    _id: account.id,
    passwordVersion: account.passwordVersion,
    user: {
      username: account.user.username,
      tag: account.user.tag,
      avatar: account.user.avatar
    }
  };
  // Save to cache
  await redisClient.set(cacheKey, JSON.stringify(accountCache));
  return accountCache;

}



export async function authenticateUser(token: string): Promise<CustomResult<AccountCache, string>> {
  const decryptedToken = decryptToken(token);
  if (!decryptedToken) {
    return [null, 'Invalid token.'];
  }
  const accountCache = await getAccountCache(decryptedToken.userId);
  if (!accountCache) {
    return [null, 'Invalid token.'];
  }
  // compare password version
  if (accountCache.passwordVersion !== decryptedToken.passwordVersion) {
    return [null, 'Invalid token.'];
  }
  return [accountCache, null];
}

