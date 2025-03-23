import React, { useState, useEffect, useCallback } from "react";
import { fetchConsumerHistory } from "../componentsHtmlFIles/Analytics_consumer_Get";
import { Bar, Line, Pie, Scatter, Doughnut, Radar,Bubble , PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Select, MenuItem, Drawer, Button, IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentCssFiles/analytics_consuer.scss";
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);

const AnalyticsConsumer = ({ email }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({});
    const [uniqueOptions, setUniqueOptions] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const generateRandomColors = (num) => {
        const colors = [];
        for (let i = 0; i < num; i++) {
            const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
            colors.push(randomColor);
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
            }, {});
            
            setUniqueOptions(options);
            setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: "All" }), {}));
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
        <div className="analytics-container">
            <h1>Analytics for {email}</h1>
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
                    datasets: [{ label: "Total Expenditure By Airline", data: airlineExpenditure, backgroundColor: "blue" }]
                }}
            />
        </div>

        {/* Line Chart - Total Expenditure Over Time */}
        <div className="col-md-12 col-sm-12 chart-box">
            <Line 
                data={{
                    labels: Object.keys(dateExpenditure),
                    datasets: [{ label: "Total Expenditure By Date Booked", data: Object.values(dateExpenditure), borderColor: "green" }]
                }}
            />
        </div>

        {/* Pie Chart - Payment Method Distribution */}
        <div className="col-md-6 col-sm-12 chart-box">
            <Pie 
                data={{
                    labels: paymentMethods,
                    datasets: [{ data: paymentCounts, backgroundColor: ["red", "blue", "yellow", "green"] }]
                }}
            />
        </div>

        {/* Scatter Plot - Flight Duration vs Amount Paid */}
        <div className="col-md-6 col-sm-12 chart-box">
    <Bubble 
        data={{
            datasets: [{
                label: "Duration vs. Amount Paid",
                data: flightDurationAmount.map(item => ({
                    x: item.x, 
                    y: item.y, 
                    r: Math.random() * 10 + 5 // Random radius for better visual appeal
                })), 
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)"
                ],
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        }}
        options={{
            scales: {
                x: { title: { display: true, text: "Flight Duration (Minutes)" } },
                y: { title: { display: true, text: "Amount Paid ($)" } }
            },
            plugins: {
                legend: { display: true }
            }
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
                        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)"], // Different colors for each slice
                        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
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
    );
};

export default AnalyticsConsumer;
