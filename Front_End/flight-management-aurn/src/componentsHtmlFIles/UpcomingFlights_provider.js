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
    const airlines = [...new Set(filteredData.map(item => item.airline))];
    const airlineExpenditure = airlines.map(airline => 
        filteredData.filter(item => item.airline === airline)
                    .reduce((sum, item) => sum + parseFloat(item.amount_earn || 0), 0)
    );

    const paymentMethods = [...new Set(filteredData.map(item => item.Total_seats))];
    const paymentCounts = paymentMethods.map(method => 
        filteredData.filter(item => item.Total_seats === method).length
    );
    
    const seatClasses = [...new Set(filteredData.map(item => item.flight_type))];
    const seatClassCounts = seatClasses.map(cls => 
        filteredData.filter(item => item.flight_type === cls).length
    );

    const checkInStatuses = [...new Set(filteredData.map(item => item.check_in_status))];
    const checkInCounts = checkInStatuses.map(status => 
        filteredData.filter(item => item.check_in_status === status).length
    );

    const dateExpenditure = filteredData.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + parseFloat(item.amount_earn || 0);
        return acc;
    }, {});
    
    const flightDurationAmount = filteredData.map(item => ({
        x: parseFloat(item.flight_duration || 0), 
        y: parseFloat(item.amount_earn || 0)
    }));



    useEffect(() => {
        setIsLoading(true); // Show loading animation // Simulate data fetching 
        fetchConsumerHistory(email).then((res) => {
            setData(res);
            setFilteredData(res);
            
            const extractUniqueValues = (key) => [...new Set(res.map(item => item[key]))];
            const keys = [
                // Flight Information - Light Blue
               "airline", 
            
                // Booking & Payment Details - Light Green
 "payment_method", "loyalty_program",
            
                // Departure & Arrival Information - Light Yellow
                "date", "departure", "destination", 
                 "layover",
            
                // Passenger Details - Light Pink
                 "seat_class",  "check_in_status",
             
            
              
            
                // Additional Information - Light Gray
                "missed_status", "cancellation_policy", 
            ]
            ;
            
            const options = keys.reduce((acc, key) => {
                acc[key] = extractUniqueValues(key);
                return acc;
                setIsLoading(false);
            }, {});
            
            setUniqueOptions(options);
            setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: "All" }), {}));
            setIsLoading(false);
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
        const total = updatedData.reduce((sum, item) => sum + parseFloat(item.amount_earn || 0), 0);
        setTotalExpenditure(total);

        setDrawerOpen(false);
    }, [filters, data]);

    useEffect(filterData, [filters, data]);
    const handleRefund = (row) => {
        alert(`Processing refund for ${row.passenger_name} - Flight ${row.flight}`);
    };
    const handlePayment = (row) => {
        console.log("Processing payment for:", row);
    
        // Example: Redirect to a payment page or trigger a payment API
        alert(`Redirecting to payment for flight: ${row.flight}`);
    };
    
    return (
            <>
           
             {isLoading && <PlaneLoading isLoading={isLoading} />}         {/* For ANimation */}
        <div className="analytics-container">
            <h1>Up Coming Flight Details  for {user.email}</h1>
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
        {/* Table Head */}
        <TableHead>
            <TableRow>
                {[
                    // Flight Information - Light Blue
                    { key: "flight", label: "Flight", color: "#D0E8FF" },
                    { key: "airline", label: "Airline", color: "#D0E8FF" },
                    { key: "airplane_model", label: "Airplane Model", color: "#D0E8FF" },
                    { key: "flight_type", label: "Flight Type", color: "#D0E8FF" },

                    // Booking & Payment Details - Light Green
                    { key: "booking_start_date", label: "booking Start Date", color: "#D4EDDA" },
                    { key: "amount_earn", label: "Amount Earn", color: "#D4EDDA" },

                    // Departure & Arrival Information - Light Yellow
                    { key: "date", label: "Flight Date", color: "#FFF3CD" },
                    { key: "departure", label: "Departure", color: "#FFF3CD" },
                    { key: "destination", label: "Destination", color: "#FFF3CD" },
                    { key: "departure_time", label: "Departure Time", color: "#FFF3CD" },
                    { key: "arrival_time", label: "Arrival Time", color: "#FFF3CD" },
                    { key: "flight_duration", label: "Flight Duration", color: "#FFF3CD" },
                    { key: "layover", label: "Layover", color: "#FFF3CD" },

                    // Passenger Details - Light Pink
                    { key: "Total_seats", label: "Total Seats", color: "#F8D7DA" },
                    { key: "Seats_booked", label: "Booked Seats", color: "#F8D7DA" },
                   

                    // Airport & Terminal Information - Light Purple
                    { key: "terminal", label: "Terminal", color: "#E2D6F9" },
           

                    // Additional Information - Light Gray
                    { key: "missed_status", label: "Missed Status", color: "#E9ECEF" },
                    { key: "cancellation_policy", label: "Cancellation Policy", color: "#E9ECEF" },
                ].map(({ key, label, color }) => (
                    <TableCell key={key} sx={{ fontWeight: "bold", backgroundColor: color }}>
                        {label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
    {filteredData
        .sort((a, b) => {
            // Move "Missed" flights to the bottom
            if (a.missed_status === "Missed" && b.missed_status !== "Missed") return 1;
            if (a.missed_status !== "Missed" && b.missed_status === "Missed") return -1;

            // Sort by nearest flight date (earliest first)
            return new Date(a.flight_date) - new Date(b.flight_date);
        })
        .map((row, rowIndex) => {
            const isAmountZero = row.amount_earn === 0;
            const isRefundable = row.cancellation_policy === "Refundable" && row.missed_status !== "Missed";
            const isNonRefundablePaid = row.cancellation_policy === "Non-Refundable" && row.amount_earn > 0;

            return (
                <TableRow key={rowIndex} sx={{ backgroundColor: isAmountZero ? "#FFCCCC" : "inherit" }}>
                    {[
                        { key: "flight", color: "#D0E8FF" },
                        { key: "airline", color: "#D0E8FF" },
                        { key: "airplane_model", color: "#D0E8FF" },
                        { key: "flight_type", color: "#D0E8FF" },

                        { key: "booking_start_date", color: "#D4EDDA" },
                        { key: "amount_earn", color: "#D4EDDA" },

                        { key: "date", color: "#FFF3CD" },
                        { key: "departure", color: "#FFF3CD" },
                        { key: "destination", color: "#FFF3CD" },
                        { key: "departure_time", color: "#FFF3CD" },
                        { key: "arrival_time", color: "#FFF3CD" },
                        { key: "flight_duration", color: "#FFF3CD" },
                        { key: "layover", color: "#FFF3CD" },


                        { key: "Total_seats", color: "#F8D7DA" },
                        { key: "Seats_booked", color: "#F8D7DA" },
              

                        { key: "terminal", color: "#E2D6F9" },
                        

                        { key: "missed_status", color: "#E9ECEF" },
                        { key: "cancellation_policy", color: "#E9ECEF" },
                       
                    ].map(({ key, color }) => (
                        <TableCell 
                            key={key} 
                            sx={{ backgroundColor: isAmountZero ? "#FFAAAA" : color }} 
                        >
                            {key === "ticket_url" ? (
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
            label: "Total Ballance By Date Booked",
            data: Object.values(dateExpenditure),
            borderColor: "green"
        }]
    }} 
    options={{
        responsive: true,
        maintainAspectRatio: false,  // ❌ Disable aspect ratio to allow height changes
    }}
/>

        </div>

        {/* Pie Chart - Payment Method Distribution */}
        <div className="col-md-6 col-sm-12 chart-box">
            <Pie 
                data={{
                    labels: paymentMethods,
                    datasets: [{ data: paymentCounts, backgroundColor:generateRandomColors( paymentMethods.length) }]
                }}
            />
        </div>

        {/* Scatter Plot - Flight Duration vs Amount Paid */}
       {/* Scatter Plot - Flight Duration vs Amount Paid */}
<div className="col-md-6 col-sm-12 chart-box bubble-chart">
    <Bubble 
        data={{
            datasets: [{
                label: "Duration vs. Amount Earn",
                data: flightDurationAmount.map(item => ({
                    x: item.x, 
                    y: item.y, 
                    r: Math.random() * 10 + 5 // Random radius for better visual appeal
                })), 
                backgroundColor: generateRandomColors(flightDurationAmount.length) ,
                borderColor:generateRandomColors(flightDurationAmount.length) ,
                borderWidth: 1
            }]
        }}
        options={{
            responsive: true,
            maintainAspectRatio: false
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
                        backgroundColor: generateRandomColors(seatClassCounts.length) // Dynamically generated colors
                    }]
                }}
            />
        </div>

        {/* Radar Chart - Check-in Status Frequency */}
        <div className="col-md-6 col-sm-12 chart-box">
            {/* Polar Area Chart */}
            <PolarArea 
                data={{
                    labels: checkInStatuses,
                    datasets: [{
                        label: "Check-in Status Frequency",
                        data: checkInCounts,
                        backgroundColor:  generateRandomColors(checkInCounts.length) , // Different colors for each slice
                        borderColor:  generateRandomColors(checkInCounts.length) ,
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
