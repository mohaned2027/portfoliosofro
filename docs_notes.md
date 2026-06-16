# Backend API Notes

## Source
- File: `/home/ubuntu/upload/response.pdf`
- Reviewed pages: 1-5

## Key findings so far

### Base behavior
- Base API URL format: `APP_URL/api`
- Admin-protected endpoints require `Authorization: Bearer {token}` using Laravel Sanctum.
- Standard response envelope uses:

```json
{
  "status": 200,
  "message": "...",
  "data": {}
}
```

### Important integration details
- Media fields such as `cover`, `pdf`, `avatar`, `icon`, `favicon`, `cv`, and `gallery` are expected to return absolute URLs.
- Some list endpoints are paginated; frontend should not rely only on `data`, and may need to handle pagination metadata.
- Multipart/form-data is required for file-upload endpoints.
- For updates with files, backend may expect `POST` with `_method=PUT` instead of a literal PUT multipart request.

### Endpoint map from reviewed pages

| Resource | Public endpoints | Admin endpoints |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/verify-otp`, `POST /auth/reset-password` | `DELETE /admin/auth/logout` |
| User/Profile | `GET /user/data` | `GET /admin/user`, `PUT /admin/user/update` |
| About | `GET /about` | `POST /admin/about`, `PUT /admin/about/update` |
| Settings | `GET /setting` | `GET/POST/PUT /admin/setting`, `/admin/setting/store`, `/admin/setting/update` |
| Achievements | `GET /achievement`, `GET /achievement/show/{id}` | `GET/POST/PUT/DELETE /admin/achievement/*` |
| Researches | `GET /research`, `GET /research/show/{id}` | `GET/POST/PUT/DELETE /admin/research/*` |
| Courses | `GET /course`, `GET /course/show/{id}` | `GET/POST/PUT/DELETE /admin/course/*` |
| Lectures | `GET /lecture`, `GET /lecture/show/{id}` | `GET/POST/PUT/DELETE /admin/lecture/*` |
| Experiences | `GET /experience` | `GET/POST/PUT/DELETE /admin/experience/*` |
| Positions | `GET /position` | `GET/POST/PUT/DELETE /admin/position/*` |
| Blogs | `GET /blog`, `GET /blog/show/{id}` | `GET/POST/PUT/DELETE /admin/blog/*` |
| Education | `GET /education` | `GET/POST/PUT/DELETE /admin/education/*` |
| Contact | `POST /contact-us/store` | `GET/PATCH/DELETE /admin/contact-us/*` |

### Error responses seen
- `401 Unauthenticated`
- `404 Resource not found`
- `422 The given data was invalid` with field-level errors in `data.errors`
- `500 Something went wrong`

### Authentication samples reviewed
- Login response returns `data.user` and `data.token`.
- Forgot password returns success message only.
- Verify OTP returns `data.reset_token`.
- Reset password returns success message only.
- Logout returns success message only.

### Public user data sample
- `GET /user/data` returns a singleton profile object including fields like `name`, `title`, `avatar`, `department`, `university`, `email`, `phone`, `office`, `office_hours`, `address`, `cv`, and `social_links`.

## Initial repo structure findings
- API layer is in `src/api/` with `client.js`, `endpoints.js`, `request.js`, and `mockData/`.
- Admin CRUD UI appears to be centralized through reusable components under `src/components/admin/`.
- Data flow likely involves contexts in `src/context/` and hooks like `src/hooks/useCrudOperations.js` and `src/lib/useResourceList.js`.
- Public/admin pages are split under `src/pages/` and `src/pages/admin/`.

## Next checks needed
- Inspect remaining pages of PDF to capture exact request bodies and special field names per resource.
- Inspect `src/api/endpoints.js` and `src/api/request.js` to compare with backend contract.
- Identify whether frontend currently assumes local JSON shape different from backend `data` envelope.
- Verify how auth token is stored and attached to admin requests.
- Test create/update/delete flows, especially file uploads and `_method=PUT` behavior.


## Additional findings from pages 6-10

### User admin update
- `PUT /admin/user/update`
- Body can include text fields and files:
  - text: `name`, `title`, `department`, `university`, `email`, `phone`, `office`, `office_hours`, `address`, `contact_email`
  - files: `avatar`, `cv`
  - structured field: `social_links` as object/JSON
- Success returns updated user object in `data`.

### About
- Public `GET /about` returns:
  - `data.about` object
  - top-level `count`
- Admin uses singleton routes:
  - `GET /admin/about`
  - `POST /admin/about/store`
  - `PUT /admin/about/update`
- About body fields: `bio`, `vision`, `skills[]`, `interests[]`

### Settings
- Public `GET /setting` returns:
  - `data.settings` array
  - top-level `count`
- Admin singleton routes:
  - `GET /admin/setting`
  - `POST /admin/setting/store`
  - `PUT /admin/setting/update`
- Settings body fields:
  - `doctor_name` (string)
  - `icon` (file)
  - `favicon` (file)

### Achievements
- Public and admin list endpoints share the same response shape:
  - `GET /achievement`
  - `GET /admin/achievement`
  - response appears as `data.achievements` plus `count`
- Show endpoints:
  - `GET /achievement/show/{id}`
  - `GET /admin/achievement/show/{id}`
  - response returns single object in `data`
- Create/update/delete:
  - `POST /admin/achievement/store`
  - `PUT /admin/achievement/update/{id}`
  - `DELETE /admin/achievement/delete/{id}`
- Achievement create/update fields:
  - required: `title`, `description`
  - optional: `full_description`, `cover`, `date`, `category`, `live_link`, `gallery[]`
- Important: `gallery[]` is a multi-file upload field.

### Likely frontend implications
- Public list pages may currently expect arrays directly, but backend often nests arrays under resource keys such as `data.achievements`, `data.settings`, or `data.about`.
- Admin singletons (`about`, `setting`, `user`) need special CRUD handling because they do not use normal `/show/{id}` and `/update/{id}` patterns.
- File upload forms must send multipart data and may need `_method=PUT` fallback for updates.


## Additional findings from pages 11-15

### Research
- List endpoints:
  - `GET /research`
  - `GET /admin/research`
  - response shape: `data.researches` with `count`
- Show endpoints:
  - `GET /research/show/{id}`
  - `GET /admin/research/show/{id}`
- Create/update/delete:
  - `POST /admin/research/store`
  - `PUT /admin/research/update/{id}`
  - `DELETE /admin/research/delete/{id}`
- Fields include:
  - `title` required
  - `year`, `abstract`, `authors[]`, `keywords[]`, `journal`, `conference`, `doi`, `link`
  - files: `pdf`, `cover`

### Courses
- List endpoints:
  - `GET /course`
  - `GET /admin/course`
  - response shape: `data.courses` with `count`
- Show endpoints:
  - `GET /course/show/{id}`
  - `GET /admin/course/show/{id}`
  - detail response includes nested `lectures[]`
- Create/update/delete:
  - `POST /admin/course/store`
  - `PUT /admin/course/update/{id}`
  - `DELETE /admin/course/delete/{id}`
- Fields include:
  - `title` required
  - `description` optional
  - `objectives[]` optional
  - `cover` file optional

### Lectures
- List endpoints:
  - `GET /lecture`
  - `GET /admin/lecture`
  - response shape: `data.lectures` with `count`
- Show endpoints:
  - `GET /lecture/show/{id}`
  - `GET /admin/lecture/show/{id}`
- Create/update/delete:
  - `POST /admin/lecture/store`
  - `PUT /admin/lecture/update/{id}`
  - `DELETE /admin/lecture/delete/{id}`
- Fields include:
  - `course_id` required
  - `title` required
  - `pdf` file optional
  - `video_url` optional
  - `youtube_url` optional
  - `date` optional

### Experiences
- Public/admin list endpoints:
  - `GET /experience`
  - `GET /admin/experience`
  - response shape: `data.experiences` with `count`
- No show endpoint is documented for experiences.
- Create/update/delete:
  - `POST /admin/experience/store`
  - `PUT /admin/experience/update/{id}`
  - `DELETE /admin/experience/delete/{id}`
- Fields include:
  - required: `position`, `organization`
  - optional: `from`, `to`, `description`, `responsibilities[]`

### Important frontend implications
- Some resources have no show endpoint (`experience` documented this way), so admin edit pages may need to reuse list data or skip detail fetches.
- Course detail includes nested lectures, which may affect public detail pages and admin edit prefilling.
- Array fields such as `authors[]`, `keywords[]`, `objectives[]`, and `responsibilities[]` likely need conversion between form state and FormData.


## Additional findings from pages 16-20

### Positions
- Public/admin list endpoints:
  - `GET /position`
  - `GET /admin/position`
  - response shape: `data.positions` with `count`
- No show endpoint is documented.
- Create/update/delete:
  - `POST /admin/position/store`
  - `PUT /admin/position/update/{id}`
  - `DELETE /admin/position/delete/{id}`
- Fields include:
  - required: `title`, `organization`
  - optional: `description`, `icon`
- Documentation suggests `icon` is now a simple string value, not necessarily a file upload.

### Blogs
- List endpoints:
  - `GET /blog`
  - `GET /admin/blog`
  - response shape: `data.blogs` with `count`
- Show endpoint exists only for public route in the document:
  - `GET /blog/show/{id}`
- Create/update/delete:
  - `POST /admin/blog/store`
  - `PUT /admin/blog/update/{id}`
  - `DELETE /admin/blog/delete/{id}`
- Fields include:
  - required: `title`, `content`
  - optional: `slug`, `excerpt`, `cover`, `date`

### Education
- Public/admin list endpoints:
  - `GET /education`
  - `GET /admin/education`
  - response shape: `data.education` with `count`
- No show endpoint is documented.
- Create/update/delete:
  - `POST /admin/education/store`
  - `PUT /admin/education/update/{id}`
  - `DELETE /admin/education/delete/{id}`
- Fields include:
  - required: `degree`, `school`
  - optional: `year`, `focus`

### Contact / Messages
- Public contact form submit:
  - `POST /contact-us/store`
  - fields: `name`, `email`, optional `subject`, required `message`
- Admin message endpoints:
  - `GET /admin/contact-us`
  - `PATCH /admin/contact-us/read/{id}`
  - `DELETE /admin/contact-us/delete/{id}`
- Message list response shape: `data.messages` with `count`.

### Final backend conventions confirmed
- Backend consistently wraps useful payload inside `data`, but the actual records may be:
  - a singleton object (`data` directly)
  - a keyed object (`data.about`, `data.settings`, `data.achievements`, etc.)
- Some resources are full CRUD lists, while others are singleton resources (`about`, `setting`, `user`).
- Not all resources expose `show/{id}` routes.
- Update endpoints are documented as `PUT`, but earlier notes still indicate multipart updates may need `_method=PUT` in practice for file uploads.

### Most important implementation concerns for frontend
- Request normalization layer is likely required so pages/components can consume backend data consistently despite resource-specific nesting.
- CRUD helpers must support:
  - normal JSON requests
  - multipart FormData requests
  - array/object serialization for fields like `skills[]`, `social_links`, `authors[]`, `objectives[]`, `responsibilities[]`
  - special endpoints for singletons and custom actions like message read status.

