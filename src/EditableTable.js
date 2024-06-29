// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import './EditableTable.css';

const initialDefaultStrings = ["Basket Weaver","Teacher","Cobbler","Mayor","Born 1910's", "Born 1920's", "Born 1930's", "Born 1940's", "Born 1950's", "Born 1960's","Born 1907's","Born 1980's",
                                "Died 1960's","Died 1970's","Died 1980's","Died 1990's","Died 2000's","Died 2010's","Died 2020's",">100 year lifespan",
];

const getRandomString = (strings) => strings[Math.floor(Math.random() * strings.length)];

const generateInitialData = (defaultStrings) => {
  return Array.from({ length: 5 }, () => 
    Array.from({ length: 5 }, () => getRandomString(defaultStrings))
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
      <button onClick={() => setDefaultStrings([...initialDefaultStrings])} className="regenerate-button">Regenerate</button>
      <h2>Options</h2>
      <ul className="editable-list">
        {defaultStrings.map((item, index) => (
          <li key={index} className="editable-list-item">
            <input 
              type="text" 
              value={item} 
              onChange={(e) => handleListChange(index, e.target.value)} 
            />
            <button onClick={() => handleRemoveValue(index)} className="remove-button">Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddValue} className="add-value-button">Add Value</button>
    </div>
  );
};

export default EditableTable;
