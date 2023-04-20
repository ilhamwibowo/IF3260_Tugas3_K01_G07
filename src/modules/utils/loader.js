export function loadFile(file, onLoad, onError) {
    // Check if the file type is JSON
    if (file.type !== "application/json") {
        onError(new Error("File is not a JSON file"));
        return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            // Parse the JSON string into a JavaScript object
            const jsonObject = await JSON.parse(event.target.result);
            console.log("++++++++++++++++++++++++++++++++++++");
            console.log(jsonObject);
            const object3D = {
                name : jsonObject.name,
                vertices : jsonObject.vertices, 
                colors : jsonObject.colors, 
                indices : jsonObject.indices, 
                normals : jsonObject.normals,
                tangents : jsonObject.tangents,
                bitangents : jsonObject.bitangents,
                textureCoord : jsonObject.textureCoord,
                textureMode : jsonObject.textureMode,
                children : jsonObject.children,
            };
            onLoad(object3D);
        } catch (error) {
            onError(new Error("Error parsing JSON file: " + error));
        }
    };

    reader.onerror = (error) => {
        onError(error);
    };

    reader.readAsText(file);
}

