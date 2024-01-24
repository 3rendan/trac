import React from 'react';
import Form from 'react-bootstrap/Form';

const ProgramInput = ({ programs, onProgramSelect }) => {

  const handleSelect = (e) => {
    const selectedProgram = programs.find(program => program.title === e.target.value)
    if(selectedProgram) {
      onProgramSelect(selectedProgram)
    } else {
      console.log('Program not found:', e.target.value); // Log if the program isn't found
    }  
  }

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
