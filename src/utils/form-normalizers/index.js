import { normalizeSchengenForm } from "./schengen"
import { normalizeCanadaForm } from "./canada"
import { normalizeUKForm } from "./uk"
import { normalizeDs160 } from "./ds160"

export function normalizeFormData(visaType, data) {
  switch (visaType) {
    case "schengen":
      return normalizeSchengenForm(data)

    case "canada":
      return normalizeCanadaForm(data)

    case "uk":
      return normalizeUKForm(data)

    case "ds160":
    case "ds-160":
        case "":
      return normalizeDs160(data)

    default:
      return data
  }
}
