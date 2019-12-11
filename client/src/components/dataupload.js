import React from 'react';

const DataUploadComponent = props => (
  <div>
    <div>
      <label htmlFor="select">select base currency :</label>
      <select id="basecurrency" name="basecurrency" defaultValue="USD" onChange={props.handleSelectChange}>
        {props.currencyOption.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="file">Choose file to upload</label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".csv"
        onChange={e => props.handleFileChange(e.target.files[0])}
      />
      {props.errorMessage ? <p style={{ color: 'red' }}>{props.errorMessage}</p> : ''}
    </div>
    <div>
      <button onClick={props.handleSubmit}>Submit</button>
    </div>
  </div>
);

export default DataUploadComponent;
