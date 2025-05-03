import React, { useState, useEffect, useCallback } from "react";
import { fetchConsumerHistory } from "../componentsHtmlFIles/flight_admin_Get";
import { Bar, Line, Pie, Scatter, Doughnut, Radar,Bubble , PolarArea } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import PlaneLoading from "../componentsHtmlFIles/PlaneLoading";   // for ANimation
import { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } from "../store";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Select, MenuItem, Drawer, Button, IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentCssFiles/AAflight_consuer.scss";
import axios from "axios";
import Popup from "../componentsHtmlFIles/Popup";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);


const AnalyticsConsumer = ({ email }) => {
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);

    const confirmPayment = async (_id) => {
      
        try {
          const response = await fetch(`http://localhost:5000/flight/u?_id=${_id}`, {
            method: "GET",
          });
      
          const result = await response.json();
          return result.success;
        } catch (error) {
          console.error("Payment confirmation error:", error);
          return false;
        }
      };
      
    const generateRandomColors = (num) => {
        const colors = [];
        for (let i = 0; i < num; i++) {
            const hue = Math.floor(Math.random() * 360); // Full spectrum of colors
            const saturation = 70 + Math.random() * 30; // Keep colors vibrant (70% - 100%)
            const lightness = 50 + Math.random() * 20; // Avoid too dark or too light shades (50% - 70%)
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        return colors;
    };

    const [data, setData] = useState([]);

const [refreshTrigger, setRefreshTrigger] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const user = useSelector((state) => state.user);
const { isActive, isCustomer, isProvider } = useSelector((state) => state.user);
const [filteredData, setFilteredData] = useState([]);
const [filters, setFilters] = useState({});
const [uniqueOptions, setUniqueOptions] = useState({});
const [drawerOpen, setDrawerOpen] = useState(false);
const [totalExpenditure, setTotalExpenditure] = useState(0);
const [visibleFields, setVisibleFields] = useState([
     "email","flightNo", "airline", "departure", "departure_time", "departure_date",
    "destination", "arrival_date", "boarding_time", "selectedClass", 
    "seatPreference", "seatCount", "mealPreference", "totalAmount", 
    "paymentConfirmed", // ✅ add this
]);

const headerMap = {
    boarding_time: "Arrival Time"
};


// Assuming filteredData contains the latest data
const airlines = [...new Set(filteredData.map(item => item.airline))];
const airlineExpenditure = airlines.map(airline =>
    filteredData.filter(item => item.airline === airline)
        .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0)
);

const seatClasses = ["business", "economy", "firstClass", "premium"];
const seatClassCounts = seatClasses.map(cls =>
    filteredData.reduce((count, item) => {
        return item.selectedClass === cls ? count + item.seatCount : count;
    }, 0)
);

const checkInStatuses = ["middle","window","aisle"];
const checkInCounts = checkInStatuses.map(status =>
    filteredData.filter(item => item.seatPreference=== status).length
);

const dateExpenditure = filteredData.reduce((acc, item) => {
    const date = new Date(item.departure_date);
    if (isNaN(date.getTime())) {
        console.error("Invalid departureDate:", item.departure_date);
        return acc;
    }
    const formattedDate = date.toISOString().split('T')[0]; // Format date (yyyy-mm-dd)
    acc[formattedDate] = (acc[formattedDate] || 0) + parseFloat(item.totalAmount || 0);
    return acc;
}, {});

const flightDurationAmount = filteredData.map(item => ({
    x: new Date(item.arrival_date).getTime() - new Date(item.departure_date).getTime(),
    y: parseFloat(item.totalAmount || 0)
}));

useEffect(() => {
    if (isLoading) return; // Avoid running if already loading
    setIsLoading(true);

    fetchConsumerHistory().then((res) => {
        const flights = res.bookings || [];
        if (flights.length === 0) {
            setData([]);
            setFilteredData([]);
            setUniqueOptions({});
            setIsLoading(false);
            return;
        }

        const requiredFields = [
            '_id',
            'flightNo', 'airline', 'departure', 'departure_time', 'departure_date',
            'destination', 'arrival_date', 'boarding_time', 'selectedClass', 
            'seatPreference', 'seatCount', 'mealPreference', 'totalAmount',
            'paymentConfirmed', 'email' // ✅ Include email here
        ];

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize

        const upcomingFlights = flights
            .filter(flight => new Date(flight.departure_date) > today)
            .map(flight => {
                const filteredFlight = {};
                requiredFields.forEach(field => {
                    if (flight[field] !== undefined) {
                        filteredFlight[field] = flight[field];
                    }
                });
                return filteredFlight;
            });

        setData(upcomingFlights);
        setFilteredData(upcomingFlights);

        // ✅ Extract unique filter options
        const options = {};
        upcomingFlights.forEach(item => {
            Object.entries(item).forEach(([key, val]) => {
                if (!options[key]) options[key] = new Set();
                options[key].add(val);
            });
        });

        const unique = {};
        Object.entries(options).forEach(([key, valSet]) => {
            unique[key] = Array.from(valSet).sort();
        });

        setUniqueOptions(unique);

        setIsLoading(false);
    }).catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
    });
}, [user.email]);

// State and imports...

const filterData = useCallback(() => {
    let updatedData = [...data];
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "All") {
            updatedData = updatedData.filter(item => item[key] === value);
        }
    });
    setFilteredData(updatedData);

    const total = updatedData.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);
    setTotalExpenditure(total);

    setDrawerOpen(false);
}, [filters, data]);

useEffect(() => {
    filterData(); // ✅ Now this is defined earlier
}, [filters, data]);

useEffect(() => {
    // your fetchConsumerHistory logic...
}, [user.email]);

useEffect(() => {
    filterData(); // Apply filters when either filters or data change
}, [filters, data]);


    
    
    
    const handleRefund = (row) => {
        alert(`Processing refund for flight: ${row.flightName}`);
    };
    
    const handlePayment = (row) => {
        console.log("Processing payment for:", row);
        alert(`Redirecting to payment for flight: ${row.flightName}`);
    };
    
return (
    <>
       {isLoading && <PlaneLoading isLoading={isLoading} />} {/* For Animation */}

<div className="analytics-container">
    <h1>Customers history</h1>
    <div className="filter-button-container" onClick={() => setDrawerOpen(true)}>
        <span>Filter</span>
        <IconButton>
            <MenuIcon />
        </IconButton>
    </div>

    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
    <div className="filter-container" style={{ width: 300, padding: 16 }}>
        <h3>Filters</h3>
        {Object.keys(uniqueOptions).map((filterKey) => (
            <div key={filterKey} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>
                    {filterKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <Select
                    fullWidth
                    value={filters[filterKey] || "All"}
                    onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
                >
                    <MenuItem value="All">All</MenuItem>
                    {uniqueOptions[filterKey]?.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </div>
        ))}
        <Button variant="contained" color="primary" onClick={filterData}>Apply Filters</Button>
    </div>
</Drawer>


    <div className="summary-container">
        <h2>Total Expendutuer: ${totalExpenditure.toFixed(2)}</h2>
    </div>



    <TableContainer component={Paper} className="table-container">
  <Table stickyHeader>
    <TableHead>
      <TableRow>
        {visibleFields.map((key) => {
          const labelOverrides = {
            boarding_time: "Arrival Time"
          };

          const formattedKey = labelOverrides[key] || key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

          return (
            <TableCell key={key} sx={{ fontWeight: "bold", backgroundColor: "#D4EDDA" }}>
              {formattedKey}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredData
        .sort((a, b) => {
          if (a.status === "Missed" && b.status !== "Missed") return 1;
          if (a.status !== "Missed" && b.status === "Missed") return -1;
          return new Date(a.departure_date) - new Date(b.departure_date);
        })
        .map((row, rowIndex) => {
          const readableDepartureDate = row.departure_date
            ? new Date(row.departure_date).toLocaleDateString("en-US", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            : '';

          const readableArrivalDate = row.arrival_date
            ? new Date(row.arrival_date).toLocaleDateString("en-US", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            : '';

          const isRefundable = row.status === "Refundable";

          return (
            <TableRow key={rowIndex} sx={{ backgroundColor: isRefundable ? "#D4EDDA" : "inherit" }}>
              {visibleFields.map((key) => (
                <TableCell key={key} sx={{ backgroundColor: "#D4EDDA" }}>
                  {key === "departure_date" ? readableDepartureDate :
                    key === "arrival_date" ? readableArrivalDate :
                      key === "paymentConfirmed" ? (
                        <Button
                          variant="contained"
                          color={row[key] ? "success" : "warning"}
                          onClick={async () => {
                            const success = await confirmPayment(row._id);


                            if (row[key]) {
                              setPopupMessage("Payment already confirmed");
                              setPopupType("error");
                            } else {
                              const success = await confirmPayment(row._id);
                              if (success) {
                                const updated = [...filteredData];
                                updated[rowIndex].paymentConfirmed = true;
                                setFilteredData(updated);
                                setPopupMessage("Payment confirmed");
                                setPopupType("success");
                              } else {
                                setPopupMessage("Payment confirmation failed.");
                                setPopupType("error");
                              }
                            }
                          }}
                        >
                          {row[key] ? "Proceed" : "Confirm Payment"}
                        </Button>
                      ) : row[key]}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
    </TableBody>
  </Table>
</TableContainer>



    
    
    
        
                    {/* Graphs Section */}
                    <div className="container charts-container">
                        <div className="row">
                            {/* Bar Chart - Total Expenditure per Airline */}
                            <div className="col-md-12 col-sm-12 chart-box">
                                <Bar 
                                    data={{
                                        labels: airlines,
                                        datasets: [{
                                            label: "Total Expense By Airline",
                                            data: airlineExpenditure,
                                            backgroundColor: "blue"
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: { title: { display: true, text: "Airlines" } },
                                            y: { title: { display: true, text: "Expenditure ($)" } }
                                        }
                                    }}
                                />
                            </div>
        
                            {/* Line Chart - Total Expenditure Over Time */}
                            <div className="col-md-12 col-sm-12 chart-box">
                                <Line 
                                    data={{
                                        labels: Object.keys(dateExpenditure),
                                        datasets: [{
                                            label: "Total Expense By Date Booked",
                                            data: Object.values(dateExpenditure),
                                            borderColor: "green"
                                        }]
                                    }} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
        
                            {/* Pie Chart - Payment Method Distribution */}
    
        
                            {/* Scatter Plot - Flight Duration vs Amount Earned */}
                            <div className="col-md-6 col-sm-12 chart-box bubble-chart">
                                <Bubble 
                                    data={{
                                        datasets: [{
                                            label: "Duration vs. Amount expend",
                                            data: flightDurationAmount.map(item => ({
                                                x: item.x,
                                                y: item.y,
                                                r: Math.random() * 10 + 5 // Random radius for better visual appeal
                                            })),
                                            backgroundColor: generateRandomColors(flightDurationAmount.length),
                                            borderColor: generateRandomColors(flightDurationAmount.length),
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
        
                            {/* Doughnut Chart - Seat Class Distribution */}
                            <div className="col-md-6 col-sm-12 chart-box">
                                <Doughnut 
                                    data={{
                                        labels: seatClasses,
                                        datasets: [{
                                            data: seatClassCounts,
                                            backgroundColor: generateRandomColors(seatClassCounts.length)
                                        }]
                                    }}
                                />
                            </div>
        
                            {/* Radar Chart - Check-in Status Frequency */}
                            <div className="col-md-6 col-sm-12 chart-box">
                                <PolarArea 
                                    data={{
                                        labels: checkInStatuses,
                                        datasets: [{
                                            label: "Check-in Status Frequency",
                                            data: checkInCounts,
                                            backgroundColor: generateRandomColors(checkInCounts.length),
                                            borderColor: generateRandomColors(checkInCounts.length),
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scale: {
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {popupMessage && (
                      <Popup 
                        message={popupMessage} 
                        type={popupType} 
                        onClose={() => {
                          setPopupMessage(null);
                          setPopupType(null);
                        }} 
                      />
                    )}
                </div>
            </>
        );
        
    };
export default AnalyticsConsumer;
