# API Service Documentation

## Overview

The `apiService.js` provides a centralized axios instance for all API calls across the client application. It uses the `VITE_API_BASE_URL` environment variable for the base URL and includes automatic token management, request/response interceptors, and error handling.

## Configuration

### Environment Variables

Make sure your `.env` file contains:
```
VITE_API_BASE_URL=http://localhost:5000
```

**Note:** This project uses Vite, so environment variables must be prefixed with `VITE_` instead of `REACT_APP_`.

## Usage Examples

### Basic HTTP Methods

```javascript
import apiService from '../services/apiService';

// GET request
const response = await apiService.get('/api/users');

// POST request
const response = await apiService.post('/api/users', { name: 'John', email: 'john@example.com' });

// PUT request
const response = await apiService.put('/api/users/1', { name: 'John Updated' });

// DELETE request
const response = await apiService.delete('/api/users/1');
```

### Authentication Endpoints

```javascript
// Login
const loginResult = await apiService.auth.login({ email: 'user@example.com', password: 'password' });

// Register
const registerResult = await apiService.auth.register({ 
  name: 'John Doe', 
  email: 'john@example.com', 
  password: 'password' 
});

// Get user profile
const profile = await apiService.auth.profile();

// Refresh token
const refreshResult = await apiService.auth.refresh(refreshToken);
```

### Resume Endpoints

```javascript
// Get all resumes
const resumes = await apiService.resumes.getAll();

// Get specific resume
const resume = await apiService.resumes.getById(resumeId);

// Create new resume
const newResume = await apiService.resumes.create(resumeData);

// Update resume
const updatedResume = await apiService.resumes.update(resumeId, resumeData);

// Delete resume
await apiService.resumes.delete(resumeId);
```

### AI Enhancement

```javascript
// Enhance resume content
const enhanced = await apiService.ai.enhance('full_resume', resumeContent);
```

## Features

### Automatic Token Management
- Automatically adds JWT tokens to requests
- Handles token refresh on 401 errors
- Clears tokens on authentication failure

### Request/Response Interceptors
- Adds authentication headers automatically
- Handles common error responses
- Provides consistent error formatting

### Error Handling
- Axios errors are properly caught and formatted
- Network errors are handled gracefully
- Authentication errors trigger automatic token refresh

### Utility Methods

```javascript
// Set authentication token
apiService.setAuthToken(token);

// Clear authentication
apiService.clearAuth();

// Get base URL
const baseUrl = apiService.getBaseURL();
```

## Migration from Fetch

### Before (using fetch)
```javascript
const response = await fetch('http://localhost:5000/api/enhance', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ section: 'full_resume', data: content })
});

const result = await response.json();
```

### After (using apiService)
```javascript
const response = await apiService.ai.enhance('full_resume', content);
const result = response.data;
```

## Benefits

1. **Centralized Configuration**: All API settings in one place
2. **Environment-based URLs**: Uses `VITE_API_BASE_URL` for different environments
3. **Automatic Authentication**: Handles tokens automatically
4. **Error Handling**: Consistent error handling across the app
5. **Type Safety**: Structured endpoints with clear method signatures
6. **Interceptors**: Request/response transformation and logging
7. **Token Refresh**: Automatic token refresh on expiration

## Best Practices

1. Always use the centralized `apiService` instead of direct fetch calls
2. Handle errors using try-catch blocks
3. Use the structured endpoint methods (e.g., `apiService.auth.login()`) instead of generic HTTP methods when available
4. Check response data structure in your components
5. Use environment variables for different API URLs (development, staging, production)
6. Remember to use `VITE_` prefix for environment variables in Vite projects