alert("JS startet");
const PASSWORD = "0303";

const LS = {
  AUTH: "auth",
  TEXT: "text",
  IMAGES: "images"
};

const loginOverlay = document.getElementById("loginOverlay");
const passwordInput = document.getElementById("passwordInput");
const openBtn = document.getElementById("openBtn");
const loginMsg = document.getElementById("loginMsg");
const app = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");

const textEditor = document.getElementById("textEditor");
const saveTextBtn = document.getElementById("saveTextBtn");
const resetTextBtn = document.getElementById("resetTextBtn");

const imageInput = document.getElementById("imageInput");
const gallery = document.getElementById("gallery");
const clearImagesBtn = document.getElementById("clearImagesBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

function isAuth() {
  return localStorage.getItem(LS.AUTH) === "1";
}

function showApp() {
  loginOverlay.classList.add("hidden");
  app.classList.remove("hidden");
  loadText();
  renderGallery();
}

function showLogin() {
  loginOverlay.classList.remove("hidden");
  app.classList.add("hidden");
}

openBtn.onclick = () => {
  if (passwordInput.value === PASSWORD) {
    localStorage.setItem(LS.AUTH, "1");
    showApp();
  } else {
    loginMsg.textContent = "Falsches Passwort";
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem(LS.AUTH);
  showLogin();
};

if (isAuth()) showApp();

function loadText() {
  textEditor.innerHTML = localStorage.getItem(LS.TEXT) ||
    `<h2>Beispielüberschrift</h2><p>Beispieltext.</p>`;
}

saveTextBtn.onclick = () => {
  localStorage.setItem(LS.TEXT, textEditor.innerHTML);
};

resetTextBtn.onclick = () => {
  textEditor.innerHTML = `<h2>Beispielüberschrift</h2><p>Beispieltext.</p>`;
  localStorage.setItem(LS.TEXT, textEditor.innerHTML);
};

imageInput.onchange = async (e) => {
  const files = [...e.target.files];
  const images = loadImages();

  for (const file of files) {
    const dataUrl = await toDataURL(file);
    images.push({ name: file.name, dataUrl });
  }

  localStorage.setItem(LS.IMAGES, JSON.stringify(images));
  renderGallery();
};

function loadImages() {
  return JSON.parse(localStorage.getItem(LS.IMAGES) || "[]");
}

function renderGallery() {
  const images = loadImages();
  gallery.innerHTML = "";

  if (images.length === 0) {
    gallery.innerHTML = "<p class='muted'>Noch keine Bilder.</p>";
    return;
  }

  images.forEach((img) => {
    const div = document.createElement("div");
    div.className = "thumb";
    div.onclick = () => openLightbox(img);

    const image = document.createElement("img");
    image.src = img.dataUrl;

    div.appendChild(image);
    gallery.appendChild(div);
  });
}

function openLightbox(img) {
  lightboxImg.src = img.dataUrl;
  lightboxCaption.textContent = img.name;
  lightbox.classList.remove("hidden");
}

closeLightbox.onclick = () => {
  lightbox.classList.add("hidden");
};

clearImagesBtn.onclick = () => {
  localStorage.removeItem(LS.IMAGES);
  renderGallery();
};

function toDataURL(file) {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}
