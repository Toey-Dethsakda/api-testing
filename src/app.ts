import express, { Request, Response } from 'express';
import axios from 'axios';

interface User {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    hair: { color: string };
    company: { department: string };
    address: { postalCode: string };
}

const app = express();
const PORT = process.env.PORT || 3000;

// function to group user data
function groupUserData(data: { users: User[] }): Record<string, any> {
    const groupedData: Record<string, any> = {};

    data.users.forEach((user) => {
        const department = user.company.department;
        const age = user.age;
        const hairColor = user.hair;
        const fullName = `${user.firstName} ${user.lastName}`;
        const postalCode = user.address.postalCode;

        // Initialize groupedData for the department if not exists
        if (!groupedData[department]) {
            groupedData[department] = {
                male: 0,
                female: 0,
                ageRange: `${age}-${age}`,
                ageMode: age,
                hair: {},
                addressUser: {},
            };
        }

        // Gender count
        user.gender === 'male' ? groupedData[department].male++ : groupedData[department].female++;

        // Age range
        const currentAgeRange = groupedData[department].ageRange.split('-').map(Number);
        if (age < currentAgeRange[0]) currentAgeRange[0] = age;
        if (age > currentAgeRange[1]) currentAgeRange[1] = age;
        groupedData[department].ageRange = `${currentAgeRange[0]}-${currentAgeRange[1]}`;

        // Calculate age mode
        const currentAgeMode = groupedData[department].ageMode;
        if (age !== currentAgeMode) {
            const ageCount = data.users.filter((u) => u.company.department === department && u.age === age).length;
            const currentAgeCount = data.users.filter((u) => u.company.department === department && u.age === currentAgeMode).length;
            if (ageCount > currentAgeCount) groupedData[department].ageMode = age;
        }

        // Hair color count
        groupedData[department].hair[hairColor.color] = (groupedData[department].hair[hairColor.color] || 0) + 1;

        // AddressUser data
        if (!groupedData[department].addressUser[fullName]) {
            groupedData[department].addressUser[fullName] = postalCode;
        }
    });

    return groupedData;
}

app.get('/users', async (req: Request, res: Response) => {
    try {
        const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
        const transformedData = groupUserData(response.data);

        res.json(transformedData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
