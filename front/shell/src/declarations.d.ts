declare module 'mfe_academico/AcademicoApp' {
  import type React from 'react'
  interface Props { token?: string }
  const AcademicoApp: React.ComponentType<Props>
  export default AcademicoApp
}

declare module 'mfe_matricula/MatriculaApp' {
  import type React from 'react'
  interface Props { token?: string }
  const MatriculaApp: React.ComponentType<Props>
  export default MatriculaApp
}
