// shaderProgram.js

export class Shader {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = this.createProgram(gl, vertexShader, fragmentShader);

        this.attributeLocations = {
            position: gl.getAttribLocation(this.program, "a_position"),
            color: gl.getAttribLocation(this.program, "a_color"),
            normal: gl.getAttribLocation(this.program, "a_normal"),
            tangent: gl.getAttribLocation(this.program, "a_tangent"),
            bitangent: gl.getAttribLocation(this.program, "a_bitangent"),
            textureCoord: gl.getAttribLocation(this.program, "a_textureCoord"),
        };

        this.uniformLocations = {
            projectionMatrix:gl.getUniformLocation(this.program, "u_projectionMatrix"),
            modelMatrix:gl.getUniformLocation(this.program, "u_modelMatrix"),
            modelViewMatrix:gl.getUniformLocation(this.program, "u_modelViewMatrix"),
            normalMatrix: gl.getUniformLocation(this.program, "u_normalMatrix"),
            lightDirection: gl.getUniformLocation(this.program, "u_lightDirection"),
            cameraPosition: gl.getUniformLocation(this.program, "u_worldCameraPosition"),
            enableShading: gl.getUniformLocation(this.program, "u_enableShading"),
            textureMode: gl.getUniformLocation(this.program, "u_textureMode"),
            textureImage: gl.getUniformLocation(this.program, "u_texture_image"),
            textureEnvironment: gl.getUniformLocation(this.program, "u_texture_environment"),
            textureBump: gl.getUniformLocation(this.program, "u_texture_bump"),
        };
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }

}
