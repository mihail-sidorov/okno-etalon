<?php 

/**
 * Initiating $form_validator to construct FormValidator that runs Form processing
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/mail-config.php';

$form_validator = new FormValidator($host, $user_name, $password, $secure, $port, $send_to);

class FormValidator{

    public $errors = [];

    public $fields = '';

    public $subject = '';

    public function __construct($host, $user_name, $password, $secure, $port, $send_to){
      
        foreach ($_POST as $key => $value){

            $name_field = explode('-', $key)[0];
                
            $type_check = explode('-', $key)[1];

            $obligatory_field = explode('-', $key)[2];

            if (!$name_field || !$type_check || !$obligatory_field) {

                $this->errors = ['Что-то пошло не так! (Имя не соответствует формату проверки)'];

                break;
            }

            switch($name_field) {
                
                case 'phone':
    
                    $name_field = 'Телефон';
    
                    break;

                case 'name':

                    $name_field = 'Имя';
    
                    break;

                case 'text':

                    $name_field = 'Комментарии или пожелания';
    
                    break;

                default:

                    break;
            }

            if ($obligatory_field === '*') {

                if ($value === '') {

                    $this->errors[] = "Поле \"$name_field\" обязательно для заполнения!";
                }
            }

            switch($type_check) {

                case 'phone':

                    $this->fields .= $value . '<br>';
    
                    $this->checkPhone($value, $name_field);

                    break;
    
                case 'captcha':
    
                    $this->checkCaptcha($value);
    
                    break;

                case 'string':

                    if (explode('-', $key)[0] === 'subject') {

                        $this->subject = $value;
                    }
                    else {

                        $this->fields .= $value . '<br>';
                    }
    
                    $this->checkString($value, $name_field);
    
                    break;

                case 'text':

                    $this->fields .= $value . '<br>';
    
                    $this->checkText($value, $name_field);
    
                    break;

                case 'email':

                    $this->fields .= $value . '<br>';
    
                    $this->checkEmail($value, $name_field);
    
                    break;
                
                default:
    
                    $this->errors = ['Что-то пошло не так, обновите страницу! (Не соответствие типа проверки)'];

                    $this->viewErrors();

                    return;
    
                    break;
            }
        }

        if ($this->errors) {

            $this->viewErrors();
        }
        else {

            // Выполняем функцию Mail

            $mail = new PHPMailer(true);
            try {
                //$mail->SMTPDebug = 2;
                $mail->isSMTP();
                $mail->Host = $host;
                $mail->SMTPAuth = true;
                $mail->Username = $user_name;
                $mail->Password = $password;
                $mail->SMTPSecure = $secure;
                $mail->Port = $port;
                $mail->CharSet = 'UTF-8';

                //Recipients
                $mail->setFrom($user_name, 'Okno-Etalon');
                $mail->addAddress($send_to, 'Okno-Etalon');
                $mail->addReplyTo($user_name, 'Okno-Etalon');

                //Content
                $mail->isHTML(true);
                $mail->Subject = $this->subject;

                // Формируем тело отправляемого сообщения

                $mail->Body    = $this->fields;
                $mail->AltBody = $this->fields;

                $mail->send();
               
            } catch (Exception $e) {

                $this->errors = ['Сообщениине не отправлено: ' . $mail->ErrorInfo];

                $this->viewErrors();
            }
        }
    }
    
    private function checkPhone($value, $name_field){
    
        if (!empty($value)) {

            if (!preg_match('/^[0-9\+\(\)\-]{16}$/u', $value)) {
                
                $this->errors[] = "Поле \"$name_field\" не соответствует формату!";
            }
        }
    }

    private function checkCaptcha($value){
    
        if ($value !== 'on') {
                            
            $this->errors[] = 'Вы должны принять согласие на обработку персональных данных!';
        }
    }

    private function checkString($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^[a-zA-Z'.$rusChars.'0-9\_\s]+$/u', $value)) {
                
                $this->errors[] = "Текстовое поле \"$name_field\" может содержать латинские или кириллические символы, цифры и знак \"_\"";
            }
        }
    }

    private function checkText($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^[a-zA-Z'.$rusChars.'0-9\.\,\;\:\?\!\'\"\(\)\_\s]+$/u', $value)) {
                
                $this->errors[] = "Текстовое поле \"$name_field\" может содержать латинские или кириллические символы, цифры и знак \"_\"";
            }
        }
    }

    private function checkEmail($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^(['.$rusChars.'a-zA-Z0-9_\.-])+@['.$rusChars.'a-zA-Z0-9-]+[\.]+(['.$rusChars.'a-zA-Z]{2,6}\.)?['.$rusChars.'a-z]{2,6}$/u', $value)) {
                
                $this->errors[] = "Поле \"$name_field\" не соответствует формату!";
            }
        }
    }

    private function viewErrors(){

        echo json_encode($this->errors);
    }
}

?>