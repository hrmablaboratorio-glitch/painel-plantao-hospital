const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD3WXA_jwJMljuqVrk8U4UzqKkSRv5mDcov4f4idiw9EUB5KzUCdrFJLricaTNHgZltLh521gi4g1D/pub?output=csv";

fetch(sheetURL)
  .then(response => response.text())
  .then(csv => {
    const linhas = csv.split("\n");
    const tbody = document.querySelector("#escala tbody");

    tbody.innerHTML = "";

    linhas.slice(1).forEach(linha => {
      if (!linha.trim()) return;

      const colunas = linha.split(",");

      const tr = document.createElement("tr");

      // Nome
      tr.innerHTML = `
        <td>${colunas[0]}</td>
        <td>${colunas[1]}</td>
        <td>${colunas[2]}</td>
        <td>${colunas[3]}</td>
        <td>${colunas[4]} - ${colunas[5]}</td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar planilha:", err);
  });
