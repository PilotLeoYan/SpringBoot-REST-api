//const URL = "http://localhost:8080/models";
const URL = "http://siiau-env-1.eba-8cxatitf.us-west-1.elasticbeanstalk.com/models";
const searchInput = document.getElementById("searchName");
let ID;

searchInput.addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    fetchDataAndPopulateTable(URL, searchTerm);
});

fetchDataAndPopulateTable(URL, '');

async function fetchDataAndPopulateTable(url, searchTerm = '') {
    console.log('searchTerm: ', searchTerm);
    try {
        //const response = await fetch(url);
        const response = await fetch(searchTerm === '' ? url : `${url}?searchTerm=${searchTerm}`);
        const models = await response.json();
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = '';

        models.forEach(currentModel => {
            if (currentModel.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${currentModel.id}</td>
                    <td>${currentModel.name}</td>
                    <td class="summary-author">${currentModel.author}</td>
                    <td>${currentModel.task}</td>
                    <td>${currentModel.size}</td>
                    <td>${currentModel.date}</td>
                    <td class="summary-column">${currentModel.summary}</td>
                    <td><button type="button" id="${currentModel.id}" class="btn btn-info edit-button" onclick="editStudent(id)">Edit</button></td>
                `;
                row.setAttribute("id", currentModel.id);
                tableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

function editStudent(id) {
    let currentRow = document.getElementById(id);

    currentRow.setAttribute("class", "text-bg-dark");

    let modelName = currentRow.children.item(1).textContent;
    let modelAuthor = currentRow.children.item(2).textContent;
    let modelTask = currentRow.children.item(3).textContent;
    let modelSize = currentRow.children.item(4).textContent;
    let modelDate = currentRow.children.item(5).textContent;
    let modelSummary = currentRow.children.item(6).textContent;

    console.log('id: ', id);
    console.log('modelName: ', modelName);
    console.log('modelAuthor: ', modelAuthor);
    console.log('modelTask: ', modelTask);
    console.log('modelSize: ', modelSize);
    console.log('modelDate: ', modelDate);
    console.log('modelSummary: ', modelSummary);

    fillEditForm(modelName, modelAuthor, modelTask, modelSize, modelDate, modelSummary);
    ID = id;
}

function fillEditForm(modelName, modelAuthor, modelTask, modelSize, modelDate, modelSummary){
    //no cambiar esto, no se puede factorizar
    const editForm = document.getElementById("editForm");
    editForm.classList.remove("d-none");

    document.getElementById("modelNameForm").value = modelName;
    document.getElementById("modelNameForm").focus();
    document.getElementById("modelAuthorForm").value = modelAuthor;
    switch(modelTask){
        case "multimodal":
            document.getElementById('taskOption1').checked = true;
            break;
        case "cv":
            document.getElementById('taskOption2').checked = true;
            break;
        case "nlp":
            document.getElementById('taskOption3').checked = true;
            break;
        case "audio":
            document.getElementById('taskOption4').checked = true;
            break;
        case "tabular":
            document.getElementById('taskOption5').checked = true;
            break;
        case "reinforcement":
            document.getElementById('taskOption6').checked = true;
            break;
        default:
            document.getElementById('taskOption7').checked = true;
            break;
    }
    document.getElementById("modelSizeForm").value = modelSize;
    document.getElementById("modelSummaryForm").value = modelSummary;
}

function cancelEditForm(){
    const editForm = document.getElementById("editForm");
    editForm.classList.add("d-none");

    document.getElementById("modelNameForm").value = "";
    document.getElementById("modelAuthorForm").value = "";
    //document.getElementById("modelTask").value = "";
    document.querySelectorAll('input[name="modelTaskForm"]').forEach((radio) => {
        radio.checked = false;
    });
    document.getElementById("modelSizeForm").value = "";
    document.getElementById("modelSummaryForm").value = "";
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

function submitForm(){
    const modelName = document.getElementById("modelNameForm").value;
    const modelAuthor = document.getElementById("modelAuthorForm").value;
    const modelTaskElement = document.querySelector('input[name="modelTaskForm"]:checked');
    const modelSize = document.getElementById("modelSizeForm").value;
    const modelSummary = document.getElementById("modelSummaryForm").value;

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
        id : ID,
        name : modelNameFormatted,
        author : modelAuthor,
        task : modelTask,
        size : modelSizeFormatted,
        date : currentDate,
        summary : modelSummary
    };

    const requestOptions = {
        method : 'PUT',
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
            clearAlarms();
            cancelEditForm();
            showAlarmSuccess("Model correctly edited. 👍")
            fetchDataAndPopulateTable(URL, '');
        })
        .catch(error => {
            console.error('Error:', error);
        })
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

function deleteForm(){
    const deleteUrl = URL + "/" + ID;
    fetch(deleteUrl,{
        method: 'DELETE',
        headers: {
            'content-Type': 'application/json'
        },
    })
        .then(response =>{
            if(!response.ok){
                throw new Error("Network response is not ok");
            }
            return response;
        })
        .then(data=>{
            console.log("deleted succesfully: "+data)
            clearAlarms();
            cancelEditForm();
            showAlarmSuccess("Model correctly deleted ♻");
            fetchDataAndPopulateTable(URL, '');
        })
        .catch(error=>{
            console.log("fetch operation fail: ",error)
            showAlarmError("fetch operation fail. Because? I don't know.");
        });
}

function deleteModelButton(){
    if(confirm("Delete the model? ID = " + ID)){
        deleteForm();
    } else {
        console.log("No changes were made to the student.");
    }
}