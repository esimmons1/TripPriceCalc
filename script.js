// trip cost calculator using CollectAPI and user inputs

function calculateCost() {
  // get values from the input boxes
  const distance = parseFloat(document.getElementById("distance").value);
  const mpg = parseFloat(document.getElementById("mpg").value);
  const state = document.getElementById("state").value.trim().toUpperCase();
  const grade = document.getElementById("grade").value;

  // simple check to make sure stuff is filled in right
  if (isNaN(distance) || isNaN(mpg) || mpg === 0 || state === "") {
    document.getElementById("result").innerText = "Please fill in all fields correctly.";
    return;
  }

  const url = `https://api.collectapi.com/gasPrice/stateUsaPrice?state=${state}`;
  const xhr = new XMLHttpRequest();

  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      try {
        const response = JSON.parse(this.responseText);

        // just making sure the API worked
        if (!response.success || !response.result || !response.result.state) {
          document.getElementById("result").innerText = "Couldn’t get gas price data.";
          return;
        }

        // get the price for the selected grade (remove $ sign)
        const rawPrice = response.result.state[grade];
        if (!rawPrice) {
          document.getElementById("result").innerText = "Selected fuel grade data is unavailable for this state.";
          return;
        }
        const gasPrice = parseFloat(rawPrice.replace("$", ""));

        if (isNaN(gasPrice)) {
          document.getElementById("result").innerText = "Invalid price data for that grade.";
          return;
        }

        // do the math
        const gallonsUsed = distance / mpg;
        const totalCost = gallonsUsed * gasPrice;

        // show result
        document.getElementById("result").innerText =
          `Trip cost: $${totalCost.toFixed(2)} (Gas: $${gasPrice.toFixed(2)} per gallon)`;

      } catch (error) {
        console.error("Error parsing response:", error);
        document.getElementById("result").innerText = "Something went wrong with the data.";
      }
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("authorization", "apikey 4jIOI6yWSsJA2BEkTOfqZS:4L3xkQ0EdU6ZV4EjQyFFws");

  xhr.send();
}
