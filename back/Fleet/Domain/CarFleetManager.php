<?php
namespace Domain;

use DomainException;
use Exception;
use InvalidArgumentException;

// we're using Exception intensively here to track all errors, it's not embedded development
// and it provides more clues about what failed
// and now some Domain related roles
class CarFleetManager {
    //protected $carProvider;
    //protected $lotProvider;
    protected $assoCarFleetProvider;
    function __construct($assoCarFleetProvider) { //$carProvider, $lotProvider, $fleetProvider) {
        //$this->carProvider = $carProvider;
        //$this->lotProvider = $lotProvider;
        //$this->fleetProvider = $fleetProvider;
        $this->assoCarFleetProvider = $assoCarFleetProvider;
    }
    /**
     * Undocumented function
     *
     * @param [type] $carId
     * @param [type] $fleetId
     * @return void
     * @throws Exception
     */
    public function recordCarInFleet($car, $fleet) {
        //$car = $this->carProvider->findById($car->getId());
        //$fleet = $this->fleetProvider->findById($fleet->getId());
        // sanity check
        if (empty($car)||empty($fleet)) {
            throw new InvalidArgumentException();
        }
        $assoCarFleet = $this->assoCarFleetProvider->findByCarAndFleet($car, $fleet);
        if (!empty($assoCarFleet)) {
            throw new DomainException('Already In This Fleet');
        }
        // this should absolutely be atomic
        $assoCarFleet = null;
        try {
            // okay we could have a new AssoCarFleet($car, fleet), here...
            $assoCarFleet = $this->assoCarFleetProvider->createAssoCarFleet($car, $fleet);
        } catch (Exception $ex) {
            // log this
            throw $ex;
        }
        return $assoCarFleet;
    }
}
