// calculateCost() - triggered when user clicks the button
function calculateCost() {
  const distance = parseFloat(document.getElementById("distance").value);
  const mpg = parseFloat(document.getElementById("mpg").value);
  const state = document.getElementById("state").value;
  const grade = document.getElementById("grade").value;
  const manualPrice = parseFloat(document.getElementById("manualPrice").value);
  const resultBox = document.getElementById("result");

  // Check for basic input
  if (isNaN(distance) || isNaN(mpg) || mpg <= 0) {
    resultBox.innerText = "Please enter valid distance and MPG.";
    return;
  }

  // fallback calculation
  function useManualPrice(reason) {
    if (isNaN(manualPrice)) {
      resultBox.innerText = `${reason} Also, no valid manual gas price entered.`;
    } else {
      const gallons = distance / mpg;
      const cost = gallons * manualPrice;
      resultBox.innerText = `${reason} Using your price: $${manualPrice.toFixed(2)}\nEstimated trip cost: $${cost.toFixed(2)}`;
    }
  }

  // API fallback if no state
  if (!state) {
    useManualPrice("No state selected. Skipping gas price lookup.");
    return;
  }

  // Start API call
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      try {
        const data = JSON.parse(this.responseText);

        if (!data.success || !data.result || !data.result.state || !data.result.state[grade]) {
          useManualPrice("Gas price data is temporarily unavailable.");
          return;
        }

        const priceString = data.result.state[grade]; // e.g. "$3.217"
        const gasPrice = parseFloat(priceString.replace("$", ""));

        if (isNaN(gasPrice)) {
          useManualPrice("Gas price returned from server is invalid.");
          return;
        }

        const gallons = distance / mpg;
        const cost = gallons * gasPrice;

        resultBox.innerText = `Estimated trip cost: $${cost.toFixed(2)} (Gas price: $${gasPrice.toFixed(2)} per gallon)`;
      } catch (e) {
        console.error(e);
        useManualPrice("Something went wrong while processing gas data.");
      }
    }
  });

  xhr.open("GET", `https://api.collectapi.com/gasPrice/stateUsaPrice?state=${state}`);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("authorization", "apikey 4jIOI6yWSsJA2BEkTOfqZS:4L3xkQ0EdU6ZV4EjQyFFws");

  xhr.send(null);
}
