import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  title: "Générateur de devis / factures",
  description: "Générateur de devis / factures simple",
  prerender: true,

  extends: vikeReact,
} satisfies Config;
