import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProgramsContext = createContext();

export const ProgramsProvider = ({ children }) => {
    const [ programs, setPrograms ] = useState([]);

    useEffect(() => {
        
        fetchPrograms();
    }, []);
    
    const fetchPrograms = async () => {
        try {
            const response = await axios.get('https://qd9pusq3ze.execute-api.us-east-1.amazonaws.com/prod/programs');
            const json = response.data.viewentry
            const transformedPrograms = json.map(item => {
                const itemPrograms = {};
                item.entrydata.forEach(entry => {
                    if (entry["@name"] === "Title") {
                        itemPrograms.title = entry.text["0"];
                    } else if (entry["@name"] === "IDNumber") {
                        itemPrograms.id = entry.number["0"];
                    }
                });
                return itemPrograms;
            });
            setPrograms(transformedPrograms)
        } catch (error) {
            console.error('Error fetching programs:', error)
        }
    };
    return (
        <ProgramsContext.Provider value={programs}>
            {children}
        </ProgramsContext.Provider>
    );
};
