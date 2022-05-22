<?php

/**
 * purpose of this, is to create a new type of number (with possibly unlimited digits)
 */
class BigNumber {
  // ok, php does no have template classes, so
  // why not using string as an internal representation, it's convenient enough in a lot of situation, and actually been used before :)
  /** @var string */
  private $digits; // string
  // let's construct
  function __construct(int $number) {
    $this->digits = strval($number);
    assert(is_string($this->digits));
  }

  public function increment() {
    // first element of the string is the biggest 10pow (on the left), so we have to back pedal, and keep track of the 'carry over'
    $digitCount = strlen($this->digits);

    // a clever albeit not so readable way to increment
    $carryOver = 1;
    for ($d = $digitCount-1; $d>=0; $d--) {
      // we re using basic integer maths on a single digit
      $digit = intval($this->digits[$d]) + $carryOver;

      if ($digit <= 9) { // standard case, no carry over, stop operation
        $carryOver = 0;
        $this->digits[$d] = strval($digit);
        break;
      }
      $this->digits[$d] = strval($digit-10);
      $carryOver = 1;
    }
    // dont forget last pow
    if ($carryOver > 0) {
      $this->digits = '1'.$this->digits;
    }
  }

  public function dump() {
    echo "'$this->digits'\n";
  }
}

echo "Hello, BigNumber!\n";
$bigNumber = new BigNumber(99999);
$bigNumber->dump();
$bigNumber->increment();
$bigNumber->dump();
$bigNumber->increment();
$bigNumber->increment();
$bigNumber->increment();
$bigNumber->increment();
$bigNumber->dump();





