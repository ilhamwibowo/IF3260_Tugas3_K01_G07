// ArticulatedObject3D.js
import { Object3D } from "./Object3D.js";
import { m4 } from "./utils/mat4.js";

class ArticulatedObject3D extends Object3D {
  constructor(gl, vertices, colors, indices, normals, tangents, bitangents, shaderProgram, textureCoord, textureMode, name) {
    super(gl, vertices, colors, indices, normals, tangents, bitangents, shaderProgram, textureCoord, textureMode);
    this.children = [];
    this.name = name;
  }

  addChild(child) {
    this.children.push(child);
  }

  saveObject(modMatrix) {
    const objData = super.saveObject(modMatrix);
    objData.name = this.name;
    const childrenData = [];
  
    for (let i = 0; i < this.children.length; i++) {
      childrenData.push(this.children[i].saveObject(m4.multiply(modMatrix, this.children[i].modelMatrix)));
    }
  
    objData.children = childrenData;
    console.log(objData)
    return objData;
  }

  changeTextureAll(mode) {
    this.textureMode = mode;

    for (const child of this.children) {
      child.changeTextureAll(mode);
    }
  }
  

  draw(projectionMatrix, modelMatrix, modelViewMatrix, normalMatrix, lightDirection, enableShading, cameraPosition) {
    super.draw(projectionMatrix, modelMatrix, modelViewMatrix, normalMatrix, lightDirection, enableShading, cameraPosition);

    // Draw all children 
    for (const child of this.children) {
      const childModelViewMatrix = m4.multiply(modelViewMatrix, child.modelMatrix);
      const childNormalMatrix = m4.transpose(m4.inverse2(childModelViewMatrix));

      child.draw(projectionMatrix, modelMatrix, childModelViewMatrix, childNormalMatrix, lightDirection, enableShading, cameraPosition);
    }
  }
}

export { ArticulatedObject3D };
