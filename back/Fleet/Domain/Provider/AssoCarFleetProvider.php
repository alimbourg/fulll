<?php
namespace Domain\Provider;

use Domain\Entity\AssoCarFleet;
use Domain\Entity\Car;
use Domain\Entity\Fleet;
use UnexpectedValueException;

// a good key would the pair car + fleet
class AssoCarFleetProvider {
    /** var AssoCarFleet[] */
    static $assoCarFleets = [];
    function __construct($reset = false) {
        if ((self::$assoCarFleets === null)||($reset)) {
            self::$assoCarFleets = [];
        }
    }
    public function findById(int $carId, int $fleetId): ?AssoCarFleet {
        foreach (self::$assoCarFleets as $assoCarFleet) {
            if (($assoCarFleet->getFleetId() === $fleetId) && ($assoCarFleet->getCarId() === $carId)) {
                return $assoCarFleet;
            }
        }
        return null;
    }
    // higher level of stuff
    public function findByCarAndFleet(Car $car, Fleet $fleet): ?AssoCarFleet {
        return $this->findById($car->getId(), $fleet->getId());
    }
    public function findCarFleets(Car $car): array {
        assert(false);
        return [];
    }
    public function findFleetCars(Fleet $fleet): array {
        assert(false);
        return [];
    }
    // atomic
    function createAssoCarFleet(Car $car, Fleet $fleet): AssoCarFleet {
        // this is atomic and should absolutely be mutexed
        $assoCarFleet = $this->findByCarAndFleet($car, $fleet);
        if (!empty($assoCarFleet)) {
            throw new UnexpectedValueException();
        }
        $assoCarFleet = new AssoCarFleet($car, $fleet);
        self::$assoCarFleets[] = $assoCarFleet;
        // end of mutex
        return $assoCarFleet;
    }
}
