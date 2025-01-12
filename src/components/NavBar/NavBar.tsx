import React, {useEffect, useRef, useState} from "react";
import {Image} from "react-bootstrap";
import './NavBar.css';

interface NavBarProps {
    headerName: string;
}

const NavBar: React.FC<NavBarProps> = ({headerName}) => {
    const [showModalAvatar, setShowModalAvatar] = useState<boolean>(false);
    const avatarRef = useRef<HTMLDivElement | null>(null);

    const toggleModalAvatar = () => {
        setShowModalAvatar((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
            setShowModalAvatar(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <h1>{headerName}</h1>
            <div style={{position: 'relative'}}>
                <Image
                    src="../../public/avatar.png"
                    roundedCircle
                    alt="Avatar"
                    style={{width: '100px', height: '100px', cursor: 'pointer'}}
                    onClick={toggleModalAvatar}
                />
                {showModalAvatar && (
                    <div
                        ref={avatarRef}
                        style={{
                            position: 'absolute',
                            top: '110px',
                            right: '0',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            borderRadius: '5px',
                            padding: '10px',
                            zIndex: 1000,
                            width: '200px',
                        }}
                    >
                        {['Profile', 'Settings'].map((item, index) => (
                            <p
                                key={index}
                                style={{
                                    margin: '10px 0',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    borderRadius: '3px',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {item}
                            </p>
                        ))}
                        <p
                            style={{
                                margin: '10px 0',
                                cursor: 'pointer',
                                color: 'red',
                                padding: '5px',
                                borderRadius: '3px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            onClick={() => alert('Logged out')}
                        >
                            Logout
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar;