import React, { useState, useEffect, useCallback } from "react";
import { fetchConsumerHistory } from "../componentsHtmlFIles/flight_consumer_Get";
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
import "../componentCssFiles/analytics_consuer.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale);

const AnalyticsConsumer = ({ email }) => {
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
        setIsLoading(true); // Show loading animation // Simulate data fetching 
        fetchConsumerHistory(email).then((res) => {
            setData(res);
            setFilteredData(res);
            
            const extractUniqueValues = (key) => [...new Set(res.map(item => item[key]))];
            const keys = [
                // Flight Information - Light Blue
                "flight", "airline", "airplane_model", "flight_type",
            
                // Booking & Payment Details - Light Green
                "booking_date", "payment_method", "amount_paid", "currency", "loyalty_program",
            
                // Departure & Arrival Information - Light Yellow
                "flight_date", "departure", "destination", 
                 "flight_duration", "layover",
            
                // Passenger Details - Light Pink
                "passenger_name", "seat_class", "seat_number", "check_in_status",
                "food_preferences", "special_requests", "baggage_allowance_kg",
            
                // Airport & Terminal Information - Light Purple
                "terminal", "gate_number",
            
                // Additional Information - Light Gray
                "missed_status", "cancellation_policy", "ticket_url","Refund","Makepayment"
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
        const total = updatedData.reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0);
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
                    { key: "booking_date", label: "Booking Date", color: "#D4EDDA" },
                    { key: "payment_method", label: "Payment Method", color: "#D4EDDA" },
                    { key: "amount_paid", label: "Amount Paid", color: "#D4EDDA" },
                    { key: "currency", label: "Currency", color: "#D4EDDA" },
                    { key: "loyalty_program", label: "Loyalty Program", color: "#D4EDDA" },

                    // Departure & Arrival Information - Light Yellow
                    { key: "flight_date", label: "Flight Date", color: "#FFF3CD" },
                    { key: "departure", label: "Departure", color: "#FFF3CD" },
                    { key: "destination", label: "Destination", color: "#FFF3CD" },
                    { key: "departure_time", label: "Departure Time", color: "#FFF3CD" },
                    { key: "boarding_time", label: "Boarding Time", color: "#FFF3CD" },
                    { key: "gate_closing_time", label: "Gate Closing Time", color: "#FFF3CD" },
                    { key: "arrival_time", label: "Arrival Time", color: "#FFF3CD" },
                    { key: "flight_duration", label: "Flight Duration", color: "#FFF3CD" },
                    { key: "layover", label: "Layover", color: "#FFF3CD" },

                    // Passenger Details - Light Pink
                    { key: "passenger_name", label: "Passenger Name", color: "#F8D7DA" },
                    { key: "seat_class", label: "Seat Class", color: "#F8D7DA" },
                    { key: "seat_number", label: "Seat Number", color: "#F8D7DA" },
                    { key: "check_in_status", label: "Check-in Status", color: "#F8D7DA" },
                    { key: "food_preferences", label: "Food Preferences", color: "#F8D7DA" },
                    { key: "special_requests", label: "Special Requests", color: "#F8D7DA" },
                    { key: "baggage_allowance_kg", label: "Baggage Allowance (kg)", color: "#F8D7DA" },

                    // Airport & Terminal Information - Light Purple
                    { key: "terminal", label: "Terminal", color: "#E2D6F9" },
                    { key: "gate_number", label: "Gate Number", color: "#E2D6F9" },

                    // Additional Information - Light Gray
                    { key: "missed_status", label: "Missed Status", color: "#E9ECEF" },
                    { key: "cancellation_policy", label: "Cancellation Policy", color: "#E9ECEF" },
                    { key: "ticket_url", label: "Ticket", color: "#E9ECEF" },
                    { key: "Refund", label: "Refund", color: "#E9ECEF" }
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
            const isAmountZero = row.amount_paid === 0;
            const isRefundable = row.cancellation_policy === "Refundable" && row.missed_status !== "Missed";
            const isNonRefundablePaid = row.cancellation_policy === "Non-Refundable" && row.amount_paid > 0;

            return (
                <TableRow key={rowIndex} sx={{ backgroundColor: isAmountZero ? "#FFCCCC" : "inherit" }}>
                    {[
                        { key: "flight", color: "#D0E8FF" },
                        { key: "airline", color: "#D0E8FF" },
                        { key: "airplane_model", color: "#D0E8FF" },
                        { key: "flight_type", color: "#D0E8FF" },

                        { key: "booking_date", color: "#D4EDDA" },
                        { key: "payment_method", color: "#D4EDDA" },
                        { key: "amount_paid", color: "#D4EDDA" },
                        { key: "currency", color: "#D4EDDA" },
                        { key: "loyalty_program", color: "#D4EDDA" },

                        { key: "flight_date", color: "#FFF3CD" },
                        { key: "departure", color: "#FFF3CD" },
                        { key: "destination", color: "#FFF3CD" },
                        { key: "departure_time", color: "#FFF3CD" },
                        { key: "boarding_time", color: "#FFF3CD" },
                        { key: "gate_closing_time", color: "#FFF3CD" },
                        { key: "arrival_time", color: "#FFF3CD" },
                        { key: "flight_duration", color: "#FFF3CD" },
                        { key: "layover", color: "#FFF3CD" },

                        { key: "passenger_name", color: "#F8D7DA" },
                        { key: "seat_class", color: "#F8D7DA" },
                        { key: "seat_number", color: "#F8D7DA" },
                        { key: "check_in_status", color: "#F8D7DA" },
                        { key: "food_preferences", color: "#F8D7DA" },
                        { key: "special_requests", color: "#F8D7DA" },
                        { key: "baggage_allowance_kg", color: "#F8D7DA" },

                        { key: "terminal", color: "#E2D6F9" },
                        { key: "gate_number", color: "#E2D6F9" },

                        { key: "missed_status", color: "#E9ECEF" },
                        { key: "cancellation_policy", color: "#E9ECEF" },
                        { key: "ticket_url", color: "#E9ECEF" }
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

                    {/* Refund & Payment Buttons */}
                    <TableCell sx={{ backgroundColor: isAmountZero ? "#FFAAAA" : "#E9ECEF" }}>
                        {/* Refund Button - Enabled only if Refundable */}
                        <button
                            onClick={() => handleRefund(row)}
                            disabled={!isRefundable} // Disabled if not refundable
                            style={{
                                backgroundColor: isRefundable ? "#28a745" : "#A9A9A9",
                                color: "white",
                                padding: "5px 10px",
                                border: "none",
                                cursor: isRefundable ? "pointer" : "not-allowed",
                                borderRadius: "5px",
                                marginRight: "5px"
                            }}
                        >
                            Refund
                        </button>

                        {/* Make Payment Button - Always shown but disabled if amount > 0 */}
                        <button 
                            onClick={() => handlePayment(row)} 
                            disabled={!isAmountZero} // Disabled if amount is paid
                            style={{
                                backgroundColor: isAmountZero ? "#007bff" : "#A9A9A9",
                                color: "white",
                                padding: "5px 10px",
                                border: "none",
                                cursor: isAmountZero ? "pointer" : "not-allowed",
                                borderRadius: "5px"
                            }}
                        >
                            Make Payment
                        </button>
                    </TableCell>
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
        maintainAspectRatio: false,  // ❌ Disable aspect ratio to allow height changes
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
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)"
                ],
                borderColor: "rgba(75, 192, 192, 1)",
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
        </>
    );
};

export default AnalyticsConsumer;
