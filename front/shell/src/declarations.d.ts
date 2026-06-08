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

declare module 'mfe_biblioteca/BibliotecaApp' {
  import type React from 'react'
  interface Props { token?: string }
  const BibliotecaApp: React.ComponentType<Props>
  export default BibliotecaApp
}

declare module 'mfe_financeiro/FinanceiroApp' {
  import type React from 'react'
  interface Props { token?: string }
  const FinanceiroApp: React.ComponentType<Props>
  export default FinanceiroApp
}
