import React, { useState, useEffect, useCallback } from "react";
import { fetchConsumerHistory } from "./Analytics_consumer_Get";
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
import "../componentCssFiles/analytics_consuer.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);

const AnalyticsAdmin = ({ email }) => {
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
                    .reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0)
    );

    const paymentMethods = [...new Set(filteredData.map(item => item.payment_method))];
    const paymentCounts = paymentMethods.map(method => 
        filteredData.filter(item => item.payment_method === method).length
    );

    const seatClasses = [...new Set(filteredData.map(item => item.seat_class))];
    const seatClassCounts = seatClasses.map(cls => 
        filteredData.filter(item => item.seat_class === cls).length
    );

    const checkInStatuses = [...new Set(filteredData.map(item => item.check_in_status))];
    const checkInCounts = checkInStatuses.map(status => 
        filteredData.filter(item => item.check_in_status === status).length
    );

    const dateExpenditure = filteredData.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + parseFloat(item.amount_paid || 0);
        return acc;
    }, {});
    
    const flightDurationAmount = filteredData.map(item => ({
        x: parseFloat(item.flight_duration || 0), 
        y: parseFloat(item.amount_paid || 0)
    }));



    useEffect(() => {
        setIsLoading(true); // Show loading animation // Simulate data fetching 
        fetchConsumerHistory(email).then((res) => {
            setData(res);
            setFilteredData(res);
            
            const extractUniqueValues = (key) => [...new Set(res.map(item => item[key]))];
            const keys = ["airline", "departure", "destination", "seat_class", "payment_method", 
                          "baggage_allowance_kg", "gate_number", "terminal", "layover", 
                          "cancellation_policy", "check_in_status", "loyalty_program"];
            
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
        const total = updatedData.reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0);
        setTotalExpenditure(total);

        setDrawerOpen(false);
    }, [filters, data]);

    useEffect(filterData, [filters, data]);

    return (
            <>
           
             {isLoading && <PlaneLoading isLoading={isLoading} />}         {/* For ANimation */}
        <div className="analytics-container">
            <h1>Analytics For Customers And Providers</h1>
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
                                "Flight", "Airline", "Date", "Departure", "Destination", "Departure Time",
                                "Arrival Time", "Duration (hrs)", "Status", "Amount Paid ($)",
                                "Passenger Name", "Seat Class", "Seat Number", "Booking Ref",
                                "Payment Method", "Baggage (kg)", "Gate", "Terminal", "Layover",
                                "Cancellation Policy", "Check-in Status", "Loyalty Program"
                            ].map(header => (
                                <TableCell key={header} className="table-header">{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow  className="data" key={index}>
                                <TableCell>{row.flight}</TableCell>
                                <TableCell>{row.airline}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.departure}</TableCell>
                                <TableCell>{row.destination}</TableCell>
                                <TableCell>{row.departure_time}</TableCell>
                                <TableCell>{row.arrival_time}</TableCell>
                                <TableCell>{row.flight_duration}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.amount_paid}</TableCell>
                                <TableCell>{row.passenger_name}</TableCell>
                                <TableCell>{row.seat_class}</TableCell>
                                <TableCell>{row.seat_number}</TableCell>
                                <TableCell>{row.booking_reference}</TableCell>
                                <TableCell>{row.payment_method}</TableCell>
                                <TableCell>{row.baggage_allowance_kg}</TableCell>
                                <TableCell>{row.gate_number}</TableCell>
                                <TableCell>{row.terminal}</TableCell>
                                <TableCell>{row.layover}</TableCell>
                                <TableCell>{row.cancellation_policy}</TableCell>
                                <TableCell>{row.check_in_status}</TableCell>
                                <TableCell>{row.loyalty_program}</TableCell>
                            </TableRow>
                        ))}
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
        <div className="col-md-6 col-sm-12 chart-box">
            <Pie 
                data={{
                    labels: paymentMethods,
                    datasets: [{ data: paymentCounts, backgroundColor:generateRandomColors(paymentMethods.length) }]
                }}
            />
        </div>

        {/* Scatter Plot - Flight Duration vs Amount Paid */}
       {/* Scatter Plot - Flight Duration vs Amount Paid */}
<div className="col-md-6 col-sm-12 chart-box bubble-chart">
    <Bubble 
        data={{
            datasets: [{
                label: "Duration vs. Amount Paid",
                data: flightDurationAmount.map(item => ({
                    x: item.x, 
                    y: item.y, 
                    r: Math.random() * 10 + 5 // Random radius for better visual appeal
                })), 
                backgroundColor: generateRandomColors(flightDurationAmount.length),
                borderColor:generateRandomColors(flightDurationAmount.length),
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
                        backgroundColor: generateRandomColors(checkInCounts.length) , // Different colors for each slice
                        borderColor:generateRandomColors(checkInCounts.length) ,
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

export default AnalyticsAdmin;
