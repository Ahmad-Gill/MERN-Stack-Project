import React, { useState, useEffect, useCallback } from "react";
import { fetchConsumerHistory } from "./flight_provider_Get";
import { Bar, Line, Pie, Scatter, Doughnut, Radar,Bubble , PolarArea } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import PlaneLoading from "./PlaneLoading";   // for ANimation
import { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } from "../store";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Select, MenuItem, Drawer, Button, IconButton
} from "@mui/material";
import axios from "axios";
import Popup from "../componentsHtmlFIles/Popup";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentCssFiles/flight_consuer.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);

const UpcomingFlights_provider = () => {
    const [data, setData] = useState([]);
        const [popupType, setPopupType] = useState(null);
        const [refreshTrigger, setRefreshTrigger] = useState(0);

        const [popupMessage, setPopupMessage] = useState(null);
      const [isLoading, setIsLoading] = useState(false);    // set isLoading for animation
      const user = useSelector((state) => state.user);       //REdux comands
      const { isActive, isCustomer, isProvider } = useSelector((state) => state.user);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({});
    const [uniqueOptions, setUniqueOptions] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
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
    const airlines = [...new Set(filteredData.map(item => item.airlineCode))];
    const airlineExpenditure = airlines.map(airline => 
        filteredData.filter(item => item.airlineCode === airline)
                    .reduce((sum, item) => sum + parseFloat(item.totalEarnings || 0), 0)
    );
    
    const seatClasses = ["business", "economy", "firstClass", "premium"];
    const seatClassCounts = seatClasses.map(cls => 
        filteredData.reduce((count, item) => count + item.seatStats[cls].totalSeats, 0)
    );
    
    const checkInStatuses = ["On Time"];  // Assuming flight status indicates check-in status
    const checkInCounts = checkInStatuses.map(status => 
        filteredData.filter(item => item.status === status).length
    );
    
    const dateExpenditure = filteredData.reduce((acc, item) => {
        const date = new Date(item.departureDate).toISOString().split('T')[0];  // Using departureDate as the reference for date
        acc[date] = (acc[date] || 0) + parseFloat(item.totalEarnings || 0);
        return acc;
    }, {});
    
    const flightDurationAmount = filteredData.map(item => ({
        x: new Date(item.arrivalDate).getTime() - new Date(item.departureDate).getTime(),  // Calculating flight duration in milliseconds
        y: parseFloat(item.totalEarnings || 0)
    }));
    
    useEffect(() => {
        if (isLoading) return; // Avoid running if already loading
    
        setIsLoading(true);
    
        fetchConsumerHistory(user.email).then((res) => {
            const allFlights = res.flights || [];
    
            // ✅ Filter only past flights (not today)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const pastFlights = allFlights.filter(flight => {
                const departureDate = new Date(flight.departureDate);
                departureDate.setHours(0, 0, 0, 0);
                return departureDate < today;
            });
    
            // ✅ Start processing the filtered list
            setData(pastFlights);
            setFilteredData(pastFlights);
            console.log(pastFlights);
    
            const extractUniqueValues = (key) => [...new Set(pastFlights.map(item => item[key]))];
    
            const keys = [
                "flightName", "airlineCode",
                "origin", "destination",
                "departureDate", "arrivalDate",
                "departureTime", "arrivalTime",
                "status"
            ];
    
            const options = keys.reduce((acc, key) => {
                acc[key] = extractUniqueValues(key);
                return acc;
            }, {});
    
            setUniqueOptions(options);
            setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: "All" }), {}));
    
            const updatedFlights = pastFlights.map(flight => {
                const seatStats = flight.seatStats;
    
                const totalSeats = Object.values(seatStats).reduce((total, classStats) => {
                    return total + classStats.totalSeats;
                }, 0);
    
                const bookedSeats = Object.values(seatStats).reduce((total, classStats) => {
                    return total + classStats.bookedSeats;
                }, 0);
    
                return {
                    ...flight,
                    totalSeats,
                    bookedSeats
                };
            });
    
            // 🔢 Compute total earnings for display
            const totalEarnings = updatedFlights.reduce((total, flight) => {
                return total + (flight.totalEarnings || 0);
            }, 0);
            setTotalExpenditure(totalEarnings);
    
            setData(updatedFlights);
            setFilteredData(updatedFlights);
    
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        });
    }, [user.email, refreshTrigger]);
    
    
    
    const filterData = useCallback(() => {
        let updatedData = [...data];
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "All") {
                updatedData = updatedData.filter(item => item[key] === value);
            }
        });
        setFilteredData(updatedData);
    
        // Calculate total expenditure
        const total = updatedData.reduce((sum, item) => sum + parseFloat(item.totalEarnings || 0), 0);
        
    
        setDrawerOpen(false);
    }, [filters, data]);
    
    useEffect(() => {
        filterData(); // Trigger filtering when filters or data change
    }, [filters, data]);
    
    const handleRefund = (row) => {
        alert(`Processing refund for flight: ${row.flightName}`);
    };
    
    const handlePayment = (row) => {
        console.log("Processing payment for:", row);
    
        // Example: Redirect to a payment page or trigger a payment API
        alert(`Redirecting to payment for flight: ${row.flightName}`);
    };
    
    
    return (
        <>
            {isLoading && <PlaneLoading isLoading={isLoading} />} {/* For Animation */}
            <div className="analytics-container">
                <h1>Past Flight Details for {user.email}</h1>
                <div className="filter-button-container" onClick={() => setDrawerOpen(true)}>
                    <span>Filter</span>
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                </div>
    
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <div className="filter-container">
                        <h3>Filters</h3>
                        {Object.keys(uniqueOptions).map((filterKey) => (
                            <div key={filterKey}>
                                <label>{filterKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                <Select fullWidth value={filters[filterKey]} onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}>
                                    <MenuItem value="All">All</MenuItem>
                                    {uniqueOptions[filterKey].map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                        ))}
                        <Button variant="contained" color="primary" onClick={filterData}>Apply Filters</Button>
                    </div>
                </Drawer>
    
                <div className="summary-container">
                    <h2>Total Profit: ${totalExpenditure.toFixed(2)}</h2>
                </div>
    
                <TableContainer component={Paper} className="table-container">
    <Table stickyHeader>
        <TableHead>
            <TableRow>
                {[
                    { key: "flightName", label: "Flight Name", color: "#D0E8FF" },
                    { key: "airlineCode", label: "Airline Code", color: "#D0E8FF" },
                    { key: "origin", label: "Origin", color: "#D4EDDA" },
                    { key: "destination", label: "Destination", color: "#D4EDDA" },
                    { key: "departureDate", label: "Departure Date", color: "#D4EDDA" },
                    { key: "arrivalDate", label: "Arrival Date", color: "#D4EDDA" },
                    { key: "departureTime", label: "Departure Time", color: "#D4EDDA" },
                    { key: "arrivalTime", label: "Arrival Time", color: "#D4EDDA" },
                    { key: "status", label: "Status", color: "#FFF3CD" },
                    { key: "totalSeats", label: "Total Seats", color: "#E1D8F0" },
                    { key: "bookedSeats", label: "Booked Seats", color: "#E1D8F0" },
                    { key: "totalEarnings", label: "Total Earnings", color: "#E1D8F0" }
                ].map(({ key, label, color }) => (
                    <TableCell key={key} sx={{ fontWeight: "bold", backgroundColor: color }}>
                        {label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <TableBody>
            {filteredData
                .sort((a, b) => {
                    if (a.status === "Missed" && b.status !== "Missed") return 1;
                    if (a.status !== "Missed" && b.status === "Missed") return -1;
                    return new Date(a.departureDate) - new Date(b.departureDate);
                })
                .map((row, rowIndex) => {
                    // Format departureDate and arrivalDate as readable strings
                    const readableDepartureDate = new Date(row.departureDate).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const readableArrivalDate = new Date(row.arrivalDate).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const isRefundable = row.status === "Refundable";

                    return (
                        <TableRow key={rowIndex} sx={{ backgroundColor: isRefundable ? "#D4EDDA" : "inherit" }}>
                            {[
                                { key: "flightName", color: "#D0E8FF" },
                                { key: "airlineCode", color: "#D0E8FF" },
                                { key: "origin", color: "#D4EDDA" },
                                { key: "destination", color: "#D4EDDA" },
                                { key: "departureDate", color: "#D4EDDA", value: readableDepartureDate },
                                { key: "arrivalDate", color: "#D4EDDA", value: readableArrivalDate },
                                { key: "departureTime", color: "#D4EDDA" },
                                { key: "arrivalTime", color: "#D4EDDA" },
                                { key: "status", color: "#FFF3CD" },
                                { key: "totalSeats", color: "#E1D8F0" },
                                { key: "bookedSeats", color: "#E1D8F0" },
                                { key: "totalEarnings", color: "#E1D8F0" }
                            ].map(({ key, color, value }) => (
                                <TableCell
                                    key={key}
                                    sx={{ backgroundColor: isRefundable ? "#D4EDDA" : color }}
                                >
                                    {value || row[key]}
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
                                        label: "Total Profit By Airline",
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
                                        label: "Total Profit By Date Booked",
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
                                        label: "Duration vs. Amount Earned",
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

export default UpcomingFlights_provider;
