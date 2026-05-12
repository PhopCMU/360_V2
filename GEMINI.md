# GEMINI.md - Project Context

## Project Overview
**360assessment2** is a React-based web application, likely a dashboard or assessment system for the Faculty of Veterinary Medicine at Chiang Mai University (based on API endpoints). It uses a modular structure with protected routes and a centralized user context.

### Core Technologies
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (animations)
- **Icons:** [Material Symbols](https://fonts.google.com/icons)
- **Routing:** [React Router Dom v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Security:** [Crypto-JS](https://cryptojs.gitbook.io/docs/) (AES encryption for API parameters)

---

## Architecture & Project Structure

- **`src/main.tsx`**: Entry point and routing configuration. Defines public and protected layouts.
- **`src/App.tsx`**: Main layout wrapper with background gradients.
- **`src/pages/`**: Contains page components, organized by domain:
  - `faculty/`, `hospital/`, `office/`, `sanbox/`, `vphcap/`: Domain-specific dashboards and boards.
  - `home.tsx`, `home_board.tsx`: Landing pages.
  - `signin.tsx`, `signin_board.tsx`: Authentication entry points.
- **`src/components/`**: Reusable UI components (Modal, Navbar, AuthCheck).
- **`src/context/`**: State management using React Context (`UserContext`).
- **`src/routers/`**: API interaction logic (GetRouter, PostRouter, authServer).
- **`src/config/`**: Configuration files (e.g., `conf.tsx` for API base URL).
- **`src/model/`**: TypeScript interfaces and types for data models.
- **`public/fonts/`**: Custom fonts, specifically **Noto Sans Thai**.

---

## Building and Running

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

---

## Development Conventions

- **State Management:** Use `useUser` hook from `src/context/UserContext.tsx` to access user info.
- **Routing:** Follow the nested route pattern in `src/main.tsx`. Protected routes are wrapped in `UserProvider` and `App`.
- **API Security:** Sensitive parameters sent via GET requests should be encrypted using AES via `crypto-js` (see `src/routers/GetRouter.tsx`).
- **Styling:** Use Tailwind utility classes. Backgrounds often use gradients (defined in `App.tsx`).
- **Authentication:** Token-based authentication using `localStorage` (`authToken`).
