# Contributing to Jobs Europa

Thank you for your interest in contributing to Jobs Europa! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together to improve the project
- **Be professional**: Maintain a professional tone in all communications

---

## Getting Started

### Prerequisites

- **Node.js 18.20.4** (exact version for consistency)
- **MongoDB 5+** (local or MongoDB Atlas)
- **Git**
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/jobs-europa.git
   cd jobs-europa
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/jobs-europa.git
   ```

4. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

5. **Set up environment variables**
   
   Create `.env` in project root:
   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_APP_NAME=Jobs Europa
   VITE_APP_VERSION=1.0.0
   ```

   Create `backend/.env`:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/jobs-europa
   JWT_SECRET=your-dev-jwt-secret-min-32-characters
   SESSION_SECRET=your-dev-session-secret-min-32-characters
   CORS_ORIGIN=http://localhost:5173
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend && npm run dev
   ```

7. **Verify setup**
   - Frontend: http://localhost:5173
   - Backend Health: http://localhost:5001/api/health

---

## Development Workflow

### 1. Stay Synced

Before starting work, sync with upstream:

```bash
git checkout main
git pull upstream main
git push origin main
```

### 2. Create a Feature Branch

Use descriptive branch names:

```bash
# Feature branches
git checkout -b feature/add-job-filters
git checkout -b feature/employer-dashboard

# Bug fix branches
git checkout -b fix/login-error-handling
git checkout -b fix/cv-upload-validation

# Refactor branches
git checkout -b refactor/auth-service
git checkout -b refactor/simplify-job-card

# Documentation branches
git checkout -b docs/api-documentation
git checkout -b docs/update-readme
```

### 3. Make Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add comments for complex logic
- Keep commits small and focused

### 4. Test Your Changes

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Manual testing
# - Test the feature/fix thoroughly
# - Test edge cases
# - Test on different screen sizes
```

### 5. Commit Your Changes

See [Commit Guidelines](#commit-guidelines) below.

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript/JavaScript

**Style Guidelines:**

- Use TypeScript for all new code
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await over promises chains
- Use template literals for string interpolation

**Good:**
```typescript
const getUserProfile = async (userId: string): Promise<User> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  return user;
};
```

**Bad:**
```typescript
function getUserProfile(userId) {
  return User.findById(userId).then(user => {
    if (!user) throw new Error("User not found");
    return user;
  });
}
```

### React Components

**Functional Components:**

```typescript
// Good: Functional component with TypeScript
interface Props {
  title: string;
  onClose: () => void;
}

export default function Modal({ title, onClose }: Props) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Hooks Rules:**

- Always declare hooks at top level
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations
- Extract custom hooks for reusable logic

### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Code Organization

```typescript
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../utils/helpers';

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Component
export default function Component({ userId }: Props) {
  // a. Hooks
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // b. Effects
  useEffect(() => {
    // ...
  }, []);

  // c. Event handlers
  const handleSubmit = async () => {
    // ...
  };

  // d. Render
  return <div>...</div>;
}
```

### Backend Code

**Controller Pattern:**

```javascript
export const createJob = asyncHandler(async (req, res) => {
  // 1. Validate input
  const { title, description } = req.body;
  if (!title || !description) {
    return sendError(res, "Title and description required", 400);
  }

  // 2. Business logic
  const job = await Job.create({
    title,
    description,
    employer: req.user._id
  });

  // 3. Response
  sendSuccess(res, { job }, "Job created successfully");
});
```

### Error Handling

**Frontend:**

```typescript
try {
  const response = await api.post('/jobs', jobData);
  showSuccess('Job posted successfully');
} catch (error) {
  const message = error.response?.data?.error?.message || 'Failed to post job';
  showError(message);
}
```

**Backend:**

```javascript
// Use asyncHandler wrapper for all async routes
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return sendError(res, "Job not found", 404);
  }
  
  sendSuccess(res, { job });
});
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functional change)
- `perf`: Performance improvement
- `style`: Code style changes (formatting, no logic change)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, build, etc.)
- `revert`: Revert a previous commit

**Examples:**

```bash
feat(jobs): add salary range filter

Add min/max salary inputs to job search filters.
Users can now filter jobs by salary range.

Closes #123

---

fix(auth): resolve token expiration edge case

Fixed issue where expired tokens weren't properly
cleared from localStorage, causing infinite redirect loop.

Fixes #456

---

refactor(cv): extract form validation to custom hook

Moved CV form validation logic to useCV FormValidation
hook for better reusability and testing.

---

docs(readme): update environment variable setup

Added comprehensive list of required and optional
environment variables with examples.
```

**Rules:**

- Use imperative mood ("add" not "added" or "adds")
- Keep subject line under 72 characters
- Capitalize subject line
- No period at end of subject
- Separate subject from body with blank line
- Reference issue numbers in footer

---

## Pull Request Process

### Before Submitting

- ✅ All tests pass (`npm run type-check`, `npm run lint`, `npm run build`)
- ✅ Code follows style guidelines
- ✅ Commits follow commit message format
- ✅ Branch is up-to-date with `main`
- ✅ No merge conflicts
- ✅ Self-review completed

### PR Title

Use same format as commit messages:

```
feat(jobs): add salary range filter
fix(auth): resolve token expiration edge case
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Tested on different browsers
- [ ] Tested on mobile

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] No new warnings
- [ ] Documentation updated (if needed)

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least 1 approval required
3. **Testing**: Reviewer tests changes locally
4. **Feedback**: Address all review comments
5. **Merge**: Squash and merge to main

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User registration (email + phone)
- [ ] User login
- [ ] Employer registration
- [ ] Employer login
- [ ] Password reset
- [ ] Email verification
- [ ] OAuth (Google) login

**Core Features:**
- [ ] CV creation/update
- [ ] Job posting
- [ ] Job search and filtering
- [ ] Job application
- [ ] Profile management

**Cross-Browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Responsive:**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

---

## Documentation

### When to Update Docs

- Adding new feature → Update README.md
- Changing API → Update ARCHITECTURE.md
- Adding env var → Update environment docs
- Making architectural decision → Create ADR

### Documentation Files

- `README.md` - Getting started, setup, overview
- `ARCHITECTURE.md` - System design, tech stack
- `CONTRIBUTING.md` - This file
- `CHANGELOG.md` - All notable changes
- `AUDIT.md` - Code quality audit
- `PLAN.md` - Implementation plans

---

## Common Tasks

### Add a New API Endpoint

1. Create controller in `backend/controllers/`
2. Add route in `backend/routes/`
3. Update frontend API service in `src/services/api.ts`
4. Add types in `src/services/api.ts`
5. Update ARCHITECTURE.md API section

### Add a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link if needed
4. Create page-specific types
5. Test protected routes if applicable

### Update Environment Variables

1. Add to `backend/config.js`
2. Document in environment variables section of README
3. Update deployment documentation
4. Add to appropriate .env.example file

---

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bug Reports**: Open an Issue with bug template
- **Feature Requests**: Open an Issue with feature template
- **Security Issues**: Email security@jobseuropa.ro (private disclosure)

---

## Recognition

Contributors who make significant contributions will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in project documentation

---

**Thank you for contributing to Jobs Europa!** 

Your contributions help make job searching and hiring easier for thousands of users across Europe.

