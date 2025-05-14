const api_key = `845b3dcb40dedcd38c8dce4a4d24383d`;
const base_url = `http://apilayer.net/api/live?access_key=${api_key}&currencies=INR,EUR&source=USD&format=1`;

const SelectOption = document.querySelectorAll(".select");
const btn = document.querySelector("form button");
const fromCurrency = document.querySelector(".from .select_container select");
const toCurrency = document.querySelector(".to .select_container select");
const msg = document.querySelector(".msg")


for (let Select of SelectOption) {
  for (currencyCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currencyCode;
    newOption.value = currencyCode;
    if (Select.name === "from" && currencyCode === "USD") {
      newOption.selected = "selected"
    }
    else if (Select.name === "to" && currencyCode === "INR") {
      newOption.selected = "selected"
    }
    Select.append(newOption)
  }

  Select.addEventListener("change", (el) => {
    updateFlag(el.target);
  });
}

const updateFlag = (element) => {
  let currencyCode = element.value;
  let countryCode = countryList[currencyCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

btn.addEventListener("click", (el) => {
  el.preventDefault();

  updateExchangeRate()
})

window.addEventListener("load", () => {
  updateExchangeRate()
})

 // Select the exchange icon
const exchangeIcon = document.querySelector(".fa-right-left"); 

exchangeIcon.addEventListener("click", () => {

  // Get current selected currencies
  let fromCurrencyValue = fromCurrency.value;
  let toCurrencyValue = toCurrency.value;

  // Swap the selected currencies
  fromCurrency.value = toCurrencyValue;
  toCurrency.value = fromCurrencyValue;

  // Update the flags
  updateFlag(fromCurrency);
  updateFlag(toCurrency);

  // Update the exchange rate after swapping currencies
  updateExchangeRate();
});


const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  };

  const url = `${base_url}&currencies=${toCurrency.value}&source=${fromCurrency.value}&format=1`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    let rateKey = fromCurrency.value + toCurrency.value;
    let rate = data.quotes[rateKey];
    let finalAmt = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmt} ${toCurrency.value}`
  }
  catch (error) {
    console.log(error);
    msg.innerText = "Error fetching exchange rates. Please try again.";
  }
}
