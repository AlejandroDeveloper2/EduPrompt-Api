import { Feature } from "@/core/infrastructure/types";

import { router as landingRouter } from "./infrastructure/routes/v1/landing.route";

/** Punto publico para acceder a la caracteristica Landing */
export const LandingFeature: Feature<null, null> = {
  featureName: "landing",
  router: landingRouter,
  repository: null,
  service: null,
};
