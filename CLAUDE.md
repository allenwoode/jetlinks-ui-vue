# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JetLinksU UI is a Vue 3 + TypeScript frontend application for the JetLinks IoT platform. It features a micro-frontend architecture with multiple modules and a comprehensive UI component library.

## Development Commands

### Setup
```bash
# Install dependencies
pnpm install

# Initialize git submodules (required first time)
pnpm modules:init

# Update submodules
pnpm modules:update
```

### Development
```bash
# Start development server
pnpm dev

# Force restart development server (clears cache)
pnpm dev:force

# Preview production build
pnpm preview
```

### Build & Test
```bash
# Build for production
pnpm build

# Build for server mode
pnpm build:modules-server

# Run end-to-end tests
pnpm test
```

### Maintenance
```bash
# Clean dependencies and build artifacts
pnpm clean
```

## Architecture

### Module Structure
The project uses a modular architecture with Git submodules in `src/modules/`:
- `authentication-manager-ui` - User authentication and permissions
- `device-manager-ui` - IoT device management
- `notify-manager-ui` - Notification system
- `rule-engine-manager-ui` - Rules and automation engine

Each module is a complete sub-application with its own:
- API layer (`api/`)
- Components (`components/`, `views/`)
- Assets (`assets/`)
- Localization (`locales/`)
- Base menu configuration (`baseMenu.json`, `baseMenu.ts`)

### Core Structure
- `src/api/` - Main application API services
- `src/components/` - Shared UI components
- `src/layout/` - Application layout components
- `src/router/` - Vue Router configuration with module support
- `src/store/` - Pinia state management
- `src/utils/` - Utility functions and helpers
- `src/locales/` - Internationalization (i18n) support

### Technology Stack
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Library**: Ant Design Vue
- **State Management**: Pinia
- **Router**: Vue Router 4
- **Language**: TypeScript
- **Styling**: Less with CSS modules support
- **Maps**: Vue AMap (高德地图)
- **Charts**: ECharts
- **Testing**: Playwright

### Key Dependencies

#### JetLinks Web Libraries
- `@jetlinks-web/components` - Business component library (globally registered)
- `@jetlinks-web/core` - Core utilities and request handling
- `@jetlinks-web/hooks` - Common Vue composables
- `@jetlinks-web/utils` - Utility functions
- `@jetlinks-web/constants` - Application constants

#### External Libraries  
- `@micro-zoe/micro-app` - Micro-frontend support
- `monaco-editor` - Code editor integration
- `xgplayer` - Video player with HLS/FLV support
- `vue-i18n` - Internationalization

## Development Environment

### Configuration
- Development server runs on port 9100 (configurable via `VITE_PORT`)
- API proxy configured to `http://127.0.0.1:8848` by default
- Environment variables in `.env.development`

### Module Development
When working with submodules:
1. Each module has independent package management
2. Modules are loaded dynamically via `src/utils/modules-loader.ts`
3. Menu registration happens through `baseMenu.ts` files
4. Localization files are automatically merged

### Component Development
- Global components from `@jetlinks-web/components` are auto-registered
- Local components use auto-import via unplugin-vue-components
- Follow existing patterns in `src/components/` for new shared components

### API Integration
- HTTP client configured in `@jetlinks-web/core`
- Authentication handled via `X-Access-Token` header
- Response format standardized across modules

## Important Notes

- Use `pnpm modules:init` after initial clone to set up submodules
- Module submodules may have their own dependencies and build processes
- The project uses Node.js 18.14.0 (managed via Volta)
- Less variables are centralized in `src/style/variable.less`
- Monaco Editor workers are configured for JSON and TypeScript support