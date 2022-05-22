<?php declare(strict_types=1);

require('./vendor/autoload.php');

use Domain\CarFleetManager;
use Domain\CarParkValet;
use Domain\Provider\AssoCarFleetProvider;
use Domain\Provider\CarProvider;
use Domain\Provider\FleetProvider;
use Domain\Provider\ParkingLotProvider;
use Domain\Provider\UserProvider;
use PHPUnit\Framework\TestCase;

final class ParkValidationTest extends TestCase
{
    /*
    static public function setUpBeforeClass():void {
        echo 'WAS THERE'.PHP_EOL;
    }
    */

    public function testParkCar(): void {
        $userProvider = new UserProvider(true);
        $carProvider = new CarProvider(true);
        $fleetProvider = new FleetProvider(true);
        $assoCarFleetProvider = new AssoCarFleetProvider(true);
        $lotProvider = new ParkingLotProvider(true);
        $carFleetManager = new CarFleetManager($assoCarFleetProvider);
        $valet = new CarParkValet($lotProvider);
        $car = $carProvider->findById(0);
        $user = $userProvider->findByName('AWEN LIMBOURG')[0];
        $fleet = $fleetProvider->findByUser($user);
        $carFleetManager->recordCarInFleet($car, $fleet);

        $lot = $lotProvider->findById('A1');
        $valet->parkCarOnLot($car, $lot);
        $this->assertTrue($valet->whereIsMyCar($car)->getId() === 'A1');
    }

    public function testParkCarTwice(): void {
        $userProvider = new UserProvider(true);
        $carProvider = new CarProvider(true);
        $fleetProvider = new FleetProvider(true);
        $assoCarFleetProvider = new AssoCarFleetProvider(true);
        $lotProvider = new ParkingLotProvider(true);

        $carFleetManager = new CarFleetManager($assoCarFleetProvider);
        $valet = new CarParkValet($lotProvider);

        $car = $carProvider->findById(0);
        $user = $userProvider->findByName('AWEN LIMBOURG')[0];
        $fleet = $fleetProvider->findByUser($user);
        $carFleetManager->recordCarInFleet($car, $fleet);
        $lot = $lotProvider->findById('A1');
        $valet->parkCarOnLot($car, $lot);

        $error = null;
        try {
            $valet->parkCarOnLot($car, $lot);
        } catch (Throwable $ex) {
            $error = $ex;
        }
        $this->assertInstanceOF(DomainException::class, $error);
        $this->assertTrue($error->getMessage() === 'Already on Lot');
    }





}