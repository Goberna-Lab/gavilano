export type Article = {
  slug: string
  image: string
  titleBefore: string
  titleBold: string
  excerpt: string
  detailLead: string
  body: string[]
}

export const articles: Article[] = [
  {
    slug: 'seguridad-serenazgo',
    image: 'enmascarar.png',
    titleBefore: 'Seguridad como Cimiento del Desarrollo: ',
    titleBold: 'La historia del cuerpo de Serenazgo Municipal',
    excerpt: 'Es un error común pensar que la seguridad es un fin en sí mismo. En realidad, es el suelo sobre el cual se construye todo lo demás.',
    detailLead: 'La seguridad no se construye solo con presencia, sino con organización, criterio y respuesta rápida.',
    body: [
      'Un serenazgo bien entrenado y equipado cambia la experiencia diaria del vecino porque reduce el miedo y mejora la convivencia.',
      'La prevención, la coordinación con la policía y la atención inmediata son tres piezas que deben trabajar juntas para proteger mejor a cada familia.',
      'Por eso, la seguridad ciudadana no es solo un área operativa: es una política de desarrollo que permite que el distrito avance con confianza.',
    ],
  },
  {
    slug: 'educacion-tecnologia',
    image: 'alcalde..png',
    titleBefore: 'Educación y Tecnología: ',
    titleBold: 'Apostando por el futuro de los estudiantes carmelinos',
    excerpt: 'En un distrito como el nuestro, Carmen de la Legua Reynoso, la escuela no puede ser solo un lugar de tránsito; debe ser el centro de una transformación real.',
    detailLead: 'La educación y la tecnología se potencian cuando el municipio crea condiciones para que estudiar sea más accesible y más moderno.',
    body: [
      'Cada aula, cada espacio comunal y cada punto de conectividad puede convertirse en una oportunidad para que un niño o joven siga aprendiendo.',
      'La propuesta apunta a fortalecer el soporte formativo, acercar herramientas digitales y reducir las barreras que todavía frenan el acceso a mejores oportunidades.',
      'Un distrito que apuesta por sus estudiantes invierte directamente en su futuro y en su capacidad de progresar con más autonomía.',
    ],
  },
  {
    slug: 'seguridad-digital',
    image: 'trazado.png',
    titleBefore: 'Seguridad Digital: ',
    titleBold: 'El Cimiento Tecnológico que Transformó Carmen de la Legua Reynoso',
    excerpt: 'Hubo un tiempo en que hablar de "Internet inalámbrico" en una plaza pública parecía una idea extraída de una novela de ciencia ficción, especialmente para un distrito con los desafíos de Carmen de la Legua Reynoso.',
    detailLead: 'La modernización digital no es un lujo: es una forma concreta de ahorrar tiempo, ordenar trámites y acercar la municipalidad al vecino.',
    body: [
      'Cuando un distrito digitaliza sus procesos, el vecino deja de perder horas en filas y empieza a resolver más rápido lo que necesita.',
      'La tecnología también ayuda a transparentar la gestión, a comunicar mejor y a hacer más accesibles los servicios municipales.',
      'Por eso, la transformación digital debe entenderse como un servicio cotidiano y no como una promesa lejana.',
    ],
  },
  {
    slug: 'limpieza-urbana',
    image: 'municipalidad.png',
    titleBefore: 'Gestión Sanitaria y Limpieza: ',
    titleBold: 'Los Pilares de un Distrito Saludable y Ordenado',
    excerpt: 'En Carmen de la Legua Reynoso, entendimos que vivir en un entorno limpio no es un lujo. La limpieza pública es un servicio esencial para la salud pública, el orden de la ciudad y el bienestar de cada vecino.',
    detailLead: 'La limpieza pública no solo ordena el distrito: protege la salud de las familias y mejora la vida cotidiana de cada barrio.',
    body: [
      'Una ciudad limpia mejora la salud, el ánimo y la manera en que convivimos en el espacio público.',
      'Por eso, el trabajo de campo, la supervisión y el mantenimiento permanente deben ser parte de una misma estrategia.',
      'Ordenar la ciudad también es cuidar la relación entre la municipalidad y cada familia.',
    ],
  },
  {
    slug: 'cercania-vecinal',
    image: 'alcaldegavi.png',
    titleBefore: 'Nutrición y Solidaridad: ',
    titleBold: 'El Legado de los Programas Alimentarios en Carmen de la Legua Reynoso',
    excerpt: 'Durante mi gestión, entendimos que un niño mal alimentado no aprende con libertad ni puede desarrollar todo su potencial.',
    detailLead: 'La nutrición es una política de cuidado: un distrito que acompaña a sus niños y familias también construye futuro.',
    body: [
      'La solidaridad se vuelve real cuando la gestión garantiza alimento, apoyo y continuidad para quienes más lo necesitan.',
      'Los programas alimentarios no son asistencia aislada: son una forma concreta de defender el futuro de la niñez.',
      'Cuidar la nutrición de hoy es asegurar más oportunidades para mañana.',
    ],
  },
  {
    slug: 'parques-vida',
    image: 'capturaa.png',
    titleBefore: 'Sanidad Ambiental: ',
    titleBold: 'Un Compromiso con nuestro Distrito',
    excerpt: 'Nuestra visión fue transformar la cara del distrito desde lo más básico: limpieza, cuidado del ambiente y orden en cada barrio.',
    detailLead: 'Cuidar el ambiente también es cuidar la salud, la convivencia y el futuro de cada vecino.',
    body: [
      'La sanidad ambiental empieza por acciones concretas: limpieza, mantenimiento y presencia permanente en cada zona.',
      'Cada espacio recuperado mejora la salud del barrio y también su sentido de pertenencia.',
      'Un distrito ordenado y limpio se siente más seguro, más humano y más vivo.',
    ],
  },
]

export function getArticleBySlug(slug: string | undefined) {
  return articles.find((article) => article.slug === slug) ?? null
}
