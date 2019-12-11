import React, { Component } from 'react';
import XLSX from 'xlsx';
import moment from 'moment';
import { saveAs } from 'file-saver';

import DataUploadComponent from './dataupload';
import { getDisbursementReport } from '../api';
import { headerKeys, currencyOption } from '../helper/util';

class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      valid: false,
      errorMessage: '',
      baseCurrency: 'USD'
    };
  }

  handleSelectChange = () => {
    const value = document.getElementById('basecurrency').value;
    this.setState({ baseCurrency: value });
  };

  validateHeaders = () => {
    this.state.data.forEach(dataValue => {
      Object.keys(dataValue).forEach(key => {
        if (!headerKeys.includes(key)) {
          return false;
        }
      });
    });
    return true;
  };

  validateValue = () => {
    for (let dataValue of this.state.data) {
      const date = dataValue.Date;
      const currencyValue = dataValue['Donation Currency'];
      const donationAmount = dataValue['Donation Amount'];
      const fee = dataValue['Fee'];

      if (!/\d{2}\/\d{2}\/\d{4}/.test(date)) {
        this.setState({ errorMessage: 'Date format not correct' });
        return false;
      }

      if (!currencyOption.includes(currencyValue)) {
        this.setState({ errorMessage: `currency ${currencyValue} is not valid` });
        return false;
      }

      if (typeof donationAmount !== 'number' || typeof fee !== 'number') {
        this.setState({ errorMessage: `donationAmount ${donationAmount} or fee ${fee} not valid ` });
        return false;
      }
    }
    this.setState({ errorMessage: '' });
    return true;
  };

  validateDataHeadersValue = () => {
    if (!this.state.data.length) {
      this.setState({ errorMessage: 'No data ' });
      return false;
    }
    if (!this.validateHeaders()) {
      this.setState({ errorMessage: 'Invalid Template' });
      return false;
    }

    if (!this.validateValue()) {
      return false;
    }
    this.setState({ errorMessage: '' });
    return true;
  };

  handleFileChange = async fileToRead => {
    try {
      if (!fileToRead) {
        this.setState({ errorMessage: 'not file selected' });
        return;
      }
      const reader = new FileReader();
      reader.readAsText(fileToRead);

      reader.onload = async e => {
        const result = e.target.result;

        const wb = XLSX.read(result, { type: 'binary', dateNF: 'dd/mm/yyyy', cellDates: true });

        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws);

        /* trim string values */
        data.forEach(row =>
          Object.keys(row).forEach(key => {
            if (typeof row[key] === 'string') {
              row[key] = row[key].trim();
            }
            if (key === 'Date') {
              row[key] = moment(row[key]).format('DD/MM/YYYY');
            }
          })
        );

        this.setState({ data }, () => {
          this.validateDataHeadersValue();
        });
      };
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  csvSheetConstructor = data => {
    try {
      /* make the worksheet */
      let ws = XLSX.utils.json_to_sheet(data);

      /* write workbook (use type 'binary') */
      let csv = XLSX.utils.sheet_to_csv(ws);

      /* generate a download */
      function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      saveAs(new Blob([s2ab(csv)], { type: 'application/octet-stream' }), 'disbursement_report.csv');
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  handleSubmit = async () => {
    try {
      if (!this.validateDataHeadersValue()) {
        return false;
      }

      const response = await getDisbursementReport({
        data: this.state.data,
        baseCurrency: this.state.baseCurrency
      });

      if (!response.success) {
        this.setState({ errorMessage: response.message });
        return;
      }

      const data = response.data;
      this.csvSheetConstructor(data);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  render() {
    return (
      <DataUploadComponent
        handleFileChange={this.handleFileChange}
        handleSelectChange={this.handleSelectChange}
        handleSubmit={this.handleSubmit}
        valid={this.state.valid}
        errorMessage={this.state.errorMessage}
        baseCurrency={this.state.baseCurrency}
        currencyOption={currencyOption}
      />
    );
  }
}

export default DataUpload;
