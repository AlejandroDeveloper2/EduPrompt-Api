import { PaymentGatewayRepository } from "../../domain/repositories";

import { CreateProductOrderInput } from "../dto";

/**
 * Caso de uso encargado de iniciar la creación de un pedido en el gateway
 * de pagos.
 *
 * Se delega la operación de creación de orden al repositorio correspondiente
 * y se devuelve el identificador de la orden resultante.
 *
 * @example
 * ```ts
 * const useCase = new CreateProductOrderUseCase(paymentGatewayRepo);
 * const { orderId } = await useCase.run(input);
 * ```
 */
export class CreateProductOrderUseCase {
  constructor(
    private readonly paymentGatewayRepository: PaymentGatewayRepository,
  ) {}

  /**
   * Ejecuta la creación de la orden de pago.
   *
   * @param createProductOrderInput - datos necesarios para generar la orden.
   * @returns Objeto con el identificador de la orden creado.
   */
  async run(
    createProductOrderInput: CreateProductOrderInput,
  ): Promise<{ orderId: string }> {
    const { order } = await this.paymentGatewayRepository.createOrder(
      createProductOrderInput,
    );
    return { orderId: order.gatewayOrderId };
  }
}
