// src/EditableTable.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import './EditableTable.css';

library.add(fas)

const initialDefaultStrings = ["Basket Weaver","Teacher","Cobbler","Carpenter","Nurse","Mayor","Doctor","Lawyer","Engineer","Smith","Writer","Police Officer","Pastor","Architect","Actor/Actress", "Entrepreneur","Born in '98","Died in '98","Born 1910's", "Born 1920's", "Born 1930's", "Born 1940's", "Born 1950's", "Born 1960's","Born 1970's","Born 1980's",
                                "✝ 1960's","✝ 1970's","✝ 1980's","✝ 1990's","✝ 2000's","✝ 2010's","✝ 2020's",">100 years", "Cross-shaped Headstone", "Stone dove", "Heart-shaped headstone"
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

function toggleDarkmode(){
  document.body.classList.toggle('dark');
  document.getElementById('darkmode-guide').style.display = 'none';
}

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const listParam = urlParams.get('list');
    if (listParam) {
      try {
        const importedList = JSON.parse(listParam);
        setDefaultStrings(importedList);
      } catch (error) {
        console.error('Invalid JSON in URL');
      }
    }
  }, []);

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

  const handleExportList = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(defaultStrings));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "graveyard.json");
    document.body.appendChild(downloadAnchorNode); // required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportList = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const importedList = JSON.parse(content);
          setDefaultStrings(importedList);
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const generateShareableURL = () => {
    const url = new URL(window.location);
    url.searchParams.set('list', JSON.stringify(defaultStrings));
    return url.toString();
  };

  const handleShareList = () => {
    const shareableURL = generateShareableURL();
    navigator.clipboard.writeText(shareableURL).then(() => {
      alert('Shareable URL copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div>
      <table className="editable-table">
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} onClick={() => handleCellClick(rowIndex, colIndex)} className={`table-cell ${rowIndex === 2 && colIndex === 2 ? 'middle-cell' : ''}`}>
                  <p>{cell}</p>
                  {clickedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) && (
                    <div className="dotted"></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="rightext">art by <a href="https://en.wikipedia.org/wiki/Kurt_Vonnegut" className="kurtlink"><b>Kurt Vonnegut</b></a></p>
      <button onClick={() => setDefaultStrings([...defaultStrings])} className="regenerate-button"><FontAwesomeIcon icon="fa-solid fa-rotate-right" /></button>
      <p><i>Please Play Respectfully</i></p>
      <h2>Options</h2>
      <ul className="editable-list">
        {defaultStrings.map((item, index) => (
          <li key={index} className="editable-list-item">
            <input 
              type="text" 
              value={item}
              onChange={(e) => handleListChange(index, e.target.value)}
            />
            <button onClick={() => handleRemoveValue(index)} className="remove-button"><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddValue} className="add-value-button"><FontAwesomeIcon icon="fa-solid fa-plus" /> Add</button>
      <div className="share">
        <button onClick={handleShareList} className="share-button"><FontAwesomeIcon icon="fa-solid fa-share-nodes" /> Share</button>
    </div>
    <div className="share">
        <button onClick={handleExportList} className="export-button">Export ↧</button>
        <label htmlFor="import" className="btn">↥ Import</label>
        <input id="import" type="file" onChange={handleImportList} className="import-input"/>
      </div>
      <p>So it goes.</p>

      
      <img onClick={toggleDarkmode} src="butthole.webp" alt="Kurts Butthole" className="butthole" />
      <p id="darkmode-guide" className="centertext flashing"><i>( click butthole for darkmode )</i></p>
      <p>made for</p>
      <a href="https://www.patreon.com/regulationpod/" className="regulation">
      <p className="centertext"><b>The Regulation Podcast</b></p></a>
      <p className="rightext">website by <a href="https://ko-fi.com/aepschmitt" className="aepslink"><b>AEPSchmitt</b></a></p>
    </div>
  );
};

export default EditableTable;
