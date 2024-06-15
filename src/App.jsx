import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import TradeData from "./components/TradeData";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";



function App() {
  const cellStyle = {
    border: "1px solid black",
    paddingRight: "15px",
    paddingLeft: "15px",
    fontSize: "15px",
    textAlign: "center",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (e, id) => {
    console.log(`Edit trade with ID: ${id}`);
    // Add your edit logic here
  };

  function getCSRFCookie() {
    const cookies = document.cookie.split(';');
    console.log('cookies', document.cookie);
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        return decodeURIComponent(value);
      }
    }
    return null;  // Handle case where csrf token is not found
  }

  let csrfToken = getCSRFCookie()
  console.log('csrfToken', csrfToken);
  

  const deleteTrade = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete_trade/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const fetchTrades = async (page, limit) => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/trades/", {
        params: { page, limit },
      });
      console.log("params", response);
      setTrades(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("trades", trades);

  useEffect(() => {
    fetchTrades(currentPage, limit);
  }, [currentPage, limit]);

  console.log("currentPage", currentPage);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/trades/")
  //     .then((response) => {
  //       console.log("response", response.data);
  //       setTrades(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the trades!", error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  const [selectedTradeCode, setSelectedTradeCode] = useState("");

  // useEffect(() => {
  //   const updatedTrades = trades.map((trade, index) => ({
  //     ...trade,
  //     id: index + 1,
  //   }));
  //   setTradesWithId(updatedTrades);
  // }, [trades]);

  const handleTradeCodeChange = (event) => {
    setSelectedTradeCode(event.target.value);
  };

  // const filteredTrades = selectedTradeCode
  //   ? tradesWithId.filter((trade) => trade.trade_code === selectedTradeCode)
  //   : tradesWithId;

  // const sortedTrades = [...filteredTrades].sort(
  //   (a, b) => new Date(a.date) - new Date(b.date)
  // );

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
    <>
      <div className="App">
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

        {loading ? (
          <div>
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <div>
            {/* <h1 className="mb-4">Trading Data</h1> */}

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={cellStyle}>Id</th>
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
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td style={cellStyle}>{trade.id}</td>
                    <td style={cellStyle}>{trade.date}</td>
                    <td style={cellStyle}>{trade.trade_code}</td>
                    <td style={cellStyle}>{trade.high}</td>
                    <td style={cellStyle}>{trade.low}</td>
                    <td style={cellStyle}>{trade.open}</td>
                    <td style={cellStyle}>{trade.close}</td>
                    <td style={cellStyle}>{trade.volume}</td>
                    <td style={cellStyle}>
                      <button
                        className="mr-1"
                        onClick={() => {
                          handleEdit(trade.id);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => deleteTrade(trade.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "20px",
                fontSize: "20px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              {/* Pagination buttons */}
              <button
                style={{ marginRight: "5px" }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {/* {Array.from({ length: currentPage }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              ))} */}
              <button
                type="button"
                onClick={() => {
                  handlePageChange(currentPage + 1);
                  console.log("next page");
                }}
                // disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
