<?php
$act = (isset($_POST["what"])) ? $_POST["what"] : "";
if ($act == "") exit;

$err = false;
$ar = array('email');
if ($act == "feedback") $ar = array('name', 'message');
foreach ($ar as $f) {
	if (!isset($_POST[$f])) $_POST[$f] = "";
	if ($_POST[$f] == "") $err = false;
}
if ($err) exit;

function do_mail($code, $subject, $to, $data) {
	$from = "=?UTF-8?B?".base64_encode("РазДельный Сбор")."?=";
	$from_mail = 'noreply@rsbor.ru';
	$headers = "From: \"$from\" <$from_mail>\r\n";
	$headers .= "Return-Path: <$from_mail>\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=UTF-8\r\n";
	
	$data["http"] = "http://hat-trick.ru/1/rsbor";
	$text = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/templates/mail/$code.tpl");
	foreach ($data as $key => $value) {
		$text = str_replace("#".$key."#", $value, $text);
		$subject = str_replace("#".$key."#", $value, $subject);
	}
	$html = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/templates/mail/content.tpl");
	$html = str_replace("#text#", $text, $html);
	$html = str_replace("#subject#", $subject, $html);
	$html = str_replace("#http#", $data["http"], $html);
	
	$ar = explode(",", $to);
	foreach ($ar as $email) {
		$email = str_replace(" ", "", $email);
		if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
			file_put_contents("1.txt", "$email\n$html");
			mail($email, $subject, $html, $headers);
		}
	}
}

$email = 'inikanorov@gmail.com';

if ($act == "feedback") {
	$_POST["message"] = strip_tags($_POST["message"]);
	do_mail('feedback', 'Вопрос с сайта', $email, $_POST);
}  else {
	do_mail('subscribe', 'Подписка', $email, $_POST);
}
print "ok";