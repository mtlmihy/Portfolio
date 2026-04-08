const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");

  burger.classList.toggle("toggle");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("nav-active")) {
      navLinks.classList.remove("nav-active");
      burger.classList.remove("toggle");
    }
  });
});

const sectionsToAnimate = document.querySelectorAll(
  ".about, .skills, .projects, .contact"
);

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");

      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sectionsToAnimate.forEach((section) => {
  observer.observe(section);
});

var allowedKeys = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  65: "a",
  66: "b",
};

var konamiCode = [
  "up",
  "up",
  "down",
  "down",
  "left",
  "right",
  "left",
  "right",
  "b",
  "a",
];

var konamiCodePosition = 0;

// === DEBUG VISUALIZER ===
(function () {
  const panel = document.createElement("div");
  panel.id = "konami-debug";
  panel.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
    background: rgba(3,7,30,0.92); border: 1px solid #00ffff;
    box-shadow: 0 0 12px rgba(0,255,255,0.4); padding: 12px 16px;
    font-family: 'Share Tech Mono', monospace; font-size: 0.8rem;
    color: #e0e0e0; min-width: 260px; display: none;
  `;

  const title = document.createElement("div");
  title.style.cssText = "color:#00ffff; text-transform:uppercase; letter-spacing:2px; margin-bottom:8px; font-size:0.75rem;";
  title.textContent = "⌨ Konami Debug";
  panel.appendChild(title);

  const stepsRow = document.createElement("div");
  stepsRow.id = "konami-steps";
  stepsRow.style.cssText = "display:flex; gap:4px; flex-wrap:wrap; margin-bottom:8px;";
  panel.appendChild(stepsRow);

  const keyInfo = document.createElement("div");
  keyInfo.id = "konami-keyinfo";
  keyInfo.style.cssText = "font-size:0.75rem; color:#aaa; border-top:1px solid rgba(0,255,255,0.2); padding-top:6px; margin-top:4px;";
  panel.appendChild(keyInfo);

  const symbols = { up:"↑", down:"↓", left:"←", right:"→", a:"A", b:"B" };

  function renderSteps(pos, flash) {
    stepsRow.innerHTML = "";
    konamiCode.forEach(function (step, i) {
      const s = document.createElement("span");
      s.textContent = symbols[step] || step;
      s.style.cssText = `
        display:inline-block; width:26px; height:26px; line-height:26px;
        text-align:center; border:1px solid;
        transition: background 0.2s, color 0.2s;
      `;
      if (flash === "success") {
        s.style.borderColor = "#00ff88";
        s.style.color = "#00ff88";
        s.style.background = "rgba(0,255,136,0.15)";
      } else if (flash === "fail" && i === pos) {
        s.style.borderColor = "#ff0055";
        s.style.color = "#ff0055";
        s.style.background = "rgba(255,0,85,0.15)";
      } else if (i < pos) {
        s.style.borderColor = "#00ffff";
        s.style.color = "#00ffff";
        s.style.background = "rgba(0,255,255,0.1)";
      } else if (i === pos) {
        s.style.borderColor = "#ff00ff";
        s.style.color = "#ff00ff";
        s.style.background = "rgba(255,0,255,0.08)";
      } else {
        s.style.borderColor = "#333";
        s.style.color = "#555";
        s.style.background = "transparent";
      }
      stepsRow.appendChild(s);
    });
  }

  document.body.appendChild(panel);

  window.__konamiDebugRender = function (pos, receivedKey, expectedKey, state) {
    panel.style.display = "block";
    renderSteps(pos, state);
    if (state === "success") {
      keyInfo.style.color = "#00ff88";
      keyInfo.textContent = "✔ Séquence complète !";
      setTimeout(function () {
        panel.style.display = "none";
        keyInfo.style.color = "#aaa";
      }, 2000);
    } else if (state === "fail") {
      keyInfo.style.color = "#ff0055";
      keyInfo.textContent = "✘ reçu: [" + (receivedKey || "?") + "]  attendu: [" + expectedKey + "]  → reset";
    } else {
      keyInfo.style.color = "#aaa";
      keyInfo.textContent = "reçu: [" + receivedKey + "]  attendu: [" + expectedKey + "]  (" + pos + "/" + konamiCode.length + ")";
    }
  };
})();

// add keydown event listener
document.addEventListener("keydown", function (e) {
  var key = allowedKeys[e.keyCode];
  var requiredKey = konamiCode[konamiCodePosition];

  if (key == requiredKey) {
    konamiCodePosition++;

    if (konamiCodePosition == konamiCode.length) {
      window.__konamiDebugRender(konamiCodePosition, key, requiredKey, "success");
      activateCheats();
      konamiCodePosition = 0;
    } else {
      window.__konamiDebugRender(konamiCodePosition, key, konamiCode[konamiCodePosition], "ok");
    }
  } else {
    if (key) {
      window.__konamiDebugRender(konamiCodePosition, key, requiredKey, "fail");
    }
    konamiCodePosition = 0;
  }
});

function activateCheats() {
  var image = document.getElementById("maganache");

  image.src = "images/background/BP_Family.jpg";

  var audio = new Audio("audio/pling.mp3");
  audio.play();

  image.style.transition = "transform 0.5s ease";
  image.style.transform = "scale(1.1)";
  setTimeout(() => (image.style.transform = "scale(1)"), 500);
}
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { Accept: "application/json" },
  }).then((response) => {
    if (response.ok) {
      alert("Message envoyé avec succès !");
      form.reset();
    } else {
      alert("Erreur lors de l'envoi du message.");
    }
  });
});
//Telechargement CV
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

window.addEventListener("load", () => {
  const bars = document.querySelectorAll(".progress-bar");
  bars.forEach((bar) => {
    let width = 0;
    const target = parseInt(bar.getAttribute("data-progress"));
    const interval = setInterval(() => {
      if (width >= target) {
        clearInterval(interval);
        // bar.innerHTML = target + "%";
      } else {
        width++;
        bar.style.width = width + "%";
        // bar.innerHTML = width + "%";
      }
    }, 10);
  });
});

// Système de filtrage des projets
const filterBtns = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Retirer la classe active de tous les boutons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Ajouter la classe active au bouton cliqué
    btn.classList.add("active");

    const filterValue = btn.getAttribute("data-filter");

    projects.forEach((project) => {
      if (filterValue === "all") {
        project.classList.remove("hidden");
      } else {
        const categories = project.getAttribute("data-category").split(" ");
        if (categories.includes(filterValue)) {
          project.classList.remove("hidden");
        } else {
          project.classList.add("hidden");
        }
      }
    });
  });
});
