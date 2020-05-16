$(document).ready(() => {

    $('.advantages__item-icon').css('width', getMinWidth() + 'px');

    $(window).resize(() => {
        $('.advantages__item-icon').css('width', getMinWidth() + 'px');
    });

    function getMinWidth(){
        var minHeight;

        $('.advantages__item-icon').css('width', '33.33%');
        minHeight = $('.advantages__item-icons').innerHeight();

        $('.advantages__item-icons').each((index, element) => {
            var elementHeight = $(element).innerHeight();

            if (elementHeight < minHeight) {
                minHeight = elementHeight;
            }
        });

        return Math.floor(minHeight);
    }
});