import { v3 } from "./vec3.js";
// https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html

export var m4 = {

    lookAt: function(cameraPosition, target, up) {
      var zAxis = v3.normalize(v3.substractVectors(cameraPosition, target));
      var xAxis = v3.normalize(v3.cross(up, zAxis));
      var yAxis = v3.normalize(v3.cross(zAxis, xAxis));
  
      return [
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
        1,
      ];
    },

    // Matrix operations
    transformDirection: function(matrix, direction) {
      const v = [direction[0], direction[1], direction[2], 0];
      const result = [0, 0, 0, 0];
      for (let i = 0; i < 4; ++i) {
        result[i] = v[0] * matrix[0 * 4 + i] +
                    v[1] * matrix[1 * 4 + i] +
                    v[2] * matrix[2 * 4 + i] +
                    v[3] * matrix[3 * 4 + i];
      }
      return [result[0], result[1], result[2]];
    },

    perspective: function(fieldOfViewInRadians, aspect, near, far) {
      var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
      var rangeInv = 1.0 / (near - far);
  
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ];
    },

    orthographic: function(matrix, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right);
      var bt = 1 / (bottom - top);
      var nf = 1 / (near - far);
    
      matrix[0] = -2 * lr;
      matrix[1] = 0;
      matrix[2] = 0;
      matrix[3] = 0;
      matrix[4] = 0;
      matrix[5] = -2 * bt;
      matrix[6] = 0;
      matrix[7] = 0;
      matrix[8] = 0;
      matrix[9] = 0;
      matrix[10] = 2 * nf;
      matrix[11] = 0;
      matrix[12] = (left + right) * lr;
      matrix[13] = (top + bottom) * bt;
      matrix[14] = (far + near) * nf;
      matrix[15] = 1;
    
      return matrix;
    },

    radToDeg: function(r) {
      return r * 180 / Math.PI;
    },
  
    degToRad: function(d) {
      return d * Math.PI / 180;
    },

    oblique: function(matrix, theta, phi) {
      var tempTheta = this.degToRad(theta);
      var tempPhi = this.degToRad(phi);
      var cotTheta = 1 / Math.tan(tempTheta);
      var cotPhi = 1 / Math.tan(tempPhi);
    
      matrix[0] = 1;
      matrix[1] = 0;
      matrix[2] = cotTheta;
      matrix[3] = 0;
      matrix[4] = 0;
      matrix[5] = 1;
      matrix[6] = cotPhi;
      matrix[7] = 0;
      matrix[8] = 0;
      matrix[9] = 0;
      matrix[10] = 1;
      matrix[11] = 0;
      matrix[12] = 0;
      matrix[13] = 0;
      matrix[14] = 0;
      matrix[15] = 1;

      return this.transpose(matrix);
    },
  
    projection: function(width, height, depth) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      return [
         2 / width, 0, 0, 0,
         0, -2 / height, 0, 0,
         0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ];
    },
    
    multiplyv2(a, b) {
      let result = new Array(16);
    
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += a[i * 4 + k] * b[k * 4 + j];
          }
          result[i * 4 + j] = sum;
        }
      }
    
      return result;
    },

    multiply: function(a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },


    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
  
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
  
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },
  
    identity: function() {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ];
    },
    
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
  
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
  
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
  
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
  
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
  
    cofactor: function(m, row, col) {
      let c = [];
      for (let i = 0; i < 4; i++) {
        if (i !== row) {
          let newRow = [];
          for (let j = 0; j < 4; j++) {
            if (j !== col) {
              newRow.push(m[i * 4 + j]);
            }
          }
          c.push(newRow);
        }
      }
      return (row + col) % 2 === 0 ? m4.determinant3x3(c) : -m4.determinant3x3(c);
    },
    
    determinant3x3: function(m) {
      return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    },

    inverse2: function(m) {
      let inv = new Float32Array(16);
      let det = 0;
    
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          inv[j * 4 + i] = m4.cofactor(m, i, j);
          if (i === 0) {
            det += m[j] * inv[j * 4];
          }
        }
      }
    
      if (det === 0) {
        return null;
      }
    
      let invDet = 1.0 / det;
      for (let i = 0; i < 16; i++) {
        inv[i] *= invDet;
      }

      return inv;
    },
    

    transpose: function(m) {
      return [
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
      ];
    },

    transformPoint: function(m, v) {
      let dst = [];
      for (let i = 0; i < 4; i++) {
        dst[i] = 0.0;
        for (let j = 0; j < 4; j++) {
          dst[i] += v[j] * m[j * 4 + i];
        }
      }
      return dst;
    },
  };