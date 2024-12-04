export const CANVAS_SIZE = {
  width: 4000,
  height: 2000
}

export const DEFAULT_EASE = [0.6, 0.01, 0.05, 0.9];


const COLORS = {
  SUNSET_ORANGE: "#FF4500",
  ELECTRIC_VIOLET: "#8F00FF",
  LIME_PUNCH: "#DFFF00",
  AQUA_MARINE: "#7FFFD4",
  ROYAL_FUCHSIA: "#CA2C92",
  CERULEAN_BLUE: "#007BA7",
  FLAME: "#E25822",
  MINT_LEAF: "#98FF98",
  VIVID_TANGERINE: "#FF8373",
  RASPBERRY_ROSE: "#B3446C"
};

export const COLORS_ARRAY = [...Object.values(COLORS)]

export const DEFAULT_MOVE = {
  circle: {
    cX: 0,
    cY: 0,
    radiusX: 0,
    radiusY: 0,
  },
  rect: {
    width: 0,
    height: 0,
  },
  path: [],
  options: {
    shape: "line",
    mode: "draw",
    lineWidth: 1,
    lineColor: { r: 0, g: 0, b: 0, a: 0 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
    selection: null,
  },
  id: "",
  img: {
    base64: "",
  },
  timestamp: 0,
};
