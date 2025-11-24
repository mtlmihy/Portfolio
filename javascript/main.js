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

// add keydown event listener
document.addEventListener("keydown", function (e) {
  var key = allowedKeys[e.keyCode];
  var requiredKey = konamiCode[konamiCodePosition];

  if (key == requiredKey) {
    konamiCodePosition++;

    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {
  var image = document.getElementById("maganache");

  image.src = "images/background/FootUs.jpg";

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
