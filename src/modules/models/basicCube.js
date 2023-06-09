// Just examples, same with cube.json.
export function createCube() { 
    // duplicates, if color same no need
    const vertices = [
      // Front face
      -0.5, -0.5,  0.5, // tl
       0.5, -0.5,  0.5, // tr
       0.5,  0.5,  0.5, // br
      -0.5,  0.5,  0.5, // bl

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

    const faceTangents = [
      // Front face
      [0, -1, 0],
      // Back face
      [0, -1, 0],
      // Top face
      [0, -1, 0],
      // Bottom face
      [0, -1, 0],
      // Right face
      [-1, 0, 0],
      // Left face
      [1, 0, 0],
    ];

    let tangents = [];
    for (let j = 0; j < faceTangents.length; j++) {
      const n = faceTangents[j];
      tangents = tangents.concat(n, n, n, n);
    }

    const bi = 0.7071067811865475;
    const faceBitangents = [
      // Front face
      [bi, -bi, 0],
      // Back face
      [-bi, -bi, 0],
      // Top face
      [0, -bi, -bi],
      // Bottom face
      [0, -bi, bi],
      // Right face
      [-bi, 0, bi],
      // Left face
      [bi, 0, bi],
    ];

    let bitangents = [];
    for (let j = 0; j < faceBitangents.length; j++) {
      const n = faceBitangents[j];
      bitangents = bitangents.concat(n, n, n, n);
    }

    const indices = [
      0,  1,  2,      0,  2,  3, 
      4,  5,  6,      4,  6,  7, 
      8,  9, 10,      8, 10, 11,
      12, 13, 14,     12, 14, 15,
      16, 17, 18,     16, 18, 19,
      20, 21, 22,     20, 22, 23, 
    ];

    // y negatif = 1, positif = 0
    // x negatif = 0, positif = 1
    // z negatif = 0, positif = 1
    const textureCoord = [
      0, 1,
      1, 1,
      1, 0,
      0, 0,
      
      0, 0,
      0, 1,
      1, 1,
      1, 0,

      0, 0,
      0, 1,
      1, 1,
      1, 0,

      0, 1,
      1, 1,
      1, 0,
      0, 0,

      1, 1,
      1, 0,
      0, 0,
      0, 1,

      0, 1,
      1, 1,
      1, 0,
      0, 0,
    ]

    const textureMode = -1
  
    return { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode };
  }
