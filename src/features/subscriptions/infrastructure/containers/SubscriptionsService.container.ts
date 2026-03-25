import { MongoTransactionManagerAdapter } from "@/core/infrastructure/database";

import {
  CancelSubscriptionUseCase,
  CaptureProductOrderUseCase,
  CreateProductOrderUseCase,
  CreateSubscriptionPlansUseCase,
  CreateTokenPackagesUseCase,
  DeleteSubscriptionPlansUseCase,
  DeleteTokenPackagesUseCase,
  FindOrderStatusUseCase,
  FindSubscriptionByUserUseCase,
  FindSubscriptionPlansUseCase,
  FindTokenPackagesUseCase,
  RenewSubscriptionUseCase,
  RetrySubscriptionPaymentUseCase,
  UpdateSubscriptionPlanUseCase,
  UpdateTokenPackageUseCase,
} from "../../application/use-cases";

import { PaypalRepository } from "../payment";
import { SubscriptionMongoRepository } from "../repositories/mongo/Subscription.mongoose.repository";
import { NodeMailerAdapter } from "@/core/infrastructure/email-notifications/adapters";

const subscriptionRepository = new SubscriptionMongoRepository();
const paymentGatewayRepository = new PaypalRepository();

/** Adaptador encargado de gestionar procesos transaccionales en base de datos basado en MongoDB*/
const transactionManager = new MongoTransactionManagerAdapter();

const emailSender = new NodeMailerAdapter();

/**
 * Contenedor de inyección de dependencias para los casos de uso del módulo de
 * suscripciones.
 *
 * Agrupa todos los casos de uso categorizados en:
 * - **Admin**: operaciones de gestión (crear, actualizar, eliminar planes y paquetes).
 * - **Usuario**: operaciones de flujo de compra y consulta (crear órdenes, capturar pagos,
 *   consultar suscripciones, cancelaciones).
 *
 * @remarks
 *   Las instancias de repositorios y adaptadores se crean una sola vez y se inyectan
 *   en todos los casos de uso (patrón Singleton).
 *
 * @example
 * ```ts
 * const container = new SubscriptionsServiceContainer();
 * await container.createSubscriptionPlans.run(input);
 * ```
 */
export class SubscriptionsServiceContainer {
  //Admin usecases
  /** Caso de uso para crear planes de suscripción */
  createSubscriptionPlans = new CreateSubscriptionPlansUseCase(
    subscriptionRepository,
  );
  /** Caso de uso para crear paquetes de tokens */
  createTokenPackages = new CreateTokenPackagesUseCase(subscriptionRepository);
  /** Caso de uso para actualizar un plan de suscripción */
  updateSubscriptionPlan = new UpdateSubscriptionPlanUseCase(
    subscriptionRepository,
  );
  /** Caso de uso para actualizar un paquete de tokens */
  updateTokenPackage = new UpdateTokenPackageUseCase(subscriptionRepository);
  /** Caso de uso para eliminar planes de suscripción */
  deleteSubscriptionPlans = new DeleteSubscriptionPlansUseCase(
    subscriptionRepository,
  );
  /** Caso de uso para eliminar paquetes de tokens */
  deleteTokenPackages = new DeleteTokenPackagesUseCase(subscriptionRepository);

  //User usecases
  /** Caso de uso para obtener todos los planes de suscripción */
  findSubscriptionPlans = new FindSubscriptionPlansUseCase(
    subscriptionRepository,
  );
  /** Caso de uso para obtener todos los paquetes de tokens */
  findTokenPackages = new FindTokenPackagesUseCase(subscriptionRepository);
  /** Caso de uso para crear una orden de producto en el gateway de pago */
  createProductOrder = new CreateProductOrderUseCase(paymentGatewayRepository);
  /** Caso de uso para capturar una orden de pago y procesar la suscripción */
  captureProductOrder = new CaptureProductOrderUseCase(
    subscriptionRepository,
    paymentGatewayRepository,
    transactionManager,
  );

  /** Caso de uso para obtener una suscripción por el identificador del usuario propietario */
  findSubscriptionByUser = new FindSubscriptionByUserUseCase(
    subscriptionRepository,
  );

  /** Caso de uso para cancelar una suscripción activa */
  cancelSubscription = new CancelSubscriptionUseCase(
    subscriptionRepository,
    transactionManager,
  );
  /** Caso de uso para renovar suscripciones expiradas de forma automática */
  renewSubscription = new RenewSubscriptionUseCase(
    subscriptionRepository,
    paymentGatewayRepository,
    transactionManager,
    emailSender,
  );
  /** Caso de uso para  encontrar estados de ordenes de pago por pasarela de pago */
  findOrderStatus = new FindOrderStatusUseCase(paymentGatewayRepository);

  /** Caso de uso para reintentar pago / reactivar suscripción cancelada o fallida */
  retrySubscriptionPayment = new RetrySubscriptionPaymentUseCase(
    subscriptionRepository,
    paymentGatewayRepository,
    transactionManager,
  );
}
