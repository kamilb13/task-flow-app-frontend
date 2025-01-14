import React, {useState} from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarPage = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
        <Calendar onChange={onChange} value={value} />

    )
}

export default CalendarPage;