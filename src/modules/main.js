// main.js
import { createCube } from "./models/basicCube.js";
import { m4 } from "./utils/mat4.js";
import { Object3D } from "./Object3D.js";
import { Shader } from "./shaders/shaderProgram.js";
import { loadAnimation, loadFile } from "./utils/loader.js";
import { createHuman } from "./models/Human.js";
import { makeCube } from "./models/Cube.js";
import { ArticulatedObject3D } from "./ArticulatedObject3D.js";
import { createTurtle } from "./models/Turtle.js";

/**
  TODOS : 
  - Fix rotation bug
  - add camera controller and projection, for canvas single, 
  - Save load set default
  - Animation
  - Texture mapping
  - Modify front end UI
  - Refactor (for readability) and cleaning
 */

const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec3 a_normal;
  attribute vec3 a_tangent;
  attribute vec3 a_bitangent;
  attribute vec2 a_textureCoord;

  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec3 v_pos;
  varying vec3 v_N;
  varying vec2 v_textureCoord;

  varying vec3 v_modelPosition;
  varying vec3 v_viewModelPosition;

  uniform mat4 u_modelMatrix;
  uniform mat4 u_modelViewMatrix;
  uniform mat4 u_projectionMatrix;
  uniform mat4 u_normalMatrix;

  // All variables for Bump Mapping
  varying mat3 v_tbn;

  mat3 transpose(in mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];
  
    mat3 outMatrix = mat3(vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z));
  
    return outMatrix;
  }

  void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    vec3 pos = (u_modelViewMatrix * a_position).xyz;
    v_pos = pos;

    v_N = normalize((u_modelViewMatrix * vec4(a_normal, 0.0)).xyz);
    v_color = a_color;
    v_normal = mat3(u_normalMatrix) * a_normal;

    // Pass the texcoord to the fragment shader.
    v_textureCoord = a_textureCoord;

    // send the view position to the fragment shader
    v_modelPosition = vec3(u_modelMatrix * a_position);
    v_viewModelPosition = vec3(u_modelViewMatrix * a_position);
  
    // Bump mapping variables. 
    vec3 t = normalize(mat3(u_normalMatrix) * a_tangent);
    vec3 b = normalize(mat3(u_normalMatrix) * a_bitangent);
    vec3 n = normalize(mat3(u_normalMatrix) * a_normal);
    v_tbn = transpose(mat3(t, b, n));
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

  // The texture
  uniform sampler2D u_texture_image;
  uniform samplerCube u_texture_environment;
  uniform sampler2D u_texture_bump;

  // variable for Bump Mapping
  varying mat3 v_tbn;

  // texture parameters
  uniform int u_textureMode;
  varying vec2 v_textureCoord;

  // The position of object.
  varying vec3 v_modelPosition;
  varying vec3 v_viewModelPosition;

  // The position of camera.
  uniform vec3 u_worldCameraPosition;

  void main() {
    // normalize the normal
    vec3 normal = normalize(v_normal);

    // lightning effect
    float lightIntensity = max(dot(normal, u_lightDirection), 0.0);
    vec3 ambient = ambientColor * v_color.rgb;
    vec3 diffuse = diffuseColor * v_color.rgb * lightIntensity;
    vec3 H = normalize(u_lightDirection - v_pos);
    float Ks = pow(max(dot(v_N, H), 0.0), shininess);
    vec3 specular = (Ks * specularColor).xyz;
    if (dot(u_lightDirection, v_N) < 0.0) specular = vec3(0.0, 0.0, 0.0);

    vec4 shadedColor = vec4(ambient + diffuse + specular, v_color.a);
    gl_FragColor = u_enableShading ? shadedColor : v_color;

    // set the color to the texture
    if (u_textureMode == 0) {
      gl_FragColor = texture2D(u_texture_image, v_textureCoord);
    } else if(u_textureMode == 1) {
      // Reflection direction.
      vec3 eyeToSurfaceDir = normalize(v_pos - u_worldCameraPosition);
      vec3 reflectionDir = reflect(eyeToSurfaceDir, normal);

      gl_FragColor = textureCube(u_texture_environment, reflectionDir);
   } else if (u_textureMode == 2) {
      // Fragment position and lighting position.
      vec3 fragPos = v_tbn * v_viewModelPosition;
      vec3 lightPos = v_tbn * u_lightDirection;

      // Lighting direction and ambient.
      vec3 lightDir = normalize(lightPos - fragPos);
      vec3 albedo = texture2D(u_texture_bump, v_textureCoord).rgb;
      vec3 ambient = 0.3 * albedo;
      // Lighting diffuse.
      vec3 norm = normalize(texture2D(u_texture_bump, v_textureCoord).rgb * 2.0 - 1.0);
      float diffuse = max(dot(lightDir, norm), 0.0);

      gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
    }
  }
`;

var projection_type = 'perspective';
var subtree_projection_type = 'perspective';

function main() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');

  const canvas_single = document.querySelector('#canvas-single');
  const gl_single = canvas_single.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  // Set up shaders and cube properties
  const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  const shader_single = new Shader(gl_single, vertexShaderSource, fragmentShaderSource);

  // Cube is the main object
  // selectedObject is the object in the second canvas (components)
  // selectedCUbePart is part of cube, to apply transformations
  var cube = createHuman(gl, shader);
  var cube2 = createHuman(gl_single, shader_single);
  var selectedObject = cube2;
  var selectedCubePart = cube;
  var vertices = cube.vertices;
  var colors = cube.colors;
  var indices = cube.indices;
  var normals = cube.normals;
  var tangents = cube.tangents;
  var bitangents = cube.bitangents;
  var textureCoord = cube.textureCoords;
  var textureMode = cube.textureMode;
  var children = cube.children;
  var name = cube.name;

  let enableShading = false;
  var playAnimation = false;
  var currentKeyframe = 0;
  var keyframes = [];
  var numKeyframes = 0;
  var timeBetweenKeyframes = 100;
  var lastUpdate = Date.now();
  var isChangingFrame = false;
  
  // Set up camera properties
  var radius = 5;
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  var cameraAngleRadians = m4.degToRad(0);

  // Set up camera properties for single canvas
  var radius_single = 5;
  const target_single = [0, 0, 0];
  const up_single = [0, 1, 0];
  var cameraAngleRadians_single = m4.degToRad(0);

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

  // Texture Mode
  var textureMode = -1;

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

  function loadChildren(webgl, shaderProgram, object, fileContentChildren) {
    console.log(fileContentChildren.length);
    for (var i = 0; i < fileContentChildren.length; i++) {
      var child = new ArticulatedObject3D(webgl, fileContentChildren[i].vertices, fileContentChildren[i].colors, fileContentChildren[i].indices, fileContentChildren[i].normals, fileContentChildren[i].tangents, fileContentChildren[i].bitangents, shaderProgram, fileContentChildren[i].textureCoord, fileContentChildren[i].textureMode, fileContentChildren[i].name);
      object.addChild(child);
      loadChildren(webgl, shaderProgram, child, fileContentChildren[i].children);
    }
  }
  
  ////////////////////////////////// Event Listeners //////////////////////////////
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
        cube = new ArticulatedObject3D(gl, fileContent.vertices, fileContent.colors, fileContent.indices, fileContent.normals, fileContent.tangents, fileContent.bitangents, shader, fileContent.textureCoord, fileContent.textureMode, fileContent.name);
        console.log(fileContent.children);
        loadChildren(gl, shader, cube, fileContent.children);
        selectedObject = new ArticulatedObject3D(gl_single, fileContent.vertices, fileContent.colors, fileContent.indices, fileContent.normals, fileContent.tangents, fileContent.bitangents, shader_single, fileContent.textureCoord, fileContent.textureMode, fileContent.name);
        loadChildren(gl_single, shader_single, selectedObject, fileContent.children);
        selectedCubePart = cube;
        cube2 = selectedObject;
        vertices = cube.vertices;
        colors = cube.colors;
        indices = cube.indices;
        normals = cube.normals;
        tangents = cube.tangents;
        bitangents = cube.bitangents;
        textureCoord = cube.textureCoords;
        textureMode = cube.textureMode;
        children = cube.children;
        name = cube.name;

        resetInputs();
        const buttonContainer = document.getElementById("button-container");
        clearComponentTree();
        createComponentTree(selectedObject, cube, buttonContainer);
        drawScene();
      },
      (error) => {
        console.error("Error reading file:", error);
      }
    );
  });

  document.getElementById("load_anim").addEventListener("click", () => {
    const fileInput = document.getElementById("animInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    loadAnimation(
      file,
      (fileContent) => {
        keyframes = fileContent.keyframes;
        numKeyframes = fileContent.numKeyframes;

        drawScene();
        console.log(keyframes);
      },
      (error) => {
        console.error("Error reading file:", error);
      }
    );
  });

  document.getElementById("loadButtonComponent").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInputComponent");
    const file = fileInput.files[0];

    if (!file) {
      alert("No file selected!");
      return;
    }

    loadFile(
      file,
      (fileContent) => {
        const componentCube = new ArticulatedObject3D(gl, fileContent.vertices, fileContent.colors, fileContent.indices, fileContent.normals, fileContent.tangents, fileContent.bitangents, shader, fileContent.textureCoord, fileContent.textureMode, fileContent.name);
        loadChildren(gl, shader, componentCube, fileContent.children);
        
        const componentSelected = new ArticulatedObject3D(gl_single, fileContent.vertices, fileContent.colors, fileContent.indices, fileContent.normals, fileContent.tangents, fileContent.bitangents, shader_single, fileContent.textureCoord, fileContent.textureMode, fileContent.name);
        loadChildren(gl_single, shader_single, componentSelected, fileContent.children);

        selectedCubePart.addChild(componentCube);
        selectedObject.addChild(componentSelected);

        resetInputs();
        const buttonContainer = document.getElementById("button-container");
        clearComponentTree();
        createComponentTree(cube2, cube, buttonContainer);
        drawScene();
        console.log(cube);
      },
      (error) => {
        console.error("Error reading file:", error);
      }
    );
  });

  function rotateXYZ(valueX, valueY, valueZ) {
    if (valueX != 0) {
      selectedObject.rotateX(valueX);
      selectedCubePart.rotateX(valueX);
    }
    if (valueY != 0) {
      selectedObject.rotateY(valueY);
      selectedCubePart.rotateY(valueY);
    }
    if (valueZ != 0) {
      selectedObject.rotateZ(valueZ);
      selectedCubePart.rotateZ(valueZ);
    }
    // console.log(rx_prev, ry_prev, rz_prev);

    if (!rotate) drawScene();
  }

  let rx_prev = 0;
  document.getElementById("rx_slider").oninput = function () {
    let value = document.getElementById("rx_slider").value;
    rotateXYZ(value - rx_prev, 0, 0);
    rx_prev = value;
  };

  let ry_prev = 0;
  document.getElementById("ry_slider").oninput = function () {
    let value = document.getElementById("ry_slider").value;
    rotateXYZ(0, value - ry_prev, 0);
    ry_prev = value;
  };

  let rz_prev = 0;
  document.getElementById("rz_slider").oninput = function () {
    let value = document.getElementById("rz_slider").value;
    rotateXYZ(0, 0, value - rz_prev);
    rz_prev = value;
  };

  function translateXYZ(valueX, valueY, valueZ) {
    selectedObject.translate(valueX, valueY, valueZ);
    selectedCubePart.translate(valueX, valueY, valueZ);
    // console.log(tx_prev, ty_prev, tz_prev);
    if (!rotate) drawScene();
  }

  let tx_prev = 0;
  document.getElementById("tx_slider").oninput = function () {
    let value = document.getElementById("tx_slider").value;
    translateXYZ(value - tx_prev, 0, 0);
    tx_prev = value;
  };

  let ty_prev = 0;
  document.getElementById("ty_slider").oninput = function () {
    let value = document.getElementById("ty_slider").value;
    translateXYZ(0, value - ty_prev, 0);
    ty_prev = value;
  };

  let tz_prev = 0;
  document.getElementById("tz_slider").oninput = function () {
    let value = document.getElementById("tz_slider").value;
    translateXYZ(0, 0, value - tz_prev);
    tz_prev = value;
  };

  function scaleXYZ(valueX, valueY, valueZ) {
    selectedObject.scale(valueX, valueY, valueZ);
    selectedCubePart.scale(valueX, valueY, valueZ);
    // console.log(sx_prev, sy_prev, sz_prev);
    if (!rotate) drawScene();
  }

  let sx_prev = 1;
  document.getElementById("sx_slider").oninput = function () {
    let value = document.getElementById("sx_slider").value;
    scaleXYZ(value / sx_prev, 1, 1);
    sx_prev = value;
  };

  let sy_prev = 1;
  document.getElementById("sy_slider").oninput = function () {
    let value = document.getElementById("sy_slider").value;
    scaleXYZ(1, value / sy_prev, 1);
    sy_prev = value;
  };

  let sz_prev = 1;
  document.getElementById("sz_slider").oninput = function () {
    let value = document.getElementById("sz_slider").value;
    scaleXYZ(1, 1, value / sz_prev);
    sz_prev = value;
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

  document.getElementById("subtree_mode_select").addEventListener("change", function() {
    subtree_projection_type = this.value;
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
    document.getElementById("cam_a_o_slider").value = 0;
    document.getElementById("cam_r_o_slider").value = 5;
    document.getElementById("mode_select").value = "perspective";

    // Reset camera variables
    radius = 5;
    cameraAngleRadians = m4.degToRad(0);

    // Reset rotation variable
    rotate = false;
  }

  // Event listener for set default
  document.getElementById("default_btn").addEventListener("click", function() {
    cube.translation = m4.identity();
    cube.scaling = m4.identity();
    cube.rotation = m4.identity();
    cube.modelMatrix = m4.identity();
    selectedObject.translation = m4.identity();
    selectedObject.scaling = m4.identity();
    selectedObject.rotation = m4.identity();
    selectedObject.modelMatrix = m4.identity();
    selectedCubePart.translation = m4.identity();
    selectedCubePart.scaling = m4.identity();
    selectedCubePart.rotation = m4.identity();
    selectedCubePart.modelMatrix = m4.identity();

    resetInputs();
    
    drawScene();
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

  // Event listener for camera angle and radius of selected object
  document.getElementById("cam_a_o_slider").oninput = function() {
    let value = m4.degToRad(document.getElementById("cam_a_o_slider").value);
    cameraAngleRadians_single = value;
    if (!rotate) drawScene();
  };

  document.getElementById("cam_r_o_slider").oninput = function() {
    let value = document.getElementById("cam_r_o_slider").value;
    radius_single = value;
    if (!rotate) drawScene();
  };

  document.getElementById("shading").addEventListener("change", function() {
    enableShading = this.checked ? true : false;
    if (!rotate) drawScene();
  });

  // Event listener for save object
  document.getElementById("save_btn").addEventListener("click", function() {
    let obj = cube.saveObject(cube.modelMatrix);

    // file setting
    const text = JSON.stringify(obj);
    const val = document.getElementById("save_filename").value;
    const name = val === "" ? "articulatedmodel.json" : val + ".json";
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

  // Event listener for play animation
  document.getElementById("play-button").addEventListener("click", function() {
    if (playAnimation) {
      playAnimation = false;
      document.getElementById("play-button").innerHTML = "Play";
      lastUpdate = Date.now();
    }
    else {
      playAnimation = true;
      document.getElementById("play-button").innerHTML = "Stop";
      currentKeyframe = 0;
    }
  });

  // Event listener for pause animation
  document.getElementById("pause-button").addEventListener("click", function() {
    if (playAnimation) {
      playAnimation = false;
      document.getElementById("pause-button").innerHTML = "Pause";
    }
    else {
      playAnimation = true;
      document.getElementById("pause-button").innerHTML = "Resume";
    }
  });

  // Event listener for animation keyframe
  document.getElementById("first-frame").addEventListener("click", function() {
    if (!playAnimation) {
      currentKeyframe = 0;
      document.getElementById("current-frame").innerHTML = currentKeyframe;
      isChangingFrame = true;
      playAnimation = true;
      requestAnimationFrame(drawScene);
    }
  });
  document.getElementById("prev-frame").addEventListener("click", function() {
    if (!playAnimation) {
      currentKeyframe = currentKeyframe - 1 < 0 ? 0 : currentKeyframe - 1;
      document.getElementById("current-frame").innerHTML = currentKeyframe;
      isChangingFrame = true;
      playAnimation = true;
      requestAnimationFrame(drawScene);
    }
  });
  document.getElementById("next-frame").addEventListener("click", function() {
    if (!playAnimation) {
      currentKeyframe = currentKeyframe + 1 > numKeyframes - 1 ? numKeyframes - 1 : currentKeyframe + 1;
      document.getElementById("current-frame").innerHTML = currentKeyframe;
      isChangingFrame = true;
      playAnimation = true;
      requestAnimationFrame(drawScene);
    }
  });
  document.getElementById("last-frame").addEventListener("click", function() {
    if (!playAnimation) {
      currentKeyframe = numKeyframes - 1;
      document.getElementById("current-frame").innerHTML = currentKeyframe;
      isChangingFrame = true;
      playAnimation = true;
      requestAnimationFrame(drawScene);
    }
  });

  // Event listener for animation speed
  document.getElementById("time_between_frames").addEventListener("change", function() {
    timeBetweenKeyframes = this.value;
  });

  // Event listener for texture
  // document.getElementById("mode_select").addEventListener("change", function() {
  //   projection_type = this.value;
  //   if (!rotate) drawScene();
  // });
  document.getElementById("texture_select").addEventListener("change", function() {
    let value;
    if (this.value == "none") {
      value = -1;
    } else if (this.value == "image") {
      value = 0;
    } else if (this.value == "environment") {
      value = 1;
    } else if (this.value == "bump") {
      value = 2;
    }
    selectedObject.changeTexture(value);
    selectedCubePart.changeTexture(value);
    if (!rotate) drawScene();
  });

  document.getElementById("texture_s_select").addEventListener("change", function() {
    let value;
    if (this.value == "none") {
      value = -1;
    } else if (this.value == "image") {
      value = 0;
    } else if (this.value == "environment") {
      value = 1;
    } else if (this.value == "bump") {
      value = 2;
    }
    selectedObject.changeTextureAll(value);
    selectedCubePart.changeTextureAll(value);
    if (!rotate) drawScene();
  });


  function createButton(object, baseObject, indent = 0) {
    const button = document.createElement("button");
    button.textContent = object.name || "Component";
    button.style.marginLeft = indent * 20 + "px";
    button.style.display = "block";
    
    button.onclick = () => {
      // Set the currently selected object to the one the button represents
      selectedObject = object;
      selectedCubePart = baseObject;
      drawSelectedObject();
    };
    return button;
  }

  function clearComponentTree() {
    const container = document.getElementById('button-container');
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      button.remove();
    });
  }

  function createComponentTree(object, baseObject,  container, depth = 0) {
    const button = createButton(object, baseObject, depth);
    container.appendChild(button);
  
    if (object.children) {
      for (let i = 0; i < object.children.length; i++) {
        const child = object.children[i];
        const baseChild = baseObject.children[i];
        createComponentTree(child, baseChild, container, depth + 1);
      }
    }
  }
  
  const buttonContainer = document.getElementById("button-container");
  createComponentTree(selectedObject, cube, buttonContainer);

  requestAnimationFrame(drawScene);

  //////////////////////////////////////////// DRAW FUNCTIONS //////////////////////////////////
  // Draw in the second canvas
  function drawSelectedObject() {
    // Clear canvas and setup viewport.
    resizeCanvasToDisplaySize(gl_single.canvas);
    gl_single.viewport(0, 0, gl_single.canvas.width, gl_single.canvas.height);
    gl_single.clearColor(0.8, 0.8, 0.8, 1);
    gl_single.clear(gl_single.COLOR_BUFFER_BIT | gl_single.DEPTH_BUFFER_BIT);
    gl_single.enable(gl_single.DEPTH_TEST);

    var projectionMatrix = m4.identity();

    // Set up projection matrix
    if (subtree_projection_type == "perspective") {
      projectionMatrix = m4.perspective(fov, aspect, near, far);
    }
    else if (subtree_projection_type == "orthographic") {
      projectionMatrix = m4.orthographic(projectionMatrix, left, right, bottom, top, near, far);
    }
    else if (subtree_projection_type == "oblique") {
      var obliqueMatrix = m4.identity();
      var orthoMatrix = m4.identity();

      obliqueMatrix = m4.oblique(projectionMatrix, theta, phi);
      orthoMatrix = m4.orthographic(projectionMatrix, left, right, bottom, top, near, far);
      
      projectionMatrix = m4.translate( m4.multiply(obliqueMatrix, orthoMatrix), 1.75, 1.75, 1.75);
    }

    // Use matrix math to compute a position on a circle where
    // the camera is
    var cameraMatrix = m4.yRotation(cameraAngleRadians_single);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius_single);

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

    const modelViewMatrix = m4.multiply(viewMatrix, selectedObject.modelMatrix);
    const normalMatrix = m4.transpose(m4.inverse2(modelViewMatrix));

    // console.log(selectedObject);

    selectedObject.draw(projectionMatrix, selectedObject.modelMatrix, modelViewMatrix, normalMatrix, viewLightDirection, enableShading, cameraPosition);

  }

  // Draw in the main canvas
  function drawScene(time) {
    time *= 0.0005;

    if (playAnimation && Date.now() - lastUpdate >= (1000 / timeBetweenKeyframes)) {
      lastUpdate = Date.now();

      translateXYZ(keyframes[currentKeyframe].translation[0] - tx_prev, keyframes[currentKeyframe].translation[1] - ty_prev, keyframes[currentKeyframe].translation[2] - tz_prev);
      tx_prev = keyframes[currentKeyframe].translation[0];
      ty_prev = keyframes[currentKeyframe].translation[1];
      tz_prev = keyframes[currentKeyframe].translation[2];
      rotateXYZ(keyframes[currentKeyframe].rotation[0] - rx_prev, keyframes[currentKeyframe].rotation[1] - ry_prev, keyframes[currentKeyframe].rotation[2] - rz_prev);
      rx_prev = keyframes[currentKeyframe].rotation[0];
      ry_prev = keyframes[currentKeyframe].rotation[1];
      rz_prev = keyframes[currentKeyframe].rotation[2];
      scaleXYZ(sx_prev / keyframes[currentKeyframe].scale[0], sy_prev / keyframes[currentKeyframe].scale[1], sz_prev / keyframes[currentKeyframe].scale[2]);
      sx_prev = keyframes[currentKeyframe].scale[0];
      sy_prev = keyframes[currentKeyframe].scale[1];
      sz_prev = keyframes[currentKeyframe].scale[2];
      
      if (playAnimation) {
        // If we're playing the animation, we want to loop back to the first keyframe
        currentKeyframe = (currentKeyframe + 1) % numKeyframes;
      }
      
      if (isChangingFrame) {
        console.log("Changing frame");
        isChangingFrame = false;
        playAnimation = false;
      }
    }

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

    cube.draw(projectionMatrix, cube.modelMatrix, modelViewMatrix, normalMatrix, viewLightDirection, enableShading, cameraPosition);
    drawSelectedObject();
    requestAnimationFrame(drawScene);
  }

  drawScene();
}

main();