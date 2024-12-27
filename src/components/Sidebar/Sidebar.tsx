import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const toggleSidebar = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? 'Close' : 'Open'} Sidebar
            </button>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
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
