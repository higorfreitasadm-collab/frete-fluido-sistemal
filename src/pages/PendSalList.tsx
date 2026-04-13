import PendList from './PendList';

export default function PendSalList() {
  return (
    <PendList
      module="pend-sal"
      titulo="Pend. Sal"
      subtitulo="Gestão de pendências Sal com controle de pagamento"
      novaPath="/pend-sal/novo"
      editarPath="/pend-sal/editar"
    />
  );
}
