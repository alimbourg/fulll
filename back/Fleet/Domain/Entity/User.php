<?php
namespace Domain\Entity;

class User {
    protected int $id;
    protected string $name;
    function __construct(int $id, string $name) {
        $this->id = $id;
        $this->name = $name;
    }
    public function getId():int { return $this->id; }
    public function getName():string { return $this->name; }
}
