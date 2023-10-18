// src/DistanceCalculator.tsx
import React, { useState } from 'react';
import Select from 'react-select';
import { useTable } from 'react-table';

interface CityOption {
  value: string;
  label: string;
}

interface DistanceData {
  multiplier: number;
  result: number;
}

interface Column {
    Header: string;
    accessor: keyof DistanceData;
}

const DistanceCalculator: React.FC = () => {
  const [origin, setOrigin] = useState<CityOption | null>(null);
  const [destination, setDestination] = useState<CityOption | null>(null);
  const [distanceData, setDistanceData] = useState<DistanceData[]>([]);

  const cityOptions: CityOption[] = [
    { value: 'Krasnodar,Russia', label: 'Краснодар' },
    { value: 'Sochi,Russia', label: 'Сочи' },
    // ...other cities
  ];

  async function handleSubmit() {
    if (!origin || !destination) {
      alert('Пожалуйста, выберите города');
      return;
    }

    try {
      const url = `https://codercastrov.online:3000/distance?origins=${origin.value}&destinations=${destination.value}&key=WUyWbmgUWU8Jg6E71aMRqZV2ZBiJAiYTUroajg7bFleHUIAdVNdIgd1nP9goces8`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const distance = parseFloat(data.rows[0].elements[0].distance.text.split(' ')[0]);
      setDistanceData([
        { multiplier: 1, result: distance },
        { multiplier: 2, result: distance * 2 },
        { multiplier: 3, result: distance * 3 }
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  const columns: Column[] = React.useMemo(
    () => [
      {
        Header: 'Множитель',
        accessor: 'multiplier',
      },
      {
        Header: 'Результат',
        accessor: 'result',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: distanceData });

  return (
    <div>
      <Select
        value={origin}
        onChange={(option) => setOrigin(option as CityOption)}
        options={cityOptions}
        placeholder="Выберите город отправления"
      />
      <Select
        value={destination}
        onChange={(option) => setDestination(option as CityOption)}
        options={cityOptions}
        placeholder="Выберите город назначения"
      />
      <button onClick={handleSubmit}>Расчитать</button>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DistanceCalculator;
