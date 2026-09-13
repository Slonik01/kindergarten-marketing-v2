# kindergarten-marketing-v2

Сайт для дозагрузки детских садов в Астане и Алматы: восемь разделов, адаптивная вёрстка, анимации и форма для демонстрации интерфейса.

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
