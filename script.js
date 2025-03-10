'use strict';

const header = document.querySelector('.header');
const message = document.createElement('div');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allsections = document.querySelectorAll('.section');
const imgTarget = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Cookie settings
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improve our funcitonality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// // header.append(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.padding = '10px';

///////////////////////////////////////
// Smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Operation Tabs

tabsContainer.addEventListener('click', function (e) {
  // console.log('clikced');
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu Fade Animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  // console.log('hoverd');
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  // console.log('hoverdout');
  handleHover(e, 1);
});

////////////////////////
//sticky navigation
// window.addEventListener('scroll', function () {
//   nav.classList.add('sticky');
// });

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////
//Animation of scrolling screen

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObsever = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allsections.forEach(function (section) {
  sectionObsever.observe(section);
  // section.classList.add('section--hidden');
});

////////////////////////////////
// Lazy Loading Images..

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '50px',
});

imgTarget.forEach(img => imgObserver.observe(img));

////////////////////////////
//slider

const btnRight = document.querySelector('.slider__btn--right');
const btnleft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotsContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;
// slider.style.transform = 'scale(0.4) translateX(-400px)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDots(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide;
  else curSlide--;

  goToSlide(curSlide);
  activateDots(curSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDots(0);
};
init();

btnRight.addEventListener('click', nextSlide);
btnleft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});
