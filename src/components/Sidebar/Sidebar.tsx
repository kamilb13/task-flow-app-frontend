import React from 'react';
import {FaCalendarAlt, FaThLarge} from 'react-icons/fa';
import './Sidebar.css';
import {useNavigate} from "react-router-dom";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <ul>
                <li onClick={() => navigate('/main')}>
                    <FaThLarge style={{marginRight: '5px'}}/>
                    Dashboard
                </li>
                <li onClick={() => navigate('/main/calendar')}>
                    <FaCalendarAlt style={{marginRight: '5px'}}/>
                    Calendar
                </li>
                {/*<li onClick={() => navigate('/main/members')}>*/}
                {/*    <FaUsers style={{marginRight: '5px'}}/>*/}
                {/*    Members*/}
                {/*</li>*/}
                {/*<li onClick={() => navigate('/main/messages')}>*/}
                {/*    <FaComments style={{marginRight: '5px'}}/>*/}
                {/*    Messages*/}
                {/*</li>*/}
            </ul>
        </div>
    );
};

export default Sidebar;
