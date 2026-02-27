# 🎓 Lesson Craft

**Lesson Craft** is a specialized platform designed for English teachers to generate high-quality, engaging lesson materials in seconds. Leveraging modern web technologies, it provides a suite of tools to transform ideas, images, and videos into structured classroom activities.

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🏗️ Architecture

The project follows a modern, scalable structure centered around the **Next.js App Router** and **Tailwind CSS 4**.

### Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Architecture**: Component-based architecture with React Server Components (RSC) and Client Components where interactivity is needed.

### Project Structure

- `/src/app`: The core of the application, containing all routes and layouts.
  - `material-generators/`: Contains specialized modules for different lesson types:
    - `image-lesson/`: Tools for generating lessons based on visual prompts.
    - `video-lesson/`: Creators for video-centric learning activities.
    - `conversation-lesson/`: Generators for speaking and discussion prompts.
- `/public`: Static assets, icons, and images.
- `/src/app/globals.css`: Global styles and Tailwind CSS configurations.

---

## 🛠️ Features

- **Intuitive UI**: A sleek, dark-themed interface designed for focus and productivity.
- **Material Generators**: Modular tools tailored for specific teaching needs.
- **Modern Styling**: Powered by the latest Tailwind CSS 4 features for a premium look and feel.

---

## 📄 License

This project is private and intended for internal use.
