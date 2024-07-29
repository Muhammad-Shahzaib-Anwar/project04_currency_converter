#!/usr/bin/env node
import inquirer from 'inquirer';

// Updated conversion rates with PKR as the base currency
const exchangeRates: { [key: string]: number } = {
  'PKR': 1, // Base currency
  'USD': 0.0035,
  'EUR': 0.0031,
  'GBP': 0.0027,
  'JPY': 0.50,
  'INR': 0.29,
  // Add more currencies as needed
};

// Function to prompt the user for inputs
async function promptForConversion(): Promise<{ amount: number, from: string, to: string } | null> {
  const amountQuestion = {
    type: 'input',
    name: 'amount',
    message: 'Enter the amount to convert (or type "exit" to quit):',
    validate: (input: string) => {
      if (input.toLowerCase() === 'exit') {
        return true;
      }
      const amount = parseFloat(input);
      if (isNaN(amount) || amount <= 0) {
        return 'Please enter a valid amount.';
      }
      return true;
    },
  };

  const currencyQuestion = {
    type: 'list',
    name: 'currency',
    message: 'Select a currency (or type "exit" to quit):',
    choices: Object.keys(exchangeRates).concat('exit'),
  };

  const amountAnswer = await inquirer.prompt([amountQuestion]);
  if (amountAnswer.amount.toLowerCase() === 'exit') {
    return null;
  }

  const fromAnswer = await inquirer.prompt([{ ...currencyQuestion, name: 'from', message: 'Select the source currency:' }]);
  if (fromAnswer.from === 'exit') {
    return null;
  }

  const toAnswer = await inquirer.prompt([{ ...currencyQuestion, name: 'to', message: 'Select the target currency:' }]);
  if (toAnswer.to === 'exit') {
    return null;
  }

  return {
    amount: parseFloat(amountAnswer.amount),
    from: fromAnswer.from,
    to: toAnswer.to,
  };
}

// Function to convert currency
function convertCurrency(amount: number, from: string, to: string): number {
  const baseAmount = amount / exchangeRates[from];
  const convertedAmount = baseAmount * exchangeRates[to];
  return convertedAmount;
}

// Main function to run the converter
async function runConverter() {
  console.log('Welcome to the Currency Converter!');

  while (true) {
    const conversionDetails = await promptForConversion();
    if (conversionDetails === null) {
      console.log('You have exited the converter. Thanks for using it!');
      break;
    }

    const { amount, from, to } = conversionDetails;
    const convertedAmount = convertCurrency(amount, from, to);

    console.log(`${amount} ${from} is equal to ${convertedAmount.toFixed(2)} ${to}`);
  }
}

runConverter().catch((error) => {
  console.error('An error occurred:', error);
});
