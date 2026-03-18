import { Feature } from "@/core/infrastructure/types";

import { router as subscriptionRouter } from "./infrastructure/routes/v1/subscriptions.route";
import { startSubscriptionRenovationValidator } from "./infrastructure/jobs/subscriptions.job";

import { SubscriptionMongoRepository } from "./infrastructure/repositories";

const subscriptionRepository = new SubscriptionMongoRepository();

/** Punto publico para acceder a la caracteristica Prompts */
export const SubscriptionsFeature: Feature<SubscriptionMongoRepository, null> =
  {
    featureName: "subscriptions",
    router: subscriptionRouter,
    repository: subscriptionRepository,
    service: null,
    jobs: [startSubscriptionRenovationValidator],
  };
