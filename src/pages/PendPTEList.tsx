import PendList from './PendList';

export default function PendPTEList() {
  return (
    <PendList
      module="pend-pte"
      titulo="Pend. PTE"
      subtitulo="Gestão de pendências PTE com controle de pagamento"
      novaPath="/pend-pte/novo"
      editarPath="/pend-pte/editar"
    />
  );
}
