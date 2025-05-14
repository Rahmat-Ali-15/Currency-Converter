const api_key = "cur_live_dGFuGM2iKYXObBF0qwscbunXATrFjxA1UgRe7uGt";

const base_url = `https://api.currencyapi.com/v3/latest?apikey=${api_key}&currencies`


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

const exchangeIcon = document.querySelector(".fa-right-left");  // Select the exchange icon

// Add event listener to the exchange icon (Only add it once)
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

  const url = `${base_url}&base_currency=${fromCurrency.value}&currencies=${toCurrency.value}`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let rate = data.data[toCurrency.value].value;
    let finalAmt = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmt} ${toCurrency.value}`
  }
  catch (error) {
    console.log(error);
    msg.innerText = "Error fetching exchange rates. Please try again.";
  }
}
