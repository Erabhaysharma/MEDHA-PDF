const browseBtn = document.getElementById("browseBtn");
const pdfFile = document.getElementById("pdfFile");
const fileName = document.getElementById("fileName");
const dropZone = document.getElementById("dropZone");

const uploadForm = document.getElementById("uploadForm");

const uploadCard = document.getElementById("uploadCard");
const loadingCard = document.getElementById("loadingCard");

browseBtn.addEventListener("click", () => {
    pdfFile.click();
});

pdfFile.addEventListener("change", () => {

    if(pdfFile.files.length > 0){
        fileName.textContent =
            pdfFile.files[0].name;
    }

});

dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
});

dropZone.addEventListener("drop",(e)=>{

    e.preventDefault();

    pdfFile.files = e.dataTransfer.files;

    if(pdfFile.files.length > 0){
        fileName.textContent =
            pdfFile.files[0].name;
    }

});

uploadForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    if(pdfFile.files.length === 0){

        alert("Please select a PDF");
        return;
    }

    uploadCard.classList.add("hidden");
    loadingCard.classList.remove("hidden");

    const formData = new FormData();

    formData.append(
        "pdf",
        pdfFile.files[0]
    );

    try{

        const response = await fetch(
            "/upload",
            {
                method:"POST",
                body:formData
            }
        );

        const data = await response.json();

        if(data.success){

            window.location.href="/chat";

        }else{

            alert(data.message);

            loadingCard.classList.add("hidden");
            uploadCard.classList.remove("hidden");
        }

    }catch(error){

        alert("Upload Failed");

        loadingCard.classList.add("hidden");
        uploadCard.classList.remove("hidden");
    }

});
function toggleDeveloper(){

    const content =
        document.getElementById("developerContent");

    const icon =
        document.getElementById("developerIcon");

    content.classList.toggle("active");

    icon.innerHTML =
        content.classList.contains("active")
        ? "✕"
        : "+";
}


function toggleWorkflow(){

    const content =
        document.getElementById("workflowContent");

    const icon =
        document.getElementById("workflowIcon");

    content.classList.toggle("active");

    icon.innerHTML =
        content.classList.contains("active")
        ? "✕"
        : "+";
}