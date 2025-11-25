# Abhyaasi API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 1. User & Authentication Endpoints (`/users`)

### Register User
- **POST** `/users/register`
- **Body:** `{ name, email, password, role? }`
- **Returns:** User object and auth token
- **Auth:** No

### Login User
- **POST** `/users/login`
- **Body:** `{ email, password }`
- **Returns:** User object and auth token
- **Auth:** No

### Google OAuth Login
- **POST** `/users/register_or_login_via_oauth`
- **Body:** `{ name, email }`
- **Returns:** User object and auth token
- **Auth:** No

### Forgot Password - Send OTP
- **POST** `/users/forgot_password_send_otp`
- **Body:** `{ email }`
- **Returns:** Success message with OTP sent
- **Auth:** No

### Forgot Password - Verify OTP
- **POST** `/users/forgot_password_verify_otp`
- **Body:** `{ email, otp }`
- **Returns:** Token for password reset
- **Auth:** No

### Reset Password
- **POST** `/users/reset_password`
- **Body:** `{ newPassword, confirmPassword }`
- **Returns:** Success message
- **Auth:** Yes

### Get User Profile
- **GET** `/users/profile`
- **Returns:** User profile details
- **Auth:** Yes

### Update User Profile
- **PUT** `/users/profile`
- **Body:** `{ name, email, ... }`
- **Returns:** Updated user object
- **Auth:** Yes

### Add or Update Profile
- **PUT** `/users/add_OR_update_profile`
- **Body:** Profile data
- **Returns:** Updated profile
- **Auth:** Yes

### Get Current User
- **GET** `/users/get_user`
- **Returns:** Current user object
- **Auth:** Yes

### Get All Users
- **GET** `/users/get_all_users`
- **Returns:** Array of all users
- **Auth:** Yes (Admin only)

### Track User Activity
- **PUT** `/users/track_user_activity`
- **Body:** `{ action, timestamp, ... }`
- **Returns:** Activity tracked
- **Auth:** Yes

### Upload Image
- **POST** `/users/upload-image`
- **Form:** FormData with image file
- **Returns:** `{ url: cloudinary_image_url }`
- **Auth:** No

---

## 2. Course Endpoints (`/courses`)

### Get All Courses
- **GET** `/courses/get_all`
- **Returns:** Array of all published courses
- **Auth:** Yes

### Get Course by ID
- **GET** `/courses/{courseId}`
- **Returns:** Course object with details
- **Auth:** Yes

### Get Course by Slug
- **GET** `/courses/slug/{slug}`
- **Returns:** Course object
- **Auth:** Yes

### Enroll in Course
- **POST** `/courses/enroll/{courseId}`
- **Returns:** Enrollment confirmation
- **Auth:** Yes

### Unenroll from Course
- **POST** `/courses/unenroll`
- **Body:** `{ courseId }`
- **Returns:** Unenrollment confirmation
- **Auth:** Yes

### Create Course (Admin)
- **POST** `/courses/create`
- **Body:** Course data
- **Returns:** Created course object
- **Auth:** Yes (Admin only)

### Update Course (Admin)
- **PUT** `/courses/update/{courseId}`
- **Body:** Course data
- **Returns:** Updated course object
- **Auth:** Yes (Admin only)

### Toggle Course Visibility (Admin)
- **PUT** `/courses/{courseId}`
- **Returns:** Updated course with visibility toggled
- **Auth:** Yes (Admin only)

### Delete Course (Admin)
- **DELETE** `/courses/delete/{courseId}`
- **Returns:** Success message
- **Auth:** Yes (Admin only)

---

## 3. Module Endpoints (`/modules`)

### Get Module
- **GET** `/modules/get/{moduleId}`
- **Returns:** Module details with content
- **Auth:** Yes

### Get My Modules
- **GET** `/modules/get_my_module`
- **Returns:** Array of user's enrolled modules
- **Auth:** Yes

### Submit MCQ
- **POST** `/modules/submit-mcq/{moduleId}`
- **Body:** `{ answers: [...], timeTaken }`
- **Returns:** MCQ result with score
- **Auth:** Yes

### Submit Code
- **POST** `/modules/submit-code/{moduleId}`
- **Body:** `{ code, language, testCases? }`
- **Returns:** Execution result with score
- **Auth:** Yes

### Create Module (Admin)
- **POST** `/modules/create`
- **Body:** Module data
- **Returns:** Created module object
- **Auth:** Yes (Admin only)

### Edit Module (Admin)
- **PUT** `/modules/edit/{moduleId}`
- **Body:** Module data
- **Returns:** Updated module object
- **Auth:** Yes (Admin only)

### Remove Module (Admin)
- **DELETE** `/modules/remove/{moduleId}`
- **Returns:** Success message
- **Auth:** Yes (Admin only)

---

## 4. Profession Endpoints (`/professions`)

### Get Profession
- **GET** `/professions/get/{professionId}`
- **Returns:** Profession details
- **Auth:** Yes

### Enroll in Profession
- **POST** `/professions/enroll/{professionId}`
- **Returns:** Enrollment confirmation
- **Auth:** Yes

### Unenroll from Profession
- **POST** `/professions/unenroll/{professionId}`
- **Returns:** Unenrollment confirmation
- **Auth:** Yes

### Create Profession (Admin)
- **POST** `/professions/create`
- **Body:** Profession data
- **Returns:** Created profession object
- **Auth:** Yes (Admin only)

### Assign Courses to Profession (Admin)
- **POST** `/professions/assign_courses/{professionId}`
- **Body:** `{ courseIds: [...] }`
- **Returns:** Updated profession
- **Auth:** Yes (Admin only)

### Toggle Profession Visibility (Admin)
- **PUT** `/professions/{professionId}`
- **Returns:** Updated profession
- **Auth:** Yes (Admin only)

---

## 5. Progress Endpoints (`/progress`)

### Get Overall Progress
- **GET** `/progress/`
- **Returns:** User's overall progress report
- **Auth:** Yes

### Get Course Progress
- **GET** `/progress/{courseId}`
- **Returns:** User's progress for specific course
- **Auth:** Yes

---

## 6. Leaderboard Endpoints (`/leaderboard`)

### Get Leaderboard
- **GET** `/leaderboard/`
- **Returns:** Global leaderboard with user rankings
- **Auth:** Yes

---

## 7. AI Chat Endpoints (`/AI`)

### Send Message
- **POST** `/AI/chat`
- **Body:** `{ message }`
- **Returns:** AI response
- **Auth:** Yes

### Send Voice Chat
- **POST** `/AI/voice-chat`
- **Body:** Voice data (audio file or format specific)
- **Returns:** AI voice response
- **Auth:** Yes

### Chat with Related Platform
- **POST** `/AI/chat-related-platform`
- **Body:** `{ message }`
- **Returns:** Response with platform-related info
- **Auth:** Yes

---

## Error Responses

All endpoints return standard error format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // validation errors if applicable
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## API Service Usage (Client)

Import from centralized service:
```javascript
import {
  loginUser,
  registerUser,
  getAllCourses,
  enrollInCourse,
  submitMCQ,
  getLeaderboard,
  sendMessage
} from '@/api_services';

// Example usage
try {
  const courses = await getAllCourses();
  console.log(courses);
} catch (error) {
  console.error(error);
}
```

---

## Environment Variables

Required in `.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

---

**Last Updated:** November 24, 2025
