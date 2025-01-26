import React, {useEffect, useState} from 'react';
import DeleteButton from "../DeleteButton/DeleteButton.tsx";
import EditButton from "../EditButton/EditButton.tsx";
import {useNavigate} from "react-router-dom";
import {FaCalendarAlt, FaCog} from 'react-icons/fa';
import AddUser from "../AddUser/AddUser.tsx";
import {forEach} from "react-bootstrap/ElementChildren";
import {Button, Card, Dropdown} from "react-bootstrap";
import "./BoardCard.css";

interface Board {
    id: number;
    name: string;
    boardCreatorId: number;
    createdAt?: string;
    estimatedEndDate?: string;
}

interface BoardCardProps {
    board: Board;
    handleDeleteBoard: (itemId: number) => void;
    toggleModalEditBoard: () => void;
    toggleAddUserToBoard: () => void;
    setBoardToEditId: (id: number) => void;
    setBoardToAddUserId: (id: number) => void;
    setBoardName: (name: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
                                                 board,
                                                 handleDeleteBoard,
                                                 toggleModalEditBoard,
                                                 toggleAddUserToBoard,
                                                 setBoardToEditId,
                                                 setBoardToAddUserId,
                                                 setBoardName
                                             }) => {
    const navigate = useNavigate();

    const [boardCreator, setboardCreator] = useState(board.users.find(user => user.id === board.boardCreatorId));

    // useEffect(() => {
    //     //console.log(board)  ;
    //     //const boardCreatorId = board.boardCreatorId;
    //     const user = board.users.find(user => user.id === board.boardCreatorId);
    //     console.log(user);
    // }, []);

    return (
        <Card
            className="card-hover"
            style={{
                cursor: 'pointer',
                margin: '10px',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
            }}

            onClick={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    navigate('/main/tasks', {state: {boardId: board.id}});
                }, 250);
            }}

            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1.00)';
            }}>
            <Card.Header style={{fontSize: '0.75rem'}}>
                <strong>
                    <FaCalendarAlt style={{marginRight: '5px'}}/> Created at:
                </strong>
                {board.createdAt ? (
                    <span> {new Date(board.createdAt).toLocaleString()}</span>
                ) : (
                    <span>Brak</span>
                )} <br/>
                <strong>
                    <FaCalendarAlt style={{marginRight: '5px'}}/> Estimated end date:
                </strong>{' '}
                {board.estimatedEndDate ? (
                    <span>{new Date(board.estimatedEndDate).toLocaleString()}</span>
                ) : (
                    <span style={{color: '#ff6347'}}>Brak</span>
                )}
            </Card.Header>
            <Card.Body>
                <Card.Title style={{display: 'flex', justifyContent: 'space-between'}}>
                    {board.name}
                    <Dropdown
                        key={'start'}
                        drop={'start'}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <Dropdown.Toggle
                            className="gear-toggle"
                        >
                            <FaCog className="gear-icon" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleModalEditBoard();
                                    setBoardToEditId(board.id);
                                    setBoardName(board.name);
                                }}
                            >
                                Edit board
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteBoard(board.id)}>Delete board</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => {
                                e.stopPropagation();
                                toggleAddUserToBoard();
                                setBoardToAddUserId(board.id);
                            }}>Add user to board</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Title>
                <Card.Text>Creator: {boardCreator.username}</Card.Text>
                <Card.Text>
                    Users: {board.users.map((user, index) => (
                    <span key={user.id}>
                        {user.username}{index < board.users.length - 1 ? ', ' : ''}
                    </span>
                ))}
                </Card.Text>

            </Card.Body>
        </Card>
    )
}

export default BoardCard;