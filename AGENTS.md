# Repository Guidelines

## Project Structure & Module Organization

This is a small Flask web app for the AgroCitrico academic project. The main application entrypoint is `app.py`, which defines routes for `/`, `/login`, `/register`, and `/ia`. Jinja templates live in `templates/`: `index.html` for the homepage, `login.html` and `register.html` for authentication views, and `ia.html` for the AI assistant view. Static assets live in `static/`: shared homepage files are `static/index.css` and `static/index.js`, page-specific scripts are in `static/js/`, page-specific styles are in `static/css/`, and images/logos are in `static/img/`.

## Build, Test, and Development Commands

Create a local environment before running the app:

```bash
python -m venv venv
source venv/bin/activate
pip install flask
python app.py
```

`python app.py` starts the Flask development server at `http://localhost:5000` with debug mode enabled. There is currently no dependency manifest, build step, or automated test command in the repository; add those before relying on repeatable CI or deployment workflows.

## Coding Style & Naming Conventions

Use 4-space indentation for Python and keep route handlers short, returning `render_template(...)` unless business logic is introduced. Use lowercase route function names that match their page purpose, for example `register()` for `/register`. Keep HTML class names descriptive and consistent with the existing Spanish/product vocabulary where already used. Store new page JavaScript in `static/js/<page>.js` and new page CSS in `static/css/<page>.css`; only place shared homepage behavior in `static/index.js` or `static/index.css`.

## Testing Guidelines

No test framework is configured yet. For backend changes, add Flask tests under a future `tests/` directory using `pytest` and Flask's test client. Name test files `test_<feature>.py`. Until automated tests exist, manually verify all affected routes in the browser, especially responsive navigation, forms, and static asset loading.

## Commit & Pull Request Guidelines

Recent history uses short Spanish commit subjects, sometimes prefixed with `Feat:` or `Style:`. Follow that pattern with concise, imperative descriptions, for example `Feat: Se agrega validacion de registro`. Pull requests should describe the user-facing change, list manual verification steps, link any related issue or task, and include screenshots for visual changes to templates, CSS, or responsive layouts.

## Security & Configuration Tips

Do not commit virtual environments, credentials, database dumps, or local configuration. Keep Flask debug mode for local development only, and move secrets or future database settings into environment variables before deployment.
