import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

/// NOTE : THIS IS NOT FINAL AS ITS .. bad

function makeCube(gl, shader) {

    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord } = createCube();
    
    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord);

    return body;
}


export { makeCube };