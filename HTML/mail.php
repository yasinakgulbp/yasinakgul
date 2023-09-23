<?php

if ( $_POST ) {

	$frm_name  = 'John Doe'; // your name
	$recepient = 'john@example.com'; // your e-mail
	$sitename  = 'Rhye HTML5 Template'; // your site name
	$subject   = "New contact from \"$sitename\""; // subject template

	$name  = trim( $_POST['visitor_name'] );
	$email = trim( $_POST['visitor_email'] );
	$msg   = trim( $_POST['visitor_msg'] );

	$message = "
	-------------------<br><br>
	Visitor name: $name <br>
	Visitor email: $email <br><br>
	$msg
	<br><br>-------------------
	";

	mail( $recepient, $subject, $message, "From: $name <$email>" . "\r\n" . "Reply-To: $email" . "\r\n" . 'X-Mailer: PHP/' . phpversion() . "\r\n" . 'Content-type: text/html; charset="utf-8"' );

}
