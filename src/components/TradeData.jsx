import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TradeData = ({ trades }) => {
  const [tradesWithId, setTradesWithId] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState('');

  useEffect(() => {
    const updatedTrades = trades.map((trade, index) => ({ ...trade, id: index + 1 }));
    setTradesWithId(updatedTrades);
  }, [trades]);

  const handleTradeCodeChange = (event) => {
    setSelectedTradeCode(event.target.value);
  };

  const filteredTrades = selectedTradeCode
    ? tradesWithId.filter((trade) => trade.trade_code === selectedTradeCode)
    : tradesWithId;

  const sortedTrades = [...filteredTrades].sort((a, b) => new Date(a.date) - new Date(b.date));

  const dates = sortedTrades.map((trade) => trade.date);
  const closePrices = sortedTrades.map((trade) => trade.close);
  const volumes = sortedTrades.map((trade) => trade.volume);

  const chartData = {
    labels: dates,
    datasets: [
      {
        type: 'line',
        label: 'Close Price',
        data: closePrices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y-axis-1',
      },
      {
        type: 'bar',
        label: 'Volume',
        data: volumes,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        yAxisID: 'y-axis-2',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      'y-axis-1': {
        type: 'linear',
        position: 'left',
      },
      'y-axis-2': {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const cellStyle = { border: '1px solid black', padding: '8px' };

  const handleEdit = (id) => {
    console.log(`Edit trade with ID: ${id}`);
    // Add your edit logic here
  };

  return (
    <header className="App-header">
      <h1>Trade Data</h1>
      <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: 20 }}>
        <InputLabel id="trade-code-select-label">Trade Code</InputLabel>
        <Select
          labelId="trade-code-select-label"
          value={selectedTradeCode}
          onChange={handleTradeCodeChange}
          label="Trade Code"
        >
          {Array.from(new Set(tradesWithId.map((trade) => trade.trade_code))).map((tradeCode) => (
            <MenuItem key={tradeCode} value={tradeCode}>
              {tradeCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Line data={chartData} options={options} />
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th style={cellStyle}>Date</th>
            <th style={cellStyle}>Trade Code</th>
            <th style={cellStyle}>High</th>
            <th style={cellStyle}>Low</th>
            <th style={cellStyle}>Open</th>
            <th style={cellStyle}>Close</th>
            <th style={cellStyle}>Volume</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrades.map((trade) => (
            <tr key={trade.id}>
              <td style={cellStyle}>{trade.date}</td>
              <td style={cellStyle}>{trade.trade_code}</td>
              <td style={cellStyle}>{trade.high}</td>
              <td style={cellStyle}>{trade.low}</td>
              <td style={cellStyle}>{trade.open}</td>
              <td style={cellStyle}>{trade.close}</td>
              <td style={cellStyle}>{trade.volume}</td>
              <td style={cellStyle}>
                <button onClick={() => handleEdit(trade.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </header>
  );
};

export default TradeData;
