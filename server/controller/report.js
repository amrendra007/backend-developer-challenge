const { validateData, getExchangeRate, getReportData } = require('../helper/util');

const getDisbursementReport = async (req, res, next) => {
  try {
    const { baseCurrency, data } = req.body;
    const isValidResponse = validateData(data, baseCurrency);

    if (!isValidResponse.valid) {
      return res.status(422).json({ success: false, message: isValidResponse.message });
    }
    // const exchangeRate = await getExchangeRate(baseCurrency)

    const exchangeRate = {rates: {}}

    const reportData = getReportData(data, exchangeRate.rates);
    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    console.log('error', error);
    next(new Error('Something went wrong'));
  }
};

module.exports = {
  getDisbursementReport
};
