<h1 align="center">Soladal 🛡️</h1>

<p align="center">
  <strong>A simple and powerful tool for creating and managing your digital assets</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-32-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron 32">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

## 🚀 Features

- **Electron-powered**: Cross-platform desktop application
- **Modern Stack**: Built with Vite, React, and TypeScript
- **Beautiful UI**: Tailwind CSS and Shadcn UI for sleek design
- **Internationalization**: i18next for multi-language support
- **Testing**: Jest and Playwright for robust testing
- **Documentation**: Storybook for component documentation

## 🛠️ Tech Stack

<details>
<summary><strong>Core 🏍️</strong></summary>

- [Electron 32](https://www.electronjs.org)
- [Vite 5](https://vitejs.dev)
- [SWC](https://swc.rs)
</details>

<details>
<summary><strong>DX 🛠️</strong></summary>

- [TypeScript 5](https://www.typescriptlang.org)
- [Prettier](https://prettier.io)
- [Zod](https://zod.dev)
- [React Query (Tan Stack)](https://react-query.tanstack.com)
</details>

<details>
<summary><strong>UI 🎨</strong></summary>

- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Geist](https://vercel.com/font) as default font
- [i18next](https://www.i18next.com)
- [Lucide](https://lucide.dev)
</details>

<details>
<summary><strong>Testing 🧪</strong></summary>

- [Jest](https://jestjs.io)
- [Playwright](https://playwright.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
</details>

<details>
<summary><strong>Packaging 📦</strong></summary>

- [Electron Forge](https://www.electronforge.io)
</details>

<details>
<summary><strong>Documentation 📚</strong></summary>

- [Storybook](https://storybook.js.org)
</details>

## 📁 Directory Structure

```
src/
├── assets/
│   └── fonts/
├── components/
│   └── ui/
├── helpers/
│   └── ipc/
├── layout/
├── lib/
├── pages/
├── stories/
├── style/
└── tests/
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/KhanhRomVN/soladal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm run start
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the app in development mode |
| `npm run package` | Package the app into a platform-specific executable |
| `npm run make` | Generate platform-specific distributables |
| `npm run publish` | Publish the app for distribution |
| `npm run prett` | Format code with Prettier |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |
| `npm run test` | Run Jest tests |
| `npm run test:watch` | Run Jest tests in watch mode |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:all` | Run all tests (Jest and Playwright) |

> Note: Playwright tests require the app to be built first. Run `npm run package`, `npm run make`, or `npm run publish` before running e2e tests.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/KhanhRomVN">KhanhRomVN</a>
</p>