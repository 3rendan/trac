import React from 'react'
import Form from 'react-bootstrap/Form'

const ProgramInput = ({ programs, onProgramSelect }) => {
  const programsArr = Object.values(programs)

  const handleSelect = (e) => {
    const selectedProgram = programs.find(program => program.title === e.target.value)
    if(selectedProgram) {
      onProgramSelect(selectedProgram)
    } else {
      // console.log('Program not found:', e.target.value) // Log if the program isn't found
    }  
  }

  return (
    <Form.Group>
      <Form.Label>Program title</Form.Label>
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
        {programs && programsArr.map((program) => (
          <option key={program.idNumber} value={program.title} />
          ))}
      </datalist>
    </Form.Group>
  )
}

export default ProgramInput
