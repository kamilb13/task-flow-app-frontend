import React from 'react';
import { FaCalendarAlt, FaUsers, FaComments, FaThLarge } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <ul>
                <a href="/main">
                    <li>
                        <FaThLarge style={{marginRight: '5px'}}/>
                        Dashboard
                    </li>
                </a>
                <a href="/main/calendar">
                    <li>
                        <FaCalendarAlt style={{marginRight: '5px'}}/>
                        Calendar
                    </li>
                </a>
                <a href="/main/members">
                    <li>
                        <FaUsers style={{marginRight: '5px'}}/>
                        Members
                    </li>
                </a>
                <a href="/main/messages">
                    <li>
                        <FaComments style={{marginRight: '5px'}}/>
                        Messages
                    </li>
                </a>
            </ul>
        </div>
    );
};

export default Sidebar;
