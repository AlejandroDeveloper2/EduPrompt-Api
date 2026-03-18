import { Client, Environment, LogLevel } from "@paypal/paypal-server-sdk";

import { config } from "./enviromentVariables";

/** Cliente de paypal SDK*/
export const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: config.PAYPAL_CLIENT_ID,
    oAuthClientSecret: config.PAYPAL_SECRET_KEY,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});
