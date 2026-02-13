Drum Scheduler is a personal practice assistant for drummers. It helps plan, manage, and follow structured drum practice sessions with clear steps and goals. The long-term aim is to provide a consistent workflow across web and mobile so a drummer can prepare sessions in one place and execute them with focus.

## Monorepo overview
This repository is a pnpm + Turborepo monorepo. It contains multiple apps and shared packages that make up the Drum Scheduler platform.

### Apps
- **API** (Node.js + Fastify): The backend service that provides data and business logic.
- **Web app** (Next.js): The web interface for creating and managing practice sessions.
- **Mobile app** (React Native): The practice companion for reading sessions and running exercises with a metronome in the specified BPM.

### Packages
- **config**: Shared constants and cross-app configuration values.
- **contracts**: Shared types and contracts between apps and the API.
- **db-schema**: Database schema definitions.
- **sdk**: Shared client utilities for consuming the API.

## Purpose
The project exists to streamline drum practice by:
- organizing sessions into actionable steps,
- keeping goals clear and measurable,
- enabling a smooth handoff from planning (web app) to execution (mobile app).

## Running the project (basic)
1. Install dependencies from the repo root: pnpm install
2. You can also run apps individually:
- API: pnpm dev:api
- Web app: pnpm dev:web-app
- Mobile app (Metro): pnpm dev:mobile-app:metro
- Mobile app (Android): pnpm dev:mobile-app:android

## Build all workspaces
- Build packages + apps (and typecheck apps): pnpm build:all

