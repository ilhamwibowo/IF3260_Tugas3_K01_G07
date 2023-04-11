// Object3D.js
import { m4 } from "./utils/mat4.js";
/** Problem : 
1. Transformations only done in modelMatrix.  
2. Algorihtm to get normals from vertices and indices not yet implemented.
**/

class Object3D {
  constructor(gl, vertices, colors, indices, normals, shaderProgram) {
    this.gl = gl;
    this.indices = indices;
    this.shaderProgram = shaderProgram;
    this.vertices = vertices;
    this.colors = colors;
    this.normals = normals;
    this.savedBuffers = null;
    
    // Model matrix representing object's transformations
    this.modelMatrix = m4.identity(); 
    this.initBuffers(vertices, colors, indices, normals);
  }

  // Transformations
  translate(dx, dy, dz) {
    this.modelMatrix = m4.translate(this.modelMatrix, dx, dy, dz);
  }

  rotateX(angle) {
    this.modelMatrix = m4.xRotate(this.modelMatrix, angle);
  }

  rotateY(angle) {
    this.modelMatrix = m4.yRotate(this.modelMatrix, angle);
  }

  rotateZ(angle) {
    this.modelMatrix = m4.zRotate(this.modelMatrix, angle);
  }

  scale(sx, sy, sz) {
    this.modelMatrix = m4.scale(this.modelMatrix, sx, sy, sz);
  }

  // Save current buffers to be used later.
  saveObject() {
    // Apply modelMatrix to vertices.
    const vertices = this.vertices;
    const newVertices = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const vertex = [vertices[i], vertices[i + 1], vertices[i + 2], 1];
      const newVertex = m4.transformPoint(this.modelMatrix, vertex);
      newVertices.push(newVertex[0], newVertex[1], newVertex[2]);
    }

    // Apply modelMatrix to normals.
    const normals = this.normals;
    const newNormals = [];
    for (let i = 0; i < normals.length; i += 3) {
      const normal = [normals[i], normals[i + 1], normals[i + 2], 1];
      const newNormal = m4.transformPoint(this.modelMatrix, normal);
      newNormals.push(newNormal[0], newNormal[1], newNormal[2]);
    }

    const colors = this.colors;
    const indices = this.indices;

    console.log("newVertices", colors);

    return {
      vertices: newVertices,
      colors,
      indices,
      normals: newNormals,
    };
  }

  
  // Initialize necessary buffers for object.
  initBuffers(vertices, colors, indices, normals) {
    this.buffers = {
      position: this.createAndSetupBuffer(new Float32Array(vertices), this.gl.ARRAY_BUFFER),
      color: this.createAndSetupBuffer(new Float32Array(colors), this.gl.ARRAY_BUFFER),
      index: this.createAndSetupBuffer(new Uint16Array(indices), this.gl.ELEMENT_ARRAY_BUFFER),
      normal: this.createAndSetupBuffer(new Float32Array(normals), this.gl.ARRAY_BUFFER),
    };
  }

  // Bind and fill the buffer data.
  createAndSetupBuffer(data, type) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(type, buffer);
    this.gl.bufferData(type, data, this.gl.STATIC_DRAW);
    return buffer;
  }

  draw(projectionMatrix, modelViewMatrix, normalMatrix, lightDirection, enableShading) {
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

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);

    // Set uniforms.
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.normalMatrix, false, normalMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.projectionMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    this.gl.uniform3fv(this.shaderProgram.uniformLocations.lightDirection, lightDirection);
    this.gl.uniform1i(this.shaderProgram.uniformLocations.enableShading, enableShading);

    // Drawwzzz.
    this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }       
}

export { Object3D };
