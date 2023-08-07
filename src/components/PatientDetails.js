import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatient();
    }, []);

    const fetchPatient = async () => {
        try {
            // Get the JWT token 
            const token = localStorage.getItem('token');

            // Set the Authorization header
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`https://localhost:7229/api/patients/${id}`, config);
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    };

    const handleLogout = () => {
        // Remove the JWT token from localStorage on logout
        localStorage.removeItem('token');
        // Redirect to the login page     
        navigate('/');
    };

    return (
        <div>
            {patient ? (
                <>
                    <h2>Patient Details</h2>
                    <Button onClick={handleLogout}>Logout</Button>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Address:</strong> {patient.address}</p>
                    <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                    <Button component={Link} to="/patients" variant="outlined" color="primary">
                        Back to List
                    </Button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PatientDetails;
