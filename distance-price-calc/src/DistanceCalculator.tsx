// src/DistanceCalculator.tsx
import React, { useState } from 'react';
import citiesData from './russian-cities.json';
import Select, { MenuListProps } from 'react-select';
import { FixedSizeList as List } from 'react-window';

interface CityOption {
  value: {
    name: string;
    coords: {
      lat: string;
      lon: string;
    };
  };
  label: string;
}

interface DistanceData {
  multiplier: number;
  result: number;
}

const DistanceCalculator: React.FC = () => {
  const [origin, setOrigin] = useState<CityOption | null>(null);
  const [destination, setDestination] = useState<CityOption | null>(null);
  const [distanceData, setDistanceData] = useState<DistanceData[]>([]);
  const [loading, setLoading] = useState(false);

  const cityOptions: CityOption[] = citiesData.map(city => ({
    value: {
      name: city.name,
      coords: city.coords,
    },
    label: city.name,
  }));

  async function handleSubmit() {
    if (!origin || !destination) {
      alert('Пожалуйста, выберите города');
      return;
    }
    
    setLoading(true);  // установите загрузку в true при отправке запроса
    
    try {
      // ... остальной код
    } catch (error) {
      console.error(error);
    } finally {
      
    }

    try {
      const originsCoords = `${origin.value.coords.lat},${origin.value.coords.lon}`;
      const destinationsCoords = `${destination.value.coords.lat},${destination.value.coords.lon}`;
      const url = `https://codercastrov.online:3000/distance?origins=${originsCoords}&destinations=${destinationsCoords}&key=WUyWbmgUWU8Jg6E71aMRqZV2ZBiJAiYTUroajg7bFleHUIAdVNdIgd1nP9goces8`;
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
    setLoading(false);
  }

  const MenuList = (props: MenuListProps<CityOption>) => {
    const { options, children, maxHeight } = props;
    const height = Math.min(maxHeight, options.length * 35);

    const rows = React.Children.toArray(children);

    return (
        <List
            height={height}
            itemCount={rows.length}
            itemSize={35}
            width="100%"
        >
            {({ index, style }) => <div style={style}>{rows[index]}</div>}
        </List>
    );
};

  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white rounded shadow-lg w-1/2">
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
          <Select
              value={origin}
              onChange={(option) => setOrigin(option as CityOption)}
              options={cityOptions}
              placeholder="Город отправления"
              className="w-full cursor-pointer"
              styles={{ control: base => ({ ...base, cursor: "pointer" }) }}
              components={{ MenuList }}  // <--- Вот здесь
          />
          </div>
          <div className="w-1/2">
          <Select
              value={destination}
              onChange={(option) => setDestination(option as CityOption)}
              options={cityOptions}
              placeholder="Город назначения"
              className="w-full cursor-pointer"
              styles={{ control: base => ({ ...base, cursor: "pointer" }) }}
              components={{ MenuList }}  // <--- И здесь
          />
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Расчитать
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        ) : distanceData.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {distanceData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="font-bold mb-2">х {data.multiplier}</div>
                <div>{data.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistanceCalculator;
