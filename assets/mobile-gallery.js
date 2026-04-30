(() => {
    // POZNÁMKA:
    // Tento modul vytváří jednoduchou fullscreen galerii pro obrázky na stránkách služeb.
    // Umí: otevřít obrázek kliknutím/klávesou Enter, zavřít tlačítkem/klikem mimo/Escape.
    const MOBILE_GALLERY_CONFIG = {
        imageSelector: '.mobile-only-bg-image, .mobile-only-image, .desktop-float-image, .gallery-hidden-image',
        overlayClass: 'mobile-gallery-overlay'
    };

    const images = Array.from(document.querySelectorAll(MOBILE_GALLERY_CONFIG.imageSelector));

    if (!images.length) {
        return;
    }

    let currentIndex = 0;

    const overlay = document.createElement('div');
    overlay.className = MOBILE_GALLERY_CONFIG.overlayClass;
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
        <button class="mobile-gallery-close" type="button" aria-label="Zavřít galerii">✕</button>
        <button class="mobile-gallery-nav mobile-gallery-prev" type="button" aria-label="Předchozí fotka">‹</button>
        <img class="mobile-gallery-image" alt="" />
        <button class="mobile-gallery-nav mobile-gallery-next" type="button" aria-label="Další fotka">›</button>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.mobile-gallery-close');
    const prevBtn = overlay.querySelector('.mobile-gallery-prev');
    const nextBtn = overlay.querySelector('.mobile-gallery-next');
    const galleryImage = overlay.querySelector('.mobile-gallery-image');

    const hasNavigation = images.length > 1;

    prevBtn.hidden = !hasNavigation;
    nextBtn.hidden = !hasNavigation;

    function updateGallery() {
        const currentImage = images[currentIndex];
        galleryImage.src = currentImage.currentSrc || currentImage.src;
        galleryImage.alt = currentImage.alt || '';
    }

    function goToPrevious() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
    }

    function openGallery(index) {
        currentIndex = index;
        updateGallery();

        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    images.forEach((image, index) => {
        if (image.hidden || image.dataset.galleryHidden === 'true') {
            return;
        }

        image.style.cursor = 'zoom-in';
        image.setAttribute('role', 'button');
        image.setAttribute('tabindex', '0');

        image.addEventListener('click', () => openGallery(index));
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGallery(index);
            }
        });
    });

    closeBtn.addEventListener('click', closeGallery);
    prevBtn.addEventListener('click', goToPrevious);
    nextBtn.addEventListener('click', goToNext);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeGallery();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!overlay.classList.contains('open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeGallery();
        } else if (event.key === 'ArrowLeft' && hasNavigation) {
            goToPrevious();
        } else if (event.key === 'ArrowRight' && hasNavigation) {
            goToNext();
        }
    });
})();
