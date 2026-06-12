const beta = document.querySelector('#beta');
const betaOut = document.querySelector('#betaOut');
const nInit = document.querySelector('#nInit');
const maxBranch = document.querySelector('#maxBranch');
const confThresh = document.querySelector('#confThresh');
const behavior = document.querySelector('#behavior');

function updateBeta() {
  const b = Number(beta.value);
  betaOut.textContent = b.toFixed(2);
  nInit.textContent = Math.max(2, Math.round(2 + 6 * b));
  maxBranch.textContent = Math.min(64, Math.round(4 + 60 * b));
  confThresh.textContent = (0.85 + 0.12 * b).toFixed(2);
  behavior.textContent = b < 0.25 ? 'cheap' : b < 0.7 ? 'balanced' : 'accuracy-first';
}

beta.addEventListener('input', updateBeta);
updateBeta();
