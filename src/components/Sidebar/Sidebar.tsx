import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {

    return (
        <>
            <div className="sidebar">
                <ul>
                    <a href="/main"><li>Home</li></a>
                    <a href="/"><li>Calendar</li></a>
                    <a href="/main/other"><li>Members</li></a>
                    <a href="/"><li>Messages</li></a>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
