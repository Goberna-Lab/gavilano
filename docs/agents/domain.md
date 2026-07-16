# Docs de dominio

Cómo deben consumir las skills de ingeniería la documentación de dominio de este repo al explorar el codebase.

## Antes de explorar, leé esto

- **`CONTEXT.md`** en la raíz del repo.
- **`docs/adr/`** — leé los ADRs que toquen el área en la que vas a trabajar.

Si alguno de estos archivos no existe, **seguí en silencio**. No marques su ausencia; no sugieras crearlos por adelantado. La skill `/domain-modeling` (a la que se llega vía `/grill-with-docs` e `/improve-codebase-architecture`) los crea de forma lazy cuando términos o decisiones efectivamente se resuelven.

## Estructura de archivos

Este repo es **single-context**:

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-ejemplo-decision.md
│   └── 0002-otra-decision.md
└── src/
```

## Usá el vocabulario del glosario

Cuando tu output nombre un concepto de dominio (en el título de un issue, una propuesta de refactor, una hipótesis, el nombre de un test), usá el término tal como está definido en `CONTEXT.md`. No derives hacia sinónimos que el glosario evita explícitamente.

Si el concepto que necesitás todavía no está en el glosario, eso es una señal — o estás inventando lenguaje que el proyecto no usa (reconsiderá) o hay un hueco real (anotalo para `/domain-modeling`).

## Marcá conflictos con ADRs

Si tu output contradice un ADR existente, hacelo explícito en vez de pisarlo en silencio:

> _Contradice ADR-0007 (órdenes event-sourced) — pero vale la pena reabrirlo porque…_
