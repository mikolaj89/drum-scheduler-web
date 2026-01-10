# Monorepo diagram

```mermaid
%%{init: {"theme": "base", "flowchart": {"nodeSpacing": 50, "rankSpacing": 60}, "themeVariables": {"textColor": "#111111", "primaryTextColor": "#111111", "secondaryTextColor": "#111111"}}}%%
flowchart TD
  %% Workspace
  Root["drum-scheduler<br/>(pnpm workspace)"]

  %% Apps
  Admin["admin-client<br/>(Next.js)"]
  Mobile["drum-scheduler-app<br/>(React Native)"]
  Api["api<br/>(Deno)"]

  %% Packages
  SDK["sdk<br/>@drum-scheduler/sdk"]
  Contracts["contracts<br/>@drum-scheduler/contracts"]
  DBSchema["db-schema<br/>@drum-scheduler/db-schema"]
  DBSchemaDist["db-schema/dist<br/>(built JS + d.ts)"]

  %% Root -> workspaces
  Root --> Admin
  Root --> Mobile
  Root --> Api
  Root --> SDK
  Root --> Contracts
  Root --> DBSchema

  %% Node workspace deps
  Mobile -->|imports| SDK
  Admin -->|imports| SDK

  SDK -->|depends on| Contracts
  Contracts -->|depends on| DBSchema

  %% Deno API uses built artifacts via import map
  DBSchema -->|pnpm build| DBSchemaDist
  Api -->|import map<br/>→ dist| DBSchemaDist

  %% Styling
  classDef app fill:#eef,stroke:#66f,stroke-width:1px,color:#111;
  classDef pkg fill:#efe,stroke:#3a3,stroke-width:1px,color:#111;
  classDef root fill:#fff,stroke:#999,stroke-width:1px,color:#111;

  class Root root;
  class Admin,Mobile,Api app;
  class SDK,Contracts,DBSchema,DBSchemaDist pkg;
```

Notes:
- `pnpm` links workspace packages into each app’s `node_modules` when the app declares them as dependencies (e.g. React Native app depends on `@drum-scheduler/sdk`).
- The Deno API does not use `workspace:` deps directly; it consumes the built output from `packages/db-schema/dist` via `apps/api/deno.json` import map.
