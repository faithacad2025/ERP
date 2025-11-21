import { LoginCredentials, User, SchoolId } from '../types';
import { MOCK_ADMIN, MOCK_STAFF, TEST_CREDENTIALS } from '../constants';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!credentials.username || !credentials.password || !credentials.schoolId) {
    throw new Error('Please fill in all fields.');
  }

  const { username, password, schoolId } = credentials;

  // Check Admin Credentials
  if (username === TEST_CREDENTIALS.ADMIN.username && password === TEST_CREDENTIALS.ADMIN.password) {
    return {
      ...MOCK_ADMIN,
      schoolId: schoolId as SchoolId,
    };
  }

  // Check Staff Credentials
  if (username === TEST_CREDENTIALS.STAFF.username && password === TEST_CREDENTIALS.STAFF.password) {
    return {
      ...MOCK_STAFF,
      schoolId: schoolId as SchoolId,
    };
  }

  throw new Error('Invalid credentials. Please check the Development Mode box for correct logins.');
};