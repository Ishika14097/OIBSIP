/* ===================== Elements ===================== */
const temperatureInput = document.getElementById("temperature-input");
const activeUnitBadge = document.getElementById("active-unit-badge");
const unitButtons = Array.from(document.querySelectorAll(".unit-option"));
const converterForm = document.getElementById("converter-form");
const validationMessage = document.getElementById("validation-message");
const statusMessage = document.getElementById("status-message");

const resultCelsius = document.getElementById("result-celsius");
const resultFahrenheit = document.getElementById("result-fahrenheit");
const resultKelvin = document.getElementById("result-kelvin");

const statusEmoji = document.getElementById("status-emoji");
const statusText = document.getElementById("status-text");
const scaleValue = document.getElementById("scale-value");
const scaleRange = document.getElementById("scale-range");

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===================== Conversion core (unchanged logic) ===================== */
const ABSOLUTE_ZERO = { celsius: -273.15, fahrenheit: -459.67, kelvin: 0 };
const UNIT_SYMBOL = { celsius: "°C", fahrenheit: "°F", kelvin: "K" };
const numericPattern = /^[-+]?(\d+\.?\d*|\.\d+)$/;

let selectedUnit = "celsius";

function toCelsius(value, unit) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return (value - 32) * (5 / 9);
  return value - 273.15;
}

function isBelowAbsoluteZero(value, unit) {
  return value < ABSOLUTE_ZERO[unit];
}

function convertAllUnits(celsiusValue) {
  return {
    celsius: celsiusValue,
    fahrenheit: celsiusValue * (9 / 5) + 32,
    kelvin: celsiusValue + 273.15,
  };
}

function formatTemperature(value) {
  return Number(value.toFixed(2)).toString();
}

/* ===================== Validation / UI state ===================== */
function showError(message) {
  validationMessage.textContent = message;
  statusMessage.textContent = "";
  temperatureInput.classList.add("invalid");
}

function clearError() {
  validationMessage.textContent = "";
  temperatureInput.classList.remove("invalid");
}

function resetResults() {
  resultCelsius.textContent = "--";
  resultFahrenheit.textContent = "--";
  resultKelvin.textContent = "--";
}

function validateNumericInput(rawValue) {
  const value = rawValue.trim();

  if (value.length === 0) {
    showError("Please enter a temperature value.");
    resetResults();
    return null;
  }

  if (!numericPattern.test(value)) {
    showError("Only numeric values are allowed (for example: -12.5, 37, 273.15).");
    resetResults();
    return null;
  }

  clearError();
  return Number(value);
}

function setSelectedUnit(unit) {
  selectedUnit = unit;
  activeUnitBadge.textContent = UNIT_SYMBOL[unit];
  unitButtons.forEach((btn) => {
    const isActive = btn.dataset.unit === unit;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-checked", String(isActive));
  });
}

unitButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setSelectedUnit(btn.dataset.unit);
    handleConversion({ silent: true });
  });
});

/* ===================== Atmosphere (continuous, temperature-driven) ===================== */
const SKY_STOPS = [
  { c: -15, top: "#050b16", mid: "#0d2036", bottom: "#15304a", glow: "rgba(140,180,255,0.22)" },
  { c: 0, top: "#0b2038", mid: "#193f5c", bottom: "#2a5c7d", glow: "rgba(150,195,255,0.30)" },
  { c: 15, top: "#1d4152", mid: "#3f7286", bottom: "#8db9c2", glow: "rgba(255,229,168,0.28)" },
  { c: 30, top: "#48342a", mid: "#a5622f", bottom: "#e0a34f", glow: "rgba(255,175,90,0.50)" },
  { c: 45, top: "#5c1f14", mid: "#a2381c", bottom: "#e0672c", glow: "rgba(255,110,60,0.60)" },
];

function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return { r: parseInt(v.substring(0, 2), 16), g: parseInt(v.substring(2, 4), 16), b: parseInt(v.substring(4, 6), 16) };
}
function rgbToHex({ r, g, b }) {
  const h = (n) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
function mixHex(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  return rgbToHex({ r: ca.r + (cb.r - ca.r) * t, g: ca.g + (cb.g - ca.g) * t, b: ca.b + (cb.b - ca.b) * t });
}
function mixRgba(a, b, t) {
  const parse = (s) => s.match(/[\d.]+/g).map(Number);
  const [ar, ag, ab, aa] = parse(a);
  const [br, bg, bb, ba] = parse(b);
  return `rgba(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)},${(aa + (ba - aa) * t).toFixed(2)})`;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function getAtmosphereFor(celsiusValue) {
  const stops = SKY_STOPS;
  const clamped = Math.min(Math.max(celsiusValue, stops[0].c), stops[stops.length - 1].c);
  for (let i = 0; i < stops.length - 1; i += 1) {
    const cur = stops[i], next = stops[i + 1];
    if (clamped >= cur.c && clamped <= next.c) {
      const t = (clamped - cur.c) / (next.c - cur.c);
      return {
        top: mixHex(cur.top, next.top, t),
        mid: mixHex(cur.mid, next.mid, t),
        bottom: mixHex(cur.bottom, next.bottom, t),
        glow: mixRgba(cur.glow, next.glow, t),
      };
    }
  }
  const last = stops[stops.length - 1];
  return { top: last.top, mid: last.mid, bottom: last.bottom, glow: last.glow };
}

function applyAtmosphere(celsiusValue) {
  const { top, mid, bottom, glow } = getAtmosphereFor(celsiusValue);
  const root = document.documentElement.style;
  root.setProperty("--sky-top", top);
  root.setProperty("--sky-mid", mid);
  root.setProperty("--sky-bottom", bottom);
  root.setProperty("--glow", glow);
}

/* ===================== Status + scale ===================== */
function getStatusFor(celsiusValue) {
  if (celsiusValue < 0) return { emoji: "❄️", text: "Freezing" };
  if (celsiusValue < 10) return { emoji: "🌨️", text: "Cold" };
  if (celsiusValue < 20) return { emoji: "🧥", text: "Cool" };
  if (celsiusValue < 30) return { emoji: "🌤️", text: "Pleasant" };
  if (celsiusValue < 40) return { emoji: "☀️", text: "Hot" };
  return { emoji: "🔥", text: "Extremely Hot" };
}

function updateStatusAndScale(celsiusValue) {
  const { emoji, text } = getStatusFor(celsiusValue);
  statusEmoji.textContent = emoji;
  statusText.textContent = text;

  const percent = clamp01((celsiusValue - -10) / (45 - -10)) * 100;
  scaleRange.value = celsiusValue;
  scaleValue.textContent = `${formatTemperature(celsiusValue)}°C`;
}

/* ===================== Lightweight particle system ===================== */
let particles = [];
let particleMode = "mild";
let animationHandle = null;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function makeParticle() {
  const w = window.innerWidth, h = window.innerHeight;
  if (particleMode === "cold") {
    return {
      x: Math.random() * w,
      y: Math.random() * -h,
      r: 1.5 + Math.random() * 2.5,
      vy: 0.4 + Math.random() * 0.9,
      vx: -0.3 + Math.random() * 0.6,
      alpha: 0.4 + Math.random() * 0.5,
      color: "255,255,255",
    };
  }
  if (particleMode === "hot") {
    return {
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: 1 + Math.random() * 2,
      vy: -(0.3 + Math.random() * 0.6),
      vx: -0.2 + Math.random() * 0.4,
      alpha: 0.15 + Math.random() * 0.35,
      color: "255,190,120",
    };
  }
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1 + Math.random() * 1.8,
    vy: -(0.1 + Math.random() * 0.25),
    vx: -0.15 + Math.random() * 0.3,
    alpha: 0.15 + Math.random() * 0.3,
    color: "255,255,255",
  };
}

function setParticleScene(celsiusValue) {
  let mode = "mild";
  let count = 26;
  if (celsiusValue < 10) {
    mode = "cold";
    count = Math.round(20 + clamp01((10 - celsiusValue) / 25) * 40);
  } else if (celsiusValue > 28) {
    mode = "hot";
    count = Math.round(14 + clamp01((celsiusValue - 28) / 20) * 26);
  }

  if (mode !== particleMode) {
    particleMode = mode;
    particles = [];
  }

  while (particles.length < count) particles.push(makeParticle());
  while (particles.length > count) particles.pop();
}

function stepParticles() {
  const w = window.innerWidth, h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (particleMode === "cold" && p.y > h + 10) {
      p.y = -10;
      p.x = Math.random() * w;
    } else if (particleMode === "hot" && p.y < -10) {
      p.y = h + 10;
      p.x = Math.random() * w;
    } else if (particleMode === "mild") {
      if (p.y < -10) p.y = h + 10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
  });

  animationHandle = requestAnimationFrame(stepParticles);
}

function startParticleLoop() {
  if (prefersReducedMotion) return;
  if (animationHandle) cancelAnimationFrame(animationHandle);
  stepParticles();
}

/* ===================== Environment orchestration ===================== */
function updateEnvironment(celsiusValue) {
  applyAtmosphere(celsiusValue);
  updateStatusAndScale(celsiusValue);
  setParticleScene(celsiusValue);
}

/* ===================== Conversion flow ===================== */
function handleConversion({ silent = false } = {}) {
  const inputNumber = validateNumericInput(temperatureInput.value);
  if (inputNumber === null) return;

  if (isBelowAbsoluteZero(inputNumber, selectedUnit)) {
    showError("That value is below absolute zero for the selected unit. Please enter a physically possible temperature.");
    resetResults();
    return;
  }

  const celsiusValue = toCelsius(inputNumber, selectedUnit);
  const results = convertAllUnits(celsiusValue);

  resultCelsius.textContent = formatTemperature(results.celsius);
  resultFahrenheit.textContent = formatTemperature(results.fahrenheit);
  resultKelvin.textContent = formatTemperature(results.kelvin);

  updateEnvironment(celsiusValue);
  clearError();
  statusMessage.textContent = silent ? "" : "Conversion successful.";
}

temperatureInput.addEventListener("input", () => {
  const raw = temperatureInput.value.trim();
  statusMessage.textContent = "";

  if (raw.length === 0) {
    clearError();
    resetResults();
    return;
  }

  if (!numericPattern.test(raw)) {
    showError("Only numeric values are allowed.");
    return;
  }

  clearError();
});

converterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleConversion();
});

scaleRange.addEventListener("input", () => {
  const celsiusValue = Number(scaleRange.value);
  const convertedValue = convertAllUnits(celsiusValue)[selectedUnit];
  temperatureInput.value = formatTemperature(convertedValue);
  handleConversion({ silent: true });
});

/* ===================== Initial state (25°C, environment reflects it, no success text) ===================== */
setSelectedUnit("celsius");
handleConversion({ silent: true });
startParticleLoop();