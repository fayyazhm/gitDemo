import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@mui/material';

const FileUpload_1 = () => {
    const [file, setFile] = useState(null);
    const [skills, setSkills] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state



    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true); // Set loading to true before the request
        try {
            const response = await axios.post('http://localhost:8000/upload/jd', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setSkills(response.data.skills);
        } catch (error) {
            setMessage('Error uploading file');
        }
        finally {
            setLoading(false); // Set loading to false after the request
        }
    };

    // useEffect(() => {
    //     if (message) {
    //         console.log("message: ", message);
    //     }
    //     if (skills) {
    //         console.log("skills: ", skills);
    //     }
    // }, [message, skills]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {message && <p>{message}</p>}
            {skills && (
                <div>
                    <h2>Extracted Skills:</h2>
                    <ul>
                        {skills.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                    <h2>Job Description:</h2>
                    <p>{skills.job_description}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload_1;
