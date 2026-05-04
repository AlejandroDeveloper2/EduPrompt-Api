import cron from "node-cron";

import { SubscriptionsServiceContainer } from "../containers";
import { getSocketInstance } from "@/core/infrastructure/socket/SocketInstance";

const subscriptionsServiceContainer = new SubscriptionsServiceContainer();

const validateAndRenewSubscriptions = async (): Promise<void> => {
  try {
    console.log("[Job] Iniciando validación y renovación de suscripciones...");
    const updatedSubscriptionIds =
      await subscriptionsServiceContainer.renewSubscription.run();

    if (updatedSubscriptionIds.length > 0) {
      const io = getSocketInstance();
      io.emit("subscriptions:updated", updatedSubscriptionIds);
    }
    console.log(
      `[Job] Validación completada. ${updatedSubscriptionIds.length} suscripciones actualizadas.`,
    );
  } catch (e) {
    console.error("[Job] Error al validar suscripciones:", e);
  }
};

//"0 0 * * *"-> Cada 24 horas
//"*/2 * * * *"-> Cada 2 minutos

export const startSubscriptionRenovationValidator = async (): Promise<void> => {
  // Ejecutar validación inmediatamente al arrancar
  await validateAndRenewSubscriptions();

  // Programar validación cada 24 horas
  cron.schedule("0 0 * * *", async () => {
    await validateAndRenewSubscriptions();
  });
};
