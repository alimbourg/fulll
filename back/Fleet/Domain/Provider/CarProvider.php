<?php
namespace Domain\Provider;

use Domain\Entity\Car;

class CarProvider {
    /** @var Car[] $cars */
    static $cars = null; //[];

    function __construct(bool $reset = false) {
        if ((self::$cars === null)||($reset)) {
            self::$cars = [];
            self::$cars[] = new Car(0);
            self::$cars[] = new Car(1);
            self::$cars[] = new Car(2);
            self::$cars[] = new Car(3);
        }
    }

    public function findById($carId): ?Car {
        foreach (self::$cars as $car) {
            if ($car->getId() === $carId) return $car;
        }
        return null;
    }
}

