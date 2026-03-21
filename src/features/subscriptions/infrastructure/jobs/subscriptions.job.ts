import cron from "node-cron";

import { SubscriptionsServiceContainer } from "../containers";
import { getSocketInstance } from "@/core/infrastructure/socket/SocketInstance";

const subscriptionsServiceContainer = new SubscriptionsServiceContainer();

//"0 0 * * *"-> Cada 24 horas
//"*/2 * * * *"-> Cada 2 minutos

export const startSubscriptionRenovationValidator = async (): Promise<void> => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const updatedSubscriptionIds =
        await subscriptionsServiceContainer.renewSubscription.run();

      const io = getSocketInstance();
      io.emit("subscriptions:updated", updatedSubscriptionIds);
    } catch (e) {
      console.error("[Job] Error al validar suscripciones:", e);
    }
  });
};
