<?php
require_once dirname(__DIR__, 1) . "/monitor-led-class-object/MonitorLedClassObject.php";
/** @class MonitorLed */
class MonitorLed {
    private $config, $classObject, $ledText, $RUNNING_COLOR, $PASS_COLOR, $FAIL_COLOR;
	public function __construct($configArg) {
		$this->config = $configArg;
		$this->classObject = new MonitorLedClassObject();
		$this->ledText = "ready.";
		$this->RUNNING_COLOR = "lightyellow";
		$this->PASS_COLOR = "lightgreen";
		$this->FAIL_COLOR = "#fb6666";} // lightred is not understood by CSS.

	public function setFail( $led_text ) {
		$this->setLedBackgroundColor( $this->FAIL_COLOR );
		$this->setLedTextColor( "white" );
        $this->setLedText( $led_text ); }

	public function setPass( $led_text ) {
		$this->setLedBackgroundColor( $this->PASS_COLOR );
		$this->setLedTextColor("black");
        $this->setLedText( $led_text ); }

	public function setLedBackgroundColor( $newColor) { $this->classObject->background_color = $newColor; }
	public function setLedTextColor(       $newColor) { $this->classObject->color            = $newColor; }
	public function setLedText($newText) {$this->ledText = $newText;}
	public function getColor($objectState) {
		$object_state_color = $objectState . "_COLOR";
		echo "getting color $object_state_color <br>";
		return $this->{$object_state_color};
	}
}
