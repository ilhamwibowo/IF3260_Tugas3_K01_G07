// Just examples, same with cube.json.
export function createCube() { 
    // duplicates, if color same no need
    const vertices = [
      // Front face
      -0.5, -0.5,  0.5,
       0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,
      -0.5,  0.5,  0.5,

      // Back face
      -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,
       0.5,  0.5, -0.5,
       0.5, -0.5, -0.5,

      // Top face
      -0.5,  0.5, -0.5,
      -0.5,  0.5,  0.5,
       0.5,  0.5,  0.5,
       0.5,  0.5, -0.5,

      // Bottom face
      -0.5, -0.5, -0.5,
       0.5, -0.5, -0.5,
       0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5,

      // Right face
       0.5, -0.5, -0.5,
       0.5,  0.5, -0.5, 
       0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,

      // Left face
      -0.5, -0.5, -0.5,
      -0.5, -0.5,  0.5,
      -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5,
    ];


    const faceColors = [
      [1.0,  0.0,  0.0,  1.0],
      [0.0,  1.0,  0.0,  1.0],
      [0.0,  0.0,  1.0,  1.0],
      [1.0,  1.0,  0.0,  1.0], 
      [1.0,  0.0,  1.0,  1.0],
      [0.0,  1.0,  1.0,  1.0],
    ];

    let colors = [];
    for (let j = 0; j < faceColors.length; j++) {
      const c = faceColors[j];
      colors = colors.concat(c, c, c, c);
    }

    const faceNormals = [
      // Front face
      [0, 0, 1],
      // Back face
      [0, 0, -1],
      // Top face
      [0, 1, 0],
      // Bottom face
      [0, -1, 0],
      // Right face
      [1, 0, 0],
      // Left face
      [-1, 0, 0],
    ];
  
    let normals = [];
    for (let j = 0; j < faceNormals.length; j++) {
      const n = faceNormals[j];
      normals = normals.concat(n, n, n, n);
    }

    const indices = [
      0,  1,  2,      0,  2,  3, 
      4,  5,  6,      4,  6,  7, 
      8,  9, 10,      8, 10, 11,
      12, 13, 14,     12, 14, 15,
      16, 17, 18,     16, 18, 19,
      20, 21, 22,     20, 22, 23, 
    ];


    return { vertices, colors, indices, normals };
  }
