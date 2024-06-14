<?php
/** @class MonitorLedClassObject */

class MonitorLedClassObject {
    public $background_color, $text_align, $margin_top, $color;
    public function __construct() {
        $this->background_color = "lightyellow";
        $this->text_align       = "left";
        $this->margin_top       = "2px";
        $this->color            = "black";
    }
}

