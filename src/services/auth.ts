import { User } from '../types/expense';

interface LoginResponse {
  user: User;
  token: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'manager';
}

// Mock users for demo - in production this would be a real database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'employee',
    department: 'Sales',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'manager',
    department: 'Sales',
    password: 'password123'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@company.com',
    role: 'employee',
    department: 'Marketing',
    password: 'password123'
  }
];

class AuthService {
  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: this.generateToken()
    };
  }

  async signup(name: string, email: string, password: string, role: 'employee' | 'manager'): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      department: role === 'manager' ? 'Management' : 'General',
      password
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token: this.generateToken()
    };
  }

  async getCurrentUser(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token');
    }

    // In a real app, you'd validate the token with your backend
    // For demo, we'll return the first manager user
    const { password: _, ...user } = mockUsers[1];
    return user;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();