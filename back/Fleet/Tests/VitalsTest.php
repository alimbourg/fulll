<?php declare(strict_types=0);

require('./vendor/autoload.php');

use Domain\Entity\Car;
use Domain\Provider\CarProvider;
use Domain\Entity\ParkingLot;
use Domain\Provider\ParkingLotProvider;
use Domain\Entity\User;
use Domain\Provider\UserProvider;
use PHPUnit\Framework\TestCase;

final class VitalsTest extends TestCase
{
    public function testSanity(): void {
        $carProvider = new CarProvider();
        $this->assertInstanceOF(Car::class, $carProvider->findById(0));
        $userProvider = new UserProvider();
        $this->assertInstanceOF(User::class, $userProvider->findById(0));
        $this->assertInstanceOF(User::class, $userProvider->findByName('AWEN LIMBOURG')[0]);
        $lotProvider = new ParkingLotProvider();
        $this->assertInstanceOF(ParkingLot::class, $lotProvider->findById('A1'));
    }
}