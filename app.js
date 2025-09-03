// Demo user database
const users = [
  { id: "2024001", pass: "abc123", name: "Siti" },
  { id: "2024002", pass: "xyz789", name: "Budi" }
];

let selectedCandidate = null;

function checkLogin() {
  const id = document.getElementById("loginId").value.trim();
  const pass = document.getElementById("loginPass").value;
  const error = document.getElementById("loginError");

  const user = users.find(u => u.id === id && u.pass === pass);

  if(user) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("ballot").style.display = "block";
    error.style.display = "none";
  } else {
    error.style.display = "block";
  }
}

// Load candidates from JSON
async function loadCandidates() {
  const res = await fetch("candidates.json");
  const candidates = await res.json();
  const container = document.getElementById("candidates");
  container.innerHTML = "";
  candidates.forEach(c => {
    const card = document.createElement("div");
    card.className = "candidate";
    card.innerHTML = `
      <span>${c.name} (${c.class})</span>
      <img src="${c.photo}" alt="${c.name}" />
      <button>Pilih</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      document.querySelectorAll(".candidate").forEach(el => el.classList.remove("selected"));
      card.classList.add("selected");
      selectedCandidate = c;
    });
    container.appendChild(card);
  });
}

document.getElementById("submitVote").addEventListener("click", () => {
  if(!selectedCandidate){
    alert("Silakan pilih kandidat terlebih dahulu!");
    return;
  }
  alert("Suara berhasil dikirim untuk " + selectedCandidate.name);
});

loadCandidates();
