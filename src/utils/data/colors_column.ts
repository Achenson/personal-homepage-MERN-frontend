export const columnColors: string[][] = [
  [
    "white",
    "gray-100",
    "gray-200",
    "blueGray-50",
    "blueGray-100",
    "blueGray-200",
    "yellow-50",
    "yellow-100",
    "yellow-200",
  ],
  [
    "amber-50",
    "amber-100",
    "amber-200",
    "orange-50",
    "orange-100",
    "orange-200",
    "red-50",
    "red-100",
    "red-200",
  ],
  [
    "rose-50",
    "rose-100",
    "rose-200",
    "pink-50",
    "pink-100",
    "pink-200",
    "fuchsia-50",
    "fuchsia-100",
    "fuchsia-200",
  ],

  [
    "green-50",
    "green-100",
    "green-200",
    "emerald-50",
    "emerald-100",
    "emerald-200",
    "teal-50",
    "teal-100",
    "teal-200",
  ],
  [
    "cyan-50",
    "cyan-100",
    "cyan-200",
    "sky-50",
    "sky-100",
    "sky-200",
    "blue-50",
    "blue-100",
    "blue-200",
  ],

  [
    "indigo-50",
    "indigo-100",
    "indigo-200",

    "violet-50",
    "violet-100",
    "violet-200",

    "purple-50",
    "purple-100",
    "purple-200",
  ],
];

export const columnColorsConcat: string[] = concatColors(columnColors);

export const imageColumnColors: string[][] = [
  [
    "rgba(0,0,0,0)",
    "rgba(0,0,0,0.1)",
    "rgba(0,0,0,0.2)",
    "rgba(0,0,0,0.3)",
    "rgb(255,215,0,0.1)",
    "rgb(255,215,0,0.2)",
    "rgb(255,215,0,0.3)",
    "rgb(255,215,0,0.4)",
  ],
  [
    "rgb(255,128,0,0.1)",
    "rgb(255,128,0,0.2)",
    "rgb(255,128,0,0.3)",
    "rgb(255,128,0,0.4)",
    "rgb(255,0,0,0.1)",
    "rgb(255,0,0,0.2)",
    "rgb(255,0,0,0.3)",
    "rgb(255,0,0,0.4)",
  ],
  [
    "rgb(0,255,0,0.1)",
    "rgb(0,255,0,0.2)",
    "rgb(0,255,0,0.3)",
    "rgb(0,255,0,0.4)",
    "rgba(0,128,128,0.1)",
    "rgba(0,128,128,0.2)",
    "rgba(0,128,128,0.3)",
    "rgba(0,128,128,0.4)",
  ],

  [
    "rgba(0,255,255,0.1)",
    "rgba(0,255,255,0.2)",
    "rgba(0,255,255,0.3)",
    "rgba(0,255,255,0.4)",
    "rgba(0,128,255,0.1)",
    "rgba(0,128,255,0.2)",
    "rgba(0,128,255,0.3)",
    "rgba(0,128,255,0.4)",
  ],
  [
    "rgba(0,0,255,0.1)",
    "rgba(0,0,255,0.2)",
    "rgba(0,0,255,0.3)",
    "rgba(0,0,255,0.4)",
    "rgba(127,0,255,0.1)",
    "rgba(127,0,255,0.2)",
    "rgba(127,0,255,0.3)",
    "rgba(127,0,255,0.4)",
  ],
  [
    "rgba(255,0,255,0.1)",
    "rgba(255,0,255,0.2)",
    "rgba(255,0,255,0.3)",
    "rgba(255,0,255,0.4)",
    "rgba(127,0,127,0.1)",
    "rgba(127,0,127,0.2)",
    "rgba(127,0,127,0.3)",
    "rgba(127,0,127,0.4)",
  ],
];

export const imageColumnColorsConcat: string[] =
  concatColors(imageColumnColors);

function concatColors(tabColors: string[][]): string[] {
  let concatArr: string[] = [];

  tabColors.forEach((el, i) => {
    concatArr.push(...tabColors[i]);
  });

  return concatArr;
}
