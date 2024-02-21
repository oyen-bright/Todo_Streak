# React + TypeScript + Vite Todo Streak App

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/your-username/todo-streak-app.git
cd todo-streak-app
```

Then, install the dependencies:
```bash
npm install
```

To run the development server:

```bash
npm run dev

```
Open http://localhost:5173 to view the app in your browser.

## Overview
This project is a Todo Streak app built with React, TypeScript, and Vite. It allows users to track their daily or weekly todos and maintain streaks for completing them. The app features include:

- Daily and weekly todo tracking
- Streak maintenance
- Date picker in the app bar for selecting dates
- Settings page for clearing the database
- Fast refresh with HMR for efficient development
## Features
### Date Picker
The app includes a date picker in the app bar, allowing users to select dates and view their todos for specific days.

### Settings Page
The settings page allows users to clear the database, providing a fresh start for managing todos.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
