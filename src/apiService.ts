import axios from 'axios';

const API = axios.create({
    // baseURL: 'http://192.168.86.78:5001/api',
    baseURL: 'https://neochoriosos.duckdns.org/api',
    timeout: 10000, // Request timeout (10 seconds)
});

export const saveUser = async (userData: any) => {
    try {
         console.log('Sending data:', userData); // Log the request payload
        const response = await API.post('/users', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
         console.log('Response:', response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error('Axios Error:', error); // Log the full error object
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
