# Error Handling Overview

This document summarizes the error handling and recovery paths implemented
across API interactions and user input flows in the app.

## API Interactions

- **Timeouts and network failures**: Requests abort after a timeout and return
  a clear message so users can retry.
- **Non-JSON or malformed responses**: Responses are parsed safely with
  user-facing errors if the payload is invalid.
- **HTTP error responses**: Server-provided error messages are preferred and
  surfaced to the UI when available.
- **Empty responses**: Empty payloads are treated as errors rather than
  rendering partial UI.
- **Invalid request inputs**: Calls like `fetchCurrency` validate IDs before
  issuing a request.

## User Inputs

- **Login**: Email and password are validated before submission with inline
  input errors for missing or invalid values.
- **OTP**: Input is restricted to digits only and validated for exact length
  with inline feedback.
- **Search**: Input is normalized and limited to a reasonable length to avoid
  accidental overload or malformed queries.

## Recovery UX

- **Retry actions**: Balance and currency load errors present retry buttons for
  users to recover from transient failures.
- **Auth hydration**: Auth state is loaded after mount to avoid hydration
  mismatch errors while still restoring sessions on the client.

