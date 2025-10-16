function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.~?";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

const resultEl = document.getElementById("PasswordResult");
const lengthEl = document.getElementById("Passwordlength");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("numbers");
const symbolEl = document.getElementById("symbols");
const noSimilarEl = document.getElementById("noSimilar");
const generateEl = document.getElementById("generateBtn");
const clipboardEl = document.getElementById("clipboardBtn");
const autoRegenEl = document.getElementById("autoRegen");
const strengthMeter = document.getElementById("strengthMeter").querySelector("span");
const strengthText = document.getElementById("strengthText");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function generatePassword(lower, upper, number, symbol, length, avoidSimilar) {
  let generatedPassword = "";
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    item => Object.values(item)[0]
  );

  if (typesArr.length === 0) return "";

  while (generatedPassword.length < length) {
    typesArr.forEach(type => {
      const funcName = Object.keys(type)[0];
      let char = randomFunc[funcName]();
      if (avoidSimilar && /[O0l1]/.test(char)) return;
      generatedPassword += char;
    });
  }

  return generatedPassword.slice(0, length);
}

function updateStrength(password) {
  let strength = 0;
  if (password.length > 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const width = (strength / 5) * 100;
  strengthMeter.style.width = `${width}%`;

  const colors = ["red", "orange", "#fbc531", "#44bd32", "#009432"];
  strengthMeter.style.background = colors[strength - 1] || "red";
  strengthText.innerText =
    ["Weak", "Fair", "Good", "Strong", "Very Strong"][strength - 1] || "Weak";
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

// Copy to clipboard
clipboardEl.addEventListener("click", () => {
  navigator.clipboard.writeText(resultEl.value);
  showToast();
});

// Generate password
generateEl.addEventListener("click", () => {
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numberEl.checked;
  const hasSymbol = symbolEl.checked;
  const avoidSimilar = noSimilarEl.checked;

  const password = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length,
    avoidSimilar
  );

  resultEl.value = password;
  updateStrength(password);
  saveHistory(password);
});

// Auto regenerate
autoRegenEl.addEventListener("change", () => {
  if (autoRegenEl.checked) {
    autoGenerate();
  } else {
    clearInterval(autoGenerate.interval);
  }
});

function autoGenerate() {
  autoGenerate.interval = setInterval(() => {
    generateEl.click();
  }, 2000);
}

function saveHistory(password) {
  if (!password) return;
  const li = document.createElement("li");
  li.textContent = password;
  historyList.prepend(li);
  if (historyList.children.length > 5) historyList.removeChild(historyList.lastChild);
}

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
});

// Dark mode toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") toggleSwitch.checked = true;
}

toggleSwitch.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});
