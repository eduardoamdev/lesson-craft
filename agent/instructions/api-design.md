# API Design Principles

To ensure a clean and maintainable codebase, all API route handlers (controllers) should follow these architecture guidelines:

## Separation of Concerns

1. **Route Handlers (Controllers)**:
   - Should focus solely on handling HTTP concerns: parsing request body/form data, validating basic input, and sending appropriate JSON responses.
   - Should never contain complex business logic, direct database access, or interactions with third-party services.
   - Should delegate all operational tasks to a dedicated service.

2. **Services**:
   - Encapsulate the core business logic, data transformations, and external API calls.
   - Provide a clean interface for controllers to consume.
   - Should be located in `src/services/[feature]/`.

## Implementation Example

When creating a new route like `src/app/api/feature/route.ts`, avoid writing logic directly in the `POST` or `GET` function. Instead, create `src/services/feature/feature.service.ts` and call it from the route handler.

This pattern improves testability and allows logic to be reused across different parts of the application if needed.
