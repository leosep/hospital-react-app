import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    id: id ? parseInt(id, 10) : 0,
    name: '',
    address: '',
    phoneNumber: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7229/api/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCancel = async () => {
    navigate(`/patients`);
  };

  const handleLogout = () => {
    // Remove the JWT token from localStorage on logout
    localStorage.removeItem('token');
    // Redirect to the login page     
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);

    const token = localStorage.getItem('token');

    try {
      if (formData.id === 0) {
        // Create new patient
        await axios.post('https://localhost:7229/api/patients', formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // Update existing patient
        await axios.put(`https://localhost:7229/api/patients/${formData.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }

      setFormData(initialFormData);
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
    }

    setSaving(false);
  };

  return (
    <div>
      <h1>Patient</h1>
      <Button onClick={handleLogout}>Logout</Button>
      <form onSubmit={handleSubmit}>
        <Box marginBottom={2}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />
        </Box>

        <Box marginBottom={2}>
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            value={formData.address}
            onChange={handleChange}
            error={!!formErrors.address}
            helperText={formErrors.address}
            required
          />
        </Box>

        <Box marginBottom={2}>
          <InputMask
            mask="(999) 999-9999"
            value={formData.phoneNumber}
            onChange={(e) => handleChange({ target: { name: 'phoneNumber', value: e.target.value } })}
            required
          >
            {() => (
              <TextField
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                fullWidth
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
              />
            )}
          </InputMask>
        </Box>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Save'}
        </Button>
        <Button variant="contained" onClick={() => handleCancel()}>Cancel</Button>
      </form>

    </div>
  );
};

export default PatientForm;