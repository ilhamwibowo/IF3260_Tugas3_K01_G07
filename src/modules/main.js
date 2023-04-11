// main.js
import { createCube } from "./models/basicCube.js";
import { m4 } from "./utils/mat4.js";
import { Object3D } from "./Object3D.js";
import { Shader } from "./shaders/shaderProgram.js";
import { loadFile } from "./utils/loader.js";

/**
 * run with http-server
 * Need to process inputs.
 * Event listeners not yet all implemented. 
 *  
 */

const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec3 a_normal;

  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec3 v_pos;
  varying vec3 v_N;

  uniform mat4 u_modelViewMatrix;
  uniform mat4 u_projectionMatrix;
  uniform mat4 u_normalMatrix;

  void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    vec3 pos = -(u_modelViewMatrix * a_position).xyz;
    v_pos = pos;

    v_N = normalize((u_modelViewMatrix * vec4(a_normal, 0.0)).xyz);
    v_color = a_color;
    v_normal = mat3(u_normalMatrix) * a_normal;
  
  }
`
const fragmentShaderSource = `
  precision mediump float;
  vec3 ambientColor = vec3(0.2, 0.2, 0.2);
  vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
  vec3 specularColor = vec3(1.0, 1.0, 1.0);
  float shininess = 50.0;

  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec3 v_pos;
  varying vec3 v_N;

  uniform vec3 u_lightDirection;
  uniform bool u_enableShading;

  void main() {
    vec3 normal = normalize(v_normal);
    float lightIntensity = max(dot(normal, u_lightDirection), 0.0);

    vec3 ambient = ambientColor * v_color.rgb;
    vec3 diffuse = diffuseColor * v_color.rgb * lightIntensity;
    vec3 H = normalize(u_lightDirection - v_pos);
    float Ks = pow(max(dot(v_N, H), 0.0), shininess);
    vec3 specular = (Ks * specularColor).xyz;
    if (dot(u_lightDirection, v_N) < 0.0) specular = vec3(0.0, 0.0, 0.0);

    vec4 shadedColor = vec4(ambient + diffuse + specular, v_color.a);
    gl_FragColor = u_enableShading ? shadedColor : v_color;
  }
`;

var projection_type = 'perspective';

function main() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  const fileSelector = document.getElementById('fileInput');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  // Set up shaders and cube properties
  const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  var { vertices, colors, indices, normals } = createCube();
  var cube = new Object3D(gl, vertices, colors, indices, normals, shader);

  let enableShading = false;
  
  // Set up camera properties
  var radius = 5;
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  var cameraAngleRadians = m4.degToRad(0);

  // Projection constants
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const fov = m4.degToRad(45); 
  const near = 0.1;
  const far = 100;

  const theta = 45;
  const phi = 45;

  const left = -2;
  const right = 2;
  const bottom = -2;
  const top = 2;

  // Light direction
  const lightDirection = [0.5, 0.7, 1];

  var rotate = false;

  // This is for testing purposes. Will be changed in future development
  const cameraSpeed = m4.degToRad(1);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
      rotate = !rotate;
    } else if (event.key === 'ArrowLeft') {
      cameraAngleRadians += cameraSpeed;
    } else if (event.key === 'ArrowRight') {
      cameraAngleRadians -= cameraSpeed;
    }

    if(!rotate) drawScene();
  });
  

  /////////// Event Listeners ////////////
  document.getElementById("loadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    loadFile(
      file,
      (fileContent) => {
        vertices = fileContent.vertices;
        colors = fileContent.colors;
        indices = fileContent.indices;
        normals = fileContent.normals;

        cube = new Object3D(gl, fileContent.vertices, fileContent.colors, fileContent.indices, fileContent.normals, shader);
        resetInputs();
        drawScene();
      },
      (error) => {
          console.error("Error reading file:", error);
      }
    );
  });

  let rx_prev = 0;
  document.getElementById("rx_slider").oninput = function () {
    let value = document.getElementById("rx_slider").value;
    cube.rotateX(value - rx_prev);
    rx_prev = value;
    if (!rotate) drawScene();
  };

  let ry_prev = 0;
  document.getElementById("ry_slider").oninput = function () {
    let value = document.getElementById("ry_slider").value;
    cube.rotateY(value - ry_prev);
    ry_prev = value;
    if (!rotate) drawScene();
  };

  let rz_prev = 0;
  document.getElementById("rz_slider").oninput = function () {
    let value = document.getElementById("rz_slider").value;
    cube.rotateZ(value - rz_prev);
    rz_prev = value;
    if (!rotate) drawScene();
  };

  let tx_prev = 0;
  document.getElementById("tx_slider").oninput = function () {
    let value = document.getElementById("tx_slider").value;
    cube.translate(value - tx_prev, 0, 0);
    tx_prev = value;
    if (!rotate) drawScene();
  };

  let ty_prev = 0;
  document.getElementById("ty_slider").oninput = function () {
    let value = document.getElementById("ty_slider").value;
    cube.translate(0, value - ty_prev, 0);
    ty_prev = value;
    if (!rotate) drawScene();
  };

  let tz_prev = 0;
  document.getElementById("tz_slider").oninput = function () {
    let value = document.getElementById("tz_slider").value;
    cube.translate(0, 0, value - tz_prev);
    tz_prev = value;
    if (!rotate) drawScene();
  };

  let sx_prev = 1;
  document.getElementById("sx_slider").oninput = function () {
    let value = document.getElementById("sx_slider").value;
    cube.scale(value / sx_prev, 1, 1);
    sx_prev = value;
    if (!rotate) drawScene();
  };

  let sy_prev = 1;
  document.getElementById("sy_slider").oninput = function () {
    let value = document.getElementById("sy_slider").value;
    cube.scale(1, value / sy_prev, 1);
    sy_prev = value;
    if (!rotate) drawScene();
  };

  let sz_prev = 1;
  document.getElementById("sz_slider").oninput = function () {
    let value = document.getElementById("sz_slider").value;
    cube.scale(1, 1, value / sz_prev);
    sz_prev = value;
    if (!rotate) drawScene();
  };

  // Rotate animation
  document.getElementById("rotate_btn").addEventListener("click", function() {
    rotate = !rotate;
    drawScene();
  });

  // Event listener for projection type
  document.getElementById("mode_select").addEventListener("change", function() {
    projection_type = this.value;
    if (!rotate) drawScene();
  });

  function resetInputs() {
    // Reset all sliders
    document.getElementById("rx_slider").value = 0;
    document.getElementById("ry_slider").value = 0;
    document.getElementById("rz_slider").value = 0;
    document.getElementById("tx_slider").value = 0;
    document.getElementById("ty_slider").value = 0;
    document.getElementById("tz_slider").value = 0;
    document.getElementById("sx_slider").value = 1;
    document.getElementById("sy_slider").value = 1;
    document.getElementById("sz_slider").value = 1;
    document.getElementById("cam_a_slider").value = 0;
    document.getElementById("cam_r_slider").value = 5;
    document.getElementById("mode_select").value = "perspective";

    // Reset camera variables
    radius = 5;
    cameraAngleRadians = m4.degToRad(0);

    // Reset rotation variable
    rotate = false;
  }

  // Event listener for set default
  document.getElementById("default_btn").addEventListener("click", function() {
    cube = new Object3D(gl, vertices, colors, indices, normals, shader);

    resetInputs();
    
    if (!rotate) drawScene();
  });

  // Event listener for camera angle and radius
  document.getElementById("cam_a_slider").oninput = function() {
    let value = m4.degToRad(document.getElementById("cam_a_slider").value);
    cameraAngleRadians = value;
    if (!rotate) drawScene();
  };

  
  document.getElementById("cam_r_slider").oninput = function() {
    let value = document.getElementById("cam_r_slider").value;
    radius = value;
    if (!rotate) drawScene();
  };

  document.getElementById("shading").addEventListener("change", function() {
    enableShading = this.checked ? true : false;
    if (!rotate) drawScene();
  });

  // Event listener for save object
  document.getElementById("save_btn").addEventListener("click", function() {
    let obj = cube.saveObject();

    // file setting
    const text = JSON.stringify(obj);
    const val = document.getElementById("save_filename").value;
    const name = val === "" ? "hollowobject.json" : val + ".json";
    const type = "text/plain";

    // create file
    const a = document.createElement("a");
    const file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Event listener for help
  document.getElementById("help_btn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "block";
  });
  
  function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth * window.devicePixelRatio;
    const height = canvas.clientHeight * window.devicePixelRatio;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  
  /////////// drawwwwzzzz /////////////////
  // Draw scene for each frame
  function drawScene() {
    // Clear canvas and setup viewport.
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var projectionMatrix = m4.identity();

    // Set up projection matrix
    if (projection_type == "perspective") {
      projectionMatrix = m4.perspective(fov, aspect, near, far);
    }
    else if (projection_type == "orthographic") {
      projectionMatrix = m4.orthographic(projectionMatrix, left, right, bottom, top, near, far);
    }
    else if (projection_type == "oblique") {
      var obliqueMatrix = m4.identity();
      var orthoMatrix = m4.identity();

      obliqueMatrix = m4.oblique(projectionMatrix, theta, phi);
      orthoMatrix = m4.orthographic(projectionMatrix, left, right, bottom, top, near, far);
      
      projectionMatrix = m4.translate( m4.multiply(obliqueMatrix, orthoMatrix), 1.75, 1.75, 1.75);
    }

    // Use matrix math to compute a position on a circle where
    // the camera is
    var cameraMatrix = m4.yRotation(cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius);

    // Get the camera's position from the matrix we computed
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    // Set up camera matrix, and get the view matrix relative to the camera
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    var viewMatrix = m4.inverse2(cameraMatrix);

    // This is for the light to be at fixed location when the camera moves
    const viewLightDirection = m4.transformDirection(viewMatrix, lightDirection);

    const modelViewMatrix = m4.multiply(viewMatrix, cube.modelMatrix);
    const normalMatrix = m4.transpose(m4.inverse2(modelViewMatrix));

    // Combined matrix
    // const matrix = m4.multiply(projectionMatrix, modelViewMatrix);
    
    cube.draw(projectionMatrix, modelViewMatrix, normalMatrix, viewLightDirection, enableShading);
    
    if (rotate) {
      cube.rotateX(0.01);
      cube.rotateY(0.01);
      requestAnimationFrame(drawScene);
    }
  }

  drawScene();
}

main();