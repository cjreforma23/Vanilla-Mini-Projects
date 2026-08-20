const input = document.getElementById("myInput");
const addBtn = document.getElementById("addBtn");  
const list = document.getElementById("myList");

addBtn.addEventListener("click", function(){
    const taskText = input.value;

    const li = document.createElement("li");
    li.textContent = taskText;
     list.appendChild(li);
     input.value = "";
});