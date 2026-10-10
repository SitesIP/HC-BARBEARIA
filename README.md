# Modelo genérico de barbearia

## Personalização

Edite `DEFAULT_CONFIG` em `src/data/store.js` para alterar o nome, o link do Instagram e o número do WhatsApp. O telefone deve conter DDI e DDD, sem espaços ou símbolos.

O agendamento envia cada profissional para sua própria aba: `Barbeiro 1` ou `Barbeiro 2`. Se os nomes das abas forem diferentes, ajuste `sheetTab` em `DEFAULT_BARBERS` no mesmo arquivo.

Para atualizar a integração com o Google Sheets, publique uma nova versão do conteúdo de `google-apps-script.js` no Apps Script e mantenha as abas da planilha com os nomes configurados.