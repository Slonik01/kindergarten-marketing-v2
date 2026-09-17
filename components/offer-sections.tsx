import Image from "next/image";
import { ArrowRight, Check, Megaphone, Eye, ChatCircle, MapPin, Handshake, UsersThree } from "@phosphor-icons/react";

function OfferButton({ onClick }: { onClick: () => void }) {
  return <button className="primary-cta" type="button" onClick={onClick}><span>Получить прогноз по набору детей</span><ArrowRight aria-hidden="true" weight="bold" /></button>;
}

function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return <ul className={`offer-checks ${className}`}>{items.map(item => <li key={item}><Check aria-hidden="true" weight="bold" /><span>{item}</span></li>)}</ul>;
}

function PathLine({ children }: { children: string }) {
  const icons = [Megaphone, Eye, ChatCircle, MapPin, Handshake, UsersThree];
  return <p className="offer-path">{children.split(" → ").map((item, index) => {
    const Icon = icons[index];
    return <span className="offer-path-part" key={item}>{index > 0 && <span className="offer-path-arrow"> → </span>}<span className="offer-path-icon" aria-hidden="true"><Icon weight="duotone" /></span><strong>{item}</strong></span>;
  })}</p>;
}

export function OfferSections({ onLead }: { onLead: () => void }) {
  return <>
    <div className="opening-gradient-run offer-opening">
      <div className="opening-gradient-run__field" aria-hidden="true" />
      <section id="hero" tabIndex={-1} className="chapter hero-section">
        <div className="ambient ambient--hero" aria-hidden="true" />
        <div className="hero-content">
          <h1>
            <span className="hero-line hero-line--small">Дозаполните группы</span>{" "}
            <span className="hero-line hero-line--blue">в детском саду</span>{" "}
            <span className="hero-line hero-line--last"><span>и получите дополнительно</span>{" "}<em>от 2,7 до 36 млн ₸ выручки</em></span>
          </h1>
          <div className="hero-lower">
            <div className="hero-summary"><p className="hero-support">Система привлечения родителей через Facebook и Instagram в Астане и Алматы, которая приводит семьи, подходящие по бюджету и готовые прийти на экскурсию.</p>
              <p className="hero-context">У вас может быть сильный сад, довольные родители и хорошая репутация.</p>
              <p className="hero-context hero-loss">Но если группы загружены не на 100% — вы каждый месяц теряете деньги.</p>
            </div>
            <div className="hero-action"><OfferButton onClick={onLead} /></div>
          </div>
        </div>
      </section>

      <section id="revenue" className="offer-section revenue-section">
        <div className="revenue-intro reveal">
          <p className="offer-kicker">Сколько денег находится в свободных местах</p>
          <h2 className="display-title">Каждое свободное место — это не один потерянный платёж</h2>
          <p>Если ребёнок приходит в сад, он обычно остаётся не на один месяц.</p>
          <p>При среднем чеке <strong>150 000 ₸</strong> один ребёнок может принести:</p>
          <ul className="child-revenue">
            <li><Check aria-hidden="true" /><span>за 6 месяцев — <strong>900 000 ₸</strong></span></li>
            <li><Check aria-hidden="true" /><span>за 12 месяцев — <strong>1 800 000 ₸</strong></span></li>
            <li><Check aria-hidden="true" /><span>за 24 месяца — <strong>3 600 000 ₸</strong></span></li>
          </ul>
        </div>
        <div className="revenue-examples reveal">
          <div className="revenue-table-scroll" role="region" aria-label="Выручка от заполнения свободных мест" tabIndex={0}>
            <table className="revenue-table">
              <thead><tr><th scope="col">Свободных мест</th><th scope="col">За 6 месяцев</th><th scope="col">За 12 месяцев</th><th scope="col">За 24 месяца</th></tr></thead>
              <tbody>
                <tr><th scope="row">3 места</th><td>2 700 000 тг</td><td>5 400 000 тг</td><td>10 800 000 тг</td></tr>
                <tr><th scope="row">5 мест</th><td>4 500 000 тг</td><td>9 000 000 тг</td><td>18 000 000 тг</td></tr>
                <tr><th scope="row">10 мест</th><td>9 000 000 тг</td><td>18 000 000 тг</td><td>36 000 000 тг</td></tr>
              </tbody>
            </table>
          </div>
          <div className="revenue-total"><p>За два года 10 заполненных мест — это уже до <strong>36 млн ₸ выручки</strong>.</p><Image className="revenue-chair" src="/kindergarten-marketing-v2/assets/kindergarten-chair.png" alt="" aria-hidden="true" width={1254} height={1254} sizes="(max-width: 640px) 170px, 230px" /></div>
        </div>
      </section>
    </div>

    <section id="method" className="offer-section light-section method-section">
      <div className="method-heading reveal"><p className="offer-kicker">Как мы дозагружаем группы</p><h2 className="display-title">Создаём систему, которая приводит родителей не просто к заявке, а к экскурсии и договору</h2><Image className="method-object" src="/kindergarten-marketing-v2/assets/marketing-megaphone.png" alt="" aria-hidden="true" width={1536} height={1024} sizes="(max-width: 700px) 130px, (max-width: 1100px) 220px, 30vw" /><p className="method-intro">Максимально простая схема:</p></div>
      <div className="method-steps">
        <div className="method-step reveal"><h3>1. Показываем ваш сад родителям, которые уже выбирают детский сад</h3><p>Реклама в Facebook и Instagram работает постоянно и выводит ваш сад в поле зрения родителей в Астане и Алматы.</p></div>
        <div className="method-step reveal"><h3>2. До заявки объясняем, почему стоит выбрать именно вас</h3><p>Показываем программу, педагогов, атмосферу, условия, безопасность и вашу реальную уникальность — то, что вы знаете о своём саде, но новый родитель ещё не видит.</p></div>
        <div className="method-step reveal"><h3>3. Отсекаем случайный интерес</h3><p>Воронка помогает отделить родителей, которые просто собирают цены, от тех, кто подходит по бюджету и действительно выбирает сад.</p></div>
      </div>
      <div className="method-result reveal"><p>Дальше родитель проходит понятный путь:</p><PathLine>реклама → знакомство с садом → заявка → экскурсия → договор → ребёнок в группе</PathLine><p className="method-conclusion">Вместо ожидания рекомендаций появляется канал набора, которым можно управлять.</p></div>
    </section>

    <div className="visibility-control-gradient-run offer-middle">
      <div className="visibility-control-gradient-run__field" aria-hidden="true" />
      <section id="quality" className="offer-section quality-section">
        <div className="quality-heading reveal"><p className="offer-kicker offer-kicker--statement">«Частный сад от 150 000 ₸ в месяц» — никакой мелочи</p><h2 className="display-title">Можно получать заявки — и всё равно не получать новых детей в группы</h2></div>
        <div className="quality-grid">
          <div className="offer-prose quality-explanation reveal">
            <p>За время работы с привлечением родителей в частные школы и детские сады я протестировал разные версии воронок и нашёл структуру, которая даёт лучший результат.</p>
            <p>Во-первых, она отсекает всех, кто ищет «подешевле», сравнивает вас только по цене или просто собирает варианты.</p>
            <p>Остаются родители с подходящим бюджетом и реальным интересом к частному детскому саду.</p>
            <p>Во-вторых, воронка заранее показывает родителю <strong>кто вы</strong>.</p>
            <p className="quality-emphasis">Это критически важно.</p>
          </div>
          <div className="quality-objections reveal"><p>Сейчас на рынке много «маркетологов», которые дают заявки от тех, кто:</p><ul>{["«Не берёт трубку»", "«Мне просто узнать цену»", "«У вас дорого»", "«Я пока просто смотрю»", "«Я не оставлял заявку»"].map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="quality-resolution">
          <div className="offer-prose reveal"><p>Для таких родителей вы просто очередной детский сад, который должен быстро назвать цену и провести бесплатную консультацию по телефону.</p><p>Они ничего не знают про вас, вашу программу, педагогов, атмосферу и подход к детям.</p></div>
          <div className="offer-prose quality-solution reveal"><h3>Моя воронка работает иначе:</h3><p>родитель прогревается ещё до заявки — заранее получает информацию о вашем саде, понимает уровень стоимости, видит преимущества и осознанно делает следующий шаг.</p><p>Поэтому администратор получает не просто номер телефона, а родителя, которого уже можно вести к экскурсии и договору.</p></div>
        </div>
      </section>

      <section id="ready" className="offer-section ready-section">
        <div className="ready-heading reveal"><h2 className="display-title">«Когда можем приехать на экскурсию? Хотим, чтобы ребёнок ходил к вам»</h2><p className="ready-subtitle"><strong>Вот какой должна быть заявка после правильной воронки</strong></p></div>
        <div className="ready-grid">
          <div className="offer-prose ready-story reveal">
            <p>Когда родитель оставляет заявку через такую систему, он уже знает о вас и понимает, с кем общается.</p>
            <p>Он видел фото и видео ваших групп, изучил программу, посмотрел условия, прочитал отзывы других родителей и понял ваш подход к обучению и воспитанию.</p>
            <p className="ready-trust">Родитель понимает, почему именно вам можно доверить ребёнка 🤩</p>
            <p>Он видит, что у вас качественно, безопасно и с заботой.</p>
          </div>
          <div className="ready-kit reveal"><h3>Делать воронку самостоятельно, кстати, не нужно.</h3><p>Клиенты сразу получают готовую версию, настроенную под них:</p><CheckList items={["город", "контакты", "фотографии", "программа", "преимущества", "отзывы", "результаты и особенности сада"]} /></div>
        </div>
        <p className="ready-conclusion reveal">И пока кто-то надеется лишь на сарафанное радио или ведёт контент ради контента, <strong>вы запускаетесь по готовой технологии</strong> и получаете заявки от родителей с бюджетом от <strong>150 000 ₸</strong> и реальной готовностью к записи.</p>
      </section>
    </div>

    <section id="system" className="chapter system-section final-section">
      <div className="system-top"><h2 className="display-title system-title">Заберите выручку, которую сейчас забирает <em className="title-accent">недозагрузка</em></h2><p>Свободные места в группах могут стоить вашему саду от <strong>2,7 до 36 млн ₸ выручки</strong>.</p></div>
      <div className="system-bottom"><p className="final-intro">Мы помогаем вернуть эту выручку через систему:</p><PathLine>Facebook / Instagram → знакомство с садом → заявка → экскурсия → договор → ребёнок в группе</PathLine>
        <div className="final-content"><div className="final-copy"><p>Вы не просто получаете рекламу.</p><p>Вы получаете систему, которая помогает:</p><CheckList items={["привлечь подходящих родителей", "показать ценность сада до первого звонка", "довести родителей до экскурсии", "увеличить количество договоров", "дозагрузить свободные места в группах"]} /></div><div className="final-cta"><OfferButton onClick={onLead} /></div></div>
      </div>
    </section>
  </>;
}
