<?php
namespace Domain\Entity;

class AssoCarFleet {
    // private int $id;
    private int $carId;
    private int $fleetId;
    function __construct(Car $car, Fleet $fleet) {
        $this->carId = $car->getId();
        $this->fleetId = $fleet->getId();
    }
    public function getCarId(): int {
        return $this->carId;
    }
    public function getFleetId(): int {
        return $this->fleetId;
    }
    //
    public function getAllCars($fleet): array {
        return [];
    }
}

