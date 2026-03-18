import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

import {
  CreateUser,
  UserPreferences,
  UserStats,
  AccountStatus,
} from "../types";

import { User } from "../entities";

export interface UserRepositoryType {
  create: (
    newUser: CreateUser,
    ctx?: TransactionContext,
  ) => Promise<Pick<User, "userId">>;
  findById: (userId: string, ctx?: TransactionContext) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findByUsername: (userName: string) => Promise<User | null>;
  updateUsername: (
    userId: string,
    updatedUsername: string,
  ) => Promise<{ matchedCount: number }>;
  updateEmail: (
    userId: string,
    updatedEmail: string,
  ) => Promise<{ matchedCount: number }>;
  updateAccountType: (
    userId: string,
    isPremiumUser: boolean,
    ctx?: TransactionContext,
  ) => Promise<{ matchedCount: number }>;
  updateUserSubscriptionState: (
    userId: string,
    hasSubscription: boolean,
    ctx?: TransactionContext,
  ) => Promise<{ matchedCount: number }>;
  updateAccountStatus: (
    userId: string,
    accountStatus: AccountStatus,
  ) => Promise<{ matchedCount: number }>;
  updateTokenCoins: (
    userId: string,
    tokenCoins: number,
  ) => Promise<{ matchedCount: number }>;
  updateUserPassword: (
    userId: string,
    newPassword: string,
  ) => Promise<{ matchedCount: number }>;
  updateUserPreferences: (
    userId: string,
    updatedPreferences: Partial<UserPreferences>,
  ) => Promise<void>;
  updateUserStats: (
    userId: string,
    userStats: UserStats,
  ) => Promise<{ matchedCount: number }>;
}
