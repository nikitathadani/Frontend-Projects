let contacts = [];
let editingId = null;

// Load stored contacts
document.addEventListener("DOMContentLoaded", () => {
    const stored = localStorage.getItem("contacts");
    if (stored) contacts = JSON.parse(stored);
    renderContacts();
});

// Render contacts
function renderContacts() {
    const list = document.getElementById("people");
    list.innerHTML = "";

    let sortedContacts = [...contacts];
    const sortVal = document.getElementById("sortContacts").value;
    if(sortVal === "nameAsc") sortedContacts.sort((a,b)=>a.name.localeCompare(b.name));
    if(sortVal === "nameDesc") sortedContacts.sort((a,b)=>b.name.localeCompare(a.name));
    if(sortVal === "emailAsc") sortedContacts.sort((a,b)=>a.email.localeCompare(b.email));
    if(sortVal === "emailDesc") sortedContacts.sort((a,b)=>b.email.localeCompare(a.email));

    sortedContacts.forEach(contact => {
        const node = document.createElement("div");
        node.className = "person";
        node.dataset.id = contact.id;
        node.innerHTML = `
            <img src="${contact.imageurl || 'https://via.placeholder.com/60'}">
            <div class="contactdetail">
                <h4>${contact.name} <i class="fas fa-star fav-contact" style="color:${contact.favorite? 'gold':'#ccc'}"></i></h4>
                <p>${contact.email}</p>
                <p>${contact.contactnumber}</p>
            </div>
            <button class="edit-contact"><i class="fas fa-edit"></i></button>
            <button class="delete-contact">&times;</button>
        `;
        list.appendChild(node);
    });
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Form submit (add or edit)
document.querySelector(".js-form").addEventListener("submit", e=>{
    e.preventDefault();
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("myEmail").value;
    const phone = document.getElementById("myTel").value;
    const image = document.getElementById("imgurl").value;

    if(editingId){
        contacts = contacts.map(c=>{
            if(c.id===editingId){
                return {...c, name, email, contactnumber:phone, imageurl:image};
            }
            return c;
        });
        editingId = null;
        document.getElementById("submitBtn").textContent="Add Contact";
        document.getElementById("cancelEdit").style.display="none";
        document.getElementById("formTitle").textContent="Add New Contact";
    }else{
        contacts.push({id:Date.now(), name, email, contactnumber:phone, imageurl:image, favorite:false});
    }
    renderContacts();
    e.target.reset();
});

// Cancel edit
document.getElementById("cancelEdit").addEventListener("click", ()=>{
    editingId=null;
    document.getElementById("submitBtn").textContent="Add Contact";
    document.getElementById("cancelEdit").style.display="none";
    document.getElementById("formTitle").textContent="Add New Contact";
    document.querySelector(".js-form").reset();
});

// Delete or Edit or Favorite
document.getElementById("people").addEventListener("click", e=>{
    const id = Number(e.target.closest(".person").dataset.id);
    if(e.target.closest(".delete-contact")){
        contacts = contacts.filter(c=>c.id!==id);
    }
    if(e.target.closest(".edit-contact")){
        const contact = contacts.find(c=>c.id===id);
        document.getElementById("fullName").value=contact.name;
        document.getElementById("myEmail").value=contact.email;
        document.getElementById("myTel").value=contact.contactnumber;
        document.getElementById("imgurl").value=contact.imageurl;
        editingId=id;
        document.getElementById("submitBtn").textContent="Update Contact";
        document.getElementById("cancelEdit").style.display="block";
        document.getElementById("formTitle").textContent="Edit Contact";
    }
    if(e.target.closest(".fav-contact")){
        contacts = contacts.map(c=>{
            if(c.id===id) c.favorite=!c.favorite;
            return c;
        });
    }
    renderContacts();
});

// Search
document.getElementById("search").addEventListener("input", function(){
    const query = this.value.toLowerCase();
    document.querySelectorAll(".person").forEach(c=>{
        const name = c.querySelector("h4").textContent.toLowerCase();
        const email = c.querySelector("p").textContent.toLowerCase();
        c.style.display=(name.includes(query)||email.includes(query))?"flex":"none";
    });
});

// Sort
document.getElementById("sortContacts").addEventListener("change", renderContacts);

// Dark/Light theme
const toggleSwitch=document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem("theme");
if(currentTheme) document.documentElement.setAttribute("data-theme",currentTheme);
if(currentTheme==="dark") toggleSwitch.checked=true;
toggleSwitch.addEventListener("change", e=>{
    if(e.target.checked){
        document.documentElement.setAttribute("data-theme","dark");
        localStorage.setItem("theme","dark");
    }else{
        document.documentElement.setAttribute("data-theme","light");
        localStorage.setItem("theme","light");
    }
});
