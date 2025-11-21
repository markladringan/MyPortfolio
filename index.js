document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const navLinks = Array.from(document.querySelectorAll('.navbar .nav a, .home-header a'));
  const sections = [];

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const section = document.querySelector(href);
    if (section && !sections.includes(section)) {
      sections.push(section);
    }
  });

  let navHeight = nav ? nav.offsetHeight : 0;

  const refreshNavHeight = () => {
    navHeight = nav ? nav.offsetHeight : 0;
  };

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${id}`);
    });
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const triggerLine = scrollTop + navHeight + 2;
    const nearPageBottom =
      window.innerHeight + scrollTop >= document.body.scrollHeight - 4;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = rect.bottom + window.scrollY;
      // Sooner activation (slightly above the section start)
      if (triggerLine >= top - 10 && triggerLine < bottom) {
        setActive(section.id);
        return;
      }
    }

    if (nearPageBottom && sections.length > 0) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    if (sections.length > 0) {
      setActive(sections[0].id);
    }
  };

  const smoothScrollTo = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
    setActive(hash.replace('#', '')); // update immediately on click
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      smoothScrollTo(href);
    });
  });

  // Toggle logic for Skills section
  const toggleOptions = Array.from(document.querySelectorAll('.toggle-option'));
  const techstack = document.querySelector('.techstack');
  const certificates = document.querySelector('.certificates');

  const updateToggleView = (target) => {
    if (!techstack || !certificates) return;
    const showTech = target === 'techstack';
    techstack.style.display = showTech ? 'flex' : 'none';
    certificates.style.display = showTech ? 'none' : 'flex';
    toggleOptions.forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.target === target);
    });
  };

  toggleOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      const target = opt.dataset.target;
      updateToggleView(target);
    });
  });

  // Set initial state
  if (toggleOptions.length) {
    const initial = toggleOptions.find((opt) => opt.classList.contains('active'));
    updateToggleView(initial ? initial.dataset.target : 'techstack');
  }

  // Certificate modal
  const modal = document.getElementById('cert-modal');
  const modalImg = modal ? modal.querySelector('img') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const certButtons = Array.from(document.querySelectorAll('.certcard .viewcert button'));

  const openModal = (src, altText) => {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = altText || 'Certificate preview';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  certButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.certcard');
      const img = card ? card.querySelector('.certimg img') : null;
      if (img && img.src) {
        openModal(img.src, img.alt || 'Certificate');
      }
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Social card click handlers
  const socialCards = Array.from(document.querySelectorAll('.socialscard[data-url]'));
  socialCards.forEach((card) => {
    const url = card.dataset.url;
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      if (url) window.open(url, '_blank', 'noopener');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
  });

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    refreshNavHeight();
    handleScroll();
  });
});
