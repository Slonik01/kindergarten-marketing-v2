import { z } from "zod";

export const leadQuestions = [
  { name: "budget", title: "Какой бюджет вы готовы ежемесячно выделять на привлечение родителей?", options: ["До $1 000", "$1 000–3 000", "Более $3 000"] },
  { name: "situation", title: "Какая ситуация сейчас ближе всего к вашей?", options: ["Пока просто изучаю варианты привлечения родителей", "В группах есть свободные места, но сейчас это не критично", "Нужно дозагрузить группы и привлечь новых детей в ближайшее время"] },
  { name: "readiness", title: "Насколько вы готовы запускать рекламу, если увидите понятный план и экономику?", options: ["Готов начать сразу", "Готов рассмотреть запуск в ближайший месяц", "Пока не готов принимать решение, хочу просто узнать подробнее"] },
] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя — минимум 2 символа").max(80, "Не больше 80 символов"),
  kindergarten: z.string().trim().min(2, "Укажите название сада").max(120, "Не больше 120 символов"),
  contact: z.string().trim().min(5, "Укажите Telegram или WhatsApp").max(160, "Не больше 160 символов"),
  budget: z.enum(leadQuestions[0].options, { error: "Выберите бюджет" }),
  situation: z.enum(leadQuestions[1].options, { error: "Выберите вашу ситуацию" }),
  readiness: z.enum(leadQuestions[2].options, { error: "Выберите готовность к запуску" }),
  consent: z.literal(true, { error: "Нужно согласие на обработку данных" }),
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
