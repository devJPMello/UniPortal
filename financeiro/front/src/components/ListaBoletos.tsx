import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Check, Clock, AlertTriangle, FileText, Smartphone,
  GraduationCap, Printer, ChevronRight, X,
} from 'lucide-react'
import type { Boleto } from '../data/mockData'

interface Props {
  boletos: Boleto[]
}

const STATUS_LABEL: Record<Boleto['status'], string> = {
  pago:     'Pago',
  pendente: 'Pendente',
  vencido:  'Vencido',
}

const STATUS_ICON: Record<Boleto['status'], React.ReactNode> = {
  pago:     <Check size={10} />,
  pendente: <Clock size={10} />,
  vencido:  <AlertTriangle size={10} />,
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function gerarPixString(boleto: Boleto) {
  return `00020126580014br.gov.bcb.pix0136universidade@pix.edu.br5204000053039865406${boleto.valor.toFixed(2).replace('.', '')}5802BR5920Universidade UniPortal6013São Paulo62290525${boleto.codigo.replace(/\s/g, '').slice(-10)}6304ABCD`
}

type ModalTipo = { tipo: 'pix'; boleto: Boleto } | { tipo: 'comprovante'; boleto: Boleto } | null

export default function ListaBoletos({ boletos }: Props) {
  const [modal, setModal] = useState<ModalTipo>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  function toggleBoleto(id: number) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo).catch(() => undefined)
    mostrarToast('Código de barras copiado!')
  }

  function copiarPix(pix: string) {
    navigator.clipboard.writeText(pix).catch(() => undefined)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function imprimir() {
    window.print()
  }

  const dataHoje = new Date().toLocaleDateString('pt-BR')

  return (
    <>
      <div className="fn-boletos-list">
        {boletos.map((b) => {
          const expanded = expandedId === b.id
          return (
            <div
              key={b.id}
              className={`fn-boleto fn-boleto--${b.status}${expanded ? ' fn-boleto--expanded' : ''}`}
            >
              <button
                className="fn-boleto-header"
                onClick={() => toggleBoleto(b.id)}
                aria-expanded={expanded}
              >
                <div className="fn-boleto-status-bar" />

                <div className="fn-boleto-info">
                  <div className="fn-boleto-mes">{b.mes}</div>
                  <div className="fn-boleto-venc">
                    {b.status === 'vencido'
                      ? <><AlertTriangle size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />Vencido em</>
                      : 'Vencimento:'
                    } {b.vencimento}
                  </div>
                </div>

                <div className="fn-boleto-center">
                  <div className="fn-boleto-valor" style={{ color: b.status === 'vencido' ? '#E53E3E' : b.status === 'pago' ? '#38A169' : '#D69E2E' }}>
                    {fmt(b.valor)}
                  </div>
                  <span className={`fn-badge fn-badge--${b.status}`}>
                    <span className="fn-badge-icon">{STATUS_ICON[b.status]}</span>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>

                <ChevronRight
                  size={16}
                  className={`fn-chevron${expanded ? ' fn-chevron--open' : ''}`}
                  style={{ color: expanded ? '#1B3A6B' : '#A0AEC0' }}
                />
              </button>

              <div className={`fn-boleto-body${expanded ? ' fn-boleto-body--open' : ''}`}>
                <div className="fn-boleto-body-inner">
                  {(b.status === 'pendente' || b.status === 'vencido') && (
                    <div className="fn-codigo" title="Código de barras">{b.codigo}</div>
                  )}
                  <div className="fn-actions">
                    {b.status === 'pago' && (
                      <button className="fn-btn fn-btn--outline" onClick={() => setModal({ tipo: 'comprovante', boleto: b })}>
                        <FileText size={14} /> Comprovante
                      </button>
                    )}
                    {(b.status === 'pendente' || b.status === 'vencido') && (
                      <>
                        <button className="fn-btn fn-btn--outline" onClick={() => copiarCodigo(b.codigo)}>
                          Copiar código
                        </button>
                        <button className="fn-btn fn-btn--pix" onClick={() => setModal({ tipo: 'pix', boleto: b })}>
                          <Smartphone size={14} /> Pagar via Pix
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Modal Pix ── */}
      {modal?.tipo === 'pix' && (
        <div className="fn-modal-overlay" onClick={() => setModal(null)}>
          <div className="fn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fn-modal-header">
              <h3 className="fn-modal-title"><Smartphone size={16} /> Pagamento via Pix</h3>
              <button className="fn-modal-close" onClick={() => setModal(null)} aria-label="Fechar"><X size={16} /></button>
            </div>

            <div className="fn-pix-body">
              <div className="fn-pix-valor">{fmt(modal.boleto.valor)}</div>
              <p className="fn-pix-ref">{modal.boleto.mes} · Vence {modal.boleto.vencimento}</p>

              <div className="fn-qr-wrap">
                <QRCodeSVG
                  value={gerarPixString(modal.boleto)}
                  size={200}
                  level="M"
                  marginSize={1}
                  bgColor="#ffffff"
                  fgColor="#1B3A6B"
                />
              </div>

              <p className="fn-pix-hint">Escaneie o QR Code com seu app bancário</p>

              <div className="fn-pix-chave-wrap">
                <span className="fn-pix-chave-lbl">Chave Pix</span>
                <div className="fn-pix-chave">universidade@pix.edu.br</div>
              </div>

              <button
                className={`fn-btn fn-btn--copiar-pix ${copiado ? 'fn-btn--copiado' : ''}`}
                onClick={() => copiarPix(gerarPixString(modal.boleto))}
              >
                {copiado ? <><Check size={14} /> Copiado!</> : 'Copiar código Pix'}
              </button>

              <div className="fn-pix-aviso">
                <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Este QR Code é para fins de demonstração.<br/>
                Em produção, o código seria gerado pelo banco.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Comprovante ── */}
      {modal?.tipo === 'comprovante' && (
        <div className="fn-modal-overlay" onClick={() => setModal(null)}>
          <div className="fn-modal fn-modal--comprovante" onClick={(e) => e.stopPropagation()}>
            <div className="fn-modal-header">
              <h3 className="fn-modal-title"><FileText size={16} /> Comprovante de Pagamento</h3>
              <button className="fn-modal-close" onClick={() => setModal(null)} aria-label="Fechar"><X size={16} /></button>
            </div>

            <div className="fn-comprovante">
              <div className="fn-comprovante-logo">
                <GraduationCap size={20} /> <strong>UniPortal</strong>
                <span className="fn-comprovante-subtitulo">Universidade Integrada</span>
              </div>

              <div className="fn-comprovante-status">
                <span className="fn-comprovante-check"><Check size={13} /></span>
                <span>Pagamento Confirmado</span>
              </div>

              <div className="fn-comprovante-linhas">
                <div className="fn-comp-linha">
                  <span>Referência</span><strong>{modal.boleto.mes}</strong>
                </div>
                <div className="fn-comp-linha">
                  <span>Valor</span><strong style={{ color: '#38A169' }}>{fmt(modal.boleto.valor)}</strong>
                </div>
                <div className="fn-comp-linha">
                  <span>Vencimento</span><strong>{modal.boleto.vencimento}</strong>
                </div>
                <div className="fn-comp-linha">
                  <span>Data do pagamento</span><strong>{dataHoje}</strong>
                </div>
                <div className="fn-comp-linha">
                  <span>Beneficiário</span><strong>Universidade UniPortal</strong>
                </div>
                <div className="fn-comp-linha">
                  <span>Autenticação</span>
                  <strong className="fn-comp-auth">
                    {modal.boleto.codigo.slice(-12).replace(/\s/g, '').toUpperCase()}
                  </strong>
                </div>
              </div>

              <div className="fn-comprovante-footer">
                Comprovante gerado em {dataHoje} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>

              <button className="fn-btn fn-btn--imprimir" onClick={imprimir}>
                <Printer size={14} /> Imprimir comprovante
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fn-toast fn-toast--show" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  )
}
