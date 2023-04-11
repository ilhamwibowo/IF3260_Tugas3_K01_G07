export function loadFile(file, onLoad, onError) {
    // Check if the file type is JSON
    if (file.type !== "application/json") {
        onError(new Error("File is not a JSON file"));
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            // Parse the JSON string into a JavaScript object
            const jsonObject = JSON.parse(event.target.result);
            const object3D = {
                vertices : jsonObject.vertices, 
                colors : jsonObject.colors, 
                indices : jsonObject.indices, 
                normals : jsonObject.normals
            }
            onLoad(object3D);
        } catch (error) {
            onError(new Error("Error parsing JSON file: " + error.message));
        }
    };

    reader.onerror = (error) => {
        onError(error);
    };

    reader.readAsText(file);
}

