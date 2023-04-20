import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

/// NOTE : THIS IS NOT FINAL AS ITS .. bad

function createHuman(gl, shader) {

    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode } = createCube();
    
    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Body");
    body.translate(0, 0, -2);
    // body.rotateY(0.7);
    body.scale(1, 1.5, 1);

    var head = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Head");
    head.translate(0, 0.75, 0);
    head.scale(0.5,0.5,0.5);
    head.rotateX(3.14);
    body.addChild(head);
    
    var rightArm = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Arm");
    rightArm.translate(0.75,-0.25,0);
    rightArm.scale(0.5,0.5, 1.5);
    rightArm.rotateX(1.57);
    body.addChild(rightArm);

    var leftArm = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Arm");
    leftArm.translate(-0.75,-0.25,0);
    leftArm.scale(0.5,0.5,1.5);
    leftArm.rotateX(1.57);
    body.addChild(leftArm);

    var rightLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Leg");
    rightLeg.translate(-0.25,-0.75,0);
    rightLeg.scale(0.5,0.5,1);
    rightLeg.rotateX(4.71);
    body.addChild(rightLeg);

    var leftLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Leg");
    leftLeg.translate(0.25,-0.75,0);
    leftLeg.scale(0.5,0.5,1);
    leftLeg.rotateX(4.71);
    body.addChild(leftLeg);

    var leftLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Lower Leg");
    leftLowerLeg.translate(0,0,-0.75);
    leftLowerLeg.scale(0.5,1,0.5);
    leftLowerLeg.rotateX(6.28);
    leftLeg.addChild(leftLowerLeg);

    var rightLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Lower Leg");
    rightLowerLeg.translate(0,0,-0.75);
    rightLowerLeg.scale(0.5,1,0.5);
    rightLowerLeg.rotateX(6.28);
    rightLeg.addChild(rightLowerLeg);

    return body;
}


export { createHuman };