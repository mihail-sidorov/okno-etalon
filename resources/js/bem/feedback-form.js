$(document).ready(() => {
    
    function formValidator($form){

        var self = this;

        var timerId;

        // Поля Валидатора
            self.errors = [];
        // Поля Валидатора КОНЕЦ

        // Методы проверки Валидатора
            self.checkPhone = function(value, nameField){

                if (value){

                    if (!value.match('^[0-9\+\(\)\-]{16}$')){

                        self.errors.push('Поле "' + nameField + '" не соответствует формату!');
                    }
                }
            }

            self.checkCaptcha = function($element){
                
                if (!$element.prop('checked')){

                    self.errors.push('Вы должны принять согласие на обработку персональных данных!');
                }
            }

            self.checkString = function(value, nameField){
            
                if (value){

                    var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                    if (!value.match('^[a-zA-Z'+rusChars+'0-9\_\ ]+$')) {
                        
                        self.errors.push('Поле "' + nameField + '" может содержать латинские или кириллические символы, цифры и знак "_"');
                    }
                }
            }

            self.checkText = function(value, nameField){
            
                if (value){

                    var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                    if (!value.match('^[a-zA-Z'+rusChars+'0-9\.\,\;\:\?\!\'\"\(\)\_\ \r\n]+$')) {
                        
                        self.errors.push('Поле "' + nameField + '" содержит недопустимые символы!');
                    }
                }
            }

            self.checkEmail = function(value, nameField){
            
                if (value){

                    var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                    if (!value.match('^(['+rusChars+'a-zA-Z0-9_\.-])+@['+rusChars+'a-zA-Z0-9-]+[\.]+(['+rusChars+'a-zA-Z]{2,6}\.)?['+rusChars+'a-z]{2,6}$')) {
                        
                        self.errors.push('Поле "' + nameField + '" не соответствует формату!');
                    }
                }
            }
        // Методы проверки Валидатора КОНЕЦ

        // Вывод сообщений валидатора
            self.getMsg = function(){
                var messages = '', $feedbackFormMessage = $form.find('.feedback-form__message');

                if (self.errors.length) {
                    $feedbackFormMessage.addClass('feedback-form__message_error');
                }
                else {
                    self.errors = ['Ваша заявка принята!'];
                    $feedbackFormMessage.removeClass('feedback-form__message_error');
                }
                
                self.errors.forEach(function(item){
                    messages += `<li>${item}</li>`;
                });
                $feedbackFormMessage.append(`<ul>${messages}</ul>`);

                $feedbackFormMessage.slideToggle();
                timerId = setTimeout(function(){
                    $feedbackFormMessage.slideToggle();
                }, 6000); 
            }
        // Вывод сообщений валидатора КОНЕЦ

        // Валидация формы
            self.validate = function(){

                self.errors = [];

                clearTimeout(timerId);

                $form.find('.feedback-form__message').css('display', 'none').html('');

                var $fieldsArr = $form.find('input[type="text"], input[type="tel"], input[type="checkbox"], input[type="hidden"], textarea');

                $fieldsArr.each(function(){

                    var nameField = $(this).attr('name').split('-')[0];
                    
                    var typeCheck = $(this).attr('name').split('-')[1];

                    var obligatoryField = $(this).attr('name').split('-')[2];

                    if (!nameField || !typeCheck || !obligatoryField) {

                        self.errors = ['Что-то пошло не так! (Имя не соответствует формату проверки)'];

                        return false;
                    }

                    switch(nameField) {
                    
                        case 'phone':
            
                            nameField = 'Телефон';
            
                            break;

                        case 'name':
        
                            nameField = 'Имя';
            
                            break;

                        case 'text':
        
                            nameField = 'Комментарии или пожелания';
            
                            break;

                        default:

                            break;
                    }

                    if (obligatoryField === '*') {

                        if ($(this).val() === '') {

                            self.errors.push('Поле "' + nameField + '" обязательно для заполнения!');
                        }
                    }

                    switch(typeCheck) {

                        case 'phone':
            
                            self.checkPhone($(this).val(), nameField);
            
                            break;
            
                        case 'captcha':
            
                            self.checkCaptcha($(this));
            
                            break;
            
                        case 'string':
            
                            self.checkString($(this).val(), nameField);
            
                            break;

                        case 'text':
            
                            self.checkText($(this).val(), nameField);
            
                            break;
            
                        case 'email':
            
                            self.checkEmail($(this).val(), nameField);
            
                            break;
                        
                        default:
            
                            self.errors = ['Что-то пошло не так, обновите страницу! (Не соответствие типа проверки)'];
            
                            return false;
            
                            break;
                    }
                });

                if (self.errors.length){

                    self.getMsg();
                }
                else {

                    var fields = $form.serialize();

                    $form.find('.feedback-form__submit-btn').addClass('feedback-form__submit-btn_load');
                    
                    $.ajax({

                        type: 'POST',
                        url: '/public/ajax/form-validator.php',
                        data: fields,           
                        success:  function(response) { 

                            $form.find('.feedback-form__submit-btn').removeClass('feedback-form__submit-btn_load');
            
                            if (response) {
            
                                self.errors = JSON.parse(response);
                            }
                            else {
            
                                $form.find('.feedback-form__checkbox input').prop('checked', false);
                            }
            
                            self.getMsg();
                        }    
                    });
                }
            }
        // Валидация формы КОНЕЦ

        // Конструктор формы

            $form.find('.feedback-form__phone input').mask("+7(999)999-99-99", {autoclear: false});

            $form.find('.feedback-form__checkbox input').prop('checked', false);

            $form.find('.feedback-form__submit-btn').on('click', function(event){

                event.preventDefault();

                $form.submit();
            });

            $form.on('submit', function(){

                self.validate();

                return false;
            });
        // Конструктор формы КОНЕЦ
    }

    $('.feedback-form').each((index, element) => {
        new formValidator($(element));
    });
});