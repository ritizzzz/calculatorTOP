# CALCULATOR

### logic behind the calculator

The logic that describes the calculator is as follows.

Initially an operation object is declared that contains all opertations needed for the program to function. The **operate** funtion uses the operation in conjunction with a forloop to do calculation on a very specifically formatted array(see below).

    ['-33', '+', '-4.4']

The specific format is ahieved through the **displayStore** function which formats all decimals and multiple digit numbers while the **parseNegatives** formats all negative numbers. The program spits out a error if it detects clumped negatives. The syntax error is detected in the **operate** function through a use of try and catch block since if there is a error in the syntax provided by the user, it won't be in the format needed by the **operate** function hence it will spit out a typeerror which is then displayed to the user as a syntaxerror.

Initially two arrays are declared, preliminaryValue and allValues, if an operator is not pressed, then all pressed values are fed into preliminary until a operation is pressed, then it is passed onto the allValues on which the **parseNegatives** function is called. After this the array can be fed into teh **operate** function and if there are no syntax or math errors, the program will output the result of the calculation.

    allValues = [];
    preliminaryValue = [];

The user presses '-', this is passed onto allValues since it is an operator. Then the user presses 3, this is passed into preliminary, then 3 is pressed again and once again it is passed into preliminary.

    allValues = ['-'];
    preliminaryValue = ['3', '3'];

Then the '+' operator is pressed, so preliminaryValue is joined to form '33' and passed to allValues alongside the '+' operator. preliminaryValue is emptied.

    allValues = ['-', '33', '+'];
    preliminaryValue = [];

Then the '-' operator is pressed again which is passed into allValues then 4 and then . and then 4 is pressed which are all passed into preliminary.

    allValues = ['-', '33', '+' '-'];
    preliminaryValue = ['4', '.', '4'];

The user presses the '=' operator to peform the calculation which joins the preliminaryValue, empties it and then sends allValues off to **parseNegatives**.

    allValues = ['-', '33', '+', '-', '4.4']
    preliminaryValue = [];

parseNegtives detects negatives through the use of .reduce and formats them through a use of if statement and forloop and then it is sent off to the **operate** function.

    allValues = ['-33', '+', '-4.4'];
    preliminaryValue = [];

The \*_operate_ does the calculation and displays with no errors since index of all operators are odd.

### further features that could be implemented

- recognistion of BODMAS
- Log of previous calculations
- blocking user input instead of outputting syntax error
