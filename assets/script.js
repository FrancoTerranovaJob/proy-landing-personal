// Datos de los casos de éxito: cada uno con la cantidad de fotos de su galería.
// Reemplazá "photos" por las URLs reales de las imágenes cuando las tengas.
const cases = [
    {
        photos: ["assets/img/yoga-1.png", "assets/img/yoga-2.png", "assets/img/yoga-3.png"],
        photosMobile: ["assets/img/yoga-1-mob.png", "assets/img/yoga-2-mob.png", "assets/img/yoga-3-mob.png"]
    }, // Caso 1 — 3 fotos
    {
        photos: ["assets/img/gym-1.png", "assets/img/gym-2.png", "assets/img/gym-3.png"],
        photosMobile: ["assets/img/gym-1-mob.png", "assets/img/gym-2-mob.png", "assets/img/gym-3-mob.png"]
    }  // Caso 2 — 3 fotos
];

const placeholderIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
  </svg>`;

const lightboxModalEl = document.getElementById('lightboxModal');
const carouselInner = document.getElementById('lightboxCarouselInner');
const positionText = document.getElementById('lightboxPosition');
let lightboxCarousel = null;
function isMobile() {
    return window.matchMedia('(max-width: 575px)').matches;
}

function getPhotosForCase(caseData) {
    if (isMobile() && caseData.photosMobile) {
        return caseData.photosMobile;
    }
    return caseData.photos;
}
function buildSlides(caseData) {
    carouselInner.innerHTML = '';
    const photos = getPhotosForCase(caseData);
    photos.forEach((photoUrl, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item${index === 0 ? ' active' : ''}`;

        if (photoUrl) {
            item.innerHTML = `<div class="lightbox-slide"><img src="${photoUrl}" alt="Foto ${index + 1}"></div>`;
        } else {
            item.innerHTML = `<div class="lightbox-slide lightbox-placeholder">${placeholderIcon}</div>`;
        }

        carouselInner.appendChild(item);
    });
}
function renderThumbnails() {
    document.querySelectorAll('.gallery-thumb').forEach((btn) => {
        const caseIndex = parseInt(btn.dataset.case, 10);
        const slideIndex = parseInt(btn.dataset.slide, 10);
        const caseData = cases[caseIndex];
        const photoUrl = getPhotosForCase(caseData)[slideIndex];
        if (photoUrl) {
            btn.innerHTML = `<img src="${photoUrl}" alt="" style="width:100%;height:100%;object-fit:cover;">`;
        } else {
            btn.innerHTML = placeholderIcon;
        }
    });
}


function updatePositionText(caseData, activeIndex) {
    positionText.textContent = `Foto ${activeIndex + 1} / ${getPhotosForCase(caseData).length}`;

}

// Al abrir el modal: armar el carrusel con las fotos del proyecto clickeado
// y arrancar en la foto que el usuario tocó.
document.querySelectorAll('.gallery-thumb').forEach((btn) => {
    btn.addEventListener('click', () => {
        const caseIndex = parseInt(btn.dataset.case, 10);
        const slideIndex = parseInt(btn.dataset.slide, 10);
        const caseData = cases[caseIndex];

        buildSlides(caseData);
        updatePositionText(caseData, slideIndex);

        // Reconstruir la instancia del carrusel cada vez (el contenido cambió)
        if (lightboxCarousel) {
            lightboxCarousel.dispose();
        }
        lightboxCarousel = new bootstrap.Carousel(document.getElementById('lightboxCarousel'), {
            interval: false,
            wrap: true
        });
        lightboxCarousel.to(slideIndex);

        // Guardar referencia al caso activo para el contador de posición
        carouselInner.dataset.activeCase = caseIndex;
    });
});

// Actualizar el contador "Foto X / Y" cada vez que se navega con las flechas
document.getElementById('lightboxCarousel').addEventListener('slid.bs.carousel', (event) => {
    const caseIndex = parseInt(carouselInner.dataset.activeCase, 10);
    const caseData = cases[caseIndex];
    updatePositionText(caseData, event.to);
});

renderThumbnails();

let lastIsMobile = isMobile();
window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastIsMobile) {
        lastIsMobile = nowMobile;
        renderThumbnails();
    }
});