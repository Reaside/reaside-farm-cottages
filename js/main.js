document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Mark current nav link active */
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });

  /* Header background solidify on scroll */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.style.background = 'rgba(28, 38, 26, 0.97)';
      else header.style.background = '';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* Lightbox gallery */
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll('.gallery a, .lightbox-link'));
  if (galleryLinks.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<img src="" alt="">' +
      '<button class="lightbox-next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    var img = lb.querySelector('img');
    var caption = lb.querySelector('.lightbox-caption');
    var current = 0;

    function show(index) {
      current = (index + galleryLinks.length) % galleryLinks.length;
      var link = galleryLinks[current];
      img.src = link.getAttribute('href');
      img.alt = link.dataset.caption || '';
      caption.textContent = link.dataset.caption || '';
    }

    galleryLinks.forEach(function (link, index) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        show(index);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* Booking form (no backend — friendly confirmation only) */
  document.querySelectorAll('form[data-local-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-success');
      form.querySelectorAll('input, textarea, select').forEach(function (el) { el.disabled = true; });
      form.querySelector('button[type="submit"]').style.display = 'none';
      if (note) note.style.display = 'block';
    });
  });

  /* Contact form — submits by email via FormSubmit */
  document.querySelectorAll('form[data-email-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successNote = form.querySelector('.form-success');
      var errorNote = form.querySelector('.form-error');
      var submitBtn = form.querySelector('button[type="submit"]');
      var ajaxAction = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      if (errorNote) errorNote.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(ajaxAction, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          return res.json();
        })
        .then(function () {
          form.querySelectorAll('input, textarea, select').forEach(function (el) { el.disabled = true; });
          submitBtn.style.display = 'none';
          if (successNote) successNote.style.display = 'block';
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          if (errorNote) errorNote.style.display = 'block';
        });
    });
  });

});
