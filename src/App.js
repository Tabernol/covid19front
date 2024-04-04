import './App.css';
import {useEffect, useState} from "react";

function App() {
    const [countries, setCountries] = useState([]); // State to hold the countries
    const [selectedIso, setSelectedIso] = useState(""); // State to hold the selected ISO code
    const [reportData, setReportData] = useState(null);


    useEffect(() => {
        async function fetchData() { // function to retrieve iso from local server
            try {
                const response = await fetch("http://localhost:8080/regions");
                const data = await response.json();
                setCountries(data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Function to handle change in selected option
    const handleChange = (event) => {
        const selectedCountry = event.target.value;
        const selectedCountryObject = countries.find(country => country.name === selectedCountry);
        setSelectedIso(selectedCountryObject ? selectedCountryObject.iso : "");
    };

    // Function to call the report endpoint with the selected ISO code
    const fetchReport = async () => {
        console.log("cal to reports...")
        try {
            const response = await fetch(`http://localhost:8080/reports/${selectedIso}`);
            if (response.ok) {
                console.log("responce ok")
                const data = await response.json();
                console.log(data) // here I show you my data
                setReportData(data); // Update state with fetched report data
                console.log("data was setted")
            } else {
                console.error('Failed to fetch report');
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    // Function to render the report data in a table format
    const renderReportTable = () => {
        if (!reportData || !reportData.length) return null;

        return (
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Confirmed Cases</th>
                    <th>Deaths</th>
                    <th>Active Cases</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((report, index) => (
                    <tr key={index}>
                        <td>{report.date}</td>
                        <td>{report.confirmed}</td>
                        <td>{report.deaths}</td>
                        <td>{report.active}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                <select value={selectedIso} onChange={handleChange}>
                    <option value="">Select a country</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country.name}>{country.name}</option>
                    ))}
                </select>
                <p>Selected ISO: {selectedIso}</p>
                <button onClick={fetchReport}>Fetch Report</button>
                <div>
                    <h2>Report Data</h2>
                    {renderReportTable()}
                </div>
            </header>
        </div>
    );
}

export default App;
