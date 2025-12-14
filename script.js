const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD3WXA_jwJMljuqVrk8U4UzqKkSRv5mDcov4f4idiw9EUB5KzUCdrFJLricaTNHgZltLh521gi4g1D/pub?output=csv";

function estaNoHorario(inicio, fim) {
  const agora = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);

  const inicioMin = hi * 60 + mi;
  const fimMin = hf * 60 + mf;

  // turno normal
  if (inicioMin <= fimMin) {
    return agoraMin >= inicioMin && agoraMin <= fimMin;
  }

  // turno que vira a noite (ex: 19:00 → 07:00)
  return agoraMin >= inicioMin || agoraMin <= fimMin;
}

function carregarEscala() {
  fetch(sheetURL)
    .then(res => res.text())
    .then(csv => {
      const linhas = csv.trim().split("\n");
      const tbody = document.getElementById("escala-body");

      tbody.innerHTML = "";

      linhas.slice(1).forEach(linha => {
        if (!linha.trim()) return;

        // ✅ separador CORRETO do CSV
        const col = linha.split(",");

        if (col.length < 6) return;

        const nome = col[0];
        const cargo = col[1];
        const especialidade = col[2];
        const turno = col[3];
        const horaIni = col[4];
        const horaFim = col[5];

        let classeCargo = "";

        const cargoLower = cargo.toLowerCase();
        const espLower = especialidade.toLowerCase();

        if (cargoLower.includes("médico") && espLower.includes("anestes")) {
          classeCargo = "func-anestesista";
        } else if (cargoLower.includes("médico")) {
          classeCargo = "func-medico";
        } else if (cargoLower.includes("técnico")) {
          classeCargo = "func-tecnico";
        } else if (cargoLower.includes("enfermeiro")) {
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
    })
    .catch(err => console.error("Erro ao carregar escala:", err));
}

// carrega ao abrir
carregarEscala();

function atualizarRelogio() {
  const agora = new Date();
  const h = String(agora.getHours()).padStart(2, "0");
  const m = String(agora.getMinutes()).padStart(2, "0");
  const s = String(agora.getSeconds()).padStart(2, "0");

  document.getElementById("relogio").textContent = `${h}:${m}:${s}`;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

