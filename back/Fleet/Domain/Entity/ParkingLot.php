<?php
namespace Domain\Entity;

class ParkingLot {
    protected string $id;
    protected int $parkedCarId;

    function __construct(string $id) {
        $this->id = $id;
        $this->parkedCarId = -1;
    }
    public function getId(): string { return $this->id; }
    public function getParkedCarId(): int {
        return $this->parkedCarId;
    }
    public function isAvailable(): bool { return $this->parkedCarId === -1; }
    public function setParkedCarId(int $carId): int {
        return $this->parkedCarId = $carId;
    }
}
