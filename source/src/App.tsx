import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, Plus, Star } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderHandle, useReactCompareSliderContext } from 'react-compare-slider';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';
import CardNav from './components/CardNav';
import GooeyNav from './components/GooeyNav';
import Waves from './components/Waves';
import { useComparisonAutoplay } from './components/useComparisonAutoplay';
import AnimatedPrice from './components/AnimatedPrice';
import { copy, extras, image, PHONE, PHONE_LINK, services, TELEGRAM, type Language } from './content';
import { concise } from './concise';
import { useScrollReveal } from './useScrollReveal';
import ComparisonLoupe from './components/ComparisonLoupe';
import FadeContent from './components/FadeContent';

const money = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;
const navSections = ['hero', 'calc', 'ba-s', 'faq'];

function Wordmark() {
  return <span className="lg2" role="img" aria-label="Чисто Конкретно"><span className="t"><b>ЧИСТО</b><i /></span><em>КОНКРЕТНО</em></span>;
}

function AccentTitle({ text, word }: { text: string; word: string }) {
  return <>{text.split(word).map((part, i) => <span key={i}>{i > 0 && <em className="serif">{word}</em>}{part}</span>)}</>;
}

function ServiceName({ name }: { name: string }) {
  return <>{name.split(/(\S*-\S*)/).map((part, i) => i % 2
    ? <span className="unbroken-word" key={i}>{part}</span>
    : part)}</>;
}

function ComparisonHandle({ label, loupeLabel, loupeHint }: { label: string; loupeLabel: string; loupeHint: string }) {
  useComparisonAutoplay();
  const { handleRootRef } = useReactCompareSliderContext();
  useEffect(() => { handleRootRef.current?.setAttribute('aria-label', label); }, [handleRootRef, label]);
  return <><ReactCompareSliderHandle buttonStyle={{ width: 48, height: 48, backgroundColor: '#E8E9F1', backdropFilter: 'none' }} linesStyle={{ outlineColor: '#E8E9F1' }} style={{ '--rcs-handle-color': '#14161A' } as React.CSSProperties} /><ComparisonLoupe src={image} label={loupeLabel} hint={loupeHint} /></>;
}

function Review({ review, quote, language }: { review: typeof copy.ru.reviews[number]; quote: string; language: Language }) {
  return <article className="review review-card">
    <header className="review-card-heading"><div><h3>{review.author}</h3><p className="review-place">{review.place}</p></div><span className="review-rating" role="img" aria-label={language === 'ru' ? '5 из 5' : '5 out of 5'}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill="currentColor" aria-hidden="true" />)}</span></header>
    <blockquote>{quote}</blockquote>
  </article>;
}

function Calculator({ language }: { language: Language }) {
  const t = { ...copy[language], ...concise[language] };
  const index = language === 'ru' ? 0 : 1;
  const [selected, setSelected] = useState<number[]>([]);
  const [additional, setAdditional] = useState<number[]>([]);
  const [area, setArea] = useState('4');
  const [toast, setToast] = useState(false);
  const metres = Math.min(200, Math.max(1, Math.round(Number(area) || 1)));
  const toggle = (values: number[], i: number) => values.includes(i) ? values.filter(v => v !== i) : [...values, i];
  const total = services.reduce((sum, service, i) => sum + (selected.includes(i) ? service.price * (i === 5 ? metres : 1) : 0), 0)
    + (selected.length ? extras.reduce((sum, extra, i) => sum + (additional.includes(i) ? extra.price : 0), 0) : 0);
  const names = services.flatMap((service, i) => selected.includes(i) ? [i === 5 ? `${t.carpet} ${metres} м²` : service.name[index]] : [])
    .concat(selected.length ? extras.flatMap((extra, i) => additional.includes(i) ? [extra.name[index]] : []) : []);
  const message = selected.length ? `${t.message} ${names.join(', ')}. ${t.estimate}: ${money(total)}.` : t.emptyMessage;
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  return <section id="calc" className="section price-section" aria-labelledby="calc-heading">
    <div className="wrap">
      <h2 id="calc-heading">{t.calcTitle}</h2>
      <div className="calculator">
        <div className="calculator-options">
          <fieldset><legend className="sr-only">{t.what}</legend>
            <div className="service-options">{services.map((service, i) => <button key={service.name[0]} type="button" className={`service-option ${selected.includes(i) ? 'selected' : ''}`} aria-pressed={selected.includes(i)} onClick={() => setSelected(toggle(selected, i))}>
              <span className="option-check" aria-hidden="true">{selected.includes(i) && <Check size={15} />}</span><span><ServiceName name={service.name[index]} /></span><span className="option-price">{money(service.price)}</span>
            </button>)}</div>
            {selected.includes(5) && <div className="area-field"><label htmlFor="area">{t.area}</label><input id="area" type="number" min="1" max="200" step="1" value={area} onChange={e => setArea(e.target.value)} onBlur={() => setArea(String(metres))} /></div>}
          </fieldset>
          <details className="extras"><summary>{t.additional}<Plus size={18} aria-hidden="true" /></summary>
            {extras.map((extra, i) => <label className="extra-option" key={extra.name[0]}><input type="checkbox" checked={additional.includes(i)} onChange={() => setAdditional(toggle(additional, i))} /><span>{extra.name[index]}</span><span className="option-price">+{money(extra.price)}</span></label>)}
          </details>
        </div>
        <aside className="calculator-total" aria-label={t.estimate}>
          <span className="small-label">{t.estimate}</span><AnimatedPrice value={total} />
          <p className="total-selection">{names.length ? names.join(' · ') : t.empty}</p>
          <a className="btn" href={`${TELEGRAM}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={() => navigator.clipboard?.writeText(message).then(() => setToast(true)).catch(() => {})}>{t.order}<ArrowUpRight size={19} aria-hidden="true" /></a>
          <p className="small-note">{t.totalNote}</p>
        </aside>
      </div>
    </div>
    {toast && <div className="toast" role="status">{t.copyMessage}</div>}
  </section>;
}

export default function App() {
  useScrollReveal();
  const [language, setLanguage] = useState<Language>('ru');
  const [activeNav, setActiveNav] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const navLock = useRef(0);
  const t = { ...copy[language], ...concise[language] };
  const gooeyItems = useMemo(() => concise[language].navLabels.map((label, i) => ({ label, href: `#${navSections[i]}` })), [language]);
  const cardItems = useMemo(() => [
    { label: concise[language].navGroups[0], links: [{ label: concise[language].calcTitle, href: '#calc' }, { label: concise[language].stepsTitle, href: '#steps' }] },
    { label: concise[language].navGroups[1], links: [{ label: concise[language].comparisonTitle, href: '#ba-s' }, { label: language === 'ru' ? 'Отзывы' : 'Reviews', href: '#rev' }, { label: language === 'ru' ? 'Вопросы' : 'Questions', href: '#faq' }] },
    { label: concise[language].navGroups[2], links: [{ label: 'Telegram', href: TELEGRAM }, { label: PHONE, href: PHONE_LINK }, { label: language === 'ru' ? 'English' : 'Русский' }] },
  ], [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy[language].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy[language].description);
  }, [language]);
  useEffect(() => {
    const update = () => {
      if (performance.now() < navLock.current) return;
      let next = 0;
      const positions = navSections.map((id, index) => ({ index, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }));
      positions.filter(p => p.top <= window.innerHeight * .35).sort((a, b) => b.top - a.top).forEach((p, i) => { if (i === 0) next = p.index; });
      setActiveNav(next);
    };
    const settled = () => { navLock.current = 0; update(); };
    addEventListener('scroll', update, { passive: true }); addEventListener('scrollend', settled); addEventListener('resize', update); update();
    return () => { removeEventListener('scroll', update); removeEventListener('scrollend', settled); removeEventListener('resize', update); };
  }, []);
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header"><div className="wrap">
      <CardNav logo={<Wordmark />} logoAlt={t.backToTop} logoHref="#hero" items={cardItems} cta={{ label: t.photoAction, href: TELEGRAM }} theme="dark" surface="glass" maxWidth={1120} cardHeight={146} cardEffect="rise" bounce={.08} stagger={.07} intro={false} openLabel={t.navOpen} closeLabel={t.navClose} ariaLabel={t.mainNav} onLinkClick={link => { if (!link.href) setLanguage(language === 'ru' ? 'en' : 'ru'); }}
        style={{ '--cn-panel': 'rgba(23,25,33,.92)', '--cn-solid': '#171921', '--cn-tile': '#22252F', '--cn-text': '#F1F1F3', '--cn-muted': '#A7ABB9', '--cn-logo': '38px' } as React.CSSProperties}
        navigation={<GooeyNav items={gooeyItems} activeIndex={activeNav} onChange={index => { navLock.current = performance.now() + 1000; setActiveNav(index); }} theme="dark" frame={false} color="#E8E9F1" activeTextColor="#101217" particleCount={10} spread={24} animationTime={480} timeVariance={100} gooeyness={.45} wobble={.2} />}
      />
    </div></header>
    <main id="main">
      <section id="hero" className="hero" aria-labelledby="hero-heading">
        <div className="hero-background" aria-hidden="true"><Waves backgroundColor="#0B0D12" lineColor="#747C9B" accentColor="#8992C3" dpr={1} /></div>
        <div className="wrap hero-grid"><div className="hero-copy">
          <h1 id="hero-heading">{t.heroTitle}<br /><span className="serif">{t.heroSecond}</span></h1>
          <p className="hero-body">{t.heroBody}</p>
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn">{t.photoAction}<ArrowUpRight size={20} aria-hidden="true" /></a>
        </div></div>
      </section>

      <section id="ba-s" className="section comparison-section" aria-labelledby="comparison-heading"><div className="wrap">
        <h2 id="comparison-heading"><AccentTitle text={t.comparisonTitle} word={language === 'ru' ? 'после' : 'after'} /></h2>
        <div className="comparison-frame" role="group" aria-label={t.sliderLabel}>
          <ReactCompareSlider className="comparison-slider" defaultPosition={50} keyboardIncrement="5%" onlyHandleDraggable handle={<ComparisonHandle label={t.sliderLabel} loupeLabel={t.loupeOpen} loupeHint={t.loupeHint} />} itemOne={<div className="comparison-image dirty"><img src={image} alt={t.before} draggable={false} /></div>} itemTwo={<div className="comparison-image"><img src={image} alt={t.after} draggable={false} /></div>} />
          <span className="comparison-tag tag-before">{t.before}</span><span className="comparison-tag tag-after">{t.after}</span>
        </div><p className="small-note comparison-note">{t.photoNote}</p>
      </div></section>

      <section id="steps" className="section process-section" aria-labelledby="steps-heading"><div className="wrap">
        <FadeContent as="h2" id="steps-heading" effect="mist" duration={1.8} threshold={.1}><AccentTitle text={t.stepsTitle} word={language === 'ru' ? 'работает' : 'works'} /></FadeContent>
        <FadeContent as="ol" className="steps-list process-cards" effect="mist" duration={1.8} stagger={.1} threshold={.1}>{t.steps.map(([, body], i) => <li key={i}><div><h3>{t.stepLabels[i]}</h3><p>{body}</p></div></li>)}</FadeContent>
      </div></section>

      <Calculator language={language} />

      <div className="section information-section"><div className="wrap information-grid">
        <section id="rev" aria-labelledby="review-heading"><FadeContent as="h2" id="review-heading" effect="mist" duration={1.8} threshold={.1}><AccentTitle text={t.reviewsTitle} word={language === 'ru' ? 'клиенты' : 'customers'} /></FadeContent><FadeContent className="reviews" effect="mist" duration={1.8} stagger={.1} threshold={.1}>{t.reviews.map((review, i) => <Review review={review} quote={t.reviewQuotes[i]} language={language} key={i} />)}</FadeContent></section>
        <section id="faq" aria-labelledby="faq-heading"><FadeContent as="h2" id="faq-heading" effect="mist" duration={1.8} threshold={.1}><AccentTitle text={t.faqTitle} word={language === 'ru' ? 'вопросы' : 'questions'} /></FadeContent><FadeContent className="faq-reveal" effect="mist" duration={1.8} threshold={.1}><Accordion flush className="faq-accordion" arrowIcon={Plus}>{t.faq.map(([question, answer], i) => <AccordionPanel key={i}><div className="faq-item"><AccordionTitle as="h3" id={`faq-question-${i}`} className="faq-title" aria-expanded={faqOpen === i} aria-controls={`faq-answer-${i}`} onClickCapture={() => setFaqOpen(faqOpen === i ? null : i)}>{question}</AccordionTitle><AccordionContent hidden={false} className="faq-answer smooth-panel" data-open={faqOpen === i} aria-hidden={faqOpen !== i} id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`}><div className="smooth-panel-inner"><div className="faq-answer-body"><p>{answer}</p></div></div></AccordionContent></div></AccordionPanel>)}</Accordion></FadeContent></section>
      </div></div>

      <section id="contact" className="section contact-section" aria-labelledby="cta-heading">
        <div className="contact-panel">
          <div className="contact-panel-content">
            <h2 id="cta-heading"><AccentTitle text={t.ctaTitle} word={language === 'ru' ? 'чистка' : 'cleaning'} /></h2>
            <p className="contact-description">{t.contactDescription}</p>
            <div className="contact-actions">
              <a className="btn contact-write" href={TELEGRAM} target="_blank" rel="noopener noreferrer">{t.contactWrite}</a>
              <a className="btn" href={PHONE_LINK}>{t.contactCall}</a>
            </div>
            <div className="contact-links"><a href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram</a><span aria-hidden="true">·</span><a href={PHONE_LINK}>{PHONE}</a></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="site-footer"><div className="wrap footer-top"><a href="#hero" className="logo" aria-label={t.backToTop}><Wordmark /></a><p>{t.footerBody}</p><a href={PHONE_LINK}>{PHONE}</a><a href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram<ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="wrap footer-bottom"><address>{t.address} {t.street}</address><button className="language-switch" type="button" lang={language === 'ru' ? 'en' : 'ru'} onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}>{language === 'ru' ? 'English' : 'Русский'}</button></div></footer>
  </>;
}
