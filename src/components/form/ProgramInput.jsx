import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

const ProgramInput = ({ programs, onProgramSelect }) => {
  const [ id, setId ] = useState()

  const handleSelect = (e) => {
    const selectedProgram = programs.find(program => program.title === e.target.value)
    if(selectedProgram) {
      onProgramSelect(selectedProgram.title)
    }
    
  };

  return (
    <>
      <Form.Control 
        size='lg'
        type='text'
        id='programId'
        list='programList'
        placeholder='Type to search...'
        onChange={handleSelect}
        maxLength='32'
        required
      />
      <datalist id='programList'>
        {programs && programs.map((program) => (
          <option key={program.idNumber} value={program.title} />
          ))}
      </datalist>
    </>
  );
};

export default ProgramInput;
