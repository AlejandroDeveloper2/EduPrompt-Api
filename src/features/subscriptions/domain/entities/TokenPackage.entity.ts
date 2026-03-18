import { LangTemplate } from "@/core/domain/types";

/**
 * Representa un paquete de tokens que los usuarios pueden adquirir.
 * Incluye identificador, información comercial, precio y cantidad de tokens.
 */
export class TokenPackage {
  /**
   * Crea una instancia de TokensPackage.
   * @param packageId Identificador único del paquete.
   * @param title Título comercial del paquete.
   * @param description Descripción breve del contenido o uso del paquete.
   * @param benefits Lista de beneficios o características incluidas.
   * @param price Precio del paquete.
   * @param tokenAmount Cantidad de tokens que se agregan al usuario al comprar este paquete.
   */
  constructor(
    public readonly packageId: string,
    public title: LangTemplate<string>,
    public description: LangTemplate<string>,
    public benefits: LangTemplate<string[]>,
    public price: number,
    public tokenAmount: number,
  ) {}
}
