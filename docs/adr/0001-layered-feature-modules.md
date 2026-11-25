# ADR 0001: Layered feature modules

- **Status:** Accepted

## Context

As the API grows, placing routing, HTTP handling, business rules, and persistence in the same modules makes changes harder to reason about and test. The project needs a consistent way to organize server-side features and separate those responsibilities.

## Decision

Organize server code into feature modules. Each feature follows this dependency flow:

```text
route → controller → service → repository
```

- **Route** declares the feature's HTTP endpoints and connects them to controllers.
- **Controller** handles HTTP concerns, such as reading validated input and producing responses.
- **Service** implements the feature's application and business rules.
- **Repository** owns persistence and data-access operations.

Dependencies flow inward from routes toward repositories. Business rules belong in services rather than route definitions or controllers.

## Consequences

- A feature has more files and folders than a single-file implementation.
- Each layer has a clearer responsibility and can be changed independently.
- Services and repositories can be tested without exercising the full HTTP stack.
- The additional structure has some overhead for very small features, but provides a consistent pattern as the application grows.
