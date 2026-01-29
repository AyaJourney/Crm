import { ds160Schema } from "@/forms/ds160.schema"
import { ukVisaSchema } from "@/forms/uk.schema"
// import { schengenSchema } from "@/forms/schengen.schema"
// import { canadaSchema } from "@/forms/canada.schema"

export function resolveVisaSchema(visaType) {
  switch (visaType) {
    case "ds-160":
      return ds160Schema

    case "uk":
      return ukVisaSchema

    // case "schengen":
    //   return schengenSchema

    // case "canada":
    //   return canadaSchema

    default:
      console.warn("Unknown visa type:", visaType)
      return []
  }
}
