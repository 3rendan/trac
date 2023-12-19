import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProgramsContext = createContext();

export const ProgramsProvider = ({ children }) => {
    const [ programs, setPrograms ] = useState([]);
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        
        fetchPrograms();
    }, []);
    
    const fetchPrograms = async () => {
        try {
            const response = await axios.get('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/prod/programs');
            const json = response
            const jsonArr = Array.from(json)
            const transformedPrograms = jsonArr.map(item => {
                const itemPrograms = {};
                item.entryprograms.forEach(entry => {
                    if (entry["@name"] === "Title") {
                        itemPrograms.title = entry.text["0"];
                    } else if (entry["@name"] === "IDNumber") {
                        itemPrograms.id = entry.number["0"];
                    }
                });
                return itemPrograms;
            });

            setPrograms(transformedPrograms);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching programs:', error);
            setLoading(false)
        }
    };
    return (
        <ProgramsContext.Provider value={programs, loading}>
            {children}
        </ProgramsContext.Provider>
    );
};
