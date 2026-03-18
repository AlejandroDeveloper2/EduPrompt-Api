import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";

import { SubscriptionPlan, TokenPackage, Subscription } from "../entities";

import {
  CreatePackage,
  CreateSubscription,
  CreateSubscriptionPlan,
  SubscriptionStatus,
  UpdatePackage,
  UpdateSubscription,
  UpdateSubscriptionPlan,
} from "../types";

export interface SubscriptionRepository {
  //Admin methods
  createTokenPackages: (packages: CreatePackage[]) => Promise<void>;
  createSubscriptionPlans: (plans: CreateSubscriptionPlan[]) => Promise<void>;
  updateTokenPackage: (
    packageId: string,
    updatedPackage: UpdatePackage,
  ) => Promise<{ matchCount: number }>;
  updateSubscriptionPlan: (
    planId: string,
    updatedPlan: UpdateSubscriptionPlan,
  ) => Promise<{ matchCount: number }>;
  deleteSubscriptionPlans: (planIds: string[]) => Promise<number>;
  deleteTokenPackages: (packageIds: string[]) => Promise<number>;

  // User methods
  findTokenPackages: () => Promise<TokenPackage[]>;
  findSubscriptionsPlans: (
    ctx?: TransactionContext,
  ) => Promise<SubscriptionPlan[]>;

  //User subscriptions
  createSubscription: (
    subscription: CreateSubscription,
    ctx?: TransactionContext,
  ) => Promise<{ subscriptionId: string }>;
  updateSubscriptionStatus: (
    subscriptionId: string,
    currentHistoryId: string,
    status: SubscriptionStatus,
    ctx?: TransactionContext,
  ) => Promise<{ matchCount: number; modifiedCount: number }>;
  findSubscriptionById: (
    subscriptionId: string,
  ) => Promise<Subscription | null>;
  findSubscriptionByUser: (userId: string) => Promise<Subscription | null>;
  findActiveSubscriptions: () => Promise<Subscription[]>;
  updateSubscriptions: (
    updatedSubscriptions: UpdateSubscription[],
    ctx?: TransactionContext,
  ) => Promise<{ matchCount: number; modifiedCount: number }>;
  updateSubscription: (
    subscriptionId: string,
    updatedSubsciption: Partial<Omit<UpdateSubscription, "subscriptionId">>,
    ctx?: TransactionContext,
  ) => Promise<void>;
}
