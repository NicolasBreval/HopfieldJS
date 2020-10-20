/**
 * @file Hopfield.js
 * @author nicolasbrevalrodriguez@gmail.com
 * @date 19/10/2020
 * 
 * This file contains a implementation of a Hopfield Neural Network, used 
 * for binary pattern recognition
 */

/** Class representing a 2-dimension array, commonly called matrix */
class Matrix {
    /**
     * Initializes a new Matrix object
     * 
     * @param {number} height Height of matrix (number of rows)
     * @param {number} width Width of matrix (number of columns)
     * @param {?Array<Array<number>>} data Input data to initialize matrix
     */
    constructor(height, width, data = null) {
        this.height = height;
        this.width = width;
        this.data = [];

        // I user pass a 2-dimension array as 'data' parameter, Matrix data
        // is filled with it, else, data is initialized with zeros
        for (let i = 0; i < this.height; i++) {
            this.data.push([]);

            for (let j = 0; j < this.width; j++) {
                this.data[i].push(data != null ? data[i][j] : 0);
            }
        }
    }

    // Matrix transform operations /////////////////////////////////////////////////

    /**
     * Returns a new Matrix with same current object data, 
     * with shape changed
     * 
     * @param {number} height Height for output matrix
     * @param {number} width Width for output matrix
     */
    reshape(height, width) {

        // A matrix only can be reshaped if target shape takes same
        // elements as current shape
        if (height * width != this.height * this.width) {
            throw `It's not possible to reshape from (${this.height}, ${this.width}) to (${height}, ${width})`;
        }

        // New Matrix object with new shape
        let result = new Matrix(height, width);

        // Flatten original data for reshape
        var zeroDimData = [].concat.apply([], this.data)

        // Iterate over each new matrix positions and
        // fill it with flatten data
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                result.data[i][j] = zeroDimData[i * width + j];
            }
        }

        return result;
    }

    /**
     * Returns a new Matrix with same content that this object,  
     * with columns and rows swapped
     */
    transpose() {
        let result = new Matrix(this.width, this.height);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // current (i, j) position is (j, i) position in new Matrix
                result.data[j][i] = this.data[i][j];
            }
        }

        return result;
    }

    // Matrix - Matrix operations /////////////////////////////////////////////////

    /**
     * Returns the result of adding up the current Matrix and entering 
     * Matrix as a parameter
     * 
     * @param {Matrix} matrix Matrix for addition
     */
    add(matrix) {
        // Two matrices only can be added if both have same height and width
        if (this.height != matrix.height || this.width != matrix.width) {
            throw "Two matrices must be same size to add them";
        }

        let result = new Matrix(this.height, this.width);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result.data[i][j] = this.data[i][j] + matrix.data[i][j];
            }
        }

        return result;
    }

    /**
     * Returns the result of multiplying the current Matrix and entering 
     * Matrix as a parameter
     * 
     * @param {Matrix} matrix Matrix for mutiplication
     */
    mul(matrix) {
        if (this.width != matrix.height) {
            throw "Current matrix must be same width as parameter matrix height to multiply them.";
        }

        let result = new Matrix(this.height, matrix.width);

        for (let i = 0; i < this.height; i++) {
            for (let k = 0; k < matrix.width; k++) {
                let sum = 0;

                for (let j = 0; j < this.width; j++) {
                    sum += this.data[i][j] * matrix.data[j][k];
                }

                result.data[i][k] = sum;
            }
        }

        return result;
    }

    // Element-by-element operations /////////////////////////////////////////////

    /**
     * Substracts a value for each element in matrix
     * 
     * @param {number} num Value to substract in each matrix element
     */
    sub(num) {
        let result = new Matrix(this.height, this.width);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result.data[i][j] = this.data[i][j] - num;
            }
        }

        return result;
    }

    /**
     * Divides a value for each element in matrix
     * 
     * @param {number} num Value to divide for each matrix element
     */
    div(num) {
        let result = new Matrix(this.height, this.width);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result.data[i][j] = this.data[i][j] / num;
            }
        }

        return result;
    }

    /**
     * Applies a function that receives a number and returns another, 
     * for each Matrix element
     * 
     * @param {CallableFunction} func Function to run for each matrix element
     */
    applyActivation(func) {
        let result = new Matrix(this.height, this.width);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result.data[i][j] = func(this.data[i][j]);
            }
        }

        return result;
    }

    // Comparation operations
    
    /**
     * Return true if parameter Matrix and current matrix have same data
     * 
     * @param {Matrix} matrix 
     */
    compare(matrix) {
        if (this.height != matrix.height || this.width != matrix.width) {
            return false;
        }

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.data[i][j] != matrix.data[i][j]) return false;
            }
        }

        return true;
    }
}

/** Class representing a Hopfield Neural Network implementation */
class HopfieldNetwork {

    /**
     * Initializes a new HopfieldNetwork object
     * 
     * @param {number} neurons 
     */
    constructor(neurons) {
        this.trainingPatterns = [];
        this.neurons = neurons
        this.weights = new Matrix(neurons, neurons);
    }

    /**
     * Recalculates weight matrix of Hopfield Network with a training input
     * 
     * @param {Matrix} pattern A pattern represented as a (1, N) shape Matrix
     */
    train(pattern) {
        this.trainingPatterns.push(new Matrix(1, pattern.width, pattern.data));

        this.weights = new Matrix(this.neurons, this.neurons); 

        let rho = this.trainingPatterns.reduce((a, b) => a.add(b)).data[0].reduce((a, b) => a + b) / (this.trainingPatterns.length * this.neurons);
        let subPattern = null;

        for (let i = 0; i < this.trainingPatterns.length; i++) {
            subPattern = this.trainingPatterns[i].sub(rho);
            this.weights = this.weights.add(subPattern.transpose().mul(subPattern));
        }
        
        this.weights = this.weights.div(this.neurons);

        for (let i = 0; i < this.neurons; i++) {
            for (let j = 0; j < this.neurons; j++) {
                if (i == j) this.weights.data[i][j] = 0;
            }
        }
    }

    /**
     * Returns more similar training pattern as input pattern as parameter
     * 
     * @param {Matrix} pattern Patter to predict
     */
    predict(pattern) {
        let same = false;
        let anotherPrediction = null
        let prediction = pattern.mul(this.weights).applyActivation(function(x) { return x <= 0 ? -1 : 1; });
        let maxIterations = 100;
        let iterations = 0;

        while (!same && iterations < maxIterations) {
            anotherPrediction = prediction.mul(this.weights).applyActivation(function(x) { return x <= 0 ? -1 : 1; });

            if (anotherPrediction.compare(prediction))
                break;
            else
                iterations++;
        }

        return anotherPrediction;
    }
}
