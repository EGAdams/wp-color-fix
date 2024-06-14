<?php
class User {
  private $first_name;
  private $last_name;
  private $rewards;
  private $device;
  private $email;
  private $password;
  private $push_id;
  private $old_push_id;
  private $stay_alive;
  private $update_logger;
  private $database;
  private $prefix;
  
  public function __construct($first_name, $last_name, $rewards, $device, $email, $password, $push_id, $old_push_id, $stay_alive, $update_logger, $database, $prefix) {
    $this->first_name = $first_name;
    $this->last_name = $last_name;
    $this->rewards = $rewards;
    $this->device = $device;
    $this->email = $email;
    $this->password = $password;
    $this->push_id = $push_id;
    $this->old_push_id = $old_push_id;
    $this->stay_alive = $stay_alive;
    $this->update_logger = $update_logger;
    $this->database = $database;
    $this->prefix = $prefix;
  }
  
  public function updateUser() {
    $result = null;
    
    if(strlen($this->getOld_push_id()) == 0) {
      $this->update_logger->logUpdate("no old push id!  old push id: " . $this->getOld_push_id());
      $this->update_logger->logUpdate("setting result to false.");
      $result = false;
    } else {
      $this->update_logger->logUpdate("searching database for old push id: " . $this->old_push_id);
      $statement = $this->database->prepare("SELECT * FROM " . $this->prefix . "mcba_users WHERE pushid = ?");
      $this->update_logger->logUpdate("this->old_push_id: " . $this->old_push_id);
      $statement->execute(array($this->old_push_id));
      $result = $statement->fetchAll();
      $this->update_logger->logUpdate("got result, it is: $result");
    }
    
    if (!$result) {
      writeLog("old push id is not available.  This is probably a new user...  add all of the data.");
      
      try {
        $statement = $this->database->prepare('INSERT INTO ' . $this->prefix . 'mcba_users (first_name, last_name, rewards, device, email, password, pushid) VALUES(?, ?, ?, ?, ?, ?, ?)');
        $statement->execute(array(
          $this->first_name,
          $this->last_name,
          $this->rewards,
          $this->device,
          $this->email,
          hash('sha512', $this->password),
          $this->push_id ));

    if (!$this->getStayAlive()) {
      $this->verify_conversation_id();
      $this->update_logger->logUpdate("json die with success and update finished.");
      die(json_encode(array("error" => "", "result" => "success")));
    } else {
      $this->verify_conversation_id();
      $this->update_logger->logUpdate("returning 1 from update()...");
      return 1;
    }
  } catch (PDOException $pdoException) {
    $this->update_logger->logUpdate("ERROR: " . $pdoException->getMessage());
    writeLog($pdoException->getMessage() . '\r\n');
    if (!$this->getStayAlive()) {
      die(json_encode(array('error' => $pdoException->getMessage())));
    } else {
      return 0;
    }
  }
} else {
  if (strlen($this->getEmail()) == 0) {
    $error = "invalid input: email: " . $this->getEmail();
    $this->update_logger->logUpdate("ERROR: *** " . $error . " ***");
    die(json_encode(array('error' => "ERROR: *** " . $error . " ***")));
  }
  writeLog("old id exists, swap it out.");
  // ...
}
}

public function getOld_push_id() {
return $this->old_push_id;
}

public function getEmail() {
return $this->email;
}

public function getFirst_name() {
return $this->first_name;
}

public function getStayAlive() {
return $this->stay_alive;
}

public function verify_conversation_id() {
// ...
}
}

class Database {
// ...
}

class UpdateLogger {
// ...
}



/*
This breaks the code up into three classes:

User, Database, and UpdateLogger.

The User class is responsible for handling the update process and contains all of the
relevant properties such as first_name, last_name, rewards, etc.

The Database class is responsible for handling database connections and queries.

The UpdateLogger class is responsible for handling logging of update events.

This separation of responsibilities makes the code easier to understand and maintain.
*/
?>
