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
    // convert zip to state (needed for gas API)
    const locationResponse = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!locationResponse.ok) throw new Error('ZIP not found');
    const locationData = await locationResponse.json();
    const stateAbbreviation = locationData.places[0]['state abbreviation'];

    // fetch gas price using my API key
    const gasResponse = await fetch(`https://api.collectapi.com/gasPrice/stateUsaPrice?state=${stateAbbreviation}`, {
      method: 'GET',
      headers: {
        'Authorization': 'apikey 4jIOI6yWSsJA2BEkTOfqZS:4L3xkQ0EdU6ZV4EjQyFFws'
      }
    });

    const gasData = await gasResponse.json();
    if (!gasData.success || !gasData.result?.gasoline) {
      document.getElementById('result').innerText = 'Couldn’t get gas price.';
      return;
    }

    // parse gas price (remove $)
    const gasPrice = parseFloat(gasData.result.gasoline.replace('$', ''));
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
