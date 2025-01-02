import React from 'react';
import {Outlet} from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="main-container">
            <div className="content">
                <Sidebar/>
                <Outlet/>
            </div>
        </div>
    );
}

export default HomePage;
