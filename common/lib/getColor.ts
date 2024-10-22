import { COLORS_ARRAY } from "../constants"

export const getColor = (color?: string) => {
  const index = COLORS_ARRAY.findIndex( clr => clr === color)

  if(index === -1) return COLORS_ARRAY[0]

  return COLORS_ARRAY[(index + 1) % COLORS_ARRAY.length]
}