export const v3 = {
    dot: function(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    },

    cross: function(a, b) {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
      },

    substractVectors: function(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
      },
    
    normalize: function(v) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (length > 0.00001) {
          return [v[0] / length, v[1] / length, v[2] / length];
        } else {
          return [0, 0, 0];
        }
    }, 
      
    multiply: function(v, m) {
        var dst = [];
        for (var i = 0; i < 4; ++i) {
          dst[i] = 0.0;
          for (var j = 0; j < 4; ++j) {
            dst[i] += v[j] * m[j * 4 + i];
          }
        }
        return dst;
    },
}