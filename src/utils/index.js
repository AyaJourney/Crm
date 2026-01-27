import { normalizeDs160 } from "./ds160"

export function normalizeFormData(visaType, rawData) {
  switch (visaType) {
    case "ds160":
    case "DS-160":
      return normalizeDs160(rawData)

    default:
      return rawData
  }
}
