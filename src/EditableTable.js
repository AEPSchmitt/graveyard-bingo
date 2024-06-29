// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import './EditableTable.css';

const initialDefaultStrings = ["Basket Weaver","Teacher","Cobbler","Mayor","Doctor","Lawyer","Engineer","Writer","Police Officer","Pastor","Architect","Actor/Actress", "Entrepreneur","Born in '98","Died in '98","Born 1910's", "Born 1920's", "Born 1930's", "Born 1940's", "Born 1950's", "Born 1960's","Born 1970's","Born 1980's",
                                "Died 1960's","Died 1970's","Died 1980's","Died 1990's","Died 2000's","Died 2010's","Died 2020's",">100 years",
];

const getRandomString = (strings) => strings[Math.floor(Math.random() * strings.length)];

const generateInitialData = (defaultStrings) => {
    let options = [...defaultStrings];
  return Array.from({ length: 5 }, () => 
    Array.from({ length: 5 }, () => {
        let draw_index = Math.floor(Math.random() * options.length)
        let draw = options[draw_index];
        options.splice(draw_index, 1)
        return draw
    })
  );
};

const EditableTable = () => {
  const [defaultStrings, setDefaultStrings] = useState(initialDefaultStrings);
  const [tableData, setTableData] = useState(generateInitialData(defaultStrings));
  const [clickedCells, setClickedCells] = useState([]);

  // Regenerate table data when defaultStrings change
  useEffect(() => {
    setTableData(generateInitialData(defaultStrings));
    // Reset clicked cells when table data changes
    setClickedCells([]);
  }, [defaultStrings]);

  // Handle cell click to toggle red circle
  const handleCellClick = (row, col) => {
    // Toggle clicked cell
    if (clickedCells.some(cell => cell.row === row && cell.col === col)) {
      // If cell is already clicked, remove it from clickedCells
      setClickedCells(clickedCells.filter(cell => !(cell.row === row && cell.col === col)));
    } else {
      // If cell is not clicked, add it to clickedCells
      setClickedCells([...clickedCells, { row, col }]);
    }
  };

  // Handle change in editable list
  const handleListChange = (index, value) => {
    const newStrings = [...defaultStrings];
    newStrings[index] = value;
    setDefaultStrings(newStrings);
  };

  // Handle removing an item from the list
  const handleRemoveValue = (index) => {
    const newStrings = defaultStrings.filter((_, i) => i !== index);
    setDefaultStrings(newStrings);
  };

  // Handle adding a new value to the list
  const handleAddValue = () => {
    setDefaultStrings([...defaultStrings, ""]);
  };

  return (
    <div>
      <table className="editable-table">
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} onClick={() => handleCellClick(rowIndex, colIndex)} className={`table-cell ${rowIndex === 2 && colIndex === 2 ? 'middle-cell' : ''}`}>
                  {cell}
                  {clickedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) && (
                    <div className="red-circle"></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="rightext">art by <a href="https://da.wikipedia.org/wiki/Kurt_Vonnegut" className="kurtlink"><b>Kurt Vonnegut</b></a></p>
      <button onClick={() => setDefaultStrings([...defaultStrings])} className="regenerate-button">Regenerate</button>
      <h2>Options</h2>
      <ul className="editable-list">
        {defaultStrings.map((item, index) => (
          <li key={index} className="editable-list-item">
            <input 
              type="text" 
              value={item} 
            />
            <button onClick={() => handleRemoveValue(index)} className="remove-button">🗑️</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddValue} className="add-value-button">Add More</button>
      <a href="https://www.patreon.com/regulationpod/" className="regulation">
      <img src="butthole.webp" alt="Kurts Butthole" className="butthole" />
      <p className="centertext">for<br/><b>The Regulation Podcast</b></p></a>
      <p className="rightext">website by <a href="https://ko-fi.com/aepschmitt" className="aepslink"><b>AEPSchmitt</b></a></p>
    </div>
  );
};

export default EditableTable;
