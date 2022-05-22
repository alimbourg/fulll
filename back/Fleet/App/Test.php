<?php

require_once('Domain/Entity/User.php');
require_once('Domain/Provider/UserProvider.php');
require_once('Domain/Entity/Fleet.php');
require_once('Domain/Provider/FleetProvider.php');
require_once('Domain/Entity/Car.php');
require_once('Domain/Provider/CarProvider.php');
require_once('Domain/Entity/AssoCarFleet.php');
require_once('Domain/Provider/AssoCarFleetProvider.php');
require_once('Domain/Entity/ParkingLot.php');
require_once('Domain/Provider/ParkingLotProvider.php');
require_once('Domain/CarParkValet.php');
require_once('Domain/CarFleetManager.php');

use Domain\CarParkValet;
use Domain\CarFleetManager;
use Domain\Provider\AssoCarFleetProvider;
use Domain\Provider\UserProvider;
use Domain\Provider\CarProvider;
use Domain\Provider\FleetProvider;
use Domain\Provider\ParkingLotProvider;

$carProvider = new CarProvider();
$fleetProvider = new FleetProvider();
$assoCarFleetProvider = new AssoCarFleetProvider();
$lotProvider = new ParkingLotProvider();
$userProvider = new UserProvider();

$carValet = new CarParkValet($lotProvider);
$carFleetManager = new CarFleetManager($assoCarFleetProvider);

$aCar = $carProvider->findById(0);
assert(!empty($aCar));
$myUsers = $userProvider->findByName('AWEN LIMBOURG');
assert(count($myUsers) === 1);
$myFleet = $fleetProvider->findByUser($myUsers[0]);
assert(!empty($myFleet));
/*
$assoCarFleetProvider->createAssoCarFleet($aCar, $myFleet);
$_ex = null;
try { $assoCarFleetProvider->createAssoCarFleet($aCar, $myFleet); } catch (Exception $ex) { $_ex = $ex; }
assert(!empty($_ex));
*/
$carFleetManager->recordCarInFleet($aCar, $myFleet);
$_ex = null;
try { $carFleetManager->recordCarInFleet($aCar, $myFleet);} catch (Exception $ex) { $_ex = $ex; }
assert(!empty($_ex));

// twice is a bug

$a1Lot = $lotProvider->findById('A1');
assert(!empty($a1Lot));
$carValet->parkCarOnLot($aCar, $a1Lot); // success
echo('parked'.PHP_EOL);

$_ex = null;
try { $carValet->parkCarOnLot($aCar, $a1Lot); } catch (Exception $ex) { $_ex = $ex; }
assert(!empty($_ex));// fail

$carValet->freeLot($a1Lot);
$whichLot = $carValet->whereIsMyCar($aCar); // fail
assert(empty($whichLot));
$carValet->parkCarOnLot($aCar, $a1Lot); // fail
$whichLot = $carValet->whereIsMyCar($aCar); // fail
assert($whichLot->getId() === $a1Lot->getId());
echo('success'.PHP_EOL);



