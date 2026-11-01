# Размещение GitHub Pages

GitHub Pages публикует ветку `main`, корень `/`.

- `index.html`, `assets/`, `images/`, `licenses/` — готовая сборка сайта.
- `source/` — исходники React + TypeScript + Vite и package-lock.json.
- Существующий HTML-архив сохранён.

Обновление:

```sh
cd source
npm ci
npm run check
npm run build
node scripts/publish-pages.mjs
```

Затем проверьте изменения, создайте коммит и отправьте его в `main`. GitHub Pages обновит публикацию автоматически. Секреты и node_modules в репозиторий не включаются.
