export const tabColors: string[][] = [
  [
    "blueGray-303",
    "blueGray-404",
    "blueGray-600",
    "gray-404",
    "warmGray-404",
    "black",
  ],
  [
    "yellow-300",
    "yellow-330",
    "yellow-400",
    "amber-400",
    "amber-500",
    "amber-600",
  ],

  [
    "orange-300",
    "orange-400",
    "orange-500",
    "orange-600",
    "orange-700",
    "orange-800",
  ],
  ["red-404", "orange-404", "orange-606", "red-606", "amber-700", "amber-900"],
  ["red-300", "red-400", "red-500", "red-600", "red-700", "red-800"],

  ["lime-400", "green-303", "lime-500", "green-400", "green-500", "green-505"],
  [
    "emerald-300",
    "emerald-400",
    "emerald-500",
    "emerald-600",
    "emerald-700",
    "emerald-800",
  ],
  ["teal-300", "teal-400", "teal-500", "teal-600", "teal-700", "teal-800"],
  ["cyan-300", "cyan-400", "cyan-500", "cyan-600", "cyan-700", "cyan-800"],
  ["sky-300", "sky-400", "sky-500", "sky-600", "sky-700", "sky-800"],
  ["blue-300", "blue-400", "blue-500", "blue-600", "blue-700", "blue-800"],
  [
    "indigo-300",
    "indigo-600",
    "indigo-800",
    "blue-707",
    "blue-770",
    "blue-777",
  ],

  [
    "violet-300",
    "violet-400",
    "violet-500",
    "violet-600",
    "violet-700",
    "violet-800",
  ],
  [
    "purple-300",
    "purple-600",
    "purple-700",
    "fuchsia-400",
    "fuchsia-600",
    "fuchsia-700",
  ],
  ["rose-400", "rose-600", "rose-700", "pink-300", "pink-400", "pink-600"],
];

export const tabColorsConcat: string[] = concatColors(tabColors);

function concatColors(tabColors: string[][]): string[] {
  let concatArr: string[] = [];

  tabColors.forEach((el, i) => {
    concatArr.push(...tabColors[i]);
  });

  return concatArr;
}

export const tabColorsLightFocus: string[] = [
  "violet-500",
  "green-505",
  "blueGray-600",
  "emerald-600",
  "emerald-700",
  "emerald-800",
  "teal-600",
  "teal-700",
  "teal-800",
  "cyan-600",
  "cyan-700",
  "cyan-800",
  "sky-600",
  "sky-700",
  "sky-800",
  "blue-500",
  "blue-600",
  "blue-700",
  "blue-800",
  "indigo-600",
  "indigo-800",
  "blue-707",
  "blue-770",
  "blue-777",
  "violet-500",
  "violet-600",
  "violet-700",
  "violet-800",
  "purple-600",
  "purple-700",
  "fuchsia-600",
  "fuchsia-700",
  "rose-600",
  "rose-700",
  "pink-600",
];
