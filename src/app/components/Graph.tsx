import React, { useState, useEffect } from 'react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axios from 'axios';

type PopulationData = {
  year: number;
  [key: string]: number;
};

type ApiResponse = {
  result: {
    data: {
      label: string;
      data: {
        year: number;
        value: number;
      }[];
    }[];
  };
};

type GraphProps = {
  value: string;
  selectedPrefectures: number[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const formatYAxis = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万`;
  }
  return value.toLocaleString();
};

const Graph: React.FC<GraphProps> = ({ value, selectedPrefectures }) => {
  const [data, setData] = useState<PopulationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [populationType, setPopulationType] = useState<string>('総人口');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = selectedPrefectures.map((prefCode) =>
          axios.get<ApiResponse>(`/api/population?prefCode=${prefCode}`)
        );
        const responses = await Promise.all(promises);
        const populationData: { [year: number]: PopulationData } = {};

        responses.forEach((response, index) => {
          const resultData = (response.data as ApiResponse).result.data;
          if (!resultData) {
            throw new Error(
              'Unexpected response structure: ' + JSON.stringify(response.data)
            );
          }
          const typeData = resultData.find(
            (data: {
              label: string;
              data: { year: number; value: number }[];
            }) => data.label === populationType
          );
          typeData?.data.forEach((item: { year: number; value: number }) => {
            if (item.year <= 2045) {
              if (!populationData[item.year]) {
                populationData[item.year] = { year: item.year };
              }
              populationData[item.year][`pref${selectedPrefectures[index]}`] =
                item.value;
            }
          });
        });
        setData(
          Object.values(populationData).sort((a, b) => a.year - b.year)
        );
      } catch (error) {
        console.error('Error fetching population data:', error);
        setError('Error fetching population data');
      }
    };

    if (selectedPrefectures.length > 0) {
      fetchData();
    } else {
      setData([]);
    }
  }, [selectedPrefectures, populationType]);

  return (
    <div>
      <h1>{value}</h1>
      <div>
        <label htmlFor='populationType'>人口タイプ:</label>
        <select
          id='populationType'
          value={populationType}
          onChange={(e) => setPopulationType(e.target.value)}
        >
          <option value='総人口'>総人口</option>
          <option value='年少人口'>年少人口</option>
          <option value='生産年齢人口'>生産年齢人口</option>
          <option value='老年人口'>老年人口</option>
        </select>
      </div>
      {error ? <p>{error}</p> : null}
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
        >
          <XAxis dataKey='year' />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip formatter={(v: number) => v?.toLocaleString() ?? v} />
          <Legend />
          {selectedPrefectures.map((prefCode, index) => (
            <Line
              key={prefCode}
              type='monotone'
              dataKey={`pref${prefCode}`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={`都道府県コード ${prefCode}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
