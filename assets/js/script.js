
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("hidden"), 350);
});

$("#year").textContent = new Date().getFullYear();

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => observer.observe(el));

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
$$(".gallery-item").forEach(item => item.addEventListener("click", () => {
  lightboxImage.src = item.dataset.src;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}));
function closeLightbox(){
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxImage.src = "";
}
$("#lightboxClose")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeLightbox(); });

const enquiryOverlay = $("#enquiryOverlay");
const enquiryForm = $("#enquiryForm");
const enquiryClose = $("#enquiryClose");
let enquiryReturnFocus = null;
let enquiryPreviousOverflow = "";

function openEnquiry(trigger) {
  enquiryReturnFocus = trigger;
  enquiryPreviousOverflow = document.body.style.overflow;
  enquiryOverlay.classList.add("is-open");
  enquiryOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  enquiryForm.elements.fullName.focus();
}

function closeEnquiry() {
  if (!enquiryOverlay.classList.contains("is-open")) return;
  enquiryOverlay.classList.remove("is-open");
  enquiryOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = enquiryPreviousOverflow;
  enquiryReturnFocus?.focus();
}

$$('[data-enquiry-open]').forEach(trigger => trigger.addEventListener("click", () => openEnquiry(trigger)));
enquiryClose?.addEventListener("click", closeEnquiry);
enquiryOverlay?.addEventListener("click", e => { if (e.target === enquiryOverlay) closeEnquiry(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeEnquiry(); });

enquiryForm?.addEventListener("submit", e => {
  e.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const services = data.getAll("services").join(", ") || "Not specified";
  const value = name => String(data.get(name) || "Not specified").trim() || "Not specified";
  const message = `Hello Chitransh Color Lab,

I would like to check availability for my event.

Name: ${value("fullName")}
Mobile: ${value("mobile")}
Event Date: ${value("eventDate")}
Event Type: ${value("eventType")}
Venue / City: ${value("venue")}
Required Services: ${services}
Estimated Budget: ${value("budget")}
Additional Message: ${value("message")}

Please share the available photography options and quotation.`;
  window.open(`https://wa.me/919828783400?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const toast = $("#toast");
function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
$("#shareButton")?.addEventListener("click", async () => {
  const data = {
    title: "Chitransh Color Lab",
    text: "Explore Chitransh Color Lab — wedding photography and cinematic films in Didwana.",
    url: location.href
  };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(location.href);
      showToast("Website link copied");
    }
  } catch (e) {}
});

let deferredPrompt;
const installButton = $("#installButton");
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.hidden = false;
});
installButton?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

// V5 cinematic hero playlist: six wedding reels followed by four pre-wedding reels.
const heroPlaylist = [
  { src: "assets/videos/wedding/wedding-01.mp4", label: "Wedding Stories · 01 / 06" },
  { src: "assets/videos/wedding/wedding-03.mp4", label: "Wedding Stories · 02 / 06" },
  { src: "assets/videos/wedding/wedding-02.mp4", label: "Wedding Stories · 03 / 06" },
  { src: "assets/videos/wedding/wedding-04.mp4", label: "Wedding Stories · 04 / 06" },
  { src: "assets/videos/wedding/wedding-05.mp4", label: "Wedding Stories · 05 / 06" },
  { src: "assets/videos/wedding/wedding-06.mp4", label: "Wedding Stories · 06 / 06" },
  { src: "assets/videos/prewedding/prewedding-01.mp4", label: "Pre-Wedding Stories · 01 / 04" },
  { src: "assets/videos/prewedding/prewedding-02.mp4", label: "Pre-Wedding Stories · 02 / 04" },
  { src: "assets/videos/prewedding/prewedding-03.mp4", label: "Pre-Wedding Stories · 03 / 04" },
  { src: "assets/videos/prewedding/prewedding-04.mp4", label: "Pre-Wedding Stories · 04 / 04" }
];
const heroVideo = document.querySelector("#heroVideo");
const heroVideoSource = document.querySelector("#heroVideoSource");
const heroReelLabel = document.querySelector("#heroReelLabel");
let heroIndex = 0;
function playHero(index) {
  if (!heroVideo || !heroVideoSource) return;
  heroIndex = index % heroPlaylist.length;
  const item = heroPlaylist[heroIndex];
  heroVideo.classList.add("is-changing");
  setTimeout(() => {
    heroVideoSource.src = item.src;
    heroVideo.load();
    heroVideo.play().catch(() => {});
    if (heroReelLabel) heroReelLabel.textContent = item.label;
    heroVideo.classList.remove("is-changing");
  }, 350);
}
heroVideo?.addEventListener("ended", () => playHero(heroIndex + 1));
heroVideo?.addEventListener("error", () => playHero(heroIndex + 1));
