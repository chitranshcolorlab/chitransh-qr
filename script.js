
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
