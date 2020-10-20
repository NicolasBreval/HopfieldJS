# HopfieldJS
This project allows to use a simple Hopfield Neural Network completely written in JavaScript.

## What is a Hopfield Neural Network?
A Hopfield Neural Network is a type of neural network in which its neurons are interconnected with each other, except with themselves. This type of neural networks are commonly used for pattern recognition. A pattern is represented as a binary image, this is and image with only black and white pixels. Patterns has parsed as 2-dimension matrices with two possible numeric values for each pixel: -1 if pixel is black, and 1 if pixel is white.

A Hopfield Neural Network is trained calculating a special matrix called wheight matrix, which contains all neuron weights. This weight matrix is used to recognize a trained pattern inside a fuzzy image.

## Library definition
This library contains two classes: Matrix and HopfieldNetwork.

### Matrix
This class is used by HopfieldNetwork class for matrix definitions and operations. A Matrix is defined by three properties:

* **height (int)**: Defines height of matrix.
* **width (int)**: Defines width of matrix.
* **data (Array)**: Defines content of matrix, is an array of arrays.

A Matrix can be initialized passing only height and width, and their data will be intialized with zeros, or passing also an array with data. The predefined Matrix methods are:

* **reshape()**: Allows to change matrix shape. This method will be completed only if current and target shapes are compatibles.
* **transpose()**: Returns a transposed version of matrix.
* **add(matrix)**: Returns the addition of current matrix with another matrix.
* **mul(matrix)**: Returns the multiplication of current matrix and another matrix.
* **sub(num)**: Returns current matrix by substracting a number element by element. 
* **div(num)**: Returns current matrix by dividing a number element by element. 
* **applyActivation(func)**: Returns current matrix by applying a function element by element. Function must receives a number and returns another number.
* **compare(matrix)**: Returns true if current matrix and parameter matrix are equals.


### HopfieldNetwork
This class represents a Hopfield Neural Network and allows to train patterns and recognize trained patterns inside fuzzy patterns. A HopfieldNetwork object is defined by three properties:

* **neurons**: Number of neurons of network. If your training patterns area matrices with shape of (2, 2), neurons number will be 4 (height * width).
* **trainingPatterns**: List of patterns that user has inserted to train.
* **weights**: Matrix with shape (neurons, neurons). This matrix keeps all patterns used to train network as a single weights matrix used to predict another pattern.

HopfieldNetwork class have only two methods:

* **train(pattern)**: Updates trainPatterns list and recalculates weight matrix including this new training pattern.
* **predict(pattern)**: Uses weights matrix to retrieve most similar pattern to input pattern.



