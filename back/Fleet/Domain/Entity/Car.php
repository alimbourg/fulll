<?php
namespace Domain\Entity;

class Car {
    protected int $id;
    protected Float $gpsLat;
    protected Float $gpsLon;

    function __construct($id) {
        $this->id = $id;
    }

    // protected $gps = [];
    public function getId():int {
        return $this->id;
    }
}
