import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";
import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import {
  CreatePackage,
  CreateSubscription,
  CreateSubscriptionPlan,
  SubscriptionStatus,
  UpdatePackage,
  UpdateSubscription,
  UpdateSubscriptionPlan,
} from "@/features/subscriptions/domain/types";
import {
  Subscription,
  SubscriptionPlan,
  TokenPackage,
} from "@/features/subscriptions/domain/entities";
import { SubscriptionRepository } from "@/features/subscriptions/domain/repositories";

import { TokenPackageModel } from "./models/TokensPackage.model";
import {
  MongoSubscriptionPlan,
  SubscriptionPlanModel,
} from "./models/SubscriptionPlan.model";
import {
  MongoSubscription,
  SubscriptionModel,
} from "./models/Subscription.model";

const mapSubcriptionPlan = (
  mongoPlan: MongoSubscriptionPlan,
): SubscriptionPlan => {
  const { _id, title, description, benefits, paymentFrecuency, price } =
    mongoPlan;
  return new SubscriptionPlan(
    _id.toString(),
    title,
    description,
    benefits,
    paymentFrecuency,
    price,
  );
};

const mapSubscription = (
  mongoSubscription: MongoSubscription,
): Subscription => {
  const {
    _id,
    gatewayCustomerReference,
    history,
    createdAt,
    language,
    currentHistoryId,
    userId,
  } = mongoSubscription;

  const subscription = new Subscription(
    _id.toString(),
    gatewayCustomerReference,
    history,
    createdAt,
    language,
    currentHistoryId,
    userId,
  );
  return subscription;
};

/**
 * Repositorio de Suscripciones con MongoDB
 *
 * Implementa operaciones CRUD para gestionar:
 * - Paquetes de tokens
 * - Planes de suscripción
 * - Suscripciones de usuarios
 *
 * @class SubscriptionMongoRepository
 * @implements {SubscriptionRepository}
 */
export class SubscriptionMongoRepository implements SubscriptionRepository {
  /**
   * Crea múltiples paquetes de tokens en la base de datos
   *
   * @async
   * @param {CreatePackage[]} packages - Array de paquetes de tokens a crear
   * @returns {Promise<void>}
   * @throws {AppError} Si ocurre un error al crear los paquetes
   */
  async createTokenPackages(packages: CreatePackage[]): Promise<void> {
    try {
      await TokenPackageModel.insertMany(packages);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while creating token packages.",
        false,
        error,
      );
    }
  }

  /**
   * Crea múltiples planes de suscripción en la base de datos
   *
   * @async
   * @param {CreateSubscriptionPlan[]} plans - Array de planes de suscripción a crear
   * @returns {Promise<void>}
   * @throws {AppError} Si ocurre un error al crear los planes
   */
  async createSubscriptionPlans(
    plans: CreateSubscriptionPlan[],
  ): Promise<void> {
    try {
      await SubscriptionPlanModel.insertMany(plans);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while creating subscription plans.",
        false,
        error,
      );
    }
  }

  /**
   * Actualiza un paquete de tokens por su ID
   *
   * @async
   * @param {string} packageId - ID del paquete a actualizar
   * @param {UpdatePackage} updatedPackage - Datos actualizados del paquete
   * @returns {Promise<{ matchCount: number }>} Cantidad de documentos coincidentes
   * @throws {AppError} Si ocurre un error al actualizar el paquete
   */
  async updateTokenPackage(
    packageId: string,
    updatedPackage: UpdatePackage,
  ): Promise<{ matchCount: number }> {
    try {
      const result = await TokenPackageModel.updateOne(
        { _id: packageId },
        updatedPackage,
      );

      return {
        matchCount: result.matchedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while updating the token package.",
        false,
        error,
      );
    }
  }
  /**
   * Actualiza un plan de suscripción por su ID
   *
   * @async
   * @param {string} planId - ID del plan a actualizar
   * @param {UpdateSubscriptionPlan} updatedPlan - Datos actualizados del plan
   * @returns {Promise<{ matchCount: number }>} Cantidad de documentos coincidentes
   * @throws {AppError} Si ocurre un error al actualizar el plan
   */
  async updateSubscriptionPlan(
    planId: string,
    updatedPlan: UpdateSubscriptionPlan,
  ): Promise<{ matchCount: number }> {
    try {
      const result = await SubscriptionPlanModel.updateOne(
        { _id: planId },
        updatedPlan,
      );

      return {
        matchCount: result.matchedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while updating the subscription plan.",
        false,
        error,
      );
    }
  }

  /**
   * Elimina múltiples planes de suscripción
   *
   * @async
   * @param {string[]} planIds - Array de IDs de planes a eliminar
   * @returns {Promise<number>} Cantidad de documentos eliminados
   * @throws {AppError} Si ocurre un error al eliminar los planes
   */
  async deleteSubscriptionPlans(planIds: string[]): Promise<number> {
    try {
      const result = await SubscriptionPlanModel.deleteMany({
        _id: { $in: planIds },
      });
      return result.deletedCount;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while deleting subscription plans.",
        false,
        error,
      );
    }
  }

  /**
   * Elimina múltiples paquetes de tokens
   *
   * @async
   * @param {string[]} packageIds - Array de IDs de paquetes a eliminar
   * @returns {Promise<number>} Cantidad de documentos eliminados
   * @throws {AppError} Si ocurre un error al eliminar los paquetes
   */
  async deleteTokenPackages(packageIds: string[]): Promise<number> {
    try {
      const result = await TokenPackageModel.deleteMany({
        _id: { $in: packageIds },
      });
      return result.deletedCount;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while deleting token packages.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene todos los paquetes de tokens disponibles
   *
   * @async
   * @returns {Promise<TokenPackage[]>} Array de paquetes de tokens mapeados
   * @throws {AppError} Si ocurre un error al obtener los paquetes
   */
  async findTokenPackages(): Promise<TokenPackage[]> {
    try {
      const packages = await TokenPackageModel.find({});
      const mappedPackages: TokenPackage[] = packages.map((mongoPackage) => {
        const { _id, title, description, benefits, price, tokenAmount } =
          mongoPackage.toObject();
        return new TokenPackage(
          _id.toString(),
          title,
          description,
          benefits,
          price,
          tokenAmount,
        );
      });
      return mappedPackages;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while listing token packages.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene todos los planes de suscripción disponibles
   *
   * @async
   * @param ctx - TransactionContext opcional para ejecutar la creación dentro de una transacción.
   * @returns {Promise<SubscriptionPlan[]>} Array de planes de suscripción mapeados
   * @throws {AppError} Si ocurre un error al obtener los planes
   */
  async findSubscriptionsPlans(
    ctx?: TransactionContext,
  ): Promise<SubscriptionPlan[]> {
    try {
      const options = ctx?.session ? { session: ctx.session } : {};

      const subscriptionsPlans = await SubscriptionPlanModel.find({}, options);

      const mappedSubscriptionPlans: SubscriptionPlan[] =
        subscriptionsPlans.map((mongoPlan) =>
          mapSubcriptionPlan(mongoPlan.toObject()),
        );

      return mappedSubscriptionPlans;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while listing subscription plans.",
        false,
        error,
      );
    }
  }

  /**
   * Crea una nueva suscripción de usuario
   *
   * @async
   * @param {CreateSubscription} subscription - Datos de la suscripción a crear
   * @param ctx - TransactionContext opcional para ejecutar la creación dentro de una transacción.
   * @returns {Promise<{ subscriptionId: string }>} ID de la suscripción creada
   * @throws {AppError} Si ocurre un error al crear la suscripción
   */
  async createSubscription(
    subscription: CreateSubscription,
    ctx?: TransactionContext,
  ): Promise<{ subscriptionId: string }> {
    try {
      if (ctx && "session" in ctx) {
        const [created] = await SubscriptionModel.create([subscription], {
          session: ctx.session,
        });
        return { subscriptionId: created!._id.toString() };
      }

      const { _id } = await SubscriptionModel.create(subscription);
      return {
        subscriptionId: _id.toString(),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while creating subscription.",
        false,
        error,
      );
    }
  }

  /**
   * Actualiza el estado de una suscripción en su historial
   *
   * @async
   * @param {string} subscriptionId - ID de la suscripción
   * @param {string} currentHistoryId - ID del elemento en el historial a actualizar
   * @param {SubscriptionStatus} status - Nuevo estado de la suscripción
   * @param ctx - TransactionContext opcional para ejecutar la actualización dentro de una transacción.
   * @returns {Promise<{ matchCount: number; modifiedCount: number }>} Cantidad de documentos coincidentes y modificados
   * @throws {AppError} Si ocurre un error al actualizar el estado
   */
  async updateSubscriptionStatus(
    subscriptionId: string,
    currentHistoryId: string,
    status: SubscriptionStatus,
    ctx?: TransactionContext,
  ): Promise<{ matchCount: number; modifiedCount: number }> {
    try {
      const options = ctx?.session ? { session: ctx.session } : {};
      const result = await SubscriptionModel.updateOne(
        { _id: subscriptionId },
        { $set: { "history.$[elem].status": status } },
        { arrayFilters: [{ "elem.historyId": currentHistoryId }], ...options },
      );

      return {
        matchCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while updating subscription status.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene una suscripción por su ID
   *
   * @async
   * @param {string} subscriptionId - ID de la suscripción a buscar
   * @returns {Promise<Subscription | null>} Objeto de suscripción mapeado o null si no existe
   * @throws {AppError} Si ocurre un error al obtener la suscripción
   */
  async findSubscriptionById(
    subscriptionId: string,
  ): Promise<Subscription | null> {
    try {
      const subscription = await SubscriptionModel.findById(subscriptionId);

      if (!subscription) return null;

      return mapSubscription(subscription.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while listing subscription.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene una suscripción por su usuario propietario
   *
   * @async
   * @param {string} userId - ID del usuario propietario de la suscripción
   * @returns {Promise<Subscription | null>} Objeto de suscripción mapeado o null si no existe
   * @throws {AppError} Si ocurre un error al obtener la suscripción
   */
  async findSubscriptionByUser(userId: string): Promise<Subscription | null> {
    try {
      const subscription = await SubscriptionModel.findOne({ userId });

      if (!subscription) return null;

      return mapSubscription(subscription.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while listing subscription.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene todas las suscripciones activas
   *
   * @async
   * @returns {Promise<Subscription[]>} Array de suscripciones activas mapeadas
   * @throws {AppError} Si ocurre un error al obtener las suscripciones
   */
  async findActiveSubscriptions(): Promise<Subscription[]> {
    try {
      const subscriptions = await SubscriptionModel.find({
        "history.status": "active",
      });

      const mappedSubscriptions: Subscription[] = subscriptions.map(
        (subscription) => mapSubscription(subscription.toObject()),
      );
      return mappedSubscriptions;
    } catch (error) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while listing active user's subscriptions.",
        false,
        error,
      );
    }
  }

  /**
   * Actualiza múltiples suscripciones mediante operaciones en lote
   *
   * @async
   * @param {UpdateSubscription[]} updatedSubscriptions - Array de suscripciones a actualizar
   * @param ctx - TransactionContext opcional para ejecutar la actualización dentro de una transacción.
   * @returns {Promise<{ matchCount: number; modifiedCount: number }>} Cantidad de documentos coincidentes y modificados
   * @throws {AppError} Si ocurre un error al actualizar las suscripciones
   */
  async updateSubscriptions(
    updatedSubscriptions: UpdateSubscription[],
    ctx?: TransactionContext,
  ): Promise<{ matchCount: number; modifiedCount: number }> {
    try {
      const options = ctx?.session ? { session: ctx.session } : {};

      const bulkOps = updatedSubscriptions.map(
        ({ subscriptionId, ...fields }) => ({
          updateOne: {
            filter: { _id: subscriptionId },
            update: { $set: fields },
          },
        }),
      );

      const result = await SubscriptionModel.bulkWrite(bulkOps, options);

      return {
        matchCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while updating subscriptions.",
        false,
        error,
      );
    }
  }

  async updateSubscription(
    subscriptionId: string,
    updatedSubscription: Partial<Omit<UpdateSubscription, "subscriptionId">>,
    ctx?: TransactionContext,
  ): Promise<void> {
    try {
      const options = ctx?.session ? { session: ctx.session } : {};

      await SubscriptionModel.updateOne(
        { _id: subscriptionId },
        { ...updatedSubscription },
        options,
      );
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error occurred while updating subscription.",
        false,
        error,
      );
    }
  }
}
