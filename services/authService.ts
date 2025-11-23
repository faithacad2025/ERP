
import { LoginCredentials, User, SchoolId } from '../types';
import { MOCK_ADMIN, MOCK_STAFF, TEST_CREDENTIALS } from '../constants';
import { dataService } from './dataService';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!credentials.username || !credentials.password || !credentials.schoolId) {
    throw new Error('Please fill in all fields.');
  }

  const { username, password, schoolId } = credentials;

  // 1. Check Hardcoded Test Credentials (for convenience)
  if (username === TEST_CREDENTIALS.ADMIN.username && password === TEST_CREDENTIALS.ADMIN.password) {
    return { ...MOCK_ADMIN, schoolId: schoolId as SchoolId };
  }
  
  if (username === TEST_CREDENTIALS.STAFF.username && password === TEST_CREDENTIALS.STAFF.password) {
    return { ...MOCK_STAFF, schoolId: schoolId as SchoolId };
  }

  // 2. Check "Database" (LocalStorage) for created users
  const user = dataService.findUser(username);

  if (user) {
    // Check password
    // For this mock system, if a user was created in the UI, we assume password == username (or stored)
    // In a real system, you'd hash compare.
    const storedPass = user.password || user.username; // Default password is username if not set
    
    if (password === storedPass) {
      // Ensure user belongs to the selected school (Mock logic: just update the ID)
      return {
        ...user,
        schoolId: schoolId as SchoolId
      };
    }
  }

  throw new Error('Invalid credentials. Default: admin/adminpassword or staff/staffpassword');
};
