# Commenting Standard

To ensure maintainability and high code quality, we follow a strict commenting policy:

### Summary of the Rule

- **Function-Level Comments Only**: Provide a concise description of the function's purpose, parameters, and return value at the very beginning of the function definition.
- **No Inline Comments**: Avoid adding comments that explain individual lines of code within the function body. The code should be self-documenting through clear naming and structure.

### Rationale

- **Improve Maintainability**: Function-level comments provide context without cluttering the implementation logic.
- **Keep Code Clean**: Removing line-by-line explanations avoids visual noise and reduces the risk of comments becoming outdated as the code changes.
- **Retain Essential Context**: Important architectural decisions or complex logic should still be captured at the function boundary where they are most relevant for callers and future maintainers.
