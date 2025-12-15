const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTD3WXA_jwJMljuqVrk8U4UzqKkSRv5mDcov4f4idiw9EUB5KzUCdrFJLricaTNHgZltLh521gi4g1D/pub?output=csv";

/* ================= RELÓGIO ================= */
function atualizarRelogio() {
  const agora = new Date();
  const h = String(agora.getHours()).padStart(2, "0");
  const m = String(agora.getMinutes()).padStart(2, "0");
  const s = String(agora.getSeconds()).padStart(2, "0");
  document.getElementById("relogio").textContent = `${h}:${m}:${s}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/* ================= DATA ================= */
const hoje = new Date();
document.getElementById("data-atual").textContent =
  hoje.toLocaleDateString("pt-BR");

/* ================= HORÁRIO ================= */
function estaNoHorario(inicio, fim) {
  const agora = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fim.split(":").map(Number);

  const inicioMin = hi * 60 + mi;
  const fimMin = hf * 60 + mf;

  if (inicioMin <= fimMin) {
    return agoraMin >= inicioMin && agoraMin <= fimMin;
  }
  return agoraMin >= inicioMin || agoraMin <= fimMin;
}

/* ================= ESCALA ================= */
function carregarEscala() {
  fetch(sheetURL)
    .then(res => res.text())
    .then(csv => {
      const linhas = csv.trim().split("\n");

      // limpa quadros
      document.getElementById("medicos").innerHTML = "";
      document.getElementById("anestesistas").innerHTML = "";
      document.getElementById("enfermeiros").innerHTML = "";
      document.getElementById("tecnicos").innerHTML = "";

      linhas.slice(1).forEach(linha => {
        if (!linha.trim()) return;

        // 🔴 separador correto
        const col = linha.split(";");

        if (col.length < 6) return;

        const nome = col[0];
        const cargo = col[1];
        const especialidade = col[2];
        const turno = col[3];
        const horaIni = col[4];
        const horaFim = col[5];

        const cargoLower = cargo.toLowerCase();
        const espLower = especialidade.toLowerCase();

        const tr = document.createElement("tr");

        if (estaNoHorario(horaIni, horaFim)) {
          tr.style.backgroundColor = "#dff0d8"; // destaque plantão atual
        }

        /* ====== MÉDICOS ====== */
        if (cargoLower.includes("médico") && !espLower.includes("anestes")) {
          tr.innerHTML = `
            <td class="func-medico">${nome}</td>
            <td>${especialidade}</td>
            <td>${turno}</td>
            <td>${horaIni}</td>
            <td>${horaFim}</td>
          `;
          document.getElementById("medicos").appendChild(tr);
        }

        /* ====== ANESTESISTAS ====== */
        else if (cargoLower.includes("médico") && espLower.includes("anestes")) {
          tr.innerHTML = `
            <td class="func-anestesista">${nome}</td>
            <td>${especialidade}</td>
            <td>${turno}</td>
            <td>${horaIni}</td>
            <td>${horaFim}</td>
          `;
          document.getElementById("anestesistas").appendChild(tr);
        }

        /* ====== ENFERMEIROS ====== */
        else if (cargoLower.includes("enfermeiro")) {
          tr.innerHTML = `
            <td class="func-enfermeiro">${nome}</td>
            <td>${especialidade || "—"}</td>
            <td>${turno}</td>
            <td>${horaIni}</td>
            <td>${horaFim}</td>
          `;
          document.getElementById("enfermeiros").appendChild(tr);
        }

        /* ====== TÉCNICOS ====== */
        else if (cargoLower.includes("técnico")) {
          tr.innerHTML = `
            <td class="func-tecnico">${nome}</td>
            <td>${turno}</td>
            <td>${horaIni}</td>
            <td>${horaFim}</td>
          `;
          document.getElementById("tecnicos").appendChild(tr);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar escala:", err));
}

/* inicial + atualização */
carregarEscala();
setInterval(carregarEscala, 60000);

