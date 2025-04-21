import { randomIntFromRange, randomColor, randomFloatFromRange } from './utilities.js';
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const texts = document.querySelectorAll("h1, p");
const fireworkSound = new Audio("./audio/fireworks-sound-final.mp3");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables

const fireworkColors = [
  "#6495ED",
  "#FF7F50",
  "#9370DB",
  "#FF69B4",
  "#F0E68C",
  "#66CDAA",
  "#FFA07A",
  "#40E0D0",
  "#DA70D6",
  "#FFA500"
];


const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

// Event Listeners

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  createStars();
});

// Objects

const gravity = 0.01;
const friction = 0.99;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1; 
    this.alphaDecrement = randomFloatFromRange(0.003, 0.004);
  }

  update() {
    this.draw();
    
    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.velocity.y += gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.alphaDecrement;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }
}

class Star {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color
    this.alpha = 1;
    this.fadingOut = true;
    this.alphaDecrement = randomFloatFromRange(0.001, 0.005);
  }

  update() {
    this.draw();
    
    if (this.fadingOut) {
      this.alpha -= this.alphaDecrement;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.fadingOut = false;
      }
    } else {
      this.alpha += this.alphaDecrement;
      if (this.alpha >= 1) {
        this.alpha = 1;
        this.fadingOut = true;
      }
    }
  }

  draw() {
    c.save();
    c.beginPath();
    c.globalAlpha = this.alpha;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }
}

// Implementation 

let particles = [];
let stars = [];

function createStars() {
  stars = [];
  const starCount = canvas.width < 768 ? 100 : 200;
  for(let i = 0; i < starCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    stars.push(
      new Star(
        x,
        y,
        randomFloatFromRange(0.1, 1),
        "white"
      )
    );
  }
}

// Animation 
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.25)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, i) => {
    if (particle.alpha > 0) particle.update();
    else particles.splice(i, 1);
  });

  stars.forEach(star => star.update());
}


animate();

addEventListener("click", (e) => {
  texts.forEach(text => text.classList.add("hidden"));
  fireworkSound.play();

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  const particleCount = 800;
  const angleIncrement = (Math.PI * 2) / particleCount;
  const power = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const color = randomColor(fireworkColors);
    particles.push(
      new Particle(
        mouse.x,
        mouse.y,
        randomFloatFromRange(1, 2),
        color,
        {
          x: Math.cos(angleIncrement * i) * Math.random() * power,
          y: Math.sin(angleIncrement * i) * Math.random() * power
        }
      )
    );
  }
});

setTimeout(() => {
  texts.forEach(text => text.classList.remove("hidden"));
}, 30000);

createStars();
