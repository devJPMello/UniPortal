import { useState } from 'react'
import { type DisciplinaDisponivel, type Aula } from '../data/mockData'

interface Props {
  disponiveis: DisciplinaDisponivel[]
  gradeAtual: Aula[]
  onConfirmar: (codigos: string[]) => Promise<{ sucesso: boolean; mensagem: string }>
}

export default function ProcessoMatricula({ disponiveis, gradeAtual, onConfirmar }: Props) {
  const [carrinho,    setCarrinho]    = useState<string[]>([])
  const [confirmado,  setConfirmado]  = useState(false)
  const [confirmando, setConfirmando] = useState(false)

  const matriculadas = [...new Set(gradeAtual.map((a) => a.disciplina))]

  function toggle(codigo: string) {
    setCarrinho((prev) =>
      prev.includes(codigo) ? prev.filter((c) => c !== codigo) : [...prev, codigo]
    )
  }

  async function confirmar() {
    if (carrinho.length === 0) return
    setConfirmando(true)
    const result = await onConfirmar(carrinho)
    setConfirmando(false)
    if (result.sucesso) setConfirmado(true)
  }

  const vagasLivres = (d: DisciplinaDisponivel) => d.vagas - d.vagasOcupadas

  return (
    <div className="mt-section">
      <h2 className="mt-section-title">Processo de Matrícula — 2026.2</h2>
      <p className="mt-section-sub">Selecione as disciplinas para o próximo semestre. Vagas sujeitas à disponibilidade.</p>

      {confirmado ? (
        <div className="mt-confirm-box">
          <div className="mt-confirm-icon">✓</div>
          <h3>Pré-matrícula enviada!</h3>
          <p>Disciplinas selecionadas: <strong>{carrinho.join(', ')}</strong></p>
          <p className="mt-confirm-note">O resultado será divulgado em 25/06/2026.</p>
          <button className="mt-btn mt-btn-sec" onClick={() => { setConfirmado(false); setCarrinho([]) }}>
            Nova seleção
          </button>
        </div>
      ) : (
        <>
          <div className="mt-mat-info">
            <span>Matriculado(a) em <strong>{matriculadas.length}</strong> disciplinas no semestre atual</span>
          </div>

          <div className="mt-table-wrap">
            <table className="mt-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Disciplina</th>
                  <th>Professor</th>
                  <th>Horários</th>
                  <th>C.H.</th>
                  <th>Vagas</th>
                  <th>Pré-req.</th>
                </tr>
              </thead>
              <tbody>
                {disponiveis.map((d) => {
                  const livres   = vagasLivres(d)
                  const selected = carrinho.includes(d.codigo)
                  const semVaga  = livres === 0
                  return (
                    <tr key={d.codigo} className={selected ? 'mt-row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={semVaga && !selected}
                          onChange={() => toggle(d.codigo)}
                          className="mt-check"
                        />
                      </td>
                      <td>
                        <div className="mt-disc-name">{d.nome}</div>
                        <div className="mt-disc-code">{d.codigo}</div>
                      </td>
                      <td className="mt-prof">{d.professor}</td>
                      <td className="mt-horario">{d.horarios}</td>
                      <td className="mt-ch">{d.ch}h</td>
                      <td>
                        <span className={`mt-vagas ${semVaga ? 'mt-vagas-esgotadas' : livres <= 5 ? 'mt-vagas-poucas' : 'mt-vagas-ok'}`}>
                          {semVaga ? 'Esgotado' : `${livres} / ${d.vagas}`}
                        </span>
                      </td>
                      <td className="mt-prereq">{d.prereq}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-footer">
            <span className="mt-footer-info">
              {carrinho.length === 0
                ? 'Nenhuma disciplina selecionada'
                : `${carrinho.length} disciplina(s) no carrinho`}
            </span>
            <button
              className="mt-btn mt-btn-primary"
              disabled={carrinho.length === 0 || confirmando}
              onClick={confirmar}
            >
              {confirmando ? 'Enviando...' : 'Confirmar Pré-matrícula'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
