import { Server } from "socket.io";

/** Función para registar el socket de notificaciones para comunicación en tiempo real */
export const registerSubscriptionSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    // Enviar bienvenida o notificaciones iniciales
    socket.emit(
      "subscriptions:connected",
      "Conectado al servidor de notificaciones",
    );

    // Escuchar cuando un cliente pida recargar
    socket.on("subscriptions:fetch", () => {
      console.log("📩 Cliente solicitó subscripciones");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });
};
