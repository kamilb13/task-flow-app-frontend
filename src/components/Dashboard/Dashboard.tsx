import React, {useEffect, useRef, useState} from 'react';
import {Modal, Button, Form, Image} from 'react-bootstrap';
import {createBoard, deleteBoard, editBoard, fetchBoards} from '../../api/boards';
import {useNavigate} from "react-router-dom";

interface Board {
    id: string;
    name: string;
    boardCreatorId: string;
}

const Dashboard: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>('');
    const [showModalAvatar, setShowModalAvatar] = useState<boolean>(false);
    const [showModalEditBoard, setShowModalEditBoard] = useState<boolean>(false);
    const [boardToEditId, setBoardToEditId] = useState<string | null>(null);
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBoardsData();
    }, []);

    const fetchBoardsData = async () => {
        const boards = await fetchBoards();
        setBoards(boards);
    };

    const toggleModalCreateBoard = () => {
        setShowModal((prev) => !prev);
    };

    const toggleModalEditBoard = () => {
        setShowModalEditBoard((prev) => !prev);
    };

    const toggleModalAvatar = () => {
        setShowModalAvatar((prev) => !prev);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userid');
        if (!boardName) return;

        const newBoard = {
            name: boardName,
            boardCreatorId: userId,
        };

        const response = await createBoard(newBoard);
        if (response?.status === 201) {
            toggleModalCreateBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        const response = await deleteBoard(boardId);
        if (response?.status === 200) {
            await fetchBoardsData();
        }
    };

    const handleEditBoard = async () => {
        if (!boardToEditId) return;

        const response = await editBoard(boardToEditId, boardName);
        if (response?.status === 200) {
            toggleModalEditBoard();
            setBoardName('');
            await fetchBoardsData();
        }
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
        <div className="dashboard">
            <div
                style={{
                    display: 'flex',
                    backgroundColor: '#f8f8f8',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                }}
            >
                <h1>Dashboard</h1>
                <Button variant="primary" onClick={toggleModalCreateBoard} size="lg">
                    Add board
                </Button>
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
            <Modal show={showModal} onHide={toggleModalCreateBoard}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="boardName">
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                                onChange={(e) => setBoardName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalCreateBoard}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalEditBoard} onHide={toggleModalEditBoard}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="boardName">
                            <Form.Label>Board Name</Form.Label>
                            <Form.Control
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalEditBoard}>
                        Close
                    </Button>
                    <Button variant="primary" type="button" onClick={handleEditBoard}>
                        Edit Board
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                }}
            >
                {boards.length ? (
                    boards.map((board) => (
                        <div
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                padding: '15px',
                                backgroundColor: '#f9f9f9',
                                textAlign: 'center',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.01)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';

                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            }}

                        >
                            <div
                                key={board.id}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.3s',
                                }}
                                onClick={() => navigate('/main/tasks', { state: { boardId: board.id } })}

                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                <h5 style={{margin: '10px 0', color: '#333'}}>Nazwa: {board.name}</h5>
                                <p style={{margin: '5px 0', fontSize: '14px', color: '#555'}}>
                                    ID: {board.id} <br/> ID creatora: {board.boardCreatorId}
                                </p>

                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteBoard(board.id)}
                                    style={{margin: '5px'}}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        toggleModalEditBoard();
                                        setBoardToEditId(board.id);
                                        setBoardName(board.name);
                                    }}
                                    style={{margin: '5px'}}
                                >
                                    Edit board
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Brak boards</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
