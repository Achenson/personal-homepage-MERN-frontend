export function setComplementaryUiColor(color: string): string {
  if (color === "black") {
    return "blueGray-400";
  }

  if (colorRgx("gray").test(color) || colorRgx("Gray").test(color)) {
    return "blueGray-400";
  }

  if (colorRgx("yellow").test(color) || colorRgx("amber").test(color)) {
    return "yellow-500";
  }

  if (colorRgx("orange").test(color)) {
    return "orange-500";
  }

  if (colorRgx("red").test(color)) {
    return "red-400";
  }

  if (
    colorRgx("lime").test(color) ||
    colorRgx("green").test(color) ||
    colorRgx("emarald").test(color) ||
    colorRgx("teal").test(color)
  ) {
    return "teal-500";
  }

  if (colorRgx("cyan").test(color) || colorRgx("sky").test(color)) {
    return "sky-500";
  }

  if (colorRgx("blue").test(color) || colorRgx("indigo").test(color)) {
    return "blue-500";
  }

  if (colorRgx("violet").test(color) || colorRgx("purple").test(color)) {
    return "violet-500";
  }

  if (colorRgx("fuchsia").test(color)) {
    return "fuchsia-500";
  }

  if (colorRgx("rose").test(color)) {
    return "rose-400";
  }

  if (colorRgx("pink").test(color)) {
    return "pink-400";
  }

  return color;

  function colorRgx(color: string) {
    return new RegExp(`${color}-`);
  }
}
