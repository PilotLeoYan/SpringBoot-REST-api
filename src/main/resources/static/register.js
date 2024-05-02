function modelRegister(){
    //const URL = "http://localhost:8080/models";
    const URL = "http://siiau-env-1.eba-8cxatitf.us-west-1.elasticbeanstalk.com/models";

    const modelName = document.getElementById("modelName").value;
    const modelAuthor = document.getElementById("modelAuthor").value;
    const modelTaskElement = document.querySelector('input[name="modelTask"]:checked');
    const modelSize = document.getElementById("modelSize").value;
    const modelSummary = document.getElementById("modelSummary").value;

    if(validationInput(modelName, modelAuthor, modelTaskElement, modelSize, modelSummary)){
        return
    }

    const modelNameFormatted  = formatModelName(modelName);
    const modelTask = modelTaskElement.value;
    const modelSizeFormatted = parseFloat(modelSize).toFixed(2);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    const modelObject = {
        name : modelNameFormatted,
        author : modelAuthor,
        task : modelTask,
        size : modelSizeFormatted,
        date : currentDate,
        summary : modelSummary
    };

    const requestOptions = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(modelObject)
    };

    fetch(URL, requestOptions)
        .then(response => {
            if (!response.ok){
                throw new Error('HTTP error! Status: ${response.status}');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data)
            if(data.id === -1){
                console.log('repetition')
                showAlarmError("The name \""+modelName+"\" already exists");
            }else{
                cleanScreen();
                clearAlarms();
                showAlarmSuccess("Model correctly uploaded. 👍")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })

    console.log("name:", modelName);
    console.log("name formatted:", modelNameFormatted);
    console.log("author:", modelAuthor);
    console.log("task:", modelTask);
    console.log("size:", modelSize);
    console.log("size formatted:", modelSizeFormatted)
    console.log("summary:", modelSummary);
}
function validationInput(modelName, modelAuthor, modelTask, modelSize, modelSummary){
    if (!modelName || !modelAuthor || !modelTask || !modelSize || !modelSummary) {
        showAlarmError("All fields are required.");
        return true;
    }
    if (isNaN(modelSize) || parseFloat(modelSize) <= 0) {
        showAlarmError("The model size must be a positive float number.");
        return true;
    }
    return false;
}

function formatModelName(modelName) {
    return modelName.trim().toLowerCase().replace(/\s+/g, '-');
}

function showAlarmError(message) {
    const alarmContainer = document.getElementById("alarmContainer");

    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger");
    errorDiv.textContent = message;

    alarmContainer.appendChild(errorDiv);
}

function showAlarmSuccess(message) {
    const alarmContainer = document.getElementById("alarmContainer");

    const successDiv = document.createElement("div");
    successDiv.classList.add("alert", "alert-success");
    successDiv.textContent = message;

    alarmContainer.appendChild(successDiv);
}

function clearAlarms() {
    const errorContainer = document.getElementById("alarmContainer");
    errorContainer.innerHTML = "";
}
function cleanScreen(){
    document.getElementById("modelName").value = "";
    document.getElementById("modelAuthor").value = "";
    //document.getElementById("modelTask").value = "";
    document.querySelectorAll('input[name="modelTask"]').forEach((radio) => {
        radio.checked = false;
    });
    document.getElementById("modelSize").value = "";
    document.getElementById("modelSummary").value = "";
}