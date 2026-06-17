import { AbacatePay } from "@abacatepay/sdk";
import { env } from "@midas/env/server";

export const abacate = AbacatePay({ secret: env.ABACATEPAY_API_KEY });
