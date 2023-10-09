import axios from 'axios';
import { groupUserData } from './app';

// Mock the axios.get function to simulate a successful response
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the Axios response data
const mockUserData = {
    users: [
        {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'male',
            hair: { color: 'brown' },
            company: { department: 'HR' },
            address: { postalCode: '12345' },
        },
        // Add more user data objects as needed
    ],
};

describe('groupUserData', () => {
    it('should group user data correctly', () => {
        // Mock Axios response
        mockedAxios.get.mockResolvedValue({ data: mockUserData });

        // Call the function to be tested
        const groupedData = groupUserData(mockUserData);

        // Define your expectations
        expect(groupedData).toEqual({
            HR: {
                male: 1,
                female: 0,
                ageRange: '30-30',
                ageMode: 30,
                hair: { brown: 1 },
                addressUser: { 'John Doe': '12345' },
            },
            // Add more department-specific expectations as needed
        });
    });

    // Add more test cases as needed
});
