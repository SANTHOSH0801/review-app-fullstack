import axios from 'axios';

async function testUserCreation() {
    try {
        const response = await axios.post(
            'http://localhost:5000/api/users',
            {
                name: 'Test User',
                email: 'testuser@example.com',
                address: '123 Test St',
                role: 'Store Owner',
                password: 'TestPass1$',
                storeName: 'Test Store Name Long Enough',
            },
            {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjY2M2Y2YwOC1hNTU5LTQxMGYtOGRhZC0xMWY5ZWNjMjlmOWIiLCJyb2xlIjoiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJpYXQiOjE3NTA2OTQ5MTcsImV4cCI6MTc1MDY5ODUxN30.5yibUyB1kAoRDm1f12_hXzJ-JKZRWAimptsD1qN2JgY',
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('User creation response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testUserCreation();
