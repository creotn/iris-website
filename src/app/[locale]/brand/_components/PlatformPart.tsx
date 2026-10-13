import clsx from "clsx";
import { Fragment } from "react";
import type { BrandBookContent } from "../_content";
import { Chapter, PartDivider } from "./Chapter";
import styles from "./BrandBook.module.css";

const MARKET_STATS = ["15M+", "95%", "8.3%", "2030"];
const PLATFORM_STACK = ["React Native", "Next.js", "ReactJS", "NestJS", "PostgreSQL"];
const PACKAGE_PRICES = [59, 49, 39, 29];
const BEST_PACKAGE = 2;
const AI_TAGS = ["AI · Smart Dispatch", "AI · Demand Forecasting", "AI · Quality Scoring"];
const SPRINT_REUSE = ["85%", "60%", "40%", "50%", "30%", "70%"];

const ARCH_NODES = [
  ["Mobile · React Native", "Dashboard · ReactJS", "Website · Next.js"],
  ["REST API", "JWT Auth + Guards", "Rate Limiting", "Swagger / OpenAPI"],
  ["Smart Dispatch", "Demand Forecasting", "Quality Scoring AI"],
  ["User", "Order", "Payment", "Notification", "Location"],
  ["PostgreSQL · Primary", "Redis · Cache+Sessions", "AWS S3 · Media"],
];

const DB_TABLES = [
  ["users", "id, name, role, wallet_balance"],
  ["orders", "user_id, tech_id, status, price"],
  ["technicians", "role, status, company_id"],
  ["partners", "type, contract, sla_minutes"],
  ["services", "name, price, duration_min"],
  ["payments", "order_id, amount, method, status"],
];

const API_ROUTES = [
  [["POST", "/auth/login · /register"]],
  [
    ["GET", "/orders · "],
    ["POST", "/orders"],
  ],
  [["PATCH", "/orders/:id/status"]],
  [["GET", "/services · /services/:id"]],
  [["GET", "/technicians/nearby"]],
  [["GET", "/partners/:id/fleet"]],
  [["POST", "/payments/initiate · /webhook"]],
];

// Per row: IRIS, traditional, competitors. "partial"/"limited" render as muted text.
const EDGE_MATRIX: ("yes" | "no" | "partial" | "limited")[][] = [
  ["yes", "yes", "partial"],
  ["yes", "no", "partial"],
  ["yes", "no", "no"],
  ["yes", "no", "no"],
  ["yes", "no", "no"],
  ["yes", "no", "no"],
  ["yes", "no", "limited"],
  ["yes", "no", "partial"],
  ["yes", "no", "no"],
];

export default function PlatformPart({ c }: { c: BrandBookContent }) {
  const edgeCell = (value: (typeof EDGE_MATRIX)[number][number]) => {
    if (value === "yes") return <span className={styles.yes}>✓</span>;
    if (value === "no") return <span className={styles.no}>✕</span>;
    return <span className={styles.partial}>{c.edge[value]}</span>;
  };

  return (
    <>
      <PartDivider id="part2" number="PART II" {...c.parts.platform} />

      <Chapter id="market" num="09" kicker={c.market.kicker} title={c.market.title}>
        <div className={clsx(styles.grid, styles.g4)}>
          {MARKET_STATS.map((stat, index) => (
            <div key={stat} className={clsx(styles.card, styles.centered)}>
              <div className={styles.statNum} dir="ltr">
                {stat}
              </div>
              <div className={styles.statLbl}>{c.market.stats[index]}</div>
            </div>
          ))}
        </div>
        <div className={clsx(styles.kicker, styles.kickerSpaced)}>
          <span>{c.market.painKicker}</span>
        </div>
        <div className={clsx(styles.grid, styles.g4, styles.gridTight)}>
          {c.market.pains.map((pain) => (
            <div key={pain.title} className={styles.card}>
              <h4>{pain.title}</h4>
              <p>{pain.text}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter id="platform" num="10" alt kicker={c.platform.kicker} title={c.platform.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          {c.platform.components.map((component, index) => (
            <div key={component.title} className={styles.card}>
              <div className={`mono ${styles.monoLabel}`}>{PLATFORM_STACK[index]}</div>
              <h4>{component.title}</h4>
              <p>{component.text}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter id="services" num="11" kicker={c.services.kicker} title={c.services.title}>
        <div className={clsx(styles.grid, styles.g4)}>
          {c.services.packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={clsx(styles.pkg, index === BEST_PACKAGE && styles.pkgBest)}
            >
              {index === BEST_PACKAGE && (
                <div className={`mono ${styles.pkgTag}`}>{c.services.bestValue}</div>
              )}
              <div className={`mono ${styles.pkgName}`}>{pkg.name}</div>
              <div className={`mono ${styles.pkgPrice}`}>
                {PACKAGE_PRICES[index]} <small>{c.services.currency}</small>
              </div>
              <div className={styles.pkgTerm}>{pkg.term}</div>
            </div>
          ))}
        </div>
        <p className={`mono ${styles.noteCenter}`}>{c.services.average}</p>
        <div className={clsx(styles.kicker, styles.kickerSpaced)}>
          <span>{c.services.protocolKicker}</span>
        </div>
        <div className={styles.card}>
          {c.services.protocol.map((step, index) => (
            <div key={step.title} className={styles.stepRow}>
              <span className={styles.stepNum}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <b>{step.title}</b> — <span className={styles.muted}>{step.text}</span>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.note}>{c.services.future}</p>
      </Chapter>

      <Chapter id="app" num="12" alt kicker={c.app.kicker} title={c.app.title}>
        <div className={clsx(styles.grid, styles.g2)}>
          <div className={styles.card}>
            <div className={`mono ${styles.monoLabel}`}>Dashboard · ReactJS</div>
            <div className={clsx(styles.grid, styles.g4, styles.dashStats)}>
              {[
                <>1,248</>,
                <>
                  87<small className={styles.statUnit}>/120</small>
                </>,
                <>
                  12<small className={styles.statUnit}>m</small>
                </>,
                <>
                  4.8<small className={clsx(styles.statUnit, styles.num)}>★</small>
                </>,
              ].map((value, index) => (
                <div key={index} className={styles.centered}>
                  <div className={clsx(styles.statNum, styles.statNumSm)}>{value}</div>
                  <div className={clsx(styles.statLbl, styles.statLblSm)}>
                    {c.app.dashboardStats[index]}
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.longText}>{c.app.dashboardText}</p>
          </div>
          <div className={styles.card}>
            <div className={`mono ${styles.monoLabel}`}>Mobile App · React Native</div>
            <ul className={styles.featureList}>
              {c.app.mobileFeatures.map((feature) => (
                <li key={feature.title}>
                  <b>◎ {feature.title}</b> — <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.accentNote}>{c.app.note}</p>
      </Chapter>

      <Chapter id="tech" num="13" kicker={c.tech.kicker} title={c.tech.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          {c.tech.tracks.map((track) => (
            <div key={track.title} className={styles.card}>
              <span className={clsx(styles.pill, styles.pillGap)}>{track.pill}</span>
              <h4>{track.title}</h4>
              <p>{track.text}</p>
            </div>
          ))}
        </div>
        <code className={clsx("mono", styles.code, styles.codeBox)}>
          <span className={styles.method}>technicians:</span> role
          &apos;internal|external|partner&apos; · company_id (FK→partners) · status ·
          approval_docs (JSONB) · commission_rate
        </code>
      </Chapter>

      <Chapter id="b2b" num="14" alt kicker={c.b2b.kicker} title={c.b2b.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          {c.b2b.segments.map((segment) => (
            <div key={segment.title} className={styles.card}>
              <h4>{segment.title}</h4>
              <p>{segment.text}</p>
            </div>
          ))}
        </div>
        <div className={clsx(styles.grid, styles.g2, styles.gridTight)}>
          <div className={styles.card}>
            <h4>{c.b2b.howTitle}</h4>
            {c.b2b.how.map((step, index) => (
              <div key={step} className={styles.stepRow}>
                <span className={styles.stepNum}>{String(index + 1).padStart(2, "0")}</span>
                <div>{step}</div>
              </div>
            ))}
          </div>
          <div className={styles.card}>
            <h4>{c.b2b.benefitsTitle}</h4>
            <p className={styles.benefits}>{c.b2b.benefits}</p>
          </div>
        </div>
      </Chapter>

      <Chapter id="ai" num="15" kicker={c.ai.kicker} title={c.ai.title}>
        <div className={clsx(styles.grid, styles.g3)}>
          {c.ai.solutions.map((item, index) => (
            <div key={item.title} className={styles.card}>
              <div className={`mono ${styles.monoLabel}`}>{AI_TAGS[index]}</div>
              <h4>{item.title}</h4>
              <p>
                <b>{c.ai.problemLabel}</b> {item.problem}
                <br />
                <b>{c.ai.solutionLabel}</b> {item.solution}
              </p>
            </div>
          ))}
        </div>
        <div className={clsx(styles.kicker, styles.kickerSpaced)}>
          <span>{c.ai.plugKicker}</span>
        </div>
        <div className={clsx(styles.grid, styles.g4, styles.gridTight)}>
          {c.ai.plugs.map((plug) => (
            <div key={plug.title} className={styles.card}>
              <h4>{plug.title}</h4>
              <p>{plug.text}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter id="arch" num="16" alt kicker={c.arch.kicker} title={c.arch.title}>
        <div className={clsx(styles.grid, styles.g2)}>
          <div>
            {ARCH_NODES.map((nodes, index) => (
              <Fragment key={c.arch.layers[index]}>
                {index > 0 && <div className={styles.archArrow}>▼</div>}
                <div className={styles.archLayer}>
                  <div className={`mono ${styles.archLayerTitle}`}>{c.arch.layers[index]}</div>
                  <div className={styles.nodes}>
                    {nodes.map((node) => (
                      <span key={node} className={`mono ${styles.node}`}>
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div className={styles.stack}>
            <div className={styles.card}>
              <div className={styles.kicker}>PostgreSQL · {c.arch.tables}</div>
              {DB_TABLES.map(([table, columns]) => (
                <code key={table} className={`mono ${styles.code}`}>
                  <span className={styles.method}>{table}</span> {columns}
                </code>
              ))}
            </div>
            <div className={styles.card}>
              <div className={styles.kicker}>NestJS · {c.arch.api}</div>
              {API_ROUTES.map((route, index) => (
                <code key={index} className={`mono ${styles.code}`}>
                  {route.map(([method, path]) => (
                    <Fragment key={method + path}>
                      <span className={styles.method}>{method}</span> {path}
                    </Fragment>
                  ))}
                </code>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="roadmap"
        num="17"
        kicker={c.roadmap.kicker}
        title={c.roadmap.title}
        lead={c.roadmap.lead}
      >
        <div className={styles.sprints}>
          {c.roadmap.sprints.map((sprint, index) => (
            <div key={sprint.weeks} className={styles.sprint}>
              <span className={`mono ${styles.sprintWeeks}`}>
                Sprint {index + 1} · {sprint.weeks}
              </span>
              <div>{sprint.text}</div>
              <span className={styles.sprintReuse}>{SPRINT_REUSE[index]}</span>
            </div>
          ))}
        </div>
        <p className={`mono ${styles.noteCenter}`}>{c.roadmap.summary}</p>
      </Chapter>

      <Chapter id="edge" num="18" alt kicker={c.edge.kicker} title={c.edge.title}>
        <div className={styles.tableScroll}>
          <table className={styles.cmp}>
            <thead>
              <tr>
                <th className="mono">{c.edge.capability}</th>
                <th className={clsx("mono", styles.center, styles.irisCol)}>IRIS</th>
                <th className={clsx("mono", styles.center)}>{c.edge.traditional}</th>
                <th className={clsx("mono", styles.center)}>{c.edge.competitors}</th>
              </tr>
            </thead>
            <tbody>
              {c.edge.rows.map((row, index) => {
                const [iris, traditional, competitors] = EDGE_MATRIX[index];
                return (
                  <tr key={row}>
                    <td>{row}</td>
                    <td className={clsx(styles.center, styles.irisCol)}>{edgeCell(iris)}</td>
                    <td className={styles.center}>{edgeCell(traditional)}</td>
                    <td className={styles.center}>{edgeCell(competitors)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Chapter>
    </>
  );
}
