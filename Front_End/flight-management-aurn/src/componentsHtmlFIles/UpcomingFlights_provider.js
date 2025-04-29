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
import MenuIcon from "@mui/icons-material/Menu";
import "../componentCssFiles/flight_consuer.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);

const UpcomingFlights_provider = ({ email="heo" }) => {
    const [data, setData] = useState([]);
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
        setIsLoading(true); // Show loading animation // Simulate data fetching 
        fetchConsumerHistory(email).then((res) => {
            setData(res);
            setFilteredData(res);
            
            const extractUniqueValues = (key) => [...new Set(res.map(item => item[key]))];
            
            const keys = [
                // Flight Information - Light Blue
                "airlineCode", 
        
                // Departure & Arrival Information - Light Yellow
                "departureDate", "destination", "departureTime",
        
                // Seat Class Information - Light Green
                "business", "economy", "firstClass", "premium",
        
                // Additional Information - Light Gray
                "status",
            ];
        
            const options = keys.reduce((acc, key) => {
                acc[key] = extractUniqueValues(key);
                return acc;
            }, {});
            
            setUniqueOptions(options);
            setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: "All" }), {}));
            
            setIsLoading(false); // Set loading state to false after data fetching
        });
    }, [email]);
    
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
        setTotalExpenditure(total);
    
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
                <h1>Upcoming Flight Details for {user.email}</h1>
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
                    <h2>Total Expenditure: ${totalExpenditure.toFixed(2)}</h2>
                </div>
    
                <TableContainer component={Paper} className="table-container">
    <Table stickyHeader>
        <TableHead>
            <TableRow>
                {[
                    // Flight Information - Light Blue
                    { key: "newFlightKey", label: "New Flight Label", color: "#D0E8FF" },
                    { key: "newAirlineKey", label: "New Airline Label", color: "#D0E8FF" },
                    { key: "newAirplaneModelKey", label: "New Airplane Model Label", color: "#D0E8FF" },
                    { key: "newFlightTypeKey", label: "New Flight Type Label", color: "#D0E8FF" },

                    // Booking & Payment Details - Light Green
                    { key: "newBookingStartDateKey", label: "New Booking Start Date", color: "#D4EDDA" },
                    { key: "newAmountEarnKey", label: "New Amount Earned", color: "#D4EDDA" },

                    // Departure & Arrival Information - Light Yellow
                    { key: "newDateKey", label: "New Flight Date", color: "#FFF3CD" },
                    { key: "newDepartureKey", label: "New Departure", color: "#FFF3CD" },
                    { key: "newDestinationKey", label: "New Destination", color: "#FFF3CD" },
                    { key: "newDepartureTimeKey", label: "New Departure Time", color: "#FFF3CD" },
                    { key: "newArrivalTimeKey", label: "New Arrival Time", color: "#FFF3CD" },
                    { key: "newFlightDurationKey", label: "New Flight Duration", color: "#FFF3CD" },
                    { key: "newLayoverKey", label: "New Layover", color: "#FFF3CD" },

                    // Passenger Details - Light Pink
                    { key: "newTotalSeatsKey", label: "New Total Seats", color: "#F8D7DA" },
                    { key: "newSeatsBookedKey", label: "New Seats Booked", color: "#F8D7DA" },

                    // Additional Information - Light Gray
                    { key: "newMissedStatusKey", label: "New Missed Status", color: "#E9ECEF" },
                    { key: "newCancellationPolicyKey", label: "New Cancellation Policy", color: "#E9ECEF" },
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
                    // Move "Missed" flights to the bottom
                    if (a.newMissedStatusKey === "Missed" && b.newMissedStatusKey !== "Missed") return 1;
                    if (a.newMissedStatusKey !== "Missed" && b.newMissedStatusKey === "Missed") return -1;

                    // Sort by nearest flight date (earliest first)
                    return new Date(a.newFlightDateKey) - new Date(b.newFlightDateKey);
                })
                .map((row, rowIndex) => {
                    const isAmountZero = row.newAmountEarnKey === 0;
                    const isRefundable = row.newCancellationPolicyKey === "Refundable" && row.newMissedStatusKey !== "Missed";
                    const isNonRefundablePaid = row.newCancellationPolicyKey === "Non-Refundable" && row.newAmountEarnKey > 0;

                    return (
                        <TableRow key={rowIndex} sx={{ backgroundColor: isAmountZero ? "#FFCCCC" : "inherit" }}>
                            {[
                                { key: "newFlightKey", color: "#D0E8FF" },
                                { key: "newAirlineKey", color: "#D0E8FF" },
                                { key: "newAirplaneModelKey", color: "#D0E8FF" },
                                { key: "newFlightTypeKey", color: "#D0E8FF" },
                                { key: "newBookingStartDateKey", color: "#D4EDDA" },
                                { key: "newAmountEarnKey", color: "#D4EDDA" },
                                { key: "newDateKey", color: "#FFF3CD" },
                                { key: "newDepartureKey", color: "#FFF3CD" },
                                { key: "newDestinationKey", color: "#FFF3CD" },
                                { key: "newDepartureTimeKey", color: "#FFF3CD" },
                                { key: "newArrivalTimeKey", color: "#FFF3CD" },
                                { key: "newFlightDurationKey", color: "#FFF3CD" },
                                { key: "newLayoverKey", color: "#FFF3CD" },
                                { key: "newTotalSeatsKey", color: "#F8D7DA" },
                                { key: "newSeatsBookedKey", color: "#F8D7DA" },
                                { key: "newMissedStatusKey", color: "#E9ECEF" },
                                { key: "newCancellationPolicyKey", color: "#E9ECEF" },
                            ].map(({ key, color }) => (
                                <TableCell
                                    key={key}
                                    sx={{ backgroundColor: isAmountZero ? "#FFAAAA" : color }}
                                >
                                    {key === "newTicketUrlKey" ? (
                                        <a href={row[key]} target="_blank" rel="noopener noreferrer">View Ticket</a>
                                    ) : (
                                        row[key]
                                    )}
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
                                        label: "Total Expenditure By Airline",
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
                                        label: "Total Expenditure By Date Booked",
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
            </div>
        </>
    );
    
};

export default UpcomingFlights_provider;
