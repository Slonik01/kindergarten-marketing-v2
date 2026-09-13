import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя — минимум 2 символа").max(80, "Не больше 80 символов"),
  kindergarten: z.string().trim().min(2, "Укажите название сада").max(120, "Не больше 120 символов"),
  location: z.string().trim().min(2, "Укажите город и район").max(120, "Не больше 120 символов"),
  openSpots: z.coerce.number({ error: "Укажите число свободных мест" }).int("Укажите целое число мест").min(1, "Минимум одно место").max(300, "Максимум 300 мест"),
  contact: z.string().trim().min(5, "Укажите телефон, email или контакт в мессенджере").max(160, "Не больше 160 символов"),
  consent: z.literal(true, { error: "Нужно согласие на обработку данных" }),
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
