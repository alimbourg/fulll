<?php

class FizzBuzzer {
    static function play($limit) {
        // making sure everything is integer with intval
        for ($d = 1; $d <= intval($limit); $d++) {
            // compute a fizzbuz state
            $fizzbuzz = (($d % 3 === 0) ? 'fizz':'').(($d % 5 === 0) ? 'buzz' : '');
            // if state is empty, display number
            echo "$d: " . (empty($fizzbuzz) ? $d : $fizzbuzz) . "\n";
        }
    }
}

FizzBuzzer::play(100);