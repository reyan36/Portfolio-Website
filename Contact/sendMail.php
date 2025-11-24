<?php
header('Content-Type: application/json; charset=UTF-8');

// CHANGE THIS TO YOUR EMAIL
$to = "reyanarshad36@gmail.com";
$subject = "New message from Portfolio";

// Security check
if(!isset($_POST['name'], $_POST['email'], $_POST['message'])){
  echo json_encode(["ok"=>false, "msg"=>"Missing fields"]);
  exit;
}
if(!empty($_POST['trap'])){ // honeypot bot check
  echo json_encode(["ok"=>false, "msg"=>"Bot detected"]);
  exit;
}

// Clean input
$name = strip_tags($_POST['name']);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($_POST['message']);
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

// Send
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if(mail($to, $subject, $body, $headers)){
  echo json_encode(["ok"=>true]);
} else {
  echo json_encode(["ok"=>false, "msg"=>"Mail failed"]);
}
?>
