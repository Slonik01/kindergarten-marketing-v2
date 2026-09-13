# kindergarten-marketing-v2

Сайт для дозагрузки детских садов в Астане и Алматы: восемь разделов, адаптивная вёрстка, анимации и форма для демонстрации интерфейса.

## Включить GitHub Pages

Готовые HTML, CSS, JavaScript, изображения и шрифты уже находятся в `docs/`. Собирать сайт для первой публикации не нужно.

1. Откройте **Settings → Pages** этого репозитория.
2. В **Build and deployment → Source** выберите **Deploy from a branch**.
3. Выберите ветку **main**, папку **/docs** и нажмите **Save**.
4. Дождитесь успешного завершения публикации `pages build and deployment` во вкладке **Actions**.

Адрес: **https://Slonik01.github.io/kindergarten-marketing-v2/**

GitHub Pages обслуживает статические файлы. Форма открывается и проверяет заполнение, но в этой демонстрационной версии данные никуда не отправляются. Серверный API и настройки Telegram в репозиторий не включены.

## Исходники и обновление

Исходники находятся в `app/`, `components/` и `lib/`, изображения — в `public/`. Используются Next.js, React, GSAP, Onest и Oswald. Требуется Node.js 22 или новее.

После изменений:

```sh
npm ci
npm run build
git add app components lib public docs
git commit -m "Update website"
git push
```

`npm run build` экспортирует сайт и обновляет `docs/`. Настроенные пути рассчитаны на репозиторий `kindergarten-marketing-v2`.

Для разработки: `npm run dev`, затем локальный адрес `http://localhost:3000/kindergarten-marketing-v2/`.
