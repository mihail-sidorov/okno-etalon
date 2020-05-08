$(document).ready(() => {
    $('.slider__items').each((index, element) => {
        $(element).owlCarousel({
            loop:true, //Зацикливаем слайдер
            margin:40, //Отступ от элемента справа в 50px
            nav:true, //Отключение навигации
            autoplay:false, //Автозапуск слайдера
            smartSpeed:200, //Время движения слайда
            autoplayTimeout:2000, //Время смены слайда
            responsive:{ //Адаптивность. Кол-во выводимых элементов при определенной ширине.
                0: {
                    items: 1,
                },
                480: {
                    items: 2,
                },
                900: {
                    items: 3,
                },
                1200: {
                    items: 4,
                },
            }
        });

        setMaxHeightTitle($(element));

        $(window).resize(() => {
            setMaxHeightTitle($(element));
        });
    });

    function setMaxHeightTitle($sliderItems){
        setTimeout(() => {
            var max = 0, $title = $sliderItems.find('.slider__item-title');
    
            $title.css('height', 'auto');
            $title.css('height');

            $title.each((index, element) => {
                if ($(element).innerHeight() > max) {
                    max = $(element).innerHeight();
                }
            });
    
            $title.css('height', `${max}px`);
        }, 1000);
    }
});