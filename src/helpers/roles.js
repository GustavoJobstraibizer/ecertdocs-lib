export default function roleParticipant(role) {
  const roles = {
    CONTRATANTE: 'Contratante',
    CONTRATADO: 'Contratado',
    PARTE: 'Parte',
    TESTEMUNHA: 'Testemunha',
    TESTEMUNHA_CONTRATANTE: 'Testemunha Contratante',
    TESTEMUNHA_CONTRATADO: 'Testemunha Contratado',
  };

  return roles[role] || '';
}
