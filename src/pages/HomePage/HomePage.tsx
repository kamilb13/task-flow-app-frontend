import React from 'react';
import Dashboard from "../../components/Dashboard/Dashboard.tsx";
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="main-container">
            <div className="content">
                <Sidebar/>
                <Dashboard/>
            </div>
        </div>
    );
}

export default HomePage;
