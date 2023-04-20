import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

function createCat(gl, shader) {
    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode } = createCube();

    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Body");
    body.translate(0, 0, -3);
    body.scale(2, 2, 5);

    var head = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Head");
    head.translate(0, 0.5, 0.5);
    head.scale(0.5, 0.5, 0.3);
    head.rotateX(0.35);
    body.addChild(head);

    var tail = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Tail");
    tail.translate(0, 0.3, -0.6);
    tail.scale(0.2, 0.2, 1);
    tail.rotateX(-2.32);
    body.addChild(tail);

    var rightFrontLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Front Leg");
    rightFrontLeg.translate(0.6, -0.35, 0.3);
    rightFrontLeg.scale(0.3, 1.3, 0.2);
    rightFrontLeg.rotateX(3.14);
    body.addChild(rightFrontLeg);
//
    //var rightFrontLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Front Lower Leg");
    //rightFrontLowerLeg.translate(0,0,-0.75);
    //rightFrontLowerLeg.scale(0.5,1,0.5);
    //rightFrontLowerLeg.rotateX(6.28);
    //rightFrontLeg.addChild(rightFrontLowerLeg);

    var leftFrontLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Front Leg");
    leftFrontLeg.translate(-0.6,-0.35,0.3);
    leftFrontLeg.scale(0.3,1.3,0.2);
    leftFrontLeg.rotateX(3.14);
    body.addChild(leftFrontLeg);
//
    //var leftFrontLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Front Lower Leg");
    //leftFrontLowerLeg.translate(0,0,-0.75);
    //leftFrontLowerLeg.scale(0.5,1,0.5);
    //leftFrontLowerLeg.rotateX(6.28);
    //leftFrontLeg.addChild(leftFrontLowerLeg);

    var rightBackLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Back Leg");
    rightBackLeg.translate(0.6,-0.35, -0.3);
    rightBackLeg.scale(0.3,1.3,0.2);
    rightBackLeg.rotateX(3.14);
    body.addChild(rightBackLeg);
//
    //var rightBackLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Back Lower Leg");
    //rightBackLowerLeg.translate(0,0,-0.75);
    //rightBackLowerLeg.scale(0.5,1,0.5);
    //rightBackLowerLeg.rotateX(6.28);
    //rightBackLeg.addChild(rightBackLowerLeg);

    var leftBackLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Back Leg");
    leftBackLeg.translate(-0.6,-0.35,-0.3);
    leftBackLeg.scale(0.3,1.3,0.2);
    leftBackLeg.rotateX(3.14);
    body.addChild(leftBackLeg);

    //var leftBackLowerLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Back Lower Leg");
    //leftBackLowerLeg.translate(0,0,-0.75);
    //leftBackLowerLeg.scale(0.5,1,0.5);
    //leftBackLowerLeg.rotateX(6.28);
    //leftBackLeg.addChild(leftBackLowerLeg);
//
    var tailTip = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Tail Tip");
    tailTip.translate(0, 0, 0.5);
    tailTip.scale(1.3, 0.2, 1.3);
    tailTip.rotateX(1.57);
    tail.addChild(tailTip);

    var rightEar = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Right Ear");
    rightEar.translate(0.37,0.6,0.3);
    rightEar.scale(0.25, 0.4, 0.1);
    rightEar.rotateX(3.14);
    head.addChild(rightEar);
    
    var leftEar = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Left Ear");
    leftEar.translate(-0.37,0.6,0.3);
    leftEar.scale(0.25,0.4,0.1);
    leftEar.rotateX(3.14);
    head.addChild(leftEar);
//
    return body;
}

export { createCat };