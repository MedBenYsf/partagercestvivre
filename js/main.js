// ===== Menu mobile =====
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }

  // Marque le lien actif dans la nav en fonction de la page courante
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });
});

// ===== Événements =====
const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateFr(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return `${d.getDate()} ${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

async function loadEvents() {
  const res = await fetch("data/events.json");
  if (!res.ok) throw new Error("Impossible de charger les événements");
  const events = await res.json();
  return events.map((e) => ({ ...e, dateObj: new Date(e.date + "T00:00:00") }));
}

function splitEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events
    .filter((e) => e.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj);
  const past = events
    .filter((e) => e.dateObj < today)
    .sort((a, b) => b.dateObj - a.dateObj);
  return { upcoming, past };
}

function eventCardHtml(event, isPast) {
  const desc = event.description || "";
  const imageHtml = event.image
    ? `<div class="card-image"><img src="${event.image}" alt="${event.title}" loading="lazy"></div>`
    : `<div class="card-image" aria-hidden="true">${isPast ? "📷" : "📅"}</div>`;
  return `
    <div class="card${isPast ? " event-past" : ""}">
      ${imageHtml}
      <div class="card-body">
        <span class="event-date-badge">${formatDateFr(event.date)}${event.time ? " · " + event.time : ""}</span>
        <h3>${event.title}</h3>
        ${event.location ? `<div class="card-meta">📍 ${event.location}</div>` : ""}
        <p>${desc}</p>
        ${event.ticketLink ? `<a href="${event.ticketLink}" target="_blank" rel="noopener" class="btn btn-primary" style="align-self:flex-start;">🎟️ Réserver mes billets</a>` : ""}
        ${event.link ? `<a href="${event.link}" target="_blank" rel="noopener">Voir sur Facebook →</a>` : ""}
      </div>
    </div>
  `;
}

// Rendu générique des événements à venir dans un conteneur donné (limit optionnel)
async function renderUpcomingEventsInto(elementId, limit) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const events = await loadEvents();
    const { upcoming } = splitEvents(events);
    if (upcoming.length === 0) {
      el.innerHTML = `<p class="empty-state">Aucun événement à venir pour le moment. Suivez notre page Facebook pour ne rien manquer !</p>`;
      return;
    }
    const list = limit ? upcoming.slice(0, limit) : upcoming;
    el.innerHTML = list.map((e) => eventCardHtml(e, false)).join("");
  } catch (err) {
    el.innerHTML = `<p class="empty-state">Impossible de charger les événements pour le moment.</p>`;
  }
}

// Rendu pour la page événements : listes complètes + filtre
async function renderEventsPage() {
  const upcomingEl = document.getElementById("upcoming-events-list");
  const pastEl = document.getElementById("past-events-list");
  if (!upcomingEl && !pastEl) return;

  try {
    const events = await loadEvents();
    const { upcoming, past } = splitEvents(events);

    upcomingEl.innerHTML = upcoming.length
      ? upcoming.map((e) => eventCardHtml(e, false)).join("")
      : `<p class="empty-state">Aucun événement à venir pour le moment.</p>`;

    pastEl.innerHTML = past.length
      ? past.map((e) => eventCardHtml(e, true)).join("")
      : `<p class="empty-state">Aucun événement passé enregistré.</p>`;

    const tabs = document.querySelectorAll(".filter-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.target;
        upcomingEl.style.display = target === "upcoming" || target === "all" ? "grid" : "none";
        pastEl.style.display = target === "past" || target === "all" ? "grid" : "none";
        document.getElementById("upcoming-heading").style.display = target === "past" ? "none" : "block";
        document.getElementById("past-heading").style.display = target === "upcoming" ? "none" : "block";
      });
    });
  } catch (err) {
    if (upcomingEl) upcomingEl.innerHTML = `<p class="empty-state">Impossible de charger les événements pour le moment.</p>`;
    if (pastEl) pastEl.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderUpcomingEventsInto("home-upcoming-events", 3);
  renderUpcomingEventsInto("actu-upcoming-events");
  renderEventsPage();
  renderActualitesPage();
});

// ===== Actualités =====
async function loadActualites() {
  const res = await fetch("data/actualites.json");
  if (!res.ok) throw new Error("Impossible de charger les actualités");
  const posts = await res.json();
  return posts
    .map((p) => ({ ...p, dateObj: new Date(p.date + "T00:00:00") }))
    .sort((a, b) => b.dateObj - a.dateObj);
}

function actualiteCardHtml(post) {
  return `
    <div class="card">
      <div class="card-image" aria-hidden="true">📰</div>
      <div class="card-body">
        <span class="event-date-badge">${formatDateFr(post.date)}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt || ""}</p>
        ${post.link ? `<a href="${post.link}" target="_blank" rel="noopener">Voir sur Facebook →</a>` : ""}
      </div>
    </div>
  `;
}

async function renderActualitesPage() {
  const el = document.getElementById("actualites-list");
  if (!el) return;
  try {
    const posts = await loadActualites();
    el.innerHTML = posts.length
      ? posts.map(actualiteCardHtml).join("")
      : `<p class="empty-state">Aucune actualité pour le moment.</p>`;
  } catch (err) {
    el.innerHTML = `<p class="empty-state">Impossible de charger les actualités pour le moment.</p>`;
  }
}

// ===== Formulaire de contact (envoi via mailto, aucun backend requis) =====
const CONTACT_EMAIL = "asso.partagercestvivre@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    const subject = encodeURIComponent(`Message de ${name} via le site`);
    const body = encodeURIComponent(`${message}\n\n---\nDe : ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
});
