# Auth Service & API Client Logic

## API Client (`src/services/apiClient.ts`)

### Configuration
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

### Key Features

#### 1. Authentication Headers
```typescript
private getHeaders(includeAuth: boolean = true): HeadersInit
```
- Automatically adds `Authorization: Bearer {token}` header when `includeAuth` is true
- Token is retrieved from `localStorage.getItem('token')`

#### 2. Error Handling
```typescript
private async handleResponse<T>(response: Response): Promise<T>
```
- Custom `ApiError` class with status, response, and statusText
- Handles 401 Unauthorized by clearing auth data from localStorage
- Parses JSON error responses or uses raw text as fallback

#### 3. HTTP Methods
- `get<T>(endpoint, includeAuth?)`
- `post<T>(endpoint, data?, includeAuth?)`
- `put<T>(endpoint, data?, includeAuth?)`
- `delete<T>(endpoint, includeAuth?)`
- `patch<T>(endpoint, data?, includeAuth?)`

#### 4. Health Check
```typescript
async healthCheck(): Promise<{ status: string; timestamp: string }>
```
- GET request to `/health` endpoint
- No authentication required

---

## Auth Service (`src/services/authService.ts`)

### Login
```typescript
async login(credentials: LoginRequest): Promise<LoginResponse>
```
- **Endpoint**: `POST /api/auth/login`
- **Auth**: `false` (no token required for login)
- **Response Format**: `{ success: boolean; data: LoginResponse; message: string }`
- **Side Effects**:
  - Stores token in `localStorage.setItem('token', token)`
  - Stores user in `localStorage.setItem('user', JSON.stringify(user))`

### Logout
```typescript
async logout(): Promise<LogoutResponse>
```
- **Endpoint**: `POST /api/auth/logout`
- **Auth**: `false`
- **Side Effects**:
  - Removes token from localStorage
  - Removes user from localStorage

### Get Profile
```typescript
async getProfile(userId: number, role: 'student' | 'instructor'): Promise<Profile>
```
- **Endpoint**: `GET /api/auth/profile?user_id={userId}&role={role}`
- **Auth**: `true` (requires token)
- **Response Format**: `{ success: boolean; data: Profile; message: string }`

### Helper Methods

#### getStoredUser()
```typescript
getStoredUser(): User | null
```
- Retrieves and parses user from localStorage
- Returns `null` if parsing fails or no user exists

#### getToken()
```typescript
getToken(): string | null
```
- Returns token from localStorage

#### isAuthenticated()
```typescript
isAuthenticated(): boolean
```
- Returns `true` if token exists in localStorage

#### clearAuth()
```typescript
clearAuth(): void
```
- Removes both token and user from localStorage

---

## Usage Example

```typescript
import { authService } from './services/authService';

// Login
const loginData = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.getStoredUser();
  const token = authService.getToken();
}

// Get profile
const profile = await authService.getProfile(user.id, 'student');

// Logout
await authService.logout();
```

---

## Type Definitions

### LoginRequest
```typescript
{
  email: string;
  password: string;
}
```

### LoginResponse
```typescript
{
  token: string;
  user: User;
}
```

### User
```typescript
{
  id: number;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
}
```

### Profile
```typescript
{
  id: number;
  email: string;
  name: string;
  role: string;
  // Additional profile fields
}
```
