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

final class FleetValidationTest extends TestCase
{
    /*
    static public function setUpBeforeClass():void {
        echo 'WAS THERE'.PHP_EOL;
    }
    */
    public function testCarFleetRegistration(): void {
        $userProvider = new UserProvider(true);
        $carProvider = new CarProvider(true);
        $fleetProvider = new FleetProvider(true);
        $assoCarFleetProvider = new AssoCarFleetProvider(true);
        $carFleetManager = new CarFleetManager($assoCarFleetProvider);
        $error = null;
        $car = $carProvider->findById(0);
        $user = $userProvider->findByName('AWEN LIMBOURG')[0];
        $fleet = $fleetProvider->findByUser($user);
        $carFleetManager->recordCarInFleet($car, $fleet);
        $this->assertTrue(true);
    }

    public function testCarFleetRegistrationDouble(): void {
        $userProvider = new UserProvider(true);
        $carProvider = new CarProvider(true);
        $fleetProvider = new FleetProvider(true);
        $assoCarFleetProvider = new AssoCarFleetProvider(true);
        $carFleetManager = new CarFleetManager($assoCarFleetProvider);
        $car = $carProvider->findById(0);
        $user1 = $userProvider->findByName('AWEN LIMBOURG')[0];
        $fleet1 = $fleetProvider->findByUser($user1);
        $carFleetManager->recordCarInFleet($car, $fleet1);
        $error = null;
        try {
            $carFleetManager->recordCarInFleet($car, $fleet1);
        } catch (Throwable $ex) {
            $error = $ex;
        }
        $this->assertTrue($error !== null);
    }

    public function testCarRegistration2Fleets(): void {
        $userProvider = new UserProvider(true);
        $carProvider = new CarProvider(true);
        $fleetProvider = new FleetProvider(true);
        $assoCarFleetProvider = new AssoCarFleetProvider(true);
        $carFleetManager = new CarFleetManager($assoCarFleetProvider);

        $user1 = $userProvider->findByName('AWEN LIMBOURG')[0];
        $fleet1 = $fleetProvider->findByUser($user1);
        $user2 = $userProvider->findByName('JULIE')[0];
        $fleet2 = $fleetProvider->findByUser($user2);
        $car = $carProvider->findById(0);
        $carFleetManager->recordCarInFleet($car, $fleet1);
        $carFleetManager->recordCarInFleet($car, $fleet2);
        $this->assertTrue(true);
    }

}