import React from 'react';
import {Button} from "react-bootstrap";

const EditButton = ({toggleModalEditBoard, setBoardToEditId, setBoardName, boardId, boardName}) => {
    return (
        <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                toggleModalEditBoard();
                setBoardToEditId(boardId);
                setBoardName(boardName);
            }}
            style={{margin: '5px'}}
        >
            Edit board
        </Button>
    )
}

export default EditButton;