import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, [currentPage, pageSize]);

    const fetchPatients = async () => {
        try {
            // Get the JWT token from localStorage
            const token = localStorage.getItem('token');

            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`https://localhost:7229/api/patients/${currentPage}/${pageSize}`, config);
            setPatients(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
        if (confirmDelete) {
            const token = localStorage.getItem('token');

            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                // Send DELETE
                await axios.delete(`https://localhost:7229/api/patients/${id}`, config);
                // Refresh the patients list after successful delete
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handleDetails = async (id) => {
        navigate(`/patients/${id}`);
    };

    const handleCreate = async () => {
        navigate(`/patients/create`);
    };

    const handleUpdate = async (id) => {
        navigate(`/patients/update/${id}`);
    };

    const handleLogout = () => {
        // Remove the JWT token from localStorage on logout
        localStorage.removeItem('token');
        // Redirect to the login page     
        navigate('/');
    };

    return (
        <div>
            <h1>Patients List</h1>
            <Button onClick={() => handleCreate()}>Create</Button>
            <Button onClick={handleLogout}>Logout</Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.data.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{patient.id}</TableCell>
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell>{patient.address}</TableCell>
                                        <TableCell>{patient.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDetails(patient.id)}>Details</Button>
                                            <Button onClick={() => handleDelete(patient.id)}>Delete</Button>
                                            <Button onClick={() => handleUpdate(patient.id)}>Update</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ marginTop: '20px' }}>
                        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
                            Previous Page
                        </Button>
                        <Button variant="contained" onClick={handleNextPage}>
                            Next Page
                        </Button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PatientsList;
