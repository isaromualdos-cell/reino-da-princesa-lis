// A câmera está liberada antecipadamente para testes e convidados.
// O horário da festa continua sendo 28/11/2026 às 16h.
export const cameraOpensAt = Date.parse("2026-11-28T16:00:00-03:00");

export function cameraIsOpen() {
  return true;
}
