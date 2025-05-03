async function calculateCost() {
  // get user input
  const distance = parseFloat(document.getElementById('distance').value);
  const mpg = parseFloat(document.getElementById('mpg').value);
  const zip = document.getElementById('zip').value.trim();

  // basic input check
  if (isNaN(distance) || isNaN(mpg) || mpg === 0 || zip === '') {
    document.getElementById('result').innerText = 'Please enter valid numbers and ZIP code.';
    return;
  }

  try {
    // fetch gas price using Gas Price Locator API
    const gasResponse = await fetch(`https://zylalabs.com/api/4808/gas+price+locator+api/1234/latest-prices?zip=${zip}`, {
      method: 'GET',
      headers: {
        'Authorization': 'apikey 4jIOI6yWSsJA2BEkTOfqZS:4L3xkQ0EdU6ZV4EjQyFFws'
      }
    });

    const gasData = await gasResponse.json();
    if (!gasData || !gasData.data || gasData.data.length === 0) {
      document.getElementById('result').innerText = 'Couldn’t get gas price.';
      return;
    }

    // parse gas price (assuming the API returns a list of stations with prices)
    const gasPrice = parseFloat(gasData.data[0].price);
    if (isNaN(gasPrice)) {
      document.getElementById('result').innerText = 'Bad gas data.';
      return;
    }

    // do the math
    const gallonsUsed = distance / mpg;
    const totalCost = gallonsUsed * gasPrice;

    // show result
    document.getElementById('result').innerText = `Estimated trip cost: $${totalCost.toFixed(2)} (Gas: $${gasPrice.toFixed(2)}/gal)`;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('result').innerText = 'Something went wrong.';
  }
}
