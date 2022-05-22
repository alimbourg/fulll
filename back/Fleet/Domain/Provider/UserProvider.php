<?php
namespace Domain\Provider;

use Domain\Entity\User;

// ok we're doing entities, with POO, could have been lean but mean
class UserProvider {
    /** @var User[] $users */
    static $users = null;
    function __construct(bool $reset = false) {
        if ((self::$users === null)||($reset)) {
            self::$users = [];
            self::$users[] = new User(0, 'AWEN LIMBOURG');
            self::$users[] = new User(1, 'JULIE');
        }
    }

    // an excellent alternative (LISP) is to always return arrays of elements
    public function findById($userId):?User {
        /** @var User $user */
        foreach (self::$users as $user) {
            if ($user->getId() === $userId) return $user;
        }
        return null;
    }
    public function findByName($userName): array {
        /** @var User $user */
        $users = [];
        foreach (self::$users as $user) {
            if ($user->getName() === $userName) $users[] = $user;
        }
        return $users;
    }
}
