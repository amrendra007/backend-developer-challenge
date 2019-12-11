const baseURL = 'http://localhost:8000/';
const reportUrl = `${baseURL}api/report`;

export const getDisbursementReport = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const responseJson = await response.json();

      resolve(responseJson);
    } catch (error) {
      reject(error);
    }
  });
};
