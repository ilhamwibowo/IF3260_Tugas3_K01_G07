// Object3D.js
import { m4 } from "./utils/mat4.js";
import { TEXTURE_MAP, toTextureMode } from "./Texture.js";
/** Problem : 
1. Transformations only done in modelMatrix.  
2. Algorihtm to get normals from vertices and indices not yet implemented.
**/

class Object3D {
  constructor(gl, vertices, colors, indices, normals, tangents, bitangents, shaderProgram, textureCoord, textureMode) {
    this.gl = gl;
    this.indices = indices;
    this.shaderProgram = shaderProgram;
    this.vertices = vertices;
    this.colors = colors;
    this.normals = normals;
    this.tangents = tangents;
    this.bitangents = bitangents
    this.textureCoord = textureCoord;
    this.textureMode = textureMode;
    this.savedBuffers = null;

    let imageTexture = TEXTURE_MAP.image(this.gl);
    let environmentTexture = TEXTURE_MAP.environment(this.gl);
    let bumpTexture = TEXTURE_MAP.bump(this.gl);
    this.textures = [imageTexture, environmentTexture, bumpTexture];

    // Model matrix representing object's transformations
    this.translation = m4.identity();
    this.scaling = m4.identity();
    this.rotation = m4.identity();
    this.modelMatrix = m4.identity(); 
    this.initBuffers(vertices, colors, indices, normals, tangents, bitangents, textureCoord);
  }

  // Transformations
  translate(dx, dy, dz) {
    this.translation = m4.translate(this.translation, dx, dy, dz);
    this.updateModelMatrix();
  }

  rotateX(angle) {
    this.rotation = m4.xRotate(this.rotation, angle);
    this.updateModelMatrix();
  }

  rotateY(angle) {
    this.rotation = m4.yRotate(this.rotation, angle);
    this.updateModelMatrix();
  }

  rotateZ(angle) {
    this.rotation = m4.zRotate(this.rotation, angle);
    this.updateModelMatrix();
  }

  scale(sx, sy, sz) {
    this.scaling = m4.scale(this.scaling, sx, sy, sz);
    this.updateModelMatrix();
  }

  changeTexture(mode) {
    this.textureMode = mode;
  }

  updateModelMatrix() {
    this.modelMatrix = m4.identity();
    this.modelMatrix = m4.multiply(this.modelMatrix, this.translation);
    this.modelMatrix = m4.multiply(this.modelMatrix, this.rotation);
    this.modelMatrix = m4.multiply(this.modelMatrix, this.scaling);
  }

  // Save current buffers to be used later.
  saveObject(modMatrix) {
    // Apply modelMatrix to vertices.
    const vertices = this.vertices;
    const newVertices = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const vertex = [vertices[i], vertices[i + 1], vertices[i + 2], 1];
      const newVertex = m4.transformPoint(modMatrix, vertex);
      newVertices.push(newVertex[0], newVertex[1], newVertex[2]);
    }

    // Apply modelMatrix to normals.
    const normals = this.normals;
    const newNormals = [];
    for (let i = 0; i < normals.length; i += 3) {
      const normal = [normals[i], normals[i + 1], normals[i + 2], 1];
      const newNormal = m4.transformPoint(modMatrix, normal);
      newNormals.push(newNormal[0], newNormal[1], newNormal[2]);
    }

    // Apply modelMatrix to tangents.
    const tangents = this.tangents;
    const newTangents = [];
    for (let i = 0; i < tangents.length; i += 3) {
      const tangent = [tangents[i], tangents[i + 1], tangents[i + 2], 1];
      const newTangent = m4.transformPoint(modMatrix, tangent);
      newTangents.push(newTangent[0], newTangent[1], newTangent[2]);
    }

    // Apply modelMatrix to bitangents.
    const bitangents = this.bitangents;
    const newBitangents = [];
    for (let i = 0; i < bitangents.length; i += 3) {
      const bitangent = [bitangents[i], bitangents[i + 1], bitangents[i + 2], 1];
      const newBitangent = m4.transformPoint(modMatrix, bitangent);
      newBitangents.push(newBitangent[0], newBitangent[1], newBitangent[2]);
    }

    const colors = this.colors;
    const indices = this.indices;

    return {
      vertices: newVertices,
      colors,
      indices,
      normals: newNormals,
      tangents: newTangents,
      bitangents: newBitangents,
      textureCoord: this.textureCoord,
      textureMode: this.textureMode,
    };
  }

  
  // Initialize necessary buffers for object.
  initBuffers(vertices, colors, indices, normals, tangents, bitangents, textureCoord) {
    this.buffers = {
      position: this.createAndSetupBuffer(new Float32Array(vertices), this.gl.ARRAY_BUFFER),
      color: this.createAndSetupBuffer(new Float32Array(colors), this.gl.ARRAY_BUFFER),
      index: this.createAndSetupBuffer(new Uint16Array(indices), this.gl.ELEMENT_ARRAY_BUFFER),
      normal: this.createAndSetupBuffer(new Float32Array(normals), this.gl.ARRAY_BUFFER),
      tangent: this.createAndSetupBuffer(new Float32Array(tangents), this.gl.ARRAY_BUFFER),
      bitangent: this.createAndSetupBuffer(new Float32Array(bitangents), this.gl.ARRAY_BUFFER),
      textureCoord: this.createAndSetupBuffer(new Float32Array(textureCoord), this.gl.ARRAY_BUFFER),
    };
  }

  // Bind and fill the buffer data.
  createAndSetupBuffer(data, type) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(type, buffer);
    this.gl.bufferData(type, data, this.gl.STATIC_DRAW);
    return buffer;
  }

  draw(projectionMatrix, modelMatrix, modelViewMatrix, normalMatrix, lightDirection, enableShading, cameraPosition) {
    // Tell webgl to use our program .
    this.gl.useProgram(this.shaderProgram.program);

    // Turn on, bind, and tell webgl to use the attributes.
    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.position);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.position, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.color);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.color, 4, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.normal);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.normal, 3, this.gl.FLOAT, false, 0, 0);
    
    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.tangent);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.tangent);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.tangent, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.bitangent);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.bitangent);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.bitangent, 3, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);

    this.gl.enableVertexAttribArray(this.shaderProgram.attributeLocations.textureCoord);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
    this.gl.vertexAttribPointer(this.shaderProgram.attributeLocations.textureCoord, 2, this.gl.FLOAT, false, 0, 0);

    // Set uniforms.
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.normalMatrix, false, normalMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.projectionMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.modelMatrix, false, modelMatrix);
    this.gl.uniform3fv(this.shaderProgram.uniformLocations.lightDirection, lightDirection);
    this.gl.uniform3fv(this.shaderProgram.uniformLocations.cameraPosition, cameraPosition);
    this.gl.uniform1i(this.shaderProgram.uniformLocations.enableShading, enableShading);

    // console.log(cameraPosition);

    // Set the texture on or off.
    this.gl.uniform1i(this.shaderProgram.uniformLocations.textureMode, this.textureMode);

    // Texture image
    this.gl.uniform1i(this.shaderProgram.uniformLocations.textureImage, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0])
    // Texture environment.
    this.gl.uniform1i(this.shaderProgram.uniformLocations.textureEnvironment, 1);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures[1]);
    // Texture bump.
    this.gl.uniform1i(this.shaderProgram.uniformLocations.textureBump, 2);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[2]);

    // Drawwzzz.
    this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }       
}

export { Object3D };
