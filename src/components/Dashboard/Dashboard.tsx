import React, {useEffect, useState} from 'react';
import {Modal, Button, Form, ListGroup} from 'react-bootstrap';
import {createBoard, deleteBoard, editBoard, fetchBoards} from '../../api/boards.ts';
import NavBar from "../NavBar/NavBar.tsx";
import BoardCard from "../BoardCard/BoardCard.tsx";
import {useDispatch, useSelector} from "react-redux";
import {setBoards} from "../../store/boardsSlice";
import {getUsers} from "../../api/users.ts";
import {addUserToBoard} from "../../api/boards.ts";
import {RootState} from "../../store/store.ts";

interface Board {
    id: number;
    name: string;
    boardCreatorId: number;
    createdAt?: string;
    estimatedEndDate?: string;
}

interface User {
    id: number;
    username: string;
}

const Dashboard: React.FC = () => {
    const [boards, setBoardsState] = useState<Board[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>('');
    const [showModalEditBoard, setShowModalEditBoard] = useState<boolean>(false);
    const [showModalAddUserToBoard, setShowModalAddUserToBoard] = useState<boolean>(false);
    const [userToBoard, setUserToBoard] = useState<{ id: number; username: string } | null>(null);
    const [boardToEditId, setBoardToEditId] = useState<number | null>(null);
    const [boardToAddUserId, setBoardToAddUserId] = useState<number | null>(null);
    const [estimatedEndDate, setEstimatedEndDate] = useState<string>();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    // const [showSuggestions, setShowSuggestions] = useState(true);

    const dispatch = useDispatch();

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    // useEffect(() => {
    //     if (showModalAddUserToBoard) {
    //         getUsers()
    //             .then((response) => setUsers(response?.data))
    //             .catch((err) => console.error("Błąd pobierania użytkowników:", err));
    //     }
    // }, [showModalAddUserToBoard]);

    useEffect(() => {
        getUsers(user)
            .then((response) => setUsers(response?.data))
            .catch((err) => console.error("Błąd pobierania użytkowników:", err));
    }, []);

    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        if (userToBoard?.username) {
            const filtered = users.filter((user) =>
                user.username.toLowerCase().includes(userToBoard.username.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [userToBoard, users]);


    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerHeight]);

    const getAvailableHeight = () => windowHeight - 350; // !!!


    useEffect(() => {
        fetchBoardsData();
    }, []);

    useEffect(() => {
        const loadBoards = async () => {
            const boards = await fetchBoards(user);
            if (boards) {
                dispatch(setBoards(boards));
            }
        };

        loadBoards();
    }, [dispatch]);

    const fetchBoardsData = async () => {
        const boards = await fetchBoards(user);
        setBoardsState(boards);
    };

    const toggleModalCreateBoard = () => {
        setShowModal((prev) => !prev);
    };

    const toggleModalEditBoard = () => {
        setShowModalEditBoard((prev) => !prev);
    };

    const toggleAddUserToBoard = () => {
        setUserToBoard(null);
        setShowModalAddUserToBoard((prev) => !prev);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem('userid');
        if (!boardName) return;

        const newBoard = {
            name: boardName,
            boardCreatorId: userId,
            estimatedEndDate: estimatedEndDate,
        };

        const response = await createBoard(newBoard);
        if (response?.status === 201) {
            toggleModalCreateBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    const handleDeleteBoard = async (boardId: number) => {
        const response = await deleteBoard(boardId, user);
        if (response?.status === 200) {
            await fetchBoardsData();
        }
    };

    const handleEditBoard = async () => {
        if (!boardToEditId) return;

        const response = await editBoard(boardToEditId, boardName, user);
        if (response?.status === 200) {
            toggleModalEditBoard();
            setBoardName('');
            await fetchBoardsData();
        }
    };

    const handleAddUserToBoard = async () => {
        const response = await getUsers(user);
        if (response?.status === 200) {
            const response = await addUserToBoard(boardToAddUserId, userToBoard.id, user);
            if (response?.status === 200) {
                fetchBoardsData();
                toggleAddUserToBoard();
            }
        }
    }

    return (
        <div className="dashboard">
            <NavBar headerName={"Dashboard"}/>
            <Button
                variant="primary"
                onClick={toggleModalCreateBoard}
                size="lg"
                style={{
                    position: 'fixed',
                    bottom: '150px',
                    right: '150px',
                    borderRadius: '10px',
                    width: '140px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                    if (e.target instanceof HTMLElement) {
                        e.target.style.backgroundColor = 'lightblue';
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }
                }}
                onMouseLeave={(e) => {
                    if (e.target instanceof HTMLElement) {
                        e.target.style.backgroundColor = '';
                        e.target.style.transform = 'scale(1.00)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }
                }}
            >
                Add Board
            </Button>
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
                            <Form.Label>Estimated end date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={estimatedEndDate}
                                onChange={(e) => setEstimatedEndDate(e.target.value)}
                                required
                                placeholder="Select estimated end date"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mt-3 ">
                            <Button variant="secondary" onClick={toggleModalCreateBoard}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
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
            <Modal show={showModalAddUserToBoard} onHide={toggleAddUserToBoard}>
                <Modal.Header closeButton>
                    <Modal.Title>Add user to Board</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="boardName">
                            <Form.Label>User username</Form.Label>
                            <Form.Control
                                value={userToBoard?.username || ''}
                                onChange={(e) => setUserToBoard({ id: null, username: e.target.value })}
                                type="text"
                                placeholder="Enter username"
                                required
                                autocomplete="off"
                            />
                        </Form.Group>
                    </Form>
                    {filteredUsers.length > 0 && (
                        <ListGroup className="mt-2">
                            {filteredUsers.map((user) => (
                                <ListGroup.Item
                                    key={user.id}
                                    action
                                    onClick={() => {
                                        setUserToBoard({ id: user.id, username: user.username });
                                    }}
                                >
                                    {user.username}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleAddUserToBoard}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={() => handleAddUserToBoard()}
                    >
                        Add this user to Board
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '5px',
                    maxHeight: getAvailableHeight(),
                    overflowY: 'auto',
                }}
            >
                {boards?.length ? (
                    boards.map((board, index) => (
                        <BoardCard
                            key={index}
                            board={board}
                            handleDeleteBoard={handleDeleteBoard}
                            toggleModalEditBoard={toggleModalEditBoard}
                            toggleAddUserToBoard={toggleAddUserToBoard}
                            setBoardToEditId={setBoardToEditId}
                            setBoardToAddUserId={setBoardToAddUserId}
                            setBoardName={setBoardName}
                            setUserToBoard={setUserToBoard}
                            // users={users}
                        />
                    ))
                ) : (
                    <p>Brak boards</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;