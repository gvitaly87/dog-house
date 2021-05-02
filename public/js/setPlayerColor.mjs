const setPlayerColor = (seat) => {
  const root = document.querySelector(":root");
  const colorsHue = { red: 0, yellow: 60, green: 120, blue: 240 };
  // Blue is set by default
  switch (seat) {
    case 1:
      root.style.setProperty("--player-hue", colorsHue.green);
      root.style.setProperty("--player2-hue", colorsHue.yellow);
      root.style.setProperty("--player3-hue", colorsHue.red);
      root.style.setProperty("--player4-hue", colorsHue.blue);
      break;
    case 2:
      root.style.setProperty("--player-hue", colorsHue.yellow);
      root.style.setProperty("--player2-hue", colorsHue.red);
      root.style.setProperty("--player3-hue", colorsHue.blue);
      root.style.setProperty("--player4-hue", colorsHue.green);
      break;
    case 3:
      root.style.setProperty("--player-hue", colorsHue.red);
      root.style.setProperty("--player2-hue", colorsHue.blue);
      root.style.setProperty("--player3-hue", colorsHue.green);
      root.style.setProperty("--player4-hue", colorsHue.yellow);
      break;
    default:
      root.style.setProperty("--player-hue", colorsHue.blue);
      root.style.setProperty("--player2-hue", colorsHue.green);
      root.style.setProperty("--player3-hue", colorsHue.yellow);
      root.style.setProperty("--player4-hue", colorsHue.red);
  }
};

export default setPlayerColor;
