import React, { createContext, useState, useEffect } from 'react'
const ProgramsContext = createContext()

export const ProgramsProvider =({children}) => {
    const [ programs, setPrograms ] = useState([])

    useEffect(() => {
        getPrograms()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
   
    const getPrograms = async () => {
        try {
            const res = await fetch(`/api/programs`)
            const json = await res.json()
            setPrograms(json)
        } catch (err) {
            console.error(err)
        }
    } 

    return <ProgramsContext.Provider value={{ programs }}>
        { children }
    </ProgramsContext.Provider>
}
export default ProgramsContext