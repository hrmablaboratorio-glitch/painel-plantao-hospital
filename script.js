const SHEET_URL = "COLE_AQUI_O_LINK_DO_CSV";

function carregarDados() {
  fetch(SHEET_URL)
    .then(res => res.text())
    .then(csv => {
      const linhas = csv.split("\n").slice(1);
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";

      linhas.forEach(linha => {
        if (!linha.trim()) return;

        const col = linha.split(",");

        const tr = document.createElement("tr");

        // Classe por cargo
        const cargo = col[1]?.toLowerCase() || "";
        if (cargo.includes("médico")) tr.classList.add("medico");
        if (cargo.includes("anestesista")) tr.classList.add("anestesista");
        if (cargo.includes("enfermeiro")) tr.classList.add("enfermeiro");
        if (cargo.includes("técnico")) tr.classList.add("tecnico");

        col.forEach(valor => {
          const td = document.createElement("td");
          td.textContent = valor;
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    });
}

// Data no cabeçalho
function atualizarData() {
  const agora = new Date();
  const texto = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  document.querySelector(".data").textContent = texto;
}

carregarDados();
atualizarData();

// Atualiza automaticamente
setInterval(() => {
  carregarDados();
  atualizarData();
}, 300000); // 5 minutos
