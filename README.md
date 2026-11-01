# Чисто Конкретно

Выездная химчистка мебели в Краснодаре и Яблоновском.

**Сайт:** https://switch3344.github.io/ChistoKonkretno/

React + TypeScript, Vite и Tailwind CSS. Тёмная тема, русская и английская версии, калькулятор стоимости, сравнение до/после, FAQ. Навигация CardNav + GooeyNav и оригинальный фон Waves из React Bits.

Исходники находятся в [`source/`](source/), готовая сборка для GitHub Pages — в корне репозитория. Цены, логотип и контакты сохранены.

## Локальный запуск

Требуется Node.js 24+.

```sh
cd source
npm ci
npm run dev
```

## Проверка и публикация

```sh
npm run check
npm run build
node scripts/publish-pages.mjs
```

После сборки и копирования файлов отправьте изменения в `main`. Инструкция по структуре публикации — в [PAGES_LAYOUT.md](PAGES_LAYOUT.md).

В Waves исправлена потеря WebGL-контекста при повторном запуске React StrictMode. Шейдеры и штатная анимация компонента сохранены.
