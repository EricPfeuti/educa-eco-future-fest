var swiper = new Swiper(".slide-contentCourse", {
    slidesPerView: 4,
    spaceBetween: 10,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
        nextEl: ".swiper-buttonCourse-next",
        prevEl: ".swiper-buttonCourse-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
        1250: {
            slidesPerView: 4,
        },
    },
});
