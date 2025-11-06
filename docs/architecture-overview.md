# Architecture Overview

This document provides a high-level view of the project structure.

## Monorepo Layout
- `backend/`: Node.js (ES Modules) API server, routes, controllers, models, and utilities.
- `frontend/`: React (Vite + Tailwind) single-page application.

## Backend
- Entry: `backend/server.mjs` and `backend/app.mjs`.
- Config: `backend/config/` for database and third-party services.
- Routes: `backend/routes/` define API endpoints mapping to controllers.
- Controllers: `backend/controllers/` contain request handling logic.
- Models: `backend/models/` define data schemas/entities.
- Middlewares: `backend/middlewares/` for cross-cutting concerns.
- Utils: `backend/utils/` for helper functions.

## Frontend
- Entry: `frontend/src/main.jsx` bootstraps the app; `frontend/src/App.jsx` configures routes/layout.
- Components: `frontend/src/components/` reusable UI elements.
- Context: `frontend/src/context/` shared state providers.
- Pages: `frontend/src/pages/` route-level views.
- Lib: `frontend/src/lib/` for API clients and external wrappers.
- Utils: `frontend/src/utils/` for formatting and helpers.

This file is informational only and does not affect runtime behavior.

