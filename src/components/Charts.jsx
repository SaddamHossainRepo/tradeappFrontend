import React from "react";

export default function Charts() {
  const dates = trades.map((trade) => trade.date);
  const closePrices = trades.map((trade) => trade.close);
  const volumes = trades.map((trade) => trade.volume);

  const chartData = {
    labels: dates,
    datasets: [
      {
        type: "line",
        label: "Close Price",
        // fontSize: '100px',
        data: closePrices,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Volume",
        data: volumes,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        yAxisID: "y-axis-2",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      "y-axis-1": {
        type: "linear",
        position: "left",
      },
      "y-axis-2": {
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  return (
    <div style={{ marginBottom: "30px" }}>
      <FormControl
        variant="outlined"
        style={{ minWidth: 200, marginBottom: 20 }}
      >
        <InputLabel className="tdx" id="trade-code-select-label">
          Trade Code
        </InputLabel>
        <Select
          labelId="trade-code-select-label"
          value={selectedTradeCode}
          onChange={handleTradeCodeChange}
          label="Trade Code"
        >
          {Array.from(new Set(trades.map((trade) => trade.trade_code))).map(
            (tradeCode) => (
              <MenuItem key={tradeCode} value={tradeCode}>
                {tradeCode}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <Line style={{ color: "white" }} data={chartData} options={options} />
    </div>
  );
}
