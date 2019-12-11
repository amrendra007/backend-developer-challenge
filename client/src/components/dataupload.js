import React from 'react';
import Loading from'./loading';

const DataUploadComponent = props => (
  <div className="main">
    <h2>Disbursement report generator</h2>
    <div className="field1">
      <label htmlFor="select">select base currency :</label>
      <select id="basecurrency" name="basecurrency" defaultValue="USD" onChange={props.handleSelectChange}>
        {props.currencyOption.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="field1">
      <label htmlFor="file">Choose file to upload</label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".csv"
        onChange={e => props.handleFileChange(e.target.files[0])}
      />
    </div>
    <div className="field1">
      <button onClick={props.handleSubmit}>Submit</button>
    </div>
    {props.errorMessage ? <p style={{ color: 'red' }}>{props.errorMessage}</p> : ''}
    {props.loading ? <Loading/>: ''}
  </div>
);

export default DataUploadComponent;
