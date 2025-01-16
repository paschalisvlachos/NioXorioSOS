import axios from 'axios';

const API = axios.create({
    // baseURL: 'http://192.168.86.78:5001/api',
    baseURL: 'https://nioxoriosos.duckdns.org/api',
    timeout: 10000, // Request timeout (10 seconds)
});

export const saveUser = async (userData: any) => {
    try {
        console.log('Sending data:', userData); // Log the request payload
        const response = await API.post('/users', userData);
        console.log('Response:', response.data); // Log the response
        return response.data;
    } catch (error) {
        // Log the error details
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:');
            console.error(`Status Code: ${error.response?.status}`); // Log status code
            console.error('Response Data:', error.response?.data); // Log response data
            console.error('Headers:', error.response?.headers); // Log headers
            console.error('Error Message:', error.message); // Log error message
        } else {
            // Handle non-Axios errors
            console.error('Non-Axios Error:', error);
        }
        
        // Rethrow the error to propagate it to the caller
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await API.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const approveUser = async (userId: string) => {
    try {
        const response = await API.patch(`/users/${userId}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving user:', error);
        throw error;
    }
};
