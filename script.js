const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD3WXA_jwJMljuqVrk8U4UzqKkSRv5mDcov4f4idiw9EUB5KzUCdrFJLricaTNHgZltLh521gi4g1D/pub?output=csv";

/* ================= RELÓGIO DIGITAL ================= */
function atualizarRelogio() {
  const agora = new Date();
  const h = String(agora.getHours()).padStart(2, "0");
  const m = String(agora.getMinutes()).padStart(2, "0");
  const s = String(agora.getSeconds()).padStart(2, "0");
  document.getElementById("relogio").textContent = `${h}:${m}:${s}`;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/* ================= PLANTÃO ATUAL ================= */
function estaNoHorario(inicio, fim) {
  if (!inicio || !fim) return false;

  const agora = new Date();
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);

  const inicioMin = hi * 60 + mi;
  const fimMin = hf * 60 + mf;
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  return agoraMin >= inicioMin && agoraMin <= fimMin;
}

/* ================= CARREGAR ESCALA ================= */
function carregarEscala() {
  fetch(sheetURL)
    .then(res => res.text())
    .then(csv => {
      const linhas = csv.split("\n").slice(1);

      const medicos = document.getElementById("medicos");
      const anestesistas = document.getElementById("anestesistas");
      const enfermeiros = document.getElementById("enfermeiros");
      const tecnicos = document.getElementById("tecnicos");

      medicos.innerHTML = "";
      anestesistas.innerHTML = "";
      enfermeiros.innerHTML = "";
      tecnicos.innerHTML = "";

      linhas.forEach(linha => {
        if (!linha.trim()) return;

        const col = linha.split(";");

        const nome = col[0];
        const cargo = (col[1] || "").toLowerCase();
        const especialidade = (col[2] || "").toLowerCase();
        const turno = col[3];
        const horaIni = col[4];
        const horaFim = col[5];

        const tr = document.createElement("tr");

        if (estaNoHorario(horaIni, horaFim)) {
          tr.classList.add("plantao-atual");
        }

        tr.innerHTML = `
          <td>${nome}</td>
          <td>${turno || "—"}</td>
          <td>${horaIni || "—"}</td>
          <td>${horaFim || "—"}</td>
        `;

        if (cargo.includes("médico") && especialidade.includes("anestes")) {
          anestesistas.appendChild(tr);
        } else if (cargo.includes("médico")) {
          medicos.appendChild(tr);
        } else if (cargo.includes("enfermeiro")) {
          enfermeiros.appendChild(tr);
        } else if (cargo.includes("técnico")) {
          tecnicos.appendChild(tr);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar escala:", err));
}

/* ================= ATUALIZAÇÃO ================= */
carregarEscala();
setInterval(carregarEscala, 60000);
