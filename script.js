const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD3WXA_jwJMljuqVrk8U4UzqKkSRv5mDcov4f4idiw9EUB5KzUCdrFJLricaTNHgZltLh521gi4g1D/pub?output=csv";

function estaNoHorario(inicio, fim) {
  const agora = new Date();
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);

  const inicioMin = hi * 60 + mi;
  const fimMin = hf * 60 + mf;
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  return agoraMin >= inicioMin && agoraMin <= fimMin;
}

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const linhas = csv.split("\n");
    const tbody = document.getElementById("escala-body");

    tbody.innerHTML = "";

    linhas.slice(1).forEach(linha => {
      if (!linha.trim()) return;

      // 🔴 separador correto do CSV brasileiro
      const col = linha.split(";");

      const nome = col[0];
      const cargo = col[1];
      const especialidade = col[2];
      const turno = col[3];
      const horaIni = col[4];
      const horaFim = col[5];

      let classeCargo = "";

      if (
        cargo?.toLowerCase().includes("médico") &&
        especialidade?.toLowerCase().includes("anestes")
      ) {
        classeCargo = "func-anestesista";
      } else if (cargo?.toLowerCase().includes("médico")) {
        classeCargo = "func-medico";
      } else if (cargo?.toLowerCase().includes("técnico")) {
        classeCargo = "func-tecnico";
      } else if (cargo?.toLowerCase().includes("enfermeiro")) {
        classeCargo = "func-enfermeiro";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nome}</td>
        <td class="${classeCargo}">${cargo}</td>
        <td>${especialidade || "—"}</td>
        <td>${turno}</td>
        <td>${horaIni}</td>
        <td>${horaFim}</td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar escala:", err);
  });
// atualiza automaticamente a cada 60 segundos
setInterval(() => {
  fetch(sheetURL)
    .then(res => res.text())
    .then(csv => {
      const linhas = csv.split("\n");
      const tbody = document.getElementById("escala-body");
      tbody.innerHTML = "";

      linhas.slice(1).forEach(linha => {
        if (!linha.trim()) return;

        const col = linha.split(";");

        const nome = col[0];
        const cargo = col[1];
        const especialidade = col[2];
        const turno = col[3];
        const horaIni = col[4];
        const horaFim = col[5];

        let classeCargo = "";

        if (
          cargo?.toLowerCase().includes("médico") &&
          especialidade?.toLowerCase().includes("anestes")
        ) {
          classeCargo = "func-anestesista";
        } else if (cargo?.toLowerCase().includes("médico")) {
          classeCargo = "func-medico";
        } else if (cargo?.toLowerCase().includes("técnico")) {
          classeCargo = "func-tecnico";
        } else if (cargo?.toLowerCase().includes("enfermeiro")) {
          classeCargo = "func-enfermeiro";
        }

        const tr = document.createElement("tr");

        if (estaNoHorario(horaIni, horaFim)) {
          tr.classList.add("plantao-atual");
        }

        tr.innerHTML = `
          <td>${nome}</td>
          <td class="${classeCargo}">${cargo}</td>
          <td>${especialidade || "—"}</td>
          <td>${turno}</td>
          <td>${horaIni}</td>
          <td>${horaFim}</td>
        `;

        tbody.appendChild(tr);
      });
    });
}, 60000);

