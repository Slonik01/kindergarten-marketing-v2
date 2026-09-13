"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  FireSimple,
  Funnel,
  LinkSimple,
  PaperPlaneTilt,
  Star,
  X,
} from "@phosphor-icons/react";
import { leadSchema } from "@/lib/lead-schema";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FormValues = {
  name: string;
  kindergarten: string;
  location: string;
  openSpots: number;
  contact: string;
  consent: boolean;
  website: string;
};

const qualifiers = [
  "ищут качественный детский сад",
  "подходят по бюджету",
  "готовы прийти на экскурсию",
  "могут выбрать вас уже в этом месяце",
];

const setupItems = [
  { icon: Funnel, label: "Привлекаем подходящих родителей" },
  { icon: Star, label: "Показываем ценность сада до звонка" },
  { icon: PaperPlaneTilt, label: "Ведём к экскурсии и договору" },
  { icon: FireSimple, label: "Дозагружаем свободные места" },
  { icon: LinkSimple, label: "Превращаем рекламу в новых детей в группах" },
];

const journey = [
  "Родитель",
  "Экскурсия",
  "Договор",
  "Ребёнок в группе",
  "Выручка сада",
];

const monthlyFee = 150_000;
const revenuePeriods = [6, 12, 24];
const revenueSeats = [3, 5, 10];
const numberFormat = new Intl.NumberFormat("ru-KZ", { maximumFractionDigits: 1 });

function SystemNote({ children }: { children: React.ReactNode }) {
  return <p className="system-note"><span>Что делает система</span>{children}</p>;
}

function keepDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]"))
    .filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && element.checkVisibility());
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function Brand() {
  return (
    <a href="#hero" className="brand" aria-label="МАРКЕТИНГ — на главную">
      <span className="brand-word">МАРКЕТИНГ</span><span className="brand-dot" aria-hidden="true" />
    </a>
  );
}

function SiteHeader({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  return (
    <header className="site-header">
      <Brand />
      <button className="menu-button" type="button" onClick={onMenu} aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="site-menu" aria-haspopup="dialog">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

function CTAButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button className="primary-cta" type="button" onClick={onClick}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" weight="bold" />
    </button>
  );
}

function MenuDrawer({ open, onClose, onLead }: { open: boolean; onClose: () => void; onLead: () => void }) {
  const menuRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !menuRef.current?.open) menuRef.current?.showModal();
    if (!open && menuRef.current?.open) menuRef.current?.close();
  }, [open]);
  const close = () => {
    menuRef.current?.close();
    onClose();
  };
  const links = [
    ["Цена свободных мест", "#profit"],
    ["Расчёт выручки", "#ltv"],
    ["Постоянный набор", "#flow"],
    ["Как выбирают родители", "#story"],
    ["Как работает система", "#system"],
  ];

  return (
    <dialog
      ref={menuRef}
      id="site-menu"
      aria-label="Навигация по сайту"
      onKeyDown={keepDialogFocus}
      className={`menu-layer ${open ? "is-open" : ""}`}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClose={onClose}
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
    >
      <aside className="menu-drawer" aria-label="Панель навигации">
        <div className="menu-drawer__top">
          <span className="brand"><span className="brand-word">МАРКЕТИНГ</span><span className="brand-dot" aria-hidden="true" /></span>
          <button type="button" className="menu-close" onClick={close} aria-label="Закрыть меню">
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Основная навигация">
          {links.map(([label, href], index) => (
            <a href={href} key={href} onClick={close}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="menu-lead"
          onClick={() => {
            close();
            onLead();
          }}
        >
          Получить прогноз <ArrowRight aria-hidden="true" />
        </button>
      </aside>
    </dialog>
  );
}

function ChairGlyph({ empty = false }: { empty?: boolean }) {
  return (
    <span className={`chair-glyph ${empty ? "is-empty" : ""}`} aria-hidden="true">
      <span className="chair-glyph__back" />
      <span className="chair-glyph__seat" />
    </span>
  );
}

function LeadDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const [state, setState] = useState<"idle" | "success">("idle");
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { openSpots: 5, consent: false, website: "" },
    resolver: (values) => {
      const parsed = leadSchema.safeParse(values);
      if (parsed.success) return { values: parsed.data, errors: {} };
      return {
        values: {},
        errors: Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], { type: "validate", message: issue.message }])),
      };
    },
  });

  const close = () => {
    dialogRef.current?.close();
    if (state === "success") {
      setState("idle");
      reset({ openSpots: 5, consent: false, website: "" });
    }
  };

  const onSubmit = handleSubmit((values) => {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      for (const [field, issues] of Object.entries(fields)) {
        const first = issues?.[0];
        if (first) setError(field as keyof FormValues, { type: "validate", message: first });
      }
      return;
    }

    setState("success");
  });

  return (
    <dialog
      ref={dialogRef}
      className="lead-dialog"
      aria-labelledby="lead-dialog-title"
      onKeyDown={keepDialogFocus}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
    >
      <div className="dialog-toolbar">
        <button className="dialog-close" type="button" onClick={close} aria-label="Закрыть форму">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="lead-dialog__panel">
        {state === "success" ? (
          <div className="form-success" aria-live="polite">
            <span><Check aria-hidden="true" weight="bold" /></span>
            <h2 id="lead-dialog-title" tabIndex={-1} ref={(node) => node?.focus()}>Форма заполнена</h2>
            <p>Данные прошли проверку. Это демонстрационная версия: заявка никуда не отправлялась.</p>
            <button type="button" className="primary-cta" onClick={close}>Вернуться на сайт</button>
          </div>
        ) : (
          <>
            <p className="dialog-eyebrow">Астана и Алматы</p>
            <h2 id="lead-dialog-title">Прогноз по набору детей</h2>
            <p className="dialog-intro">Демонстрация формы прогноза. Можно проверить заполнение полей; данные никуда не отправляются.</p>
            <form onSubmit={onSubmit} noValidate>
              <div className="form-grid">
                <label>
                  <span id="name-label">Ваше имя</span>
                  <input required aria-labelledby="name-label" autoComplete="name" maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
                  {errors.name && <small id="name-error">{errors.name.message}</small>}
                </label>
                <label>
                  <span id="kindergarten-label">Название сада</span>
                  <input required aria-labelledby="kindergarten-label" autoComplete="organization" maxLength={120} aria-invalid={!!errors.kindergarten} aria-describedby={errors.kindergarten ? "kindergarten-error" : undefined} {...register("kindergarten")} />
                  {errors.kindergarten && <small id="kindergarten-error">{errors.kindergarten.message}</small>}
                </label>
                <label>
                  <span id="location-label">Город и район</span>
                  <input required aria-labelledby="location-label" autoComplete="address-level2" placeholder="Например: Астана, Есиль…" maxLength={120} aria-invalid={!!errors.location} aria-describedby={errors.location ? "location-error" : undefined} {...register("location")} />
                  {errors.location && <small id="location-error">{errors.location.message}</small>}
                </label>
                <label>
                  <span id="openSpots-label">Свободных мест сейчас</span>
                  <input required aria-labelledby="openSpots-label" type="number" min="1" max="300" step="1" inputMode="numeric" aria-invalid={!!errors.openSpots} aria-describedby={errors.openSpots ? "openSpots-error" : undefined} {...register("openSpots", { valueAsNumber: true })} />
                  {errors.openSpots && <small id="openSpots-error">{errors.openSpots.message}</small>}
                </label>
                <label className="form-wide">
                  <span id="contact-label">Telegram, WhatsApp, телефон или email</span>
                  <input required aria-labelledby="contact-label" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="+7… или @username…" maxLength={160} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "contact-error" : undefined} {...register("contact")} />
                  {errors.contact && <small id="contact-error">{errors.contact.message}</small>}
                </label>
                <label className="form-honeypot" aria-hidden="true">
                  <span>Сайт</span>
                  <input tabIndex={-1} autoComplete="off" {...register("website")} />
                </label>
              </div>
              <label className="consent-row">
                <input required type="checkbox" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} {...register("consent")} />
                <span>
                  Согласен на обработку данных и принимаю <a href="/kindergarten-marketing-v2/privacy/" target="_blank" rel="noopener">политику конфиденциальности<span className="sr-only"> (откроется в новой вкладке)</span></a>.
                </span>
              </label>
              {errors.consent && <small className="consent-error" id="consent-error">{errors.consent.message}</small>}
              <p className="sr-only" role="status">{Object.keys(errors).length > 0 ? "Проверьте отмеченные поля формы." : ""}</p>
              <button className="primary-cta form-submit" type="submit">
                <span>Проверить форму</span>
                <ArrowRight aria-hidden="true" weight="bold" />
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

export function MarketingSite() {
  const root = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openLeadDialog = () => dialogRef.current?.showModal();

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.from(".hero-line", {
        y: 42,
        opacity: 0,
        duration: 1.05,
        stagger: 0.12,
        ease: "power4.out",
      });
      gsap.from(".hero-support, .hero-action, .qualifier-item", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.55,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.fromTo(
        ".marketing-object",
        {
          autoAlpha: 0,
          x: 120,
          y: 92,
          rotation: -20,
          scale: 0.78,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotation: -8,
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: ".flow-section",
            start: "top 72%",
            once: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel) => {
        const children = Array.from(panel.children).filter(
          (child) => !child.classList.contains("ghost-word"),
        );
        gsap.from(children, {
          opacity: 0,
          y: 34,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 72%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="site-main overflow-x-hidden w-full max-w-full">
      <a className="skip-link" href="#hero">Перейти к содержанию</a>
      <SiteHeader onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onLead={openLeadDialog} />

      <div className="opening-gradient-run">
        <div className="opening-gradient-run__field" aria-hidden="true" />

      <section id="hero" tabIndex={-1} className="chapter hero-section">
        <div className="ambient ambient--hero" aria-hidden="true" />
        <div className="hero-content">
          <h1>
            <span className="hero-line hero-line--small">Дозаполните группы</span>
            <span className="hero-line hero-line--blue">в детском саду</span>
            <span className="hero-line hero-line--last">
              <span>и получите дополнительно</span>
              <em>от 2,7 до 36 млн ₸</em>
            </span>
          </h1>
          <div className="hero-lower">
            <div className="hero-summary"><p className="hero-support">Система привлечения родителей в Астане и Алматы — от первого интереса до экскурсии и договора.</p>
              <p className="hero-context">Сильный сад, довольные родители, хорошая репутация. Но пока группы загружены не на 100%, вы каждый месяц теряете выручку.</p>
            </div>
            <div className="hero-action">
              <CTAButton onClick={openLeadDialog}>Получить прогноз по набору детей</CTAButton>
              <p className="hero-calculation">Потенциальная выручка за <span className="number-range">6–24</span> месяца при заполнении <span className="number-range">3–10</span> мест и чеке 150&nbsp;000&nbsp;₸. <a href="#ltv">Посмотреть расчёт ↗</a></p>
            </div>
          </div>
        </div>
        <div className="qualifier-strip" aria-label="Кого приводит система">
          {qualifiers.map((item) => (
            <p className="qualifier-item" key={item}>
              <Check aria-hidden="true" weight="bold" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </section>

      <section id="profit" className="chapter dark-section profit-section">
        <div className="ambient ambient--right" aria-hidden="true" />
        <div className="chapter-grid">
          <h2 className="display-title fluid-title reveal">
            Недозагрузка крадёт <em className="title-accent">прибыль</em>
          </h2>
          <div className="profit-data reveal">
            <p className="mega-metric">20–40<sup>%</sup></p>
            <div className="seats-row" aria-label="Шесть занятых и четыре свободных места">
              {Array.from({ length: 10 }, (_, index) => <ChairGlyph key={index} empty={index >= 6} />)}
            </div>
            <p className="capacity-label">Пример загрузки группы</p>
            <p className="profit-thesis">20–40% свободных мест могут означать миллионы тенге недополученной выручки</p>
            <div className="copy-columns">
              <p>Помещение, педагоги, администратор, питание, коммунальные услуги и реклама уже заложены в бюджет. Но часть мест всё равно не приносит деньги.</p>
              <p>Прибыль можно увеличить без открытия новых групп и найма новых сотрудников. Достаточно дозагрузить свободные места.</p>
            </div>
            <SystemNote>Считаем упущенную выручку и запускаем привлечение родителей под конкретное количество свободных мест.</SystemNote>
          </div>
        </div>
      </section>

      <section id="cost" className="chapter dark-section cost-section">
        <div className="corner-frame" aria-hidden="true" />
        <div className="cost-copy reveal">
          <h2 className="display-title fluid-title">Каждое свободное место уже стоит вам денег</h2>
          <p>Свободный столик. Свободный шкафчик. Место в группе. Всё это уже есть в ваших расходах. Но пока нет ребёнка — нет и выручки.</p>
          <strong>Ваш сад может принять детей уже сейчас. А семьи пока выбирают конкурентов.</strong>
          <SystemNote>Приводим подходящих родителей, знакомим с садом до экскурсии и помогаем довести интерес до договора.</SystemNote>
        </div>
        <div className="chair-stage reveal">
          <p className="cost-number">5–10</p>
          <Image
            className="chair-illustration"
            src="/kindergarten-marketing-v2/assets/kindergarten-chair.png"
            alt="Пустой синий детский стул"
            width={1254}
            height={1254}
            sizes="(max-width: 640px) 74vw, (max-width: 1100px) 42vw, 520px"
          />
          <p>свободных мест — это 750&nbsp;000–1,5&nbsp;млн&nbsp;₸ потенциальной выручки в месяц при чеке 150&nbsp;000&nbsp;₸</p>
        </div>
      </section>

      <section id="ltv" className="chapter dark-section ltv-section">
        <span className="ltv-watermark" aria-hidden="true">LTV</span>
        <div className="ltv-head reveal">
          <h2 className="display-title fluid-title">Свободное место — <span>выручка на месяцы вперёд</span></h2>
          <p>Ребёнок приходит не на один месяц. При чеке 150&nbsp;000&nbsp;₸ одно заполненное место может принести:</p>
          <ul className="ltv-child-values">{revenuePeriods.map((months) => <li key={months}><span>За {months} месяцев</span><strong>{numberFormat.format(monthlyFee * months)}&nbsp;₸</strong></li>)}</ul>
        </div>
        <div className="ltv-table-wrap reveal">
          <table className="ltv-table" aria-describedby="revenue-assumptions">
            <caption className="table-caption">Потенциал свободных мест, млн ₸</caption>
            <thead><tr><th scope="col">Мест</th>{revenuePeriods.map((months) => <th scope="col" key={months}>{months}<span className="table-period"> месяцев</span></th>)}</tr></thead>
            <tbody>
              {revenueSeats.map((seats) => <tr key={seats}><th scope="row">{seats}</th>{revenuePeriods.map((months) => <td key={months} className={seats === 10 && months === 24 ? "table-hot" : undefined}>{numberFormat.format(seats * monthlyFee * months / 1_000_000)}</td>)}</tr>)}
            </tbody>
          </table>
          <p className="revenue-assumptions" id="revenue-assumptions">Расчёт: места × 150&nbsp;000&nbsp;₸ × месяцы. При полной оплате в течение всего периода, без учёта расходов и оттока. Это потенциальная выручка, а не гарантия результата.</p>
          <SystemNote>Показываем, сколько детей нужно добрать, сколько заявок и экскурсий потребуется. Планируем рекламу под загрузку ваших групп.</SystemNote>
          <button type="button" className="text-cta" onClick={openLeadDialog}>Получить расчёт для своего сада <ArrowRight aria-hidden="true" /></button>
        </div>
      </section>
      </div>

      <section id="flow" className="chapter light-section flow-section">
        <div className="flow-copy reveal">
          <h2 className="display-title fluid-title">Даже сильному саду нужен постоянный поток новых семей</h2>
          <p>Проблема не в качестве сада. Набор нужно постоянно обновлять: вчера группа была полной, а сегодня появились свободные места.</p>
        </div>
        <div className="flow-timeline flow-timeline--desktop reveal" aria-label="Естественная ротация семей в течение года">
          <div className="flow-line" />
          {Array.from({ length: 18 }, (_, index) => (
            <span className={`flow-seat ${[2, 8, 14].includes(index) ? "is-leaving" : ""}`} key={index}>
              <ChairGlyph />
            </span>
          ))}
          <span className="month month--one">Сентябрь</span>
          <span className="month month--two">Январь</span>
          <span className="month month--three">Апрель</span>
          <span className="month month--four">Июнь</span>
        </div>
        <div className="flow-timeline-mobile reveal" aria-label="Естественная ротация семей: сентябрь, январь и апрель">
          {["Сентябрь", "Январь", "Апрель"].map((month) => (
            <div className="flow-mobile-stage" key={month}>
              <div className="flow-mobile-seats" aria-hidden="true">
                <span className="flow-mobile-seat"><ChairGlyph /></span>
                <span className="flow-mobile-seat"><ChairGlyph /></span>
                <span className="flow-mobile-seat is-leaving"><ChairGlyph /></span>
              </div>
              <span className="flow-mobile-loss">−1 семья</span>
              <span className="flow-mobile-month">{month}</span>
            </div>
          ))}
        </div>
        <div className="flow-reasons reveal">
          <div><h3>Дети выпускаются</h3><p>Каждый год часть детей переходит в школу.</p></div>
          <div><h3>Семьи переезжают</h3><p>Меняют город или район — и ищут сад ближе к дому.</p></div>
          <div><h3>Родители меняют сад</h3><p>Выбирают другой график, программу или условия.</p></div>
        </div>
        <p className="flow-conclusion reveal">Естественная ротация есть всегда. Вопрос — <strong>откуда придёт следующий набор?</strong></p>
        <SystemNote>Создаём постоянный поток обращений, чтобы набор не зависел только от сезона, сарафана и случайных рекомендаций.</SystemNote>
        <Image
          className="marketing-object"
          src="/kindergarten-marketing-v2/assets/marketing-megaphone.png"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          sizes="(max-width: 640px) 220px, 520px"
        />
      </section>

      <div className="visibility-control-gradient-run">
        <div className="visibility-control-gradient-run__field" aria-hidden="true" />

          <section id="story" className="story-panel visibility-panel">
            <span className="ghost-word" aria-hidden="true">ПЕРВЫМ</span>
            <div className="visibility-copy">
              <h2 className="display-title fluid-title">Родители выбирают не только лучший сад</h2>
              <div className="visibility-copy__text">
                <p>Они выбирают тот, который увидели вовремя, поняли быстрее, запомнили лучше и захотели посмотреть лично.</p>
                <p>Сильная программа и хорошие педагоги уже есть. Но если родитель не понял вашу ценность, он продолжит сравнивать — и может выбрать конкурента, который раньше объяснил, почему ему стоит доверять.</p>
              </div>
            </div>
            <div className="attention-flow" aria-label="Как родитель знакомится с садом и решает прийти на экскурсию">
              <div className="attention-stage attention-stage--family">
                <span>01 / Увидели вовремя</span>
                <strong>Ищут сад в своём районе</strong>
                <p>Показываем ваш сад родителям, которые уже выбирают место для ребёнка.</p>
              </div>
              <span className="attention-arrow" aria-hidden="true">→</span>
              <div className="attention-stage attention-stage--first">
                <span>02 / Поняли ценность</span>
                <strong>Узнают, чем вы отличаетесь</strong>
                <p>Программа, педагоги, атмосфера, безопасность и подход к ребёнку становятся понятными до звонка.</p>
              </div>
              <span className="attention-arrow" aria-hidden="true">→</span>
              <div className="attention-stage attention-stage--choice">
                <span>03 / Захотели посмотреть</span>
                <strong>Записываются на экскурсию</strong>
                <p>Следующий шаг — увидеть сад лично и познакомиться с командой.</p>
              </div>
              <div className="garden-missed">
                <div><span>Ваш сильный сад</span><b>Понятный выбор</b></div>
                <p>Родитель видит не «ещё один частный сад», а место, которому можно доверить ребёнка.</p>
                <strong>Есть повод прийти</strong>
              </div>
            </div>
            <p className="visibility-loss">Раскрываем причины выбрать именно вас — до первого звонка администратора.</p>
          </section>

          <section id="control" className="story-panel control-panel">
            <h2 className="display-title fluid-title">Сарафан не заполняет группы по команде</h2>
            <div className="control-compare">
              <div className="control-card control-card--have">
                <span className="control-card__index">01 / Сарафан</span>
                <h3>Ждать</h3>
                <div className="control-card__list"><p>Может привести 2 семьи</p><p>Может привести 5</p><p>Может не привести никого</p><p>Сроки нельзя задать</p></div>
              </div>
              <div className="control-card control-card--need">
                <span className="control-card__index">02 / Реклама и система</span>
                <h3>Привлекать</h3>
                <div className="control-card__list"><p>Выйти на нужных родителей</p><p>Показать ценность сада</p><p>Пригласить на экскурсию</p><p>Измерять путь до договора</p></div>
              </div>
            </div>
            <p className="control-thesis">Когда свободно 5, 10 или 20 мест, ждать рекомендаций слишком долго.</p>
            <div className="budget-line"><span>Подходящие родители</span><span>Понятная ценность</span><strong>Следующий шаг — экскурсия</strong></div>
          </section>
      </div>

      <section id="system" className="chapter system-section">
        <div className="system-top">
          <h2 className="display-title fluid-title system-title">
            Заберите выручку, которую сейчас забирает <em className="title-accent">недозагрузка</em>
          </h2>
          <p>Свободные места могут стоить вашему саду от 2,7 до 36&nbsp;млн&nbsp;₸ выручки. Не ждите сарафана — встройте рекламу в понятную систему набора.</p>
          <p className="system-calculation">3–10 мест · 150&nbsp;000&nbsp;₸ в месяц · 6–24 месяца. <a href="#ltv">Как рассчитана сумма ↗</a></p>
        </div>
        <div className="system-bottom">
          <ol className="system-journey">
            {journey.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}
          </ol>
          <div className="setup-row">
            <h3>Наша система</h3>
            <div>
              {setupItems.map(({ icon: Icon, label }) => (
                <span key={label}><Icon aria-hidden="true" /><small>{label}</small></span>
              ))}
            </div>
          </div>
          <div className="system-action">
            <div className="final-cta"><CTAButton onClick={openLeadDialog}>Забрать выручку</CTAButton><p>Начнём с прогноза по набору детей для вашего сада.</p></div>
          </div>
          <footer>
            <Brand />
            <p>© 2026. Привлечение родителей в детские сады Астаны и Алматы.</p>
            <a href="/kindergarten-marketing-v2/privacy/">Политика конфиденциальности</a>
          </footer>
        </div>
      </section>

      <LeadDialog dialogRef={dialogRef} />
    </main>
  );
}
