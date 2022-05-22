<?php
namespace Domain\Entity;

class Fleet {
    protected int $id;
    protected int $ownerUserId;

    function __construct($fleetId, $ownerUserId) {
        $this->id = $fleetId;
        $this->ownerUserId = $ownerUserId;
    }
    public function getId():int { return $this->id; }
    public function getOwnerUserId():int { return $this->ownerUserId; }
}

