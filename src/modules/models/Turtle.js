import { createCube } from "./basicCube.js";
import { ArticulatedObject3D } from "../ArticulatedObject3D.js";

function createTurtle(gl, shader) {

    var { vertices, colors, indices, normals, tangents, bitangents, textureCoord, textureMode } = createCube();
    
    var body = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Body");
    body.translate(0, 0, -2);
    body.scale(1, 0.3, 1.2);

    var head = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Head");
    head.translate(0, 0.2, 0.625);
    head.scale(0.3, 1, 0.25);
    body.addChild(head);

    var shell = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "Shell");
    shell.translate(0, 0.75, -0.15);
    shell.scale(1.6, 1.4, 1.3);
    body.addChild(shell);

    var frontLeftLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "FrontLeftLeg");
    frontLeftLeg.translate(0.9, -0.3, 0.2);
    frontLeftLeg.scale(1, 0.2, 0.3);
    frontLeftLeg.rotateZ(-0.2);
    frontLeftLeg.rotateY(0.2);
    body.addChild(frontLeftLeg);

    var frontRightLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "FrontRightLeg");
    frontRightLeg.translate(-0.9, -0.3, 0.2);
    frontRightLeg.scale(1, 0.2, 0.3);
    frontRightLeg.rotateZ(0.2);
    frontRightLeg.rotateY(-0.2);
    body.addChild(frontRightLeg);

    var backLeftLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "BackLeftLeg");
    backLeftLeg.translate(0.3, -0.3, -0.9);
    backLeftLeg.scale(0.3, 0.2, 1);
    backLeftLeg.rotateZ(0.2);
    body.addChild(backLeftLeg);

    var backRightLeg = new ArticulatedObject3D(gl, vertices, colors, indices, normals, tangents, bitangents, shader, textureCoord, textureMode, "BackRightLeg");
    backRightLeg.translate(-0.3, -0.3, -0.9);
    backRightLeg.scale(0.3, 0.2, 1);
    backRightLeg.rotateZ(-0.2);
    body.addChild(backRightLeg);

    return body;
}


export { createTurtle };