import { isPowerOf2 } from "./utils/helper.js";

export function toTextureMode(texture) {
    switch (texture) {
        case "image":
            return 0;
        case "environment":
            return 1;
        case "bump":
            return 2;
        default:
            return -1;
    }
}

export function fromTextureMode(mode) {
    switch (mode) {
        case 0:
            return "image";
        case 1:
            return "environment";
        case 2:
            return "bump";
        default:
            return "none";
    }
}

export class TEXTURE_MAP {
    static environment(gl) {
        let texture = gl.createTexture()

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)

        const faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: './assets/pos-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: './assets/neg-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: '../assets/pos-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: './assets/neg-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: './assets/pos-z.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: './assets/neg-z.jpg',
            },
        ];

        faceInfos.forEach((faceInfo) => {
            const { target, url } = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // Setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Aynchronously load an image
            const image = new Image ();
            image.src = url;
            image.crossOrigin = "";
            image.addEventListener('load', function () {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        return texture;
    }

    static image(gl) {
        const url = "./assets/sun.jpg";

        return TEXTURE_MAP.loadTexture2D(gl, url)
    }
    static loadTexture2D(gl, url) {
        // create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // fill the texture with 1x1 blue pixel
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 0, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

        // Asynchornously load an image
        var image = new Image();
        image.src = url;
        image.crossOrigin = "";
        image.addEventListener('load', function () {
            // now that the image has loaded make copy it to the texture
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            // check if the image is a power of 2 in both dmensions.
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                // generate mips
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // turn off mips and set and set wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T), gl.CLAMP_TO_EDGE;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        });
        return texture;
    }
}