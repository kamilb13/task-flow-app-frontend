import React from 'react';
import {Button} from "react-bootstrap";

const AddUser= ({toggleAddUserToBoard, setBoardToAddUserId, itemId}) => {
    return (
        <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                toggleAddUserToBoard();
                setBoardToAddUserId(itemId);
            }}
            style={{margin: '5px'}}
        >
            Add user to board
        </Button>
    )
}

export default AddUser;