/**
 *  These are kernels used to generate values for non-mine tiles after the mines have been placed.
 * 
 * The center value of the kernel is the normalizing term.

 * 
 * note: "gravity strength" roughly relates to the radius/size of the kernel
 * useful tool for creating kernels: https://donatstudios.com/PixelCircleGenerator
 * 
 * 
 * 
 * Kernels have weights (W) and center values (C).
 * The weight of the kernel, W, is the sum of all of its elements
 * A normalized kernel is a kernel matrix multiplied by 1/C
*
 * The Normalized center value for a kernel is always 1. nC = 1
 * Normalized kernel weight, or nW = C/W
 * 
 * The absolute maximum value for any mine is +-1 * nW. This only occurs when All surrounding tiles contain mines of the same polarity. 
 * 
 * 
 * 
 *  *  * For example:
 *  [[1, 2, 1],          [[0.25, 0.5, 0.25],
 *   [2, 4, 2], * 1/4 =   [0.5,  1,   0.5],
 *   [1, 2, 1]]           [0.25, 0.5, 0.25]]
 * 
 *  W = 16, C = 4, nC = 1, nW = 4
 */

export const _vanillaMS = 
[[1, 1, 1],
 [1, 1, 1],
 [1, 1, 1]];

export const _3x3 = 
[[1,2,1],
 [2,3,2],
 [1,2,1]];

export const _5x5 = 
[[0,1,1,1,0],
 [1,2,2,2,1],
 [1,2,3,2,1],
 [1,2,2,2,1],
 [0,1,1,1,0],]

export const _7x7 =  
[[0,0,1,2,1,0,0],
[0,1,2,3,2,1,0],
[1,2,3,4,3,2,1],
[2,3,4,5,4,3,2],
[1,2,3,4,3,2,1],
[0,1,2,3,2,1,0],
[0,0,1,2,1,0,0]];

export const _9x9 = //experimenting with non integer values...
[[0,  0,  1,  1,  2,  1,  1,  0,  0],
 [0,  1,  2,  2,  3,  2,  2,  1,  0],
 [1,  2,  2.5,3,  4,  3,  2.5,2,  1],
 [1,  2,  3,  4,  5,  4,  3,  2,  1],
 [2,  3,  4,  5,  6,  5,  4,  3,  2],
 [1,  2,  3,  4,  5,  4,  3,  2,  1],
 [1,  2,  2.5,3,  4,  3,  2.5,2,  1],
 [0,  1,  2,  2,  3,  2,  2,  1,  0],
 [0,  0,  1,  1,  2,  1,  1,  0,  0]];  

export const _15x15 = //might want to remake
[[0,0,0,0,0,1,1,2,1,1,0,0,0,0,0], 
 [0,0,0,1,1,2,2,3,2,2,1,1,0,0,0],
 [0,0,1,2,2,3,3,4,3,3,2,2,1,0,0],
 [0,1,2,3,3,4,4,5,4,4,3,3,2,1,0],
 [0,1,2,3,4,5,5,6,5,5,4,3,2,1,0],
 [1,2,3,4,5,5,6,7,6,5,5,4,3,2,1],
 [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1],
 [2,3,4,5,6,7,8,9,8,7,6,5,4,3,2],
 [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1],
 [1,2,3,4,5,5,6,7,6,5,5,4,3,2,1],
 [0,1,2,3,4,5,5,6,5,5,4,3,2,1,0],
 [0,1,2,3,3,4,4,5,4,4,3,3,2,1,0],
 [0,0,1,2,2,3,3,4,3,3,2,2,1,0,0],
 [0,0,0,1,1,2,2,3,2,2,1,1,0,0,0],
 [0,0,0,0,0,1,1,2,1,1,0,0,0,0,0]];


 /**
  * 2 pass kernels
  * 
  * 
  */
 export const kernel_gauss_comp = [1,2,1];