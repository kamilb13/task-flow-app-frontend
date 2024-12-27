import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Services</li>
                    <li>Contact</li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
