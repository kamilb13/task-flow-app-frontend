import React, {useEffect, useRef, useState} from "react";
import {Image} from "react-bootstrap";
import './NavBar.css';
import {useDispatch, useSelector} from "react-redux";
import {clearUser} from "../../store/userSlice.ts";
import {persistor, RootState} from "../../store/store.ts";
import {useNavigate} from "react-router-dom";
import {changeAvatar, getAvatar} from "../../api/users.ts";

interface NavBarProps {
    headerName: string;
    boardName: string;
}

const NavBar: React.FC<NavBarProps> = ({headerName, boardName}) => {
    const [showModalAvatar, setShowModalAvatar] = useState<boolean>(false);
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<string>();
    const user: any = useSelector((state: RootState) => state.user.user);

    const dispatch = useDispatch();

    const fetchAvatar = async () => {
        if (user?.id) {
            const response = await getAvatar(user);
            const imageUrl = URL.createObjectURL(response?.data);
            setAvatarUrl(imageUrl);
        }
    };

    useEffect(() => {
        fetchAvatar();
    }, [user?.id]);

    const toggleModalAvatar = () => {
        setShowModalAvatar((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
            setShowModalAvatar(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        await changeAvatar(user, formData);
        fetchAvatar();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <h1 style={{marginLeft: '8px'}}>{headerName}</h1>
            <h1 style={{marginLeft: '8px'}}>{boardName}</h1>
            <div style={{position: 'relative'}}>
                <Image
                    src={avatarUrl}
                    roundedCircle
                    alt="Avatar"
                    style={{width: '90px', height: '90px', cursor: 'pointer', objectFit: 'cover', marginRight: '8px'}}
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
                        <div
                            onClick={() => document.getElementById("avatarInput")?.click()}
                            style={{
                                cursor: "pointer",
                                margin: '10px 0',
                                padding: '5px',
                                borderRadius: '3px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            Change avatar image
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                style={{display: "none"}}
                                onChange={handleFileChange}
                            />
                        </div>
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
                            onClick={() => {
                                dispatch(clearUser());
                                persistor.purge();
                                navigate('/')
                            }}
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