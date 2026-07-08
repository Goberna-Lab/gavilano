import { useState } from "react";
import "./AporteSection.css";
import { asset } from "../utils/asset";

type AporteSectionProps = {
  className?: string;
};

type Proyecto = {
  id: number;
  nombre: string;
  titulo: string;
  descripcion?: string;
  descripcionBold?: boolean;
  imagen: string;
  navClass: string;
  tituloCompleto?: string;
  tituloPrefix?: string;
  tituloSuffix?: string;
  tituloSuffixLines?: string[];
  tituloBreakAfterPrefix?: boolean;
  ocultarDescripcion?: boolean;
};

const proyectos: Proyecto[] = [
  {
    id: 1,
    nombre: "Casa del Adulto Mayor",
    titulo: "",
    tituloCompleto:
      "Un espacio digno para cuidar, acompañar y reconocer a quienes hicieron historia en Carmen.",
    imagen: asset("personas/casa-adulto.png"),
    navClass: "aporte-projects-nav-item-casa",
  },
  {
    id: 2,
    nombre: "Skate Park",
    titulo: "",
    tituloPrefix: "Un lugar para que los jóvenes",
    tituloSuffixLines: [
      "practiquen deporte, se expresen",
      "y usen mejor su tiempo libre.",
    ],
    tituloBreakAfterPrefix: true,
    descripcion: "",
    imagen: asset("SKATE.png"),
    navClass: "aporte-projects-nav-item-skate",
  },
  {
    id: 3,
    nombre: "FestiRock",
    titulo: "",
    tituloPrefix: "Arte, música y cultura",
    tituloSuffix: " para promover el talento de nuestros jóvenes.",
    descripcion: "",
    imagen: asset("Imagen 876.png"),
    navClass: "aporte-projects-nav-item-festirock",
  },
  {
    id: 4,
    nombre: "Boulevard Morales Duárez",
    titulo: "",
    tituloPrefix: "Espacios públicos recuperados",
    tituloSuffix: " para caminar, encontrarnos y vivir mejor el distrito.",
    descripcion: "",
    imagen: asset("Imagen 007.png"),
    navClass: "aporte-projects-nav-item-boulevard",
  },
  {
    id: 5,
    nombre: "Carmen Digital",
    titulo: "Tecnología y modernización",
    descripcion:
      "Para acercar la municipalidad al vecino y simplificar cada trámite.",
    imagen: asset("Imagen 1022.png"),
    navClass: "aporte-projects-nav-item-digital",
  },
];

function ProyectoDescripcion({ proyecto }: { proyecto: Proyecto }) {
  return (
    <>
      <p
        className={`aporte-project-description-text ${proyecto.tituloPrefix || proyecto.tituloCompleto ? "aporte-project-description-text-normal" : ""}`}
      >
        {proyecto.tituloCompleto ? (
          <>
            <span className="aporte-project-description-title-strong">
              {proyecto.tituloCompleto.split(",")[0]},
            </span>{" "}
            <br className="aporte-project-break" />
            {proyecto.tituloCompleto
              .slice(proyecto.tituloCompleto.indexOf(",") + 1)
              .trim()}
          </>
        ) : proyecto.tituloPrefix ? (
          <>
            <span className="aporte-project-description-title-strong">
              {proyecto.tituloPrefix}
            </span>
            {proyecto.tituloBreakAfterPrefix ? (
              <>
                {" "}
                <br className="aporte-project-break" />
              </>
            ) : null}
            {proyecto.tituloSuffixLines
              ? proyecto.tituloSuffixLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? (
                      <>
                        {" "}
                        <br className="aporte-project-break" />
                      </>
                    ) : null}
                    {line}
                  </span>
                ))
              : proyecto.tituloSuffix}
          </>
        ) : proyecto.titulo ? (
          <strong>{proyecto.titulo}</strong>
        ) : null}
      </p>
      {proyecto.descripcion ? (
        <p className="aporte-project-description-subtext">
          {proyecto.descripcionBold ? (
            <strong>{proyecto.descripcion}</strong>
          ) : (
            proyecto.descripcion
          )}
        </p>
      ) : null}
    </>
  );
}

function AporteSection({ className = "" }: AporteSectionProps) {
  const [proyectoActivo, setProyectoActivo] = useState(proyectos[0]);
  const [proyectoAbiertoId, setProyectoAbiertoId] = useState<number | null>(
    proyectos[0].id,
  );

  const irAlProyecto = (proyectoId: number) => {
    const proyecto = proyectos.find((item) => item.id === proyectoId);
    if (proyecto) {
      setProyectoActivo(proyecto);
      setProyectoAbiertoId(proyecto.id);
    }
  };

  const alternarProyectoMobile = (proyectoId: number) => {
    const proyecto = proyectos.find((item) => item.id === proyectoId);
    if (!proyecto) return;

    setProyectoActivo(proyecto);
    setProyectoAbiertoId((actual) =>
      actual === proyectoId ? null : proyectoId,
    );
  };

  const irAnterior = () => {
    const index = proyectos.findIndex((item) => item.id === proyectoActivo.id);
    const proyecto =
      proyectos[(index - 1 + proyectos.length) % proyectos.length];

    setProyectoActivo(proyecto);
    setProyectoAbiertoId(proyecto.id);
  };

  const irSiguiente = () => {
    const index = proyectos.findIndex((item) => item.id === proyectoActivo.id);
    const proyecto = proyectos[(index + 1) % proyectos.length];

    setProyectoActivo(proyecto);
    setProyectoAbiertoId(proyecto.id);
  };

  return (
    <section
      className={`aporte-section${className ? ` ${className}` : ""}`}
      id="mi-aporte"
    >
      <p className="aporte-heading">MI APORTE AL DISTRITO</p>
      <div className="aporte-subtitle-block">
        <p className="aporte-subtitle-line aporte-subtitle-line-first">
          PROYECTOS QUE
        </p>
        <div className="aporte-subtitle-second-row">
          <p className="aporte-subtitle-line aporte-subtitle-line-second">
            DEJARON
          </p>
          <p className="aporte-subtitle-italic">HUELLA.</p>
        </div>
      </div>
      <div className="aporte-description-group">
        <div className="aporte-description-desktop">
          <div className="aporte-description-first-row">
            <p className="aporte-description">
              Durante mi gestión, impulsamos espacios
            </p>
            <p className="aporte-description-connector">y</p>
          </div>
          <p className="aporte-description-text">
            programas que dejaron huella en Carmen de{" "}
            <br className="aporte-description-mobile-break" />
            la Legua Reynoso.
          </p>
          <p className="aporte-description-note">Estos son solo algunos,</p>
        </div>
        <div className="aporte-description-mobile-only">
          <p className="aporte-description-line">
            <strong>Durante mi gestiòn, impulsamos</strong>
          </p>
          <p className="aporte-description-line">
            <strong>espacios y</strong> programas que dejaron huella en
          </p>
          <p className="aporte-description-line aporte-description-line-last">
            Carmen de la Legua Reynoso.
          </p>
          <p className="aporte-description-line aporte-description-line-note">
            Estos son solo algunos,
          </p>
        </div>
      </div>
      <nav className="aporte-projects-nav" aria-label="Proyectos destacados">
        {proyectos.map((proyecto) => {
          const isActive = proyectoActivo.id === proyecto.id;

          return (
            <button
              key={proyecto.id}
              className={`aporte-projects-nav-item ${proyecto.navClass} ${isActive ? "aporte-projects-nav-item-active" : ""}`}
              type="button"
              onClick={() => irAlProyecto(proyecto.id)}
              aria-pressed={isActive}
            >
              {proyecto.nombre}
            </button>
          );
        })}
        <div className="aporte-projects-nav-baseline" />
      </nav>
      <div className="aporte-projects-content">
        {!proyectoActivo.ocultarDescripcion ? (
          <div
            className="aporte-project-description aporte-project-content-transition"
            key={`description-${proyectoActivo.id}`}
          >
            <ProyectoDescripcion proyecto={proyectoActivo} />
          </div>
        ) : null}
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
          key={`image-${proyectoActivo.id}`}
          style={{ backgroundImage: `url("${proyectoActivo.imagen}")` }}
        />
        <img
          className="aporte-project-image-mobile aporte-project-content-transition"
          key={`image-mobile-${proyectoActivo.id}`}
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
        {proyectos.map((proyecto) => {
          const isOpen = proyectoAbiertoId === proyecto.id;

          return (
            <div
              className={`aporte-accordion-item ${isOpen ? "aporte-accordion-item-open" : ""}`}
              key={proyecto.id}
            >
              <button
                type="button"
                className={`aporte-accordion-trigger ${isOpen ? "aporte-accordion-trigger-active" : ""}`}
                onClick={() => alternarProyectoMobile(proyecto.id)}
                aria-expanded={isOpen}
                aria-controls={`aporte-panel-${proyecto.id}`}
              >
                <span>{proyecto.nombre}</span>
              </button>
              {isOpen ? (
                <div
                  id={`aporte-panel-${proyecto.id}`}
                  className="aporte-accordion-panel aporte-project-content-transition"
                  key={`panel-${proyecto.id}`}
                >
                  {!proyecto.ocultarDescripcion ? (
                    <div className="aporte-accordion-desc">
                      <ProyectoDescripcion proyecto={proyecto} />
                    </div>
                  ) : null}
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
