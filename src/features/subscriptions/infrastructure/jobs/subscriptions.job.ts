import cron from "node-cron";

import { SubscriptionsServiceContainer } from "../containers";

const subscriptionsServiceContainer = new SubscriptionsServiceContainer();

//"0 0 * * *"-> Cada 24 horas
//"*/2 * * * *"-> Cada 2 minutos

export const startSubscriptionRenovationValidator = async (): Promise<void> => {
  cron.schedule("0 0 * * *", async () => {
    try {
      await subscriptionsServiceContainer.renewSubscription.run();
    } catch (e) {
      console.error("[Job] Error al validar suscripciones:", e);
    }
  });
};
