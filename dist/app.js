"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Define a function to group user data
function groupUserData(data) {
    const groupedData = {};
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
        if (age < currentAgeRange[0])
            currentAgeRange[0] = age;
        if (age > currentAgeRange[1])
            currentAgeRange[1] = age;
        groupedData[department].ageRange = `${currentAgeRange[0]}-${currentAgeRange[1]}`;
        // Calculate age mode
        const currentAgeMode = groupedData[department].ageMode;
        if (age !== currentAgeMode) {
            const ageCount = data.users.filter((u) => u.company.department === department && u.age === age).length;
            const currentAgeCount = data.users.filter((u) => u.company.department === department && u.age === currentAgeMode).length;
            if (ageCount > currentAgeCount)
                groupedData[department].ageMode = age;
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
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://dummyjson.com/users');
        const transformedData = groupUserData(response.data);
        res.json(transformedData);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
