function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomFloatFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

export { randomIntFromRange, randomColor, randomFloatFromRange };