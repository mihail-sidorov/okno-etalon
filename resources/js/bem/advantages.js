$(document).ready(() => {

    $('.advantages__item-icon').css('width', getMinWidth() + 'px');

    $(window).resize(() => {
        $('.advantages__item-icon').css('width', getMinWidth() + 'px');
    });

    function getMinWidth(){
        var minWidth;

        $('.advantages__item-icon').css('width', '33.33%');
        minWidth = $('.advantages__item-icon').innerWidth();

        $('.advantages__item-icon').each((index, element) => {
            var elementWidth = $(element).innerWidth();

            if (elementWidth < minWidth) {
                minWidth = elementWidth;
            }
        });

        return Math.floor(minWidth);
    }
});