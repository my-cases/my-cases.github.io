const whatsappNumber = document.body.dataset.whatsappNumber.replace(/\D/g, '');
const defaultMessage = 'Здравствуйте! Хочу обсудить свою задачу.';
const whatsappUrl = message => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl(link.dataset.message || defaultMessage);
});

const form = document.querySelector('#contact-form');
const messageInput = document.querySelector('#message');
// Native submission opens a new chat. Visitors can start a conversation without filling anything in.
form.addEventListener('submit', () => {
  if (!messageInput.value.trim()) messageInput.value = defaultMessage;
});

const caseMedia = {
  app: { title: 'Учебное приложение', video: 'assets/case-app-demo.mp4', poster: 'assets/case-app-course.webp' },
  green: { title: 'Система управления DAGENGLISH', image: 'assets/case-crm-green.jpg', alt: 'Интерфейс системы управления DAGENGLISH' },
  blue: { title: 'Система управления школой', video: 'assets/case-crm-blue-demo.mp4', poster: 'assets/case-crm-blue.webp' },
  journal: { title: 'Электронный журнал', video: 'assets/case-journal-demo.mp4', poster: 'assets/case-journal.webp' }
};
const mediaDialog = document.querySelector('#media-dialog');
const mediaDialogTitle = document.querySelector('#media-dialog-title');
const mediaDialogContent = document.querySelector('#media-dialog-content');
let mediaTrigger;

document.querySelectorAll('[data-case-media]').forEach(button => {
  button.addEventListener('click', () => {
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
  });
});

document.querySelector('.media-dialog-close').addEventListener('click', () => mediaDialog.close());
mediaDialog.addEventListener('click', event => {
  // Do not dismiss clicks in the empty space beside portrait videos.
  if (event.target !== mediaDialog) return;
  const bounds = mediaDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) mediaDialog.close();
});
mediaDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  const video = mediaDialogContent.querySelector('video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  mediaDialogContent.replaceChildren();
  mediaTrigger?.focus({ preventScroll: true });
});

document.querySelector('#year').textContent = new Date().getFullYear();
