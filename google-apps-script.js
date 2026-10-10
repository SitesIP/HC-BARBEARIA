/**
 * =========================================================================
 * Barbearia — Google Apps Script (Web App + Automação)
 * =========================================================================
 * 
 * RECURSOS INCLUÍDOS:
 * 1. doPost(e) -> Grava agendamentos e ORDENA AUTOMATICAMENTE por Data e Horário.
 * 2. doGet(e) -> Lê agendamentos em tempo real para bloquear horários no site.
 * 3. Menu Superior no Sheets -> Botões de Reset Manual, Ordenação e Automação.
 * 4. Reset Automático Semanal -> Limpa agendamentos todo domingo às 00:00 automaticamente.
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Abra sua planilha de agendamentos no Google Sheets.
 * 2. Clique no menu superior: Extensões > Apps Script.
 * 3. Substitua todo o código pelo conteúdo deste arquivo.
 * 4. Salve (ícone de disquete).
 * 5. Clique em "Implantar" > "Gerenciar implantações" (ou "Nova implantação" > "App da Web"):
 *    - Executar como: "Eu"
 *    - Quem tem acesso: "Qualquer pessoa" (Anyone)
 *    - Clique em Implantar.
 * 6. Atualize a página da planilha no navegador. O menu "💈 Barbearia" estará pronto!
 * =========================================================================
 */

// ==========================================
// 1. GRAVAÇÃO E ORDENAÇÃO AUTOMÁTICA (POST)
// ==========================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var tabName = resolveSheetTabName(data.aba || data.barbeiro || "Barbeiro 1");
    var sheet = ss.getSheetByName(tabName);
    
    if (!sheet) {
      throw new Error('A aba "' + tabName + '" não foi encontrada na planilha.');
    }

    var barbeiro = data.barbeiro || tabName;
    var nome = data.nome || "";
    var numero = data.numero || data.telefone || "";
    var servico = data.servico || "";
    var dataCorte = data.data || data.dataCorte || "";
    var diaSemana = data.dia || data.diaSemana || "";
    var horario = data.horario || "";

    // Estrutura das colunas:
    // Coluna A (1): Barbeiro:
    // Coluna B (2): Nome:
    // Coluna C (3): Numero: (Número do Cliente coletado no formulário)
    // Coluna E (5): Serviço:
    // Coluna G (7): Data: (DD/MM/AAAA)
    // Coluna H (8): Dia: (Dia da semana)
    // Coluna I (9): Horario: (HH:MM)

    var nextRow = sheet.getLastRow() + 1;
    if (nextRow < 2) nextRow = 2; // Começa na linha 2 (abaixo do cabeçalho)

    sheet.getRange(nextRow, 1).setValue(barbeiro);
    sheet.getRange(nextRow, 2).setValue(nome);
    sheet.getRange(nextRow, 3).setValue(numero); // Coluna C
    sheet.getRange(nextRow, 5).setValue(servico); // Coluna E
    
    // Grava a data no formato Date para permitir ordenação cronológica perfeita
    var dataObj = converterParaData(dataCorte);
    if (dataObj) {
      sheet.getRange(nextRow, 7).setValue(dataObj).setNumberFormat('dd/MM/yyyy');
    } else {
      sheet.getRange(nextRow, 7).setValue(dataCorte);
    }

    sheet.getRange(nextRow, 8).setValue(diaSemana); // Coluna H
    sheet.getRange(nextRow, 9).setValue(horario); // Coluna I

    // Alinhamento à esquerda padrão
    sheet.getRange(nextRow, 1, 1, 9).setHorizontalAlignment("left");

    // ORDENAÇÃO AUTOMÁTICA IMEDIATA:
    // Organiza por Data (Coluna G) e depois por Horário (Coluna I) em ordem crescente
    ordenarAba(sheet);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Agendamento gravado e ordenado com sucesso!",
      barbeiro: barbeiro
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Helper para converter string em objeto Data real
function converterParaData(dataStr) {
  if (!dataStr) return null;
  if (dataStr instanceof Date) return dataStr;
  
  if (typeof dataStr === 'string') {
    if (dataStr.indexOf('/') > -1) {
      var partes = dataStr.split('/');
      if (partes.length === 3) {
        return new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
      }
    } else if (dataStr.indexOf('-') > -1) {
      var partes = dataStr.split('-');
      if (partes.length === 3) {
        return new Date(parseInt(partes[0], 10), parseInt(partes[1], 10) - 1, parseInt(partes[2], 10));
      }
    }
  }
  return null;
}

// ==========================================
// 2. FUNÇÃO DE ORDENAÇÃO (DATA E HORÁRIO)
// ==========================================
function ordenarAba(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    // Garante que todas as datas na coluna G estejam como formato Date
    var rangeDatas = sheet.getRange(2, 7, lastRow - 1, 1);
    var valoresData = rangeDatas.getValues();
    var alterou = false;

    for (var i = 0; i < valoresData.length; i++) {
      var val = valoresData[i][0];
      if (!(val instanceof Date)) {
        var d = converterParaData(val);
        if (d) {
          valoresData[i][0] = d;
          alterou = true;
        }
      }
    }

    if (alterou) {
      rangeDatas.setValues(valoresData);
      rangeDatas.setNumberFormat('dd/MM/yyyy');
    }

    // Ordena da linha 2 até a última linha
    // 1º critério: Coluna 7 (Data) -> Ascendente (dias anteriores/hoje em cima, próximos dias abaixo)
    // 2º critério: Coluna 9 (Horário) -> Ascendente (09:00 primeiro, 12:30 depois, 13:00 abaixo)
    var rangeTotal = sheet.getRange(2, 1, lastRow - 1, 9);
    rangeTotal.sort([
      { column: 7, ascending: true },
      { column: 9, ascending: true }
    ]);
  }
}

// Ordena manualmente todas as abas de barbeiros
function ordenarTodasAsAbas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abas = ["Profissional 1", "Profissional 2"];
  
  abas.forEach(function(nomeAba) {
    var sheet = ss.getSheetByName(nomeAba);
    if (sheet) {
      ordenarAba(sheet);
    }
  });

  var ui = SpreadsheetApp.getUi();
  ui.alert('Ordenação Concluída', 'As abas dos profissionais foram ordenadas por Data e Horário com sucesso!', ui.ButtonSet.OK);
}

// ==========================================
// 3. LEITURA DE HORÁRIOS EM TEMPO REAL (GET)
// ==========================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tabName = resolveSheetTabName((e && e.parameter && (e.parameter.aba || e.parameter.barbeiro)) || "Barbeiro 1");
    var sheet = ss.getSheetByName(tabName);
    
    if (!sheet) {
      throw new Error('A aba "' + tabName + '" não foi encontrada na planilha.');
    }

    var lastRow = sheet.getLastRow();
    var appointments = [];

    if (lastRow >= 2) {
      var values = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        
        // Data (Coluna G / índice 6)
        var dataVal = row[6];
        var dataStr = "";
        if (dataVal instanceof Date) {
          var dia = ("0" + dataVal.getDate()).slice(-2);
          var mes = ("0" + (dataVal.getMonth() + 1)).slice(-2);
          var ano = dataVal.getFullYear();
          dataStr = dia + "/" + mes + "/" + ano;
        } else {
          dataStr = String(dataVal || "").trim();
        }

        // Horário (Coluna I / índice 8)
        var horaVal = row[8];
        var horaStr = "";
        if (horaVal instanceof Date) {
          var h = ("0" + horaVal.getHours()).slice(-2);
          var m = ("0" + horaVal.getMinutes()).slice(-2);
          horaStr = h + ":" + m;
        } else {
          horaStr = String(horaVal || "").trim();
        }

        if (dataStr && horaStr) {
          appointments.push({
            barbeiro: String(row[0] || ""),
            nome: String(row[1] || ""),
            numero: String(row[2] || ""),
            servico: String(row[4] || ""),
            data: dataStr,
            dia: String(row[7] || ""),
            horario: horaStr
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      barbeiro: tabName,
      appointments: appointments
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      appointments: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function resolveSheetTabName(name) {
  var aliases = {
    "Profissional 1": "Barbeiro 1",
    "Profissional 2": "Barbeiro 2"
  };
  return aliases[name] || name;
}

// ==========================================
// 4. MENU SUPERIOR PERSONALIZADO NO GOOGLE SHEETS
// ==========================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('💈 Barbearia')
    .addItem('🔃 Organizar por Data e Horário (profissionais)', 'ordenarTodasAsAbas')
    .addSeparator()
    .addItem('🧹 Resetar Agendamentos Agora (profissionais)', 'limparAgendamentosManualmente')
    .addSeparator()
    .addItem('⏰ Ativar Reset Automático (Todo Domingo 00:00)', 'configurarTriggerSemanal')
    .addToUi();
}

// ==========================================
// 5. FUNÇÃO CORE DE RESET (NÃO APAGA CABEÇALHO)
// ==========================================
function resetarAgendamentos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abas = ["Profissional 1", "Profissional 2"];
  
  abas.forEach(function(nomeAba) {
    var sheet = ss.getSheetByName(nomeAba);
    if (sheet) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        // Limpa os dados a partir da linha 2 até a última linha existente.
        // O cabeçalho na Linha 1 permanece 100% intacto!
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      }
    }
  });
}

// Execução manual acionada pelo menu do usuário
function limparAgendamentosManualmente() {
  var ui = SpreadsheetApp.getUi();
  var resposta = ui.alert(
    'Confirmar Limpeza de Horários',
    'Tem certeza de que deseja limpar os agendamentos das abas dos profissionais?\n\n(O cabeçalho e a formatação da linha 1 serão mantidos).',
    ui.ButtonSet.YES_NO
  );
  
  if (resposta === ui.Button.YES) {
    resetarAgendamentos();
    ui.alert('Concluído', 'Os agendamentos dos profissionais foram resetados com sucesso!', ui.ButtonSet.OK);
  }
}

// ==========================================
// 6. RESET AUTOMÁTICO SEMANAL (DOMINGO 00:00)
// ==========================================
function resetSemanalAutomatico() {
  resetarAgendamentos();
  console.log("Reset semanal automático executado com sucesso nas abas dos profissionais.");
}

// Configura o agendador automático no Google Sheets
function configurarTriggerSemanal() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'resetSemanalAutomatico') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  ScriptApp.newTrigger('resetSemanalAutomatico')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(0)
    .create();
    
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    'Automação Ativada com Sucesso!',
    'O Google Sheets irá resetar automaticamente as abas dos profissionais todo domingo à meia-noite.',
    ui.ButtonSet.OK
  );
}
