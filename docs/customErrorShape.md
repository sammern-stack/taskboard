# Custom AppError shape

```json
// Error response
{
  "error": {
    "message": "Invalid input", // a meaningful error message
    "code": "VALIDATION_ERROR", // a machine readable code string
    "details": {
      "field": "email"
    }, // Optional: extra information related to the error for easy debugging
    "stack": {...} // Only in development
  }
}
```

Example

```ts
// provide the actual relative path to shared/errors/customErrors.js
import { ValidationError } from '../shared/errors/customErrors.js';

try {
  throw new ValidationError('Invalid input', { field: 'email' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(`Validation failed: ${err.message}`);
    console.error(`Details:`, err.details);
  }
}
```
