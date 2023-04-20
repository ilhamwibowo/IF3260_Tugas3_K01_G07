import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

/// NOTE : THIS IS NOT FINAL AS ITS .. bad

function makeCube(gl, shader) {

    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode } = createCube();

    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Articulated Model");
    // var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, "Articulated Cube");

    return body;
}


export { makeCube };