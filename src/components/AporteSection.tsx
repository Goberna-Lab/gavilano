import { useState } from "react";
import "./AporteSection.css";
import type { ContenidoMiAporte, PropsSeccion } from "../lib/contenido";

type AporteSectionProps = PropsSeccion<ContenidoMiAporte> & {
  className?: string;
};

type Proyecto = ContenidoMiAporte["proyectos"][number];

/* La FORMA en que cada proyecto parte su bajada es del diseño, no del contenido:
   son cuatro maquetaciones distintas que el Figma dibujó así. Viven acá indexadas
   por la misma posición que `content.proyectos`, igual que la pestaña de cada uno.

   - `completo`      el destacado lleva coma y la bajada baja de renglón
   - `multilinea`    la bajada va partida en renglones, cada uno en su <span>
   - `prefijo`       el destacado y la bajada van seguidos, en el mismo renglón
   - `titulo`        el destacado va solo y la bajada en un párrafo aparte */
type Forma = "completo" | "multilinea" | "prefijo" | "titulo";

const FORMAS: Forma[] = ["completo", "multilinea", "prefijo", "prefijo", "titulo"];

const CLASES_NAV = [
  "aporte-projects-nav-item-casa",
  "aporte-projects-nav-item-skate",
  "aporte-projects-nav-item-festirock",
  "aporte-projects-nav-item-boulevard",
  "aporte-projects-nav-item-digital",
];

function ProyectoDescripcion({
  proyecto,
  forma,
}: {
  proyecto: Proyecto;
  forma: Forma;
}) {
  return (
    <>
      <p
        className={`aporte-project-description-text ${forma !== "titulo" ? "aporte-project-description-text-normal" : ""}`}
      >
        {forma === "completo" ? (
          <>
            <span className="aporte-project-description-title-strong">
              {proyecto.destacado},
            </span>{" "}
            <br className="aporte-project-break" />
            {proyecto.resto}
          </>
        ) : forma === "multilinea" ? (
          <>
            <span className="aporte-project-description-title-strong">
              {proyecto.destacado}
            </span>
            {" "}
            <br className="aporte-project-break" />
            {proyecto.resto.split("\n").map((linea, index) => (
              <span key={linea}>
                {index > 0 ? (
                  <>
                    {" "}
                    <br className="aporte-project-break" />
                  </>
                ) : null}
                {linea}
              </span>
            ))}
          </>
        ) : forma === "prefijo" ? (
          <>
            <span className="aporte-project-description-title-strong">
              {proyecto.destacado}
            </span>
            {/* El espacio va DENTRO del mismo nodo de texto que la bajada, que es
                como lo tenía el original: partirlo en {' '}{resto} crearía dos
                nodos y el navegador no lleva el kerning de uno al otro (P7b). */}
            {` ${proyecto.resto}`}
          </>
        ) : (
          <strong>{proyecto.destacado}</strong>
        )}
      </p>
      {forma === "titulo" && proyecto.resto ? (
        <p className="aporte-project-description-subtext">{proyecto.resto}</p>
      ) : null}
    </>
  );
}

function AporteSection({ content, anchor, className = "" }: AporteSectionProps) {
  const { proyectos } = content;
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(0);

  const proyectoActivo = proyectos[indiceActivo];

  const irAlProyecto = (indice: number) => {
    setIndiceActivo(indice);
    setIndiceAbierto(indice);
  };

  const alternarProyectoMobile = (indice: number) => {
    setIndiceActivo(indice);
    setIndiceAbierto((actual) => (actual === indice ? null : indice));
  };

  const irAnterior = () => {
    irAlProyecto((indiceActivo - 1 + proyectos.length) % proyectos.length);
  };

  const irSiguiente = () => {
    irAlProyecto((indiceActivo + 1) % proyectos.length);
  };

  return (
    <section
      className={`aporte-section${className ? ` ${className}` : ""}`}
      id={anchor}
    >
      <p className="aporte-heading">{content.encabezado}</p>
      <div className="aporte-subtitle-block">
        <p className="aporte-subtitle-line aporte-subtitle-line-first">
          {content.subtituloLinea1}
        </p>
        <div className="aporte-subtitle-second-row">
          <p className="aporte-subtitle-line aporte-subtitle-line-second">
            {content.subtituloLinea2}
          </p>
          <p className="aporte-subtitle-italic">{content.subtituloItalica}</p>
        </div>
      </div>
      <div className="aporte-description-group">
        <div className="aporte-description-desktop">
          <div className="aporte-description-first-row">
            <p className="aporte-description">{content.descEscritorio1}</p>
            <p className="aporte-description-connector">
              {content.descEscritorioConector}
            </p>
          </div>
          <p className="aporte-description-text">
            {content.descEscritorio2a}{" "}
            <br className="aporte-description-mobile-break" />
            {content.descEscritorio2b}
          </p>
          <p className="aporte-description-note">{content.descEscritorioNota}</p>
        </div>
        <div className="aporte-description-mobile-only">
          <p className="aporte-description-line">
            <strong>{content.descMovil1}</strong>
          </p>
          <p className="aporte-description-line">
            <strong>{content.descMovil2Destacado}</strong>
            {` ${content.descMovil2Resto}`}
          </p>
          <p className="aporte-description-line aporte-description-line-last">
            {content.descMovil3}
          </p>
          <p className="aporte-description-line aporte-description-line-note">
            {content.descMovilNota}
          </p>
        </div>
      </div>
      <nav className="aporte-projects-nav" aria-label="Proyectos destacados">
        {proyectos.map((proyecto, indice) => {
          const isActive = indiceActivo === indice;

          return (
            <button
              key={proyecto.nombre}
              className={`aporte-projects-nav-item ${CLASES_NAV[indice]} ${isActive ? "aporte-projects-nav-item-active" : ""}`}
              type="button"
              onClick={() => irAlProyecto(indice)}
              aria-pressed={isActive}
            >
              {proyecto.nombre}
            </button>
          );
        })}
        <div className="aporte-projects-nav-baseline" />
      </nav>
      <div className="aporte-projects-content">
        <div
          className="aporte-project-description aporte-project-content-transition"
          key={`description-${indiceActivo}`}
        >
          <ProyectoDescripcion
            proyecto={proyectoActivo}
            forma={FORMAS[indiceActivo]}
          />
        </div>
        <button
          className="aporte-project-arrow aporte-project-arrow-left"
          type="button"
          aria-label="Proyecto anterior"
          onClick={irAnterior}
        >
          <span className="aporte-project-arrow-icon aporte-project-arrow-icon-left" />
        </button>
        <div
          className="aporte-project-image aporte-project-content-transition"
          key={`image-${indiceActivo}`}
          style={{ backgroundImage: `url("${proyectoActivo.imagen}")` }}
        />
        <img
          className="aporte-project-image-mobile aporte-project-content-transition"
          key={`image-mobile-${indiceActivo}`}
          src={proyectoActivo.imagen}
          alt={proyectoActivo.nombre}
          loading="lazy"
        />
        <button
          className="aporte-project-arrow aporte-project-arrow-right"
          type="button"
          aria-label="Proyecto siguiente"
          onClick={irSiguiente}
        >
          <span className="aporte-project-arrow-icon aporte-project-arrow-icon-right" />
        </button>
      </div>

      {/* Mobile: acordeón desplegable (una imagen por proyecto) */}
      <div className="aporte-accordion">
        {proyectos.map((proyecto, indice) => {
          const isOpen = indiceAbierto === indice;

          return (
            <div
              className={`aporte-accordion-item ${isOpen ? "aporte-accordion-item-open" : ""}`}
              key={proyecto.nombre}
            >
              <button
                type="button"
                className={`aporte-accordion-trigger ${isOpen ? "aporte-accordion-trigger-active" : ""}`}
                onClick={() => alternarProyectoMobile(indice)}
                aria-expanded={isOpen}
                /* +1 para conservar los ids que el sitio ya tenía: venían del
                   `id` del proyecto, que arrancaba en 1. No cambia un píxel, pero
                   un deep link o un selector de analítica externo sí lo notaría. */
                aria-controls={`aporte-panel-${indice + 1}`}
              >
                <span>{proyecto.nombre}</span>
              </button>
              {isOpen ? (
                <div
                  id={`aporte-panel-${indice + 1}`}
                  className="aporte-accordion-panel aporte-project-content-transition"
                  key={`panel-${indice}`}
                >
                  <div className="aporte-accordion-desc">
                    <ProyectoDescripcion
                      proyecto={proyecto}
                      forma={FORMAS[indice]}
                    />
                  </div>
                  <div className="aporte-accordion-media">
                    <button
                      type="button"
                      className="aporte-accordion-arrow aporte-accordion-arrow-left"
                      aria-label="Proyecto anterior"
                      onClick={irAnterior}
                    >
                      <span className="aporte-project-arrow-icon aporte-project-arrow-icon-left" />
                    </button>
                    <img
                      className="aporte-accordion-img"
                      src={proyecto.imagen}
                      alt={proyecto.nombre}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="aporte-accordion-arrow aporte-accordion-arrow-right"
                      aria-label="Proyecto siguiente"
                      onClick={irSiguiente}
                    >
                      <span className="aporte-project-arrow-icon aporte-project-arrow-icon-right" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AporteSection;
