import React, { useEffect, useState } from "react";
import { pathOr } from "ramda";
import Field from "./Field";

import './App.scss';

const CELL_SIZE = 18;

const App = ({ dimension }) => {
  const fieldViewSize = dimension * CELL_SIZE;

  const [fieldCellStates, setFieldCellStates] = useState(
    generateFieldCellStates(dimension)
  );
  useEffect(() => {
    const rerenderFieldInterval = setInterval(
      () => setFieldCellStates(rerenderField(fieldCellStates)),
      200
    );
    return () => clearInterval(rerenderFieldInterval);
  });
  return (
    <div className="App">
      <h1 className="Header">Game of Life</h1>
      <Field cellStates={fieldCellStates} fieldViewSize={fieldViewSize} />
    </div>
    )
  };

const generateRow = size =>
  new Array(size).fill(0).map(() => Math.round(Math.random()));

const generateFieldCellStates = size =>
  new Array(size).fill(0).map(() => generateRow(size));

const returnCellState = (i, j, data) => pathOr(0, [i, j], data);

const calculateCellNeighborsValue = (i, j, data) =>
  returnCellState(i - 1, j - 1, data) +
  returnCellState(i - 1, j, data) +
  returnCellState(i - 1, j + 1, data) +
  returnCellState(i, j - 1, data) +
  returnCellState(i, j + 1, data) +
  returnCellState(i + 1, j - 1, data) +
  returnCellState(i + 1, j, data) +
  returnCellState(i + 1, j + 1, data);

const getNewCellState = (i, j, data) => {
  const neighborsValue = calculateCellNeighborsValue(i, j, data);
  if ((data[i][j] && neighborsValue === 2) || neighborsValue === 3) {
    return 1;
  } else if (neighborsValue <= 2 || neighborsValue > 3) {
    return 0;
  }
};

const rerenderField = data => {
  const copiedData = data.map(row => row.map(cell => cell));
  return copiedData.map((row, i) =>
    row.map((_, j) => getNewCellState(i, j, data))
  );
};

export default App;
