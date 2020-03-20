# Calculate Check Digit

This formula is used to calculate the check digit for a UPC code, with the added ability of prefixing it with leading zero's in order to meet a retailer-specified length requirement.

## Configuration
In order to configure this formula, all that is needed is to modify the two variables shown at the beginning of the formula.
* `desiredLength`
* `upcValue`

For the `desiredLength` variable, the value should be set to the desired total length of the resulting UPC, with the check digit included.
For the `upcValue` variable, the value should be set to the property that stores your current UPC value.

As an example, say you have the below UPC that you would like to use for a product on Walmart.com:

`62910419025` *(11 digits)*

Let's also say that Walmart requires a UPC with a length of 14 digits.

When the formula calculates the check digit, it will also prefix the UPC with the necessary amount of leading zero's to meet the length requirement.

In order to make the length of this UPC meet the 14 digit requirement, the variables will need to look like the following:
```
let desiredLength = 14 in

let upcValue = 62910419025 in
```

If our UPC is only 11 digits, and we set the `desiredLength` variable to `14`, the formula will run like shown below:

**Stage 1** *(Raw UPC value)*

`__62910419025_` *11 digits*

**Stage 2** *(Calculate and add check digit)*

`__62910419025(9)` *12 digits*

**Stage 3** *(Add leading zero's)*

`(00)629104190259` *14 digits*

**Final result:** `00629104190259`

## Explanation
This formula works by performing the operation from GS1.org on [How To Calculate a Check Digit Manually](https://www.gs1.org/services/how-calculate-check-digit-manually)

Firstly, it takes the provided UPC value, and creates an array with each element being a single integer from the UPC.

`let upcArray = SPLIT(LPAD(upcValue, 0, 18),'') in`

> *Note that the `LPAD` function being used is specifically for the patterned calculation that generates the check digit, which will be explained a bit further down below.*

**Example** *(LPAD omitted for readability)*

Input:
```
let upcValue = 62910419025 in
let upcArray = SPLIT(upcValue,'') in
```

Output:
`[6, 2, 9, 1, 0, 4, 1, 9, 0, 2, 5]`

Secondly, it then performs a `forEach` loop on the array, and checks a condition for each element to determine what calculation to apply.
```
let multipliedArray = EACH(upcArray, (currentValue, index) =>
    IF(
      EQUAL(MOD(index, 2), '0.0'),
        MULTIPLY(currentValue, 3),
        currentValue
    )
) in
```

The condition that is being applied within the `forEach` loop is to check if the current index can evenly divide by 2, without leaving a remainder. This is otherwise known as [modulo](https://en.wikipedia.org/wiki/Modulo_operation) and is utilized via the `MOD` function.

Where this conditional is being checked, it is basically checking if the current index value can be evenly divided by 2 with no remainder.
`EQUAL(MOD(index, 2), '0.0')`

Depending on the value of the current index, if it evenly divides into the number 2, it will return 0. If not, it will return the remainder left over after dividing it by 2 as many times as possible.

In simplistic terms, this specific use of the `MOD` function `(index % 2)` results in a glorified even/odd check.

Since we are always using the number 2 within the `MOD`, if the number is even, it will return `0`, and will return a `1` if the number is odd.

Example:
```
0 % 2 = 0
1 % 2 = 1
2 % 2 = 0
3 % 2 = 1
4 % 2 = 0
5 % 2 = 1
```

The reason we are running this even/odd condition is due to the way the check digit calculation is performed.
If we go back to the [How To Calculate a Check Digit Manually](https://www.gs1.org/services/how-calculate-check-digit-manually) page, you can see the inital part of the calculation involves an alternating pattern of multiplying each digit in the original UPC by 3 and 1 respectively.

Here is a recreation of the patterned model used, slightly modified for readability.

| ID Key Format | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position | Position |
|---------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|
| GTIN-8        |          |          |          |          |          |          |          |          |          |          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       |
| GTIN-12       |          |          |          |          |          |          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       | N9       | N10      | N11      | N12      |
| GTIN-13       |          |          |          |          |          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       | N9       | N10      | N11      | N12      | N13      |
| GTIN-14       |          |          |          |          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       | N9       | N10      | N11      | N12      | N13      | N14      |
| GSIN          |          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       | N9       | N10      | N11      | N12      | N13      | N14      | N15      | N16      | N17      |
| SSCC          | N1       | N2       | N3       | N4       | N5       | N6       | N7       | N8       | N9       | N10      | N11      | N12      | N13      | N14      | N15      | N16      | N17      | N18      |
| **Multiply By**   | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       | `x3`       | `x1`       |


Using this pattern, we will generate a new array that is made up of the original UPC values that have been multiplied by either 3 or 1, depending on their position within the pattern.

Calling back to the note at the top where we explained how the [`upcArray` variable was being declared](#explanation), we will now also demonstrate the reasoning behind adding `LPAD` to the mix.

`let upcArray = SPLIT(LPAD(upcValue, 0, 18),'') in`

The result of this variable will be an array with 18 elements inside of it, and contains a mix of 0's and individual integers from the original `upcValue`. The amount of zero's is determined by the length of your original UPC.

For example, if the provided UPC value is `62910419025`, which is 11 digits in length, the output would be:

`[0, 0, 0, 0, 0, 0, 0, 6, 2, 9, 1, 0, 4, 1, 9, 0, 2, 5]`

The end-result consists of 7 extra leading zero's, which brings the length of the array to 18.

The purpose of padding the array is to adhere to the order of the pattern in which each digit is multiplied, as shown in the table above.
Since the pattern is based on the length of your original UPC, in order to know which number to multiply each element by we pad any empty space with 0's, which both allow us to easily use the pattern schema, while also having no negative affects on the calculation of the check digit.

```
  IF(
      EQUAL(MOD(index, 2), '0.0'),
        MULTIPLY(currentValue, 3),
        currentValue
    )
```

Now that we have our padded array with a length of 18, we can use our even/odd check implemented via the `MOD` function to alternate between 3 and 1 when multiplying each element.


|              |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
|--------------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Original UPC** |    |    |    |    |    |    |    | 6  | 2  | 9  | 1  | 0  | 4  | 1  | 9  | 0  | 2  | 5  |
| **Padded UPC**   | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 6  | 2  | 9  | 1  | 0  | 4  | 1  | 9  | 0  | 2  | 5  |
| **Multiply By**  | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` | `x3` | `x1` |
| **Result**       | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 6  | 6  | 9  | 3  | 0  | 12 | 1  | 27 | 0  | 6  | 5  |

Once the loop has completed processing each element, we are left with an end result of
`[0, 0, 0, 0, 0, 0, 0, 6, 6, 9, 3, 0, 12, 1, 27, 0, 6, 5]`

With our newly created array, we will need to take each element and add them together, resulting in a total sum. Luckily, Salsify has a nifty function that simplifies this step called `ARRAY_SUM`.

`let sum = ARRAY_SUM(multipliedArray) in`

After utilizing the `ARRAY_SUM` function, our resulting value is `81`.

Now that we have obtained the sum of the patterned multiplication array, we find the nearest equal or higher multiple of ten.
This means that if our value is already a multiple of 10, we don't need to round it further, but if not, we need to find the next multiple of 10 by rounding upwards.

`let nearestTenUp = MROUNDUP(sum, 10) in`

Using the `MROUNDUP` function, it is incredibly easy to locate the nearest multiple of 10 without worrying about accidentally rounding downwards.

For our recent sum value of `81`, since it is not already a multiple of 10, we will round it upwards to get a result of `90`.

With our two currently available values, the first being the sum (`81`) and the second being the rounded up multiple of 10 (`90`), we are now able to find the check digit itself with one last calculation.

`let checkDigit = SUBTRACT(nearestTenUp, sum) in`

Using the `SUBTRACT` function, we subtract our sum value from the nearest upwards or equal multiple of 10.

In our case for this specific example, this would look like `(90 - 81)`, leaving us with a final value of `9`, which is the check digit for our original UPC (`62910419025`) from the beginning.

`let finalResult = CONCATENATE(paddedUPC, INT(checkDigit)) in`

At long last, after combining the original UPC, the check digit, and the extra leading zero's that were added to supplement the `desiredLength` requirement value of 14, our final result comes out to be `00629104190259`.