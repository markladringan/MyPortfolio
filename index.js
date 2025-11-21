document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const navLinks = Array.from(document.querySelectorAll('.navbar .nav a, .home-header a'));
  const sections = [];
  const homeSection = document.querySelector('.home');
  const navLogo = document.querySelector('.navbar .logo img');
  const bigLogo = document.querySelector('.biglogo img');
  const homeHeader = document.querySelector('.home-header');
  const homeContent = document.querySelector('.homecontent');
  const worksSidebar = document.getElementById('works-sidebar');
  const worksSidebarTrack = worksSidebar ? worksSidebar.querySelector('.works-slider-track') : null;
  const worksSliderPrev = worksSidebar ? worksSidebar.querySelector('.works-slider-btn.prev') : null;
  const worksSliderNext = worksSidebar ? worksSidebar.querySelector('.works-slider-btn.next') : null;
  const worksSidebarTitle = worksSidebar ? worksSidebar.querySelector('.works-sidebar-text h3') : null;
  const worksSidebarDesc = worksSidebar ? worksSidebar.querySelector('.works-sidebar-text p') : null;
  const worksSidebarClose = worksSidebar ? worksSidebar.querySelector('.works-sidebar-close') : null;
  const worksButtons = Array.from(document.querySelectorAll('.workscard .viewworks button'));
  let sliderImages = [];
  let sliderIndex = 0;

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

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const animateHomeToNav = () => {
    if (!homeSection || !navLogo || !bigLogo || !homeHeader) return;
    const homeHeight = homeSection.offsetHeight || 1;
    const y = window.scrollY;
    const maxScroll = Math.max(1, homeHeight - navHeight);
    const progress = clamp(y / maxScroll, 0, 1);

    const bigScale = 1 - 0.5 * progress;
    const bigOpacity = 1 - progress;
    const navScale = 0.4 + 0.6 * progress;
    const navOpacity = 0.2 + 0.8 * progress;
    const headerOffset = -40 * progress;
    const headerOpacity = 1 - progress;
    const contentOffset = 20 * progress;
    const contentOpacity = 1 - 0.7 * progress;

    bigLogo.style.transform = `scale(${bigScale})`;
    bigLogo.style.opacity = `${bigOpacity}`;
    navLogo.style.transform = `scale(${navScale})`;
    navLogo.style.opacity = `${navOpacity}`;
    homeHeader.style.transform = `translateY(${headerOffset}px)`;
    homeHeader.style.opacity = `${headerOpacity}`;
    if (homeContent) {
      homeContent.style.transform = `translateY(${contentOffset}px)`;
      homeContent.style.opacity = `${contentOpacity}`;
    }
  };

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

  // Works sidebar logic with slider
  const updateSliderPosition = () => {
    if (!worksSidebarTrack) return;
    worksSidebarTrack.style.transform = `translateX(-${sliderIndex * 100}%)`;
  };

  const renderSlider = () => {
    if (!worksSidebarTrack) return;
    worksSidebarTrack.innerHTML = '';
    sliderImages.forEach((src, idx) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Work slide ${idx + 1}`;
      worksSidebarTrack.appendChild(img);
    });
    updateSliderPosition();
  };

  const openWorksSidebar = (imgSrc, title, desc, card) => {
    if (!worksSidebar || !worksSidebarTrack || !worksSidebarTitle || !worksSidebarDesc) return;
    const sliderNodes = card
      ? Array.from(card.querySelectorAll('.sliderimg img')).map((n) => n.src)
      : [];
    sliderImages = sliderNodes.length ? sliderNodes : [imgSrc || ''];
    sliderImages = sliderImages.filter(Boolean);
    sliderIndex = 0;
    renderSlider();
    worksSidebarTitle.textContent = title || '';
    worksSidebarDesc.textContent = desc || '';
    worksSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeWorksSidebar = () => {
    if (!worksSidebar) return;
    worksSidebar.classList.remove('open');
    document.body.style.overflow = '';
  };

  worksButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.workscard');
      const img = card ? card.querySelector('.worksimg img') : null;
      const title = card ? card.querySelector('.workstext h3') : null;
      const desc = card ? card.querySelector('.worksdesc p') : null;
      openWorksSidebar(img ? img.src : '', title ? title.textContent : '', desc ? desc.textContent : '', card);
    });
  });

  if (worksSidebar) {
    worksSidebar.addEventListener('click', (e) => {
      if (e.target === worksSidebar) closeWorksSidebar();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeWorksSidebar();
    });
  }
  if (worksSidebarClose) {
    worksSidebarClose.addEventListener('click', closeWorksSidebar);
  }
  if (worksSliderPrev) {
    worksSliderPrev.addEventListener('click', () => {
      if (!sliderImages.length) return;
      sliderIndex = (sliderIndex - 1 + sliderImages.length) % sliderImages.length;
      updateSliderPosition();
    });
  }
  if (worksSliderNext) {
    worksSliderNext.addEventListener('click', () => {
      if (!sliderImages.length) return;
      sliderIndex = (sliderIndex + 1) % sliderImages.length;
      updateSliderPosition();
    });
  }

  animateHomeToNav();
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('scroll', animateHomeToNav, { passive: true });
  window.addEventListener('resize', () => {
    refreshNavHeight();
    handleScroll();
    animateHomeToNav();
  });
});
