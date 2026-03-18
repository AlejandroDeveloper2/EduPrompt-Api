import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { PaymentGatewayRepository } from "../../domain/repositories";
import { OrderStatusResponse } from "../../domain/types";

/**
 * Caso de uso para recuperar una orden con su estado por su identificador.
 *
 * Lanza un error si no existe la orden.
 *
 * @example
 * ```ts
 * const useCase = new FindOrderStatusUseCase(paymentGatewayRepository);
 * const orderStatus = await useCase.run(orderId);
 * ```
 */
export class FindOrderStatusUseCase {
  constructor(
    private readonly paymentGatewayRepository: PaymentGatewayRepository,
  ) {}
  /**
   * Ejecuta la búsqueda de la orden.
   *
   * @param orderId - identificador de la orden.
   * @returns La info del estado de la orden encontrada.
   * @throws {AppError} si la orden no existe.
   */
  async run(orderId: string): Promise<OrderStatusResponse> {
    const orderStatus =
      await this.paymentGatewayRepository.findOrderStatus(orderId);

    if (orderStatus === null)
      throw new AppError(
        ErrorMessages.ORDER_NOT_FOUND,
        404,
        `Order ${orderId} not found`,
        true,
      );

    return orderStatus;
  }
}
