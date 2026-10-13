import clsx from "clsx";
import Image from "next/image";
import type { BrandBookContent } from "../_content";
import { Chapter, PartDivider } from "./Chapter";
import styles from "./BrandBook.module.css";

const MOODS = [
  { src: "mood-0-focused.png", width: 496, height: 238, en: "FOCUSED" },
  { src: "mood-1-ontheway.png", width: 552, height: 253, en: "ON THE WAY" },
  { src: "mood-2-details.png", width: 558, height: 253, en: "DETAILS" },
  { src: "mood-3-clean.png", width: 546, height: 253, en: "CLEAN" },
  { src: "mood-4-finished.png", width: 552, height: 288, en: "FINISHED" },
  { src: "mood-5-relax.png", width: 552, height: 288, en: "RELAX" },
];

const SWATCHES = [
  { hex: "#6A4FB6", ink: "#FFFFFF", en: "Royal Lavender — primary", rgb: "106·79·182", cmyk: "42·57·0·29" },
  { hex: "#5A3E92", ink: "#FFFFFF", en: "Deep Purple — anchor", rgb: "90·62·146", cmyk: "38·58·0·43" },
  { hex: "#BCA7E8", ink: "#3A2A60", en: "Soft Lavender — support", rgb: "188·167·232", cmyk: "19·28·0·9" },
  { hex: "#FFFFFF", ink: "#797D8A", en: "White — base", rgb: "255·255·255", cmyk: "0·0·0·0" },
  { hex: "#F1F3F6", ink: "#797D8A", en: "Light — background", rgb: "241·243·246", cmyk: "2·1·0·4" },
  { hex: "#E1E5EA", ink: "#797D8A", en: "light Gray — surface", rgb: "225·229·234", cmyk: "4·2·0·8" },
  { hex: "#797D8A", ink: "#FFFFFF", en: "Gray — secondary text", rgb: "121·125·138", cmyk: "12·9·0·46" },
  { hex: "#111315", ink: "#BCA7E8", en: "Dark — ink / dark mode", rgb: "17·19·21", cmyk: "19·10·0·92" },
];

const RATIO = [
  { hex: "#F1F3F6", ink: "#797D8A", share: 42, label: "42%" },
  { hex: "#6A4FB6", ink: "#FFFFFF", share: 26, label: "26%" },
  { hex: "#5A3E92", ink: "#FFFFFF", share: 14, label: "14" },
  { hex: "#BCA7E8", ink: "#3A2A60", share: 10, label: "10" },
  { hex: "#797D8A", ink: "#FFFFFF", share: 8, label: "8" },
];

const VOICE_LINES = [
  { ar: "نحن لا نغسل فقط. نحن IRIS.", en: "We don't just wash. We IRIS." },
  { ar: "دقّة في كل تفصيل. لمعان في كل رحلة.", en: "Precision in every detail. Shine in every trip." },
  { ar: "سيارتك. عنايتنا.", en: "Your car. Our care." },
  {
    ar: "النظافة معيارنا. التفاصيل تُغيّر كل شيء.",
    en: "Cleanliness is our standard. Details change everything.",
  },
  { ar: "عناية فاخرة، من الداخل والخارج.", en: "Premium Care, Inside & Out." },
];

export default function BrandPart({ c }: { c: BrandBookContent }) {
  return (
    <>
      <PartDivider id="part1" number="PART I" {...c.parts.brand} />

      <Chapter id="idea" num="01" kicker={c.idea.kicker} title={c.idea.title} lead={c.idea.lead}>
        <div className={clsx(styles.grid, styles.g2)}>
          {c.idea.cards.map((card) => (
            <div key={card.title} className={styles.card}>
              <span className={clsx(styles.pill, styles.pillGap)}>{card.pill}</span>
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter id="character" num="02" kicker={c.character.kicker} title={c.character.title}>
        <div className={clsx(styles.grid, styles.g2, styles.alignCenter)}>
          <div className={styles.mascotPanel}>
            <div className="iris-pattern" />
            <Image
              src="/brand/iris-mascot.png"
              alt={c.cover.mascotAlt}
              width={490}
              height={895}
              sizes="200px"
              className={styles.mascotLarge}
            />
          </div>
          <div>
            <p className={styles.lead}>{c.character.lead}</p>
            <div className={clsx(styles.grid, styles.g3, styles.gridTight)}>
              {c.character.traits.map((trait, index) => (
                <div key={trait} className={styles.card}>
                  <h4>{"ABC"[index]}</h4>
                  <p>{trait}</p>
                </div>
              ))}
            </div>
            <div className={styles.pills}>
              {c.character.pills.map((pill) => (
                <span key={pill} className={styles.pill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter id="moods" num="03" alt kicker={c.moods.kicker} title={c.moods.title} lead={c.moods.lead}>
        <div className={clsx(styles.grid, styles.g3)}>
          {MOODS.map((mood, index) => {
            const copy = c.moods.items[index];
            return (
              <div key={mood.src} className={styles.moodCard}>
                <Image
                  src={`/brand/moods/${mood.src}`}
                  alt={copy.name}
                  width={mood.width}
                  height={mood.height}
                  sizes="(max-width: 900px) 45vw, 340px"
                  className={styles.moodImage}
                />
                <div className={`mono ${styles.moodEn}`}>{mood.en}</div>
                <div className={styles.moodName}>{copy.name}</div>
                <div className={styles.moodState}>{copy.state}</div>
                <div className={styles.moodNotif}>{copy.notification}</div>
              </div>
            );
          })}
        </div>
        <div className={clsx(styles.grid, styles.g2, styles.gridTight)}>
          <div className={clsx(styles.card, styles.cardDo)}>
            <h4>✓ {c.moods.doTitle}</h4>
            <p>{c.moods.doText}</p>
          </div>
          <div className={clsx(styles.card, styles.cardDont)}>
            <h4>✕ {c.moods.dontTitle}</h4>
            <p>{c.moods.dontText}</p>
          </div>
        </div>
      </Chapter>

      <Chapter id="logo" num="04" kicker={c.logo.kicker} title={c.logo.title} lead={c.logo.lead}>
        <div className={clsx(styles.grid, styles.g2)}>
          <div>
            <div className={clsx(styles.logoPanel, styles.onLight)}>
              <Image src="/brand/iris-logo-black.png" alt="IRIS" width={727} height={399} />
            </div>
            <p className={`mono ${styles.caption}`}>{c.logo.onLight}</p>
          </div>
          <div>
            <div className={clsx(styles.logoPanel, styles.onDark)}>
              <Image src="/brand/iris-logo-white.png" alt="IRIS" width={727} height={399} />
            </div>
            <p className={`mono ${styles.caption}`}>{c.logo.onDark}</p>
          </div>
        </div>
        <div className={clsx(styles.grid, styles.g4, styles.gridTight)}>
          <div className={styles.card}>
            <h4>{c.logo.construction.title}</h4>
            <p>{c.logo.construction.text}</p>
          </div>
          <div className={styles.card}>
            <h4>{c.logo.clearSpace.title}</h4>
            <p>{c.logo.clearSpace.text}</p>
          </div>
          <div className={styles.card}>
            <h4>{c.logo.minSize.title}</h4>
            <p>
              <span className="mono">Print 24mm · Digital 96px</span>
              <br />
              {c.logo.minSize.text}
            </p>
          </div>
          <div className={styles.card}>
            <h4>{c.logo.misuseTitle}</h4>
            <p>
              {c.logo.misuse.map((rule) => (
                <span key={rule}>
                  <span className={styles.cross}>✕</span> {rule}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      </Chapter>

      <Chapter id="color" num="05" alt kicker={c.color.kicker} title={c.color.title}>
        <div className={clsx(styles.grid, styles.g4)}>
          {SWATCHES.map((swatch, index) => (
            <div key={swatch.hex} className={styles.swatch}>
              <div className={styles.chip} style={{ background: swatch.hex, color: swatch.ink }}>
                {index === 0 && <span className={`mono ${styles.typeRole}`}>PRIMARY</span>}
              </div>
              <div className={styles.swatchMeta}>
                <div className={styles.swatchName}>{c.color.names[index]}</div>
                <div className={`mono ${styles.swatchEn}`}>{swatch.en}</div>
                <div className={`mono ${styles.swatchVals}`}>
                  <span dir="ltr">{swatch.hex}</span> · RGB {swatch.rgb}
                  <br />
                  CMYK {swatch.cmyk}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={clsx(styles.kicker, styles.kickerSpaced)}>
          <span>{c.color.usageKicker}</span>
        </div>
        <div className={`mono ${styles.ratioBar}`}>
          {RATIO.map((part) => (
            <span
              key={part.hex}
              style={{ background: part.hex, color: part.ink, width: `${part.share}%` }}
            >
              {part.label}
            </span>
          ))}
        </div>
        <p className={styles.note}>{c.color.usageText}</p>
      </Chapter>

      <Chapter id="type" num="06" kicker={c.type.kicker} title={c.type.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          <div className={styles.card}>
            <div className={`mono ${styles.typeRole}`}>{c.type.displayRole}</div>
            <div className={styles.typeBig}>SK Quadratica</div>
            <div className={styles.lead}>A modern geometric sans</div>
            <div className={`mono ${styles.typeWeights}`}>{c.type.displayNote}</div>
          </div>
          <div className={styles.card}>
            <div className={`mono ${styles.typeRole}`}>{c.type.bodyRole}</div>
            <div className={clsx(styles.typeBig, styles.latin)}>Roboto</div>
            <div className={clsx(styles.typeSample, styles.latin)}>ABCabc · 0123456789</div>
            <div className={`mono ${styles.typeWeights}`}>
              Regular 400 · Medium 500 · Bold 700 · Black 900
            </div>
          </div>
          <div className={styles.card}>
            <div className={`mono ${styles.typeRole}`}>{c.type.arabicRole}</div>
            <div className={clsx(styles.typeBig, styles.arabic)}>{c.type.arabicName}</div>
            <div className={clsx(styles.typeSample, styles.arabic)}>
              أبجد هوّز حطّي · ٠١٢٣٤٥٦٧٨٩
            </div>
            <div className={`mono ${styles.typeWeights}`}>
              Regular 400 · Medium 500 · Bold 700 · ExtraBold 800
            </div>
          </div>
        </div>
        <div className={clsx(styles.grid, styles.g2, styles.gridTight, styles.alignCenter)}>
          <div className={styles.card}>
            <div className={styles.kicker}>{c.type.scaleKicker}</div>
            <div className={styles.scaleH1}>H1 · 48</div>
            <div className={styles.scaleH2}>{c.type.scaleH2}</div>
            <div className={styles.scaleBody}>{c.type.scaleBody}</div>
            <div className={styles.scaleCaption}>Caption / Label · 12</div>
          </div>
          <div className={styles.card}>
            <div className={styles.kicker}>{c.type.pairingKicker}</div>
            <h4>SK Quadratica → Roboto → Tajawal</h4>
            <p>{c.type.pairingText}</p>
          </div>
        </div>
      </Chapter>

      <Chapter id="pattern" num="07" alt kicker={c.pattern.kicker} title={c.pattern.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          <div>
            <div className={styles.patternDemo} style={{ background: "var(--iris-ink)" }}>
              <div className="iris-pattern-strong" />
            </div>
            <p className={`mono ${styles.caption}`}>{c.pattern.onDark}</p>
          </div>
          <div>
            <div className={styles.patternDemo} style={{ background: "var(--iris-paper)" }}>
              <div className="iris-pattern-strong" style={{ opacity: 0.22 }} />
            </div>
            <p className={`mono ${styles.caption}`}>{c.pattern.onLight}</p>
          </div>
          <div>
            <div className={styles.patternDemo} style={{ background: "var(--iris-violet)" }}>
              <div className="iris-pattern-sun" />
            </div>
            <p className={`mono ${styles.caption}`}>{c.pattern.onViolet}</p>
          </div>
        </div>
        <div className={clsx(styles.grid, styles.g3, styles.gridTight)}>
          {c.pattern.cards.map((card) => (
            <div key={card.title} className={styles.card}>
              <h4>{card.title}</h4>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter id="voice" num="08" kicker={c.voice.kicker} title={c.voice.title}>
        <div className={styles.sprints}>
          {VOICE_LINES.map((line) => (
            <div key={line.en} className={styles.voiceLine}>
              {line.ar}
              <span className={`mono ${styles.voiceEn}`}>{line.en}</span>
            </div>
          ))}
        </div>
      </Chapter>
    </>
  );
}
