import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';

const ProgramInput = ({ programs, onProgramSelect }) => {

  const handleSelect = (e) => {
    const selectedProgram = programs.find(program => program.title === e.target.value);
    onProgramSelect(selectedProgram ? selectedProgram.id : '');
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
          <option key={program.id} value={program.title} />
          ))}
      </datalist>
    </>
  );
};

export default ProgramInput;
