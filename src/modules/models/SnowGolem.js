import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

/// NOTE : THIS IS NOT FINAL AS ITS .. bad

function createHuman(gl, shader) {

    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode } = createCube();
    
    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Body");
    body.translate(0, 0, -2);

    var head = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Head");
    head.translate(0, 1, 0);
    head.scale(1.05, 1.05, 1.05);
    head.rotateX(3.14);
    body.addChild(head);
    
    var rightArm = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Arm");
    rightArm.translate(0.75,-0.25,0);
    rightArm.scale(0.1, 0.1, 1.5);
    rightArm.rotateX(1.57);
    rightArm.rotateY(0.5);
    body.addChild(rightArm);

    var leftArm = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Arm");
    leftArm.translate(-0.75,-0.25,0);
    leftArm.scale(0.1, 0.1, 1.5);
    leftArm.rotateX(1.57);
    leftArm.rotateY(-0.5);
    body.addChild(leftArm);

    var leg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Leg");
    leg.translate(0,-1,0);
    leg.scale(1.2,1.2,1.2);
    leg.rotateX(4.71);
    body.addChild(leg);

    return body;
}


export { createHuman };