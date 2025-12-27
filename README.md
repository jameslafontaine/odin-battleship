# 🧩 Odin Project Webpack Template

A ready-to-use boilerplate for your future **The Odin Project** projects, built with **Webpack + npm**, and optional support for **Babel**, **ESLint + Prettier**, and **CSS optimisation**.

---

## 🚀 Getting Started

Follow these steps after cloning the template repository to get up and running:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/odin-template.git my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Optional: Run the setup script
./setup_template_repo.sh

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build

# 6. Optional: Deploy to GitHub Pages
npm run deploy
```

### ✅ Notes

-   **Step 3** (setup script) may prompt you to enable optional features like Babel or ESLint/Prettier.
-   **Step 4** launches the Webpack Dev Server with hot reloading for development.
-   **Step 5** creates a minified production build in the `dist/` folder.
-   **Step 6** deploys `dist/` to a `gh-pages` branch via `git subtree` (if configured).

For a minimal workflow, the **only required commands** are:

```bash
npm install
npm run dev       # or `npm run build` if just building for production
```

---

### ⚠️ Note on `package.json` module type

If you’re **not using Babel**, make sure your `package.json` **does not include** this line:

```json
"type": "commonjs"
```

Having it set forces Node to interpret `.js` files as CommonJS, which **breaks ES6 `import` / `export` syntax** used in this template.  
Simply remove that line (or set `"type": "module"` if you prefer ESM explicitly).

---

### 📝 Babel vs No-Babel Workflow Tip

-   **Using Babel (recommended for beginners or projects with modern JS features):**

    -   Keep `"type"` unset or `"type": "module"` in `package.json`.
    -   Babel will transpile your ES6+ syntax (`import`/`export`) into a form Webpack and Node can handle.
    -   Use Babel loader in `webpack.common.js`.

-   **Not using Babel (simple template setup):**
    -   Remove `"type": "commonjs"` from `package.json`.
    -   Webpack will handle ES modules directly for `import`/`export` syntax.
    -   You won’t need any Babel-related packages or config.

This ensures users know exactly when they need Babel and when it’s safe to skip it.

---

## 🧱 Included by Default

-   **Webpack 5 modular configuration**

    -   `webpack.common.js` – shared configuration
    -   `webpack.dev.js` – development-specific config
    -   `webpack.prod.js` – production build config

-   **Basic project structure**

    -   `src/index.html` – main HTML template
    -   `src/index.js` – Webpack entry, imports styles.js and app.js
    -   `src/controller.js` – app orchestrator
    -   `src/models/` – core logic
    -   `src/views/` – view-specific modules
    -   `src/utils/` – generic utility functions
    -   `src/styles/` – CSS subfiles
    -   `src/services/` - External operations (API calls, storage, etc.)
    -   `dist/` – build output

-   **NPM scripts**

    -   `npm run dev` → start dev server
    -   `npm run build` → production build
    -   `npm run deploy` → deploy `dist/` to GitHub Pages (`git subtree`)
    -   `npm run lint` → check for ESLint + Prettier issues
    -   `npm run lint:fix` → auto-fix all issues, including Prettier formatting
    -   `npm run format` → format using Prettier alone

-   **Optional Bash script setup prompts**

    -   Babel for ES6+ transpilation
    -   ESLint + Prettier for code style consistency

---

## 🧠 Webpack Behaviour: JS vs CSS Minification

Webpack automatically minifies JavaScript when using **`mode: 'production'`**, powered internally by **Terser**.  
You do **not need to install `terser-webpack-plugin`** unless you want to customize minification options.

CSS is **not minified by default**. If you want smaller CSS output, you can use a plugin like `css-minimizer-webpack-plugin`.

### ✅ Recommended Setup

-   **Default (simple projects):**

    -   Just use `mode: 'production'`.
    -   Webpack handles JS minification automatically.
    -   CSS is optional.

-   **Advanced / customizable minification:**
    -   Add `TerserPlugin` to the `optimization.minimizer` array if you want fine-grained control (e.g., keeping comments, custom ECMAScript target, parallelization).

---

## ⚙️ Customisation Tips

-   **SASS/SCSS:**

    ```bash
    npm install sass sass-loader --save-dev
    ```

    Then update your `webpack.common.js`:

    ```js
    {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }
    ```

-   **Linting & Formatting:**

    ```bash
    npm run lint
    ```

-   **Deploy to GitHub Pages:**
    ```bash
    npm run deploy
    ```

---

## 🎨 CSS Workflow with Webpack

Use `index.js` to import all CSS subfiles:

```js
// src/index.js
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/utilities.css";
```

✅ Clear, explicit, Webpack-compatible, and scalable.

---

## 🧩 Folder Structure (with explanations)

```plaintext
📁 my-project/
 ┣ 📁 src/
 ┃ ┣ 📁 assets/                  ← Static assets
 ┃ ┃ ┣ 📁 fonts/                 ← Font files
 ┃ ┃ ┗ 📁 img/                   ← Images
 ┃ ┣ 📁 models/                  ← Core logic / data
 ┃ ┃ ┣ Constants.js              ← Enum-like constants
 ┃ ┃ ┣ Items.js                  ← Generic data object contained within a Model
 ┃ ┃ ┣ Manager.js                ← Singleton managing models
 ┃ ┃ ┗ Model.js                  ← Generic data object
 ┃ ┣ 📁 views/                   ← View-specific modules
 ┃ ┃ ┣ DialogView.js             ← Generic dialog rendering
 ┃ ┃ ┣ MainView.js               ← Generic main view rendering
 ┃ ┃ ┗ SidebarView.js            ← Generic sidebar rendering
 ┃ ┣ 📁 utils/                   ← Generic helpers / utilities
 ┃ ┃ ┣ DateUtils.js              ← Centralized date and time utility functions.
 ┃ ┃ ┣ TableUtils.js             ← Table helpers
 ┃ ┃ ┗ UIUtils.js                ← DOM helpers: show/hide/toggle/bindEvent/createElement etc.
 ┃ ┣ 📁 services/                ← External operations (API calls, storage, etc.)
 ┃ ┃ ┗ weatherService.js         ← Fetches and processes weather data using the Visual Crossing API
 ┃ ┣ 📁 styles/                  ← CSS subfiles
 ┃ ┃ ┣ base.css                  ← Base/global styles
 ┃ ┃ ┣ carousel.css              ← Carousel styling
 ┃ ┃ ┣ components.css            ← Component-specific styles
 ┃ ┃ ┣ dropdown.css              ← Dropdown styling
 ┃ ┃ ┣ layout.css                ← Layout rules (grid, flex, containers)
 ┃ ┃ ┣ tokens.css                ← Design tokens: colors, spacing, fonts
 ┃ ┃ ┗ utilities.css             ← Utility/helper classes (e.g., `.hidden`, `.mt-4`)
 ┃ ┣ controller.js               ← Orchestrates core logic + UI
 ┃ ┣ index.html                  ← HTML template
 ┃ ┗ index.js                    ← Webpack entry point, aggregates CSS subfiles
 ┃
 ┣ 📁 dist/                      ← Production build output
 ┣ .gitignore
 ┣ LICENSE
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md
 ┣ setup_template_repo.sh
 ┣ webpack.common.js
 ┣ webpack.dev.js
 ┗ webpack.prod.js
```

---

## 🔧 (Optional) Improvements later

-   Use `.env` + `dotenv-webpack` for environment variables
-   Add testing support (e.g., Jest)

---

## 🧰 Why Use This Template?

-   Saves time setting up Webpack projects for each Odin Project assignment.
-   Keeps configuration clean, modular, and reusable.
-   Promotes modern web dev best practices (linting, transpiling, bundling).
-   Fully extensible — add React, TypeScript, or other tools later if desired.

---

## 📝 License

This project is open-source under the **MIT License**.  
Feel free to copy, modify, or use it for your Odin Project work or any other web dev projects.

---

Happy coding! 💻✨
