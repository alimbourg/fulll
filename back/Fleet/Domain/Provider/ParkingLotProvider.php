<?php
namespace Domain\Provider;

use Domain\Entity\Car;
use Domain\Entity\ParkingLot;

class ParkingLotProvider {
    static private $lots = null; //[];
    function __construct(bool $reset = false) {
        if ((self::$lots === null)||($reset)) {
            self::$lots = [];
            self::$lots[] = new ParkingLot('A1');
            self::$lots[] = new ParkingLot('B1');
            self::$lots[] = new ParkingLot('C1');
        }
    }
    public function findById(string $id): ?ParkingLot { // as per symfony
        foreach (self::$lots as $lot) {
            if ($lot->getId() === $id) return $lot;
        }
        return null;
    }
    public function findByCar(Car $car): ?ParkingLot { // as per symfony
        foreach (self::$lots as $lot) {
            if ($lot->getParkedCarId() === $car->getId()) return $lot;
        }
        return null;
    }
    public function findByGpsCoords(): ?ParkingLot {
        assert(false);
        return null;
    }      // postgres will do that
    public function findNearestAvailableLots(): array { // postgres knows how to do that
        assert(false);
        return [];
    }
    // everything
    public function resetParkedCar(ParkingLot $lot): ParkingLot {
        // totally atomic
        $lot->setParkedCarId(-1);
        return $lot;
    }
    public function setParkedCar(ParkingLot $lot, Car $car): ParkingLot {
        // totally atomic
        $lot->setParkedCarId($car->getId());
        return $lot;
    }

}
