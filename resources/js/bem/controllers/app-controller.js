$(document).ready(() => {
    $('.header__order-call-btn, .header__order-call-mobile-btn').click(() => {
        $('.modal-window').addClass('modal-window_show');
    });

    $('.buklet__new').click(() => {
        $('html, body').stop().animate(
            {
                scrollTop: $('.special-offer').offset().top - 20
            },
            {
                duration: 1000,
                easing: 'easeOutQuint',
                queue: false,
            }
        );
    });
});