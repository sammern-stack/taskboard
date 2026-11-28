# API conventions

## Successful responses

Successful board responses use the envelope `{ "data": ... }`, where `data` is a board or a list of boards. A successful deletion returns `204 No Content` with an empty body instead.

## Board endpoints

| Method | Endpoint             | Success        |
| ------ | -------------------- | -------------- |
| POST   | `/api/v1/boards`     | 201 Created    |
| GET    | `/api/v1/boards`     | 200 OK         |
| GET    | `/api/v1/boards/:id` | 200 OK         |
| PATCH  | `/api/v1/boards/:id` | 200 OK         |
| DELETE | `/api/v1/boards/:id` | 204 No Content |

Invalid input returns 400 Bad Request; a valid ID for a missing board returns 404 Not Found.

## Error responses

Errors use a JSON envelope with an `error` property:

```json
{
  "error": {
    "message": "The request data is invalid",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email"
    }
  }
}
```

`message` is intended to be readable. Clients should use the stable `code` for programmatic handling rather than relying on exact message text. `details` is optional and its shape depends on the error. A `stack` property may be included outside production; clients should not depend on it.

The server currently uses these codes:

| HTTP status | Code                    | Meaning                                                        |
| ----------- | ----------------------- | -------------------------------------------------------------- |
| 400         | `VALIDATION_ERROR`      | Request data failed validation.                                |
| 400         | `INVALID_JSON`          | The request body is not valid JSON.                            |
| 401         | `UNAUTHORIZED_ERROR`    | Authentication is required or failed.                          |
| 403         | `FORBIDDEN_ERROR`       | The caller is not allowed to perform the operation.            |
| 404         | `NOT_FOUND_ERROR`       | The requested resource or route was not found.                 |
| 409         | `CONFLICT_ERROR`        | The request conflicts with the current resource state.         |
| 4xx         | `REQUEST_ERROR`         | A client error without a more specific application error code. |
| 5xx         | `INTERNAL_SERVER_ERROR` | An unexpected server error.                                    |

Application errors may include `details`. Unexpected errors use a generic message so internal error details are not exposed to clients.

## URL versioning

All versioned API endpoints use the `/api/v1` prefix. For example:

```text
/api/v1/users
```

Keep the behavior of a published version stable. Introduce a new prefix, such as `/api/v2`, when a breaking API change is needed rather than silently changing the existing version.

The health endpoint is currently exposed at `/api/health` and is not versioned. New versioned application endpoints should follow the `/api/v1` convention.

## Request IDs

The server generates a UUID for each HTTP request and returns it in the `X-Request-Id` response header. The request ID is also included in the HTTP request log, allowing a request to be correlated with its log entry.

Clients can include this ID when reporting a problem so operators can find the corresponding request log. The ID is for correlation only; it is not an authentication credential or authorization mechanism.
