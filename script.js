const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
document.documentElement.classList.add('motion-ready');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  mobileNav.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const catalogScroll = document.querySelector('#hero-services-scroll');
const catalogNext = document.querySelector('.catalog-next');
const catalogLabel = catalogNext.querySelector('[data-catalog-label]');
const catalogArrow = catalogNext.querySelector('[data-catalog-arrow]');
const groups = [...document.querySelectorAll('.scenario-group')];
const totalSolutions = document.querySelectorAll('[data-scenario]').length;

function taskWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'задача';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'задачи';
  return 'задач';
}

function updateCatalogAction() {
  const atEnd = catalogScroll.scrollTop + catalogScroll.clientHeight >= catalogScroll.scrollHeight - 8;
  catalogLabel.textContent = atEnd ? 'К началу списка' : `Листайте: ${totalSolutions} ${taskWord(totalSolutions)}`;
  catalogArrow.textContent = atEnd ? '↑' : '↓';
}

catalogNext.addEventListener('click', () => {
  const atEnd = catalogScroll.scrollTop + catalogScroll.clientHeight >= catalogScroll.scrollHeight - 8;
  catalogScroll.scrollTo({
    top: atEnd ? 0 : catalogScroll.scrollTop + catalogScroll.clientHeight * .82,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
});
catalogScroll.addEventListener('scroll', updateCatalogAction, { passive: true });
groups.forEach(group => group.addEventListener('toggle', updateCatalogAction));
updateCatalogAction();

const caseMedia = {
  app: { title: 'Учебное приложение', video: 'assets/case-app-demo.mp4', poster: 'assets/case-app-course.webp' },
  green: { title: 'CRM DAGENGLISH', image: 'assets/case-crm-green.jpg', alt: 'Интерфейс CRM DAGENGLISH' },
  blue: { title: 'CRM для управления школой', video: 'assets/case-crm-blue-demo.mp4', poster: 'assets/case-crm-blue.webp' },
  journal: { title: 'Онлайн-журнал', video: 'assets/case-journal-demo.mp4', poster: 'assets/case-journal.webp' }
};
const mediaDialog = document.querySelector('#media-dialog');
const mediaDialogTitle = document.querySelector('#media-dialog-title');
const mediaDialogContent = document.querySelector('#media-dialog-content');
let mediaTrigger = null;

document.querySelectorAll('[data-case-media]').forEach(button => button.addEventListener('click', () => {
  const item = caseMedia[button.dataset.caseMedia];
  if (!item) return;
  mediaTrigger = button;
  mediaDialogTitle.textContent = item.title;
  const media = document.createElement(item.video ? 'video' : 'img');
  if (item.video) {
    media.controls = true;
    media.playsInline = true;
    media.preload = 'metadata';
    media.poster = item.poster;
    media.src = item.video;
  } else {
    media.src = item.image;
    media.alt = item.alt;
  }
  mediaDialogContent.replaceChildren(media);
  mediaDialog.showModal();
  document.body.classList.add('dialog-open');
  if (item.video) media.play().catch(() => {});
}));
document.querySelector('.media-dialog-close').addEventListener('click', () => mediaDialog.close());
mediaDialog.addEventListener('click', event => { if (event.target === mediaDialog) mediaDialog.close(); });
mediaDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  const video = mediaDialogContent.querySelector('video');
  if (video) video.pause();
  mediaDialogContent.replaceChildren();
  mediaTrigger?.focus();
});

const form = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const messageInput = document.querySelector('#message');
const feedback = document.querySelector('#form-feedback');
const whatsappNumber = (document.body.dataset.whatsappNumber || '').replace(/\D/g, '');

document.querySelectorAll('[data-scenario]').forEach(link => link.addEventListener('click', () => {
  messageInput.value = `Для кого: ${link.dataset.audience}\nПроблема: ${link.dataset.problem}\nИнтересующее решение: ${link.dataset.solution}`;
  messageInput.setAttribute('aria-invalid', 'false');
  document.querySelector('#message-error').textContent = '';
}));
document.querySelectorAll('[data-case-interest]').forEach(link => link.addEventListener('click', () => {
  messageInput.value = `Интересует похожий проект: ${link.dataset.caseInterest}`;
  messageInput.setAttribute('aria-invalid', 'false');
  document.querySelector('#message-error').textContent = '';
}));

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const task = messageInput.value.trim();
  nameInput.setAttribute('aria-invalid', name ? 'false' : 'true');
  messageInput.setAttribute('aria-invalid', task ? 'false' : 'true');
  document.querySelector('#name-error').textContent = name ? '' : 'Укажите ваше имя.';
  document.querySelector('#message-error').textContent = task ? '' : 'Коротко опишите задачу.';
  if (!name || !task) {
    (name ? messageInput : nameInput).focus();
    feedback.textContent = '';
    return;
  }
  if (!whatsappNumber) {
    feedback.textContent = 'Отправка в WhatsApp пока не настроена: нужен номер получателя.';
    return;
  }
  const text = `Здравствуйте! Меня зовут ${name}.\n\nМоя задача:\n${task}`;
  feedback.textContent = 'Открываем WhatsApp. Подтвердите отправку в чате.';
  window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
});
nameInput.addEventListener('input', () => {
  if (nameInput.value.trim()) {
    nameInput.setAttribute('aria-invalid', 'false');
    document.querySelector('#name-error').textContent = '';
  }
});
messageInput.addEventListener('input', () => {
  if (messageInput.value.trim()) {
    messageInput.setAttribute('aria-invalid', 'false');
    document.querySelector('#message-error').textContent = '';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}
