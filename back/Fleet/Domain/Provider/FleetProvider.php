<?php
namespace Domain\Provider;

use Domain\Entity\Fleet;

// NOT MANDATORY, 'USER' WOULD IS ENOUGH (it's a 0<->1 dependency)
class FleetProvider {
    /** @var Fleet[] $fleets */
    static $fleets = null;

    function __construct($reset = false) {
        if ((self::$fleets === null)||($reset)) {
            self::$fleets[] = new Fleet(0, 0); // fleet 0 to user 0
            self::$fleets[] = new Fleet(1, 1); // fleet 1 to user 1
        }
    }

    public function findById($fleetId): ?Fleet {
        foreach (self::$fleets as $fleet) {
            if ($fleet->getId() === $fleetId) return $fleet;
        }
        return null;
    }

    public function findByUser($user): ?Fleet {
        foreach (self::$fleets as $fleet) {
            if ($fleet->getOwnerUserId() === $user->getId()) {
                return $fleet;
            }
        }
        return null;
    }

}
