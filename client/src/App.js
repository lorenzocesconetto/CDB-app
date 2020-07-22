import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";

function App() {
  const [data, setData] = useState([]);
  const [investmentDate, setInvestmentDate] = useState(new Date("2016-11-14"));
  const [cdbRate, setCdbRate] = useState(103.5);
  const [currentDate, setCurrentDate] = useState(new Date("2016-12-26"));

  const plotData = data.map(element => ({
    x: new Date(element.date),
    y: element.unitPrice.toFixed(8),
  }));

  const chartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "DD/MM/YYYY",
            displayFormats: {
              day: "DD MMM YY",
            },
          },
        },
      ],
    },
    title: {
      display: true,
      text: "CDB bond pricing",
      fontSize: 20,
      fontColor: "#aaa",
    },
  };

  const chartDataset = {
    datasets: [
      {
        label: "Price",
        backgroundColor: "rgba(75,192,192,.8)",
        borderColor: "rgba(200,200,200,1)",
        borderWidth: 2,
        data: plotData,
      },
    ],
  };

  useEffect(() => {
    const data = {
      investmentDate: investmentDate.toISOString().substring(0, 10),
      cdbRate,
      currentDate: currentDate.toISOString().substring(0, 10),
    };

    fetch("/api", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then(data => data.json())
      .then(json => {
        json.unitPrice = parseFloat(json.unitPrice);
        setData(json);
      })
      .catch(err => {
        setData([]);
        alert("Bad parameters");
      });
  }, [investmentDate, cdbRate, currentDate]);

  function handleDateChange(date, setCallback) {
    setCallback(date);
  }

  function handleTextChange(e) {
    setCdbRate(e.target.value);
  }

  const currentValue =
    data.length > 1 ? data[data.length - 1].unitPrice.toFixed(8) : "Loading...";

  return (
    <div className="App">
      <header className="App-header">
        <div className="form">
          <div className="input-widget">
            <span className="form-label">Investment Date</span>
            <DatePicker
              selected={investmentDate}
              onChange={date => handleDateChange(date, setInvestmentDate)}
            />
          </div>

          <div className="input-widget">
            <span className="form-label">Current Date</span>
            <DatePicker
              selected={currentDate}
              onChange={date => handleDateChange(date, setCurrentDate)}
            />
          </div>
          <div className="input-widget">
            <span className="form-label">CDB rate (%)</span>
            <input type="number" value={cdbRate} onChange={handleTextChange} />
          </div>
        </div>
        <p>The current value is: R$ {currentValue}</p>

        <div className="chart-pane">
          <Line data={chartDataset} options={chartOptions} />
        </div>
      </header>
    </div>
  );
}

export default App;
