import User from '../../backend/models/User.js';
import { successResponse, errorResponse, asyncHandler } from '../../backend/utils/helpers.js';

// In-memory storage for demo purposes
let users = [
  new User('1', 'User-1', 'user1@example.com', new Date('2023-01-15')), // Old member with 2 projects
  new User('2', 'User-2', 'user2@example.com', new Date('2023-02-20')) // Project owner with similar access
];

// Track user's projects and participations
const userProjects = {
  '1': {
    ownedProjects: [
      {
        id: 'p1',
        title: 'AI Image Recognition App',
        description: 'An application that uses machine learning to identify objects in images',
        stage: 'Beta Testing',
        industry: 'Technology',
        createdAt: '2023-05-20'
      },
      {
        id: 'p2',
        title: 'Smart Home IoT System',
        description: 'A comprehensive IoT system for home automation and energy efficiency',
        stage: 'MVP Development',
        industry: 'IoT',
        createdAt: '2023-09-15'
      }
    ],
    participatingProjects: [
      {
        id: 'p3',
        title: 'Healthcare Monitoring Platform',
        description: 'A platform for remote patient monitoring and health data analysis',
        stage: 'Market Ready',
        industry: 'Healthcare',
        createdAt: '2023-11-10'
      }
    ]
  },
  '2': {
    ownedProjects: [
      {
        id: 'p2',
        title: 'Smart Home IoT System',
        description: 'A comprehensive IoT system for home automation and energy efficiency',
        stage: 'MVP Development',
        industry: 'IoT',
        createdAt: '2023-09-15',
        originalOwner: 'User-1',
        transferredAt: '2024-01-10'
      }
    ],
    participatingProjects: [
      {
        id: 'p1',
        title: 'AI Image Recognition App',
        description: 'An application that uses machine learning to identify objects in images',
        stage: 'Beta Testing',
        industry: 'Technology',
        createdAt: '2023-05-20'
      }
    ]
  }
};

const userController = {
  // Get all users
  getAllUsers: asyncHandler(async (req, res) => {
    const response = successResponse(users, 'Users retrieved successfully');
    res.json(response);
  }),

  // Get user by ID
  getUserById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const response = successResponse(user, 'User retrieved successfully');
    res.json(response);
  }),

  // Get user projects
  getUserProjects: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const projects = userProjects[id] || { ownedProjects: [], participatingProjects: [] };
    const response = successResponse(projects, 'User projects retrieved successfully');
    res.json(response);
  }),

  // Create new user
  createUser: asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // Validate user data
    const validation = User.validate({ name, email });
    if (!validation.isValid) {
      return res.status(400).json(
        errorResponse(validation.errors.join(', '), 'VALIDATION_ERROR')
      );
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json(
        errorResponse('Email already exists', 'EMAIL_EXISTS')
      );
    }

    // Create new user
    const newUser = User.create({ name, email });
    users.push(newUser);

    // Initialize empty projects for the new user
    userProjects[newUser.id] = {
      ownedProjects: [],
      participatingProjects: []
    };

    const response = successResponse(newUser, 'User created successfully');
    res.status(201).json(response);
  }),

  // Update user
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Validate updated data
    const validation = User.validate({ name, email });
    if (!validation.isValid) {
      return res.status(400).json(
        errorResponse(validation.errors.join(', '), 'VALIDATION_ERROR')
      );
    }

    // Check if email is taken by another user
    const emailExists = users.find(u => u.email === email && u.id !== id);
    if (emailExists) {
      return res.status(409).json(
        errorResponse('Email already exists', 'EMAIL_EXISTS')
      );
    }

    // Update user
    users[userIndex].update({ name, email });

    const response = successResponse(users[userIndex], 'User updated successfully');
    res.json(response);
  }),

  // Get user profile
  getUserProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const response = successResponse(user, 'User profile retrieved successfully');
    res.json(response);
  }),

  // Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const profileData = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Update user profile with new data
    users[userIndex].update(profileData);

    const response = successResponse(users[userIndex], 'Profile updated successfully');
    res.json(response);
  }),

  // Delete user
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Remove user from array
    const deletedUser = users.splice(userIndex, 1)[0];

    // Remove user projects
    delete userProjects[id];

    const response = successResponse(deletedUser, 'User deleted successfully');
    res.json(response);
  })
};

export default userController;