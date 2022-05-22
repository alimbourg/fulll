<?php

namespace Domain;

use DomainException;
use Exception;
use Domain\Entity\Car;
use Domain\Entity\ParkingLot;
use Domain\Provider\ParkingLotProvider;
use InvalidArgumentException;

// action or role ?
// assuming that all provieders are accessible thourgh says a singleton a construct injection
class CarParkValet {
    private $lotProvider;
    function __construct(ParkingLotProvider $lotProvider) {
        $this->lotProvider = $lotProvider;
    }
    public function parkCar($car):void {
        $lots = $this->lotProvider->findNearestAvailableLots($car->getGps(), '500m');
        // find nearest available lot
        if (empty($lots)) {
            throw new DomainException('No available lot');
        }
        // the clsoest should do
        $this->parkCarOnLot($car, $lots[0]);
        // and... parkCarOnLot
    }
    public function freeLot(ParkingLot $lot):void {
        if (empty($lot)) {
            throw new InvalidArgumentException(); // 404
        }
        $this->lotProvider->resetParkedCar($lot);
    }
    public function parkCarOnLot(Car $car, ParkingLot $lot):void {
        //$car = $this->carProvider->findById($carId);
        //$lot = $this->lotProvider->findById($lotId);
        if (empty($lot)||empty($car)) {
            throw new InvalidArgumentException(); // 404
        }
        if ($lot->getParkedCarId() === $car->getId()) {
            throw new DomainException('Already on Lot');
        }
        if (!empty($this->lotProvider->findByCar($car))) {
            throw new DomainException('Car is already parked !');
        }
        // That must not happen
        if (!$lot->isAvailable()) {
            throw new DomainException('Lot is already occupied');
        }
        try {
            $this->lotProvider->setParkedCar($lot, $car);
        } catch (Exception $ex) {
            // log this
            throw $ex;
        }
    }
    public function whereIsMyCar(Car $car):?ParkingLot {
        if (empty($car)) {
            throw new InvalidArgumentException(); // 404
        }
        // 0<->1 dependency
        $lot = $this->lotProvider->findByCar($car);
        return $lot;
    }
}
