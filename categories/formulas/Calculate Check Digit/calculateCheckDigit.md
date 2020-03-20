```
# Set your desired length of end result UPC including the check digit
let desiredLength = 14 in

# Replace with the property that stores your UPC value
let upcValue = 62910419025 in


## DO NOT MODIFY ##
let upcArray = SPLIT(LPAD(upcValue, 0, 18),'') in

let multipliedArray = EACH(upcArray, (currentValue, index) =>
    IF(
      EQUAL(MOD(index, 2), '0.0'),
        MULTIPLY(currentValue, 3),
        currentValue
    )
) in

let lengthDifference = SUBTRACT(SUBTRACT(desiredLength, 1), LENGTH(upcValue)) in

let paddedUPC = IF(
  LT(lengthDifference, 0),
    upcValue,
    LPAD(upcValue, 0, ADD(lengthDifference, LENGTH(upcValue)))
) in

let sum = ARRAY_SUM(multipliedArray) in

let nearestTenUp = MROUNDUP(sum, 10) in

let checkDigit = SUBTRACT(nearestTenUp, sum) in

let finalResult = CONCATENATE(paddedUPC, INT(checkDigit)) in

## DO NOT MODIFY ##

finalResult

# Check digit calculator
# https://www.gs1.org/services/check-digit-calculator

# How to calculate a check digit manually
# https://www.gs1.org/services/how-calculate-check-digit-manually
```