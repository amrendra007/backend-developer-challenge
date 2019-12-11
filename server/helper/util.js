const fetch = require('node-fetch');
const groupBy = require('lodash/groupBy');

const headerKeys = ['Date', 'Donation Amount', 'Donation Currency', 'Fee', 'Nonprofit', 'Order Id'];
const currencyOption = [
  'AED',
  'USD',
  'CAD',
  'GBP',
  'AUD',
  'EUR',
  'SGD',
  'MYR',
  'DKK',
  'HKD',
  'JPY',
  'NOK',
  'INR',
  'QAR'
];

const validateHeaders = data => {
  data.forEach(dataValue => {
    Object.keys(dataValue).forEach(key => {
      if (!headerKeys.includes(key)) {
        return false;
      }
    });
  });
  return true;
};

validateValue = data => {
  for (let dataValue of data) {
    const date = dataValue.Date;
    const currencyValue = dataValue['Donation Currency'];
    const donationAmount = dataValue['Donation Amount'];
    const fee = dataValue['Fee'];

    if (!/\d{2}\/\d{2}\/\d{4}/.test(date)) {
      return { valid: false, message: 'Date format not correct' };
    }

    if (!currencyOption.includes(currencyValue)) {
      return { valid: false, message: `currency ${currencyValue} is not valid` };
    }

    if (typeof donationAmount !== 'number' || typeof fee !== 'number') {
      return { valid: false, message: `donationAmount ${donationAmount} or fee ${fee} not valid ` };
    }
  }
  return { valid: true, message: '' };
};

const validateData = (data, baseCurrency) => {
  if (!currencyOption.includes(baseCurrency)) {
    return { valid: false, message: 'baseCurrency not valid' };
  }

  if (!(data && data.length)) {
    return { valid: false, message: 'Data not available' };
  }

  if (!validateHeaders(data)) {
    return { valid: false, message: 'Invalid Template' };
  }

  const validationRes = validateValue(data);

  if (!validationRes.valid) {
    return { valid: false, message: validationRes.message };
  }

  return { valid: true, message: '' };
};

const getExchangeRate = async baseCurrency => {
  try {
    const url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    throw error;
  }
};

//todo
const getReportData = (data, todo) => {
  const rates = {
    CAD: 1.3237923251,
    HKD: 7.8138148984,
    ISK: 121.9864559819,
    PHP: 50.8162528217,
    DKK: 6.7474492099,
    HUF: 298.6365688488,
    CZK: 23.0446952596,
    GBP: 0.7606772009,
    RON: 4.3153950339,
    SEK: 9.4442437923,
    IDR: 14044.4966139955,
    INR: 70.8004514673,
    BRL: 4.1164785553,
    RUB: 63.5598194131,
    HRK: 6.7164785553,
    JPY: 108.7494356659,
    THB: 30.2645598194,
    CHF: 0.9856433409,
    EUR: 0.9029345372,
    MYR: 4.1645146727,
    BGN: 1.7659593679,
    TRY: 5.8102934537,
    CNY: 7.0392776524,
    NOK: 9.1643340858,
    NZD: 1.5281264108,
    ZAR: 14.7640632054,
    USD: 1,
    MXN: 19.225282167,
    SGD: 1.3598194131,
    AUD: 1.4622121896,
    ILS: 3.4765688488,
    KRW: 1193.2279909707,
    PLN: 3.8707900677
  };

  data.forEach(d => {
    const donationCurrency = d['Donation Currency'];
    // api does not have some currency rate and just for test project considering it 1
    const rate = rates[donationCurrency] || 1;
    d['Donation Amount'] = d['Donation Amount'] * rate;
  });

  let groupedData = groupBy(data, item => {
    return [item['Nonprofit']];
  });

  let reportData = [];

  Object.keys(groupedData).map(key => {
    let keyValue = groupedData[key];
    let totalAmout = 0;
    let numberOfDonation = keyValue.length;
    let totalFee = 0;
    keyValue.map(value => {
      totalAmout = totalAmout + value['Donation Amount'];
      totalFee = totalFee + value['Fee'];
    });
    reportData.push({
      Nonprofit: key,
      'Total amount': +totalAmout.toFixed(2),
      'Total Fee': +totalFee.toFixed(2),
      'Number of Donations': numberOfDonation
    });
  });

  return reportData;
};

module.exports = {
  validateData,
  getExchangeRate,
  getReportData
};
