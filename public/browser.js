

function itemTemplate(iitem)
{
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${iitem.toDotext}</span>
    <div>
      <button data-id="${iitem._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${iitem._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

//INITIAL PAGE LOAD
let ourHTML=myitems.map(function(item)
{
    return itemTemplate(item);
}).join('');
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML);

//CREATE
let createField=document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit",function(e)
{
    e.preventDefault();

    axios.post('/create-item',{text:createField.value}).then(function(response)
    {
        document.getElementById('item-list').insertAdjacentHTML("beforeend",itemTemplate(response.data));
        createField.value="";
        createField.focus();
    })
})





document.addEventListener("click",function(e){
    //UPDATE 
    if(e.target.classList.contains("edit-me")){
        let newUserTodo=prompt("What is your new TODO?",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        if(newUserTodo)
        {
            axios.post('/update-item',{toDotext:newUserTodo, newId:e.target.getAttribute("data-id")}).then(function()
        {
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=newUserTodo;
        }).catch(function()
        {
            console.log("Please TryAgain")
        })
        }
    }

    //DELETE
    if(e.target.classList.contains("delete-me")){
        if(confirm("Do you really want to delete this permanently?")){
            axios.post('/delete-item',{newId:e.target.getAttribute("data-id")}).then(function()
            {
                e.target.parentElement.parentElement.remove();
            }).catch(function()
            {
                console.log("Deleted Successfully!");
            })
        }
    }
})