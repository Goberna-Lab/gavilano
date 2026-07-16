# Issue tracker: GitHub

Los issues y PRDs de este repo viven como GitHub Issues en `Goberna-Lab/gavilano`. Usá el CLI `gh` para todas las operaciones.

## Convenciones

- **Crear un issue**: `gh issue create --title "..." --body "..."`. Usá heredoc para cuerpos multilínea.
- **Leer un issue**: `gh issue view <número> --comments`, filtrando comentarios con `jq` y trayendo también los labels.
- **Listar issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` con los filtros `--label` y `--state` que correspondan.
- **Comentar un issue**: `gh issue comment <número> --body "..."`
- **Aplicar / quitar labels**: `gh issue edit <número> --add-label "..."` / `--remove-label "..."`
- **Cerrar**: `gh issue close <número> --comment "..."`

`gh` infiere el repo desde `git remote -v` cuando se corre dentro del clon (origin: `https://github.com/Goberna-Lab/gavilano.git`).

## Pull requests como superficie de triage

**PRs como superficie de pedidos: no.** _(Cambiar a `sí` si este repo trata PRs externos como feature requests; `/triage` lee este flag.)_

Cuando esté en `sí`, los PRs pasan por los mismos labels y estados que los issues, usando los equivalentes de `gh pr`:

- **Leer un PR**: `gh pr view <número> --comments` y `gh pr diff <número>` para el diff.
- **Listar PRs externos para triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` y quedarse solo con `authorAssociation` de `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR` o `NONE` (descartar `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comentar / etiquetar / cerrar**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub comparte un solo espacio de números entre issues y PRs, así que un `#42` suelto puede ser cualquiera de los dos — resolvé con `gh pr view 42` y caé a `gh issue view 42`.

## Cuando una skill dice "publicar al issue tracker"

Creá un GitHub issue.

## Cuando una skill dice "traer el ticket relevante"

Corré `gh issue view <número> --comments`.

## Operaciones de wayfinding

Usadas por `/wayfinder`. El **mapa** es un único issue con issues **hijos** como tickets.

- **Mapa**: un único issue con label `wayfinder:map`, que contiene el cuerpo de Notas / Decisiones-hasta-ahora / Niebla. `gh issue create --label wayfinder:map`.
- **Ticket hijo**: un issue vinculado al mapa como sub-issue de GitHub (`gh api` sobre el endpoint de sub-issues). Donde los sub-issues no estén habilitados, agregá el hijo a una task list en el cuerpo del mapa y poné `Part of #<mapa>` al inicio del cuerpo del hijo. Labels: `wayfinder:<tipo>` (`research`/`prototype`/`grilling`/`task`). Una vez reclamado, el ticket se asigna al dev que lo maneja.
- **Bloqueos**: las **dependencias nativas de issues** de GitHub — la representación canónica y visible en la UI. Agregá una arista con `gh api --method POST repos/Goberna-Lab/gavilano/issues/<hijo>/dependencies/blocked_by -F issue_id=<db-id-del-bloqueador>`, donde `<db-id-del-bloqueador>` es el **database id** numérico del bloqueador (`gh api repos/Goberna-Lab/gavilano/issues/<n> --jq .id`, _no_ el `#número` ni el `node_id`). GitHub reporta `issue_dependencies_summary.blocked_by` (solo bloqueadores abiertos — el gate vivo). Donde las dependencias no estén disponibles, caé a una línea `Blocked by: #<n>, #<n>` al inicio del cuerpo del hijo. Un ticket queda desbloqueado cuando todos sus bloqueadores están cerrados.
- **Consulta de frontera**: listar los hijos abiertos del mapa (`gh issue list --state open`, acotado a los sub-issues / task list del mapa), descartar los que tengan un bloqueador abierto (`issue_dependencies_summary.blocked_by > 0`, o un issue abierto en la línea `Blocked by`) o un assignee; gana el primero en el orden del mapa.
- **Reclamar**: `gh issue edit <n> --add-assignee @me` — la primera escritura de la sesión.
- **Resolver**: `gh issue comment <n> --body "<respuesta>"`, después `gh issue close <n>`, y por último anexar un puntero de contexto (gist + link) a las Decisiones-hasta-ahora del mapa.
