document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const page = document.body.dataset.page;

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    if (link.getAttribute('data-page-link') === page) {
      link.classList.add('is-active');
    }
  });

  const syncNavState = () => {
    if (!nav) {
      return;
    }

    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  syncNavState();
  window.addEventListener('scroll', syncNavState, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-word-cycle]').forEach((container) => {
    const words = Array.from(container.querySelectorAll('.word'));

    if (words.length < 2) {
      return;
    }

    let index = 0;
    window.setInterval(() => {
      words[index].classList.remove('active');
      index = (index + 1) % words.length;
      words[index].classList.add('active');
    }, 2200);
  });

  const collapseNode = document.getElementById('siteNavbar');
  if (collapseNode && window.bootstrap?.Collapse) {
    const collapse = bootstrap.Collapse.getOrCreateInstance(collapseNode, { toggle: false });
    collapseNode.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          collapse.hide();
        }
      });
    });
  }

  document.querySelectorAll('[data-mail-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = data.get('name') || '';
      const company = data.get('company') || '';
      const email = data.get('email') || '';
      const phone = data.get('phone') || '';
      const interest = data.get('interest') || '';
      const timeline = data.get('timeline') || '';
      const message = data.get('message') || '';

      const subject = `AsiliTech inquiry from ${name || 'website visitor'}`;
      const body = [
        `Name: ${name}`,
        `Company: ${company}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Interest: ${interest}`,
        `Timeline: ${timeline}`,
        '',
        'Business challenge:',
        `${message}`
      ].join('\n');

      window.location.href = `mailto:hello@asilitech.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
});