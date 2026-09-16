"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  X,
} from "@phosphor-icons/react";
import { leadSchema } from "@/lib/lead-schema";
import { OfferSections } from "@/components/offer-sections";

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
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const logo = header.querySelector(".brand-word");
      const lightSection = document.querySelector("#method");
      if (!logo || !lightSection) return;
      const logoRect = logo.getBoundingClientRect();
      const sectionRect = lightSection.getBoundingClientRect();
      const center = logoRect.top + logoRect.height / 2;
      const onLight = window.innerWidth > 640 && sectionRect.top <= center && sectionRect.bottom > center;
      header.classList.toggle("site-header--light", onLight);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (document.querySelector("main")) observer.observe(document.querySelector("main")!);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <header ref={headerRef} className="site-header">
      <Brand />
      <button className="menu-button" type="button" onClick={onMenu} aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="site-menu" aria-haspopup="dialog">
        <span />
        <span />
        <span />
      </button>
    </header>
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
    ["Свободные места", "#revenue"],
    ["Как мы дозагружаем группы", "#method"],
    ["Качество заявок", "#quality"],
    ["Готовая воронка", "#ready"],
    ["Получить прогноз", "#system"],
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
        ".method-object",
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
            trigger: ".method-section",
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
    <main ref={root} className="site-main offer-v3 overflow-x-hidden w-full max-w-full">
      <a className="skip-link" href="#hero">Перейти к содержанию</a>
      <SiteHeader onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onLead={openLeadDialog} />

      <OfferSections onLead={openLeadDialog} />
      <footer className="offer-footer">
        <Brand />
        <p>© 2026. Привлечение родителей в детские сады Астаны и Алматы.</p>
        <a href="/kindergarten-marketing-v2/privacy/">Политика конфиденциальности</a>
      </footer>

      <LeadDialog dialogRef={dialogRef} />
    </main>
  );
}
