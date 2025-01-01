import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {

    return (
        <>
            <div className="sidebar">
                <ul>
                    <a href="/main"><li>Home</li></a>
                    <a href="/"><li>Add board</li></a>
                    <a href="/"><li>List of your projects</li></a>
                    <a href="/"><li>Log out</li></a>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
