import React, {useEffect, useState} from 'react';
import DeleteButton from "../DeleteButton/DeleteButton.tsx";
import EditButton from "../EditButton/EditButton.tsx";
import {useNavigate} from "react-router-dom";
import {FaCalendarAlt} from 'react-icons/fa';
import AddUser from "../AddUser/AddUser.tsx";
import {forEach} from "react-bootstrap/ElementChildren";

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

    useEffect(() => {
        //console.log(board)  ;
        //const boardCreatorId = board.boardCreatorId;
        const user = board.users.find(user => user.id === board.boardCreatorId);
        console.log(user);
    }, []);

    return (
        <div
            key={board.id}
            style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                backgroundColor: '#ffffff',
                textAlign: 'left',
                margin: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.3s',
                maxWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '300px',
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
            }}
        >
            <h5
                style={{
                    margin: '10px 0',
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                {board.name}
            </h5>
            <div style={{marginBottom: '20px'}}>
                <p style={{margin: '10px 0', fontSize: '14px', color: '#555', lineHeight: '1.6'}}>
                    <strong>Creator username:</strong> {boardCreator.username}<br/>
                    <strong>
                        <FaCalendarAlt style={{marginRight: '5px'}}/> Data utworzenia:
                    </strong>
                    {board.createdAt ? (
                        <span>{new Date(board.createdAt).toLocaleString()}</span>
                    ) : (
                        <span>Brak</span>
                    )} <br/>
                    <strong>
                        <FaCalendarAlt style={{marginRight: '5px'}}/> Przewidywana data zakończenia:
                    </strong>{' '}
                    {board.estimatedEndDate ? (
                        <span>{new Date(board.estimatedEndDate).toLocaleString()}</span>
                    ) : (
                        <span style={{color: '#ff6347'}}>Brak</span>
                    )}
                    <strong>
                        Użytkownicy tablicy:
                        {board.users.map((user) => {
                            return (
                                <p key={user.id}>{user.username}</p>
                            );
                        })}
                    </strong>
                </p>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <DeleteButton onClick={handleDeleteBoard} itemId={board.id}/>
                <EditButton
                    toggleModalEditItem={toggleModalEditBoard}
                    setItemToEditId={setBoardToEditId}
                    setItemName={setBoardName}
                    setItemDescription={() => {
                    }}
                    itemId={board.id}
                    itemName={board.name}
                    itemDescription={""}
                />
                <AddUser
                    toggleAddUserToBoard={toggleAddUserToBoard}
                    setBoardToAddUserId={setBoardToAddUserId}
                    itemId={board.id}
                />
            </div>
        </div>
    )
}

export default BoardCard;