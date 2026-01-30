let trackingData = JSON.parse(localStorage.getItem("trackingData")) || {};
let totalMaterialsCount = 0;
    let transactionsCount = 0;
    let activebuyersCount=0;
    let activeSuppliersCount = 0;
    let totalQuantity = 0;
    let totalSales = 0;
    
   
    // BUYER NOTIFICATIONS
function getBuyerNotes(){
  return JSON.parse(localStorage.getItem("buyerNotifications")) || [];
}
function saveBuyerNotes(arr){
  localStorage.setItem("buyerNotifications", JSON.stringify(arr));
}

// SUPPLIER NOTIFICATIONS
function getSupplierNotes(){
  return JSON.parse(localStorage.getItem("supplierNotifications")) || [];
}
function saveSupplierNotes(arr){
  localStorage.setItem("supplierNotifications", JSON.stringify(arr));
}

        function signup() {
    let email = document.getElementById("newEmail").value;
    let pass = document.getElementById("newPassword").value;
    
    
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", pass);
  
    alert("Signup Successful");
    window.location = "login.html";
  }
  
  function login(){

    let profile = {
      name: document.getElementById("loginName").value,
      email: document.getElementById("loginEmail").value,
      phone: document.getElementById("loginPhone").value,
      location: document.getElementById("loginLocation").value
    };
  
    localStorage.setItem("userProfile", JSON.stringify(profile));
  
    window.location = "role.html"; // or dashboard
  }
  
  
  function logout() {
    window.location = "login.html";
  }
  function openModal(text){
    document.getElementById("modalText").innerText = text;
    document.getElementById("modal").style.display = "flex";
  }
  
  function closeModal(){
    document.getElementById("modal").style.display = "none";
  }
  function showLoader(){ document.getElementById("loader").style.display="block"; }
function hideLoader(){ document.getElementById("loader").style.display="none"; }
function showToast(msg){
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(()=> t.style.display="none", 2000);
  }
  function searchTable(){
    let input = document.getElementById("buyerSearch").value.toLowerCase();
    let table = document.getElementById("materialTable");
    let rows = table.getElementsByTagName("tr");
  
    for(let i = 1; i < rows.length; i++){
      let materialCell = rows[i].getElementsByTagName("td")[0];
  
      if(materialCell){
        let txt = materialCell.innerText.toLowerCase();
        rows[i].style.display = txt.includes(input) ? "" : "none";
      }
    }
  }
  
  setInterval(()=>{
    let t = document.getElementById("time");
    if(t){
      t.innerText = new Date().toLocaleString();
    }
  },1000);
  
  function confirmAction(){
    openModal("Are you sure?");
  }
  
  
    function addMaterial(){

      let m = document.getElementById("material").value;
      let q = document.getElementById("quantity").value;
      let l = document.getElementById("location").value;
      let p = document.getElementById("price").value;
      let id = Date.now(); // unique id

      trackingData[id] = ["Listed"];
      localStorage.setItem("trackingData", JSON.stringify(trackingData));
      
      if(!m || !q || !l || !p){
        showToast("Fill all fields");
        return;
      }
      let profile = JSON.parse(localStorage.getItem("userProfile")) || {};

let name = profile.name || "Supplier";
let location = profile.location || "Unknown";

let buyerNotes = getBuyerNotes();

buyerNotes.push(`${name} listed ${m} in ${location}`);

saveBuyerNotes(buyerNotes);


      
      let table = document.getElementById("materialTable");
    
      let row = table.insertRow();
      row.innerHTML = `
        <td>${m}</td>
        <td>${q} kg</td>
        <td>${l}</td>
        <td>₹${p}</td>
        <td><span class="badge">Fair</span></td>
       <td><button onclick="trackMaterial(${id})">Track</button></td>

      <td><button onclick="openProfile()">View Seller</button></td>
`;
    
      updateMap(l);
      showToast("Material Listed Successfully");
    
      // REAL TIME DASHBOARD
      totalMaterialsCount++;
      let tm = document.getElementById("totalMaterials");
if(tm) tm.innerText = totalMaterialsCount;
    
      transactionsCount++;
      let tr = document.getElementById("transactions");
if(tr) tr.innerText = transactionsCount;

      let buyers = Math.floor(Math.random()*10) + 5;
      let ab = document.getElementById("activeBuyers");
if(ab) ab.innerText = buyers;
activeSuppliersCount++;
let as = document.getElementById("activeSuppliers");
if(as) as.innerText = activeSuppliersCount;

    // Active Suppliers Update

// TOTAL QUANTITY
totalQuantity += parseInt(q);
let qtyEl = document.getElementById("totalQty");
if(qtyEl) qtyEl.innerText = totalQuantity + " kg";

// TOTAL SALES
totalSales += parseInt(p);
let salesEl = document.getElementById("totalSales");
if(salesEl) salesEl.innerText = "₹" + totalSales;
fetch("http://localhost:3000/materials", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    material: m,
    qty: q,
    location: l,
    price: p
  })
});
}
    
  
  


;
  
  
  
  
  
  function trackMaterial(id){
    let data = JSON.parse(localStorage.getItem("trackingData")) || {};
    let steps = data[id] || [];
  
    let text = steps.join(" → ");
    openModal(text);
  }
  
  
  function analyzeImage(){
    let file = document.getElementById("photoUpload").files[0];
    if(!file){
      showToast("Upload Image First");
      return;
    }
  
    let preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(file);
  
    // Fake AI logic
    let types = [
      "Plastic",
      "Paper",
      "Metal",
      "Glass",
      "E-Waste",
      "Rubber",
      "Textile",
      "Organic Waste",
      "Cardboard",
      "Aluminium"
    ];
    
    let grades = ["Grade A", "Grade B", "Grade C"];
  
    let type = types[Math.floor(Math.random()*types.length)];
    let grade = grades[Math.floor(Math.random()*grades.length)];
  
    document.getElementById("aiResult").innerHTML =
      `Detected: <b>${type}</b> | Quality: <b>${grade}</b>`;
  }function suggestPrice(){
    let material = document.getElementById("material").value.toLowerCase();
    let qty = parseInt(document.getElementById("quantity").value);
  
    if(!material || !qty){
      return;
    }
  
    // Average market prices per kg
    let priceMap = {
      plastic: 15,
      paper: 8,
      metal: 30,
      glass: 6,
      "e-waste": 40,
      rubber: 12,
      textile: 10,
      organic: 3,
      cardboard: 7,
      aluminium: 35
    };
    
  
    let rate = priceMap[material] || 10; // default
    let total = rate * qty;
  
    document.getElementById("priceSuggestion").innerHTML =
      `AI Fair Price Suggestion: ₹${total}`;
  }
  
  function updateMap(location){
    document.getElementById("mapFrame").src =
      `https://www.google.com/maps?q=${location}&output=embed`;
  }
  let map = L.map('map').setView([19.0760, 72.8777], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const fields = ["material", "quantity", "location", "price", "submitBtn"];

fields.forEach((id, index) => {
  let el = document.getElementById(id);

  if(!el) return;

  el.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      e.preventDefault(); // stop form submit

      let next = document.getElementById(fields[index + 1]);
      if(next){
        next.focus();
      }
    }
  });
});
window.onload = function(){
  let first = document.getElementById("material");
  if(first) first.focus();
};
function showSupplier(){
  document.getElementById("supplierPanel").style.display = "block";
  document.getElementById("buyerPanel").style.display = "none";
}

function showBuyer(){
  document.getElementById("supplierPanel").style.display = "none";
  document.getElementById("buyerPanel").style.display = "block";
}
function selectRole(role){
  localStorage.setItem("userRole", role);

  if(role === "supplier"){
    window.location = "supplier.html";
  } else {
    window.location = "buyer.html";
  }
}
function purchaseMaterial(material, qty, price){

  let profile = JSON.parse(localStorage.getItem("userProfile")) || {};
  let orders = getOrders();

  orders.push({
    id: Date.now(),
    material,
    qty,
    price,
    buyer: profile.name,
    status: "Requested"
  });

  saveOrders(orders);

  showToast("Order Placed");
  fetch("http://localhost:3000/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      material,
      qty,
      price,
      buyer: profile.name
    })
  });
  
}

function loadNotifications(){
  let list = document.getElementById("notificationList");
  if(!list) return;

  let notes = JSON.parse(localStorage.getItem("notifications")) || [];
  list.innerHTML = "";

  notes.slice(-5).reverse().forEach(n=>{
    let li = document.createElement("li");
    li.innerText = n;
    list.appendChild(li);
  });
}

window.onload = function(){
  loadNotifications();
};
function loadBuyerNotifications(){
  let list = document.getElementById("notificationList");
  if(!list) return;

  let notes = getBuyerNotes();
  list.innerHTML = "";

  notes.slice(-5).reverse().forEach(n=>{
    let li = document.createElement("li");
    li.innerText = n;
    list.appendChild(li);
  });
}

function loadSupplierNotifications(){
  let list = document.getElementById("notificationList");
  if(!list) return;

  let notes = getSupplierNotes();
  list.innerHTML = "";

  notes.slice(-5).reverse().forEach(n=>{
    let li = document.createElement("li");
    li.innerText = n;
    list.appendChild(li);
  });
}
function saveProfile(){
  let profile = {
    name: document.getElementById("profileName").value,
    email: document.getElementById("profileEmail").value,
    phone: document.getElementById("profilePhone").value,
    location: document.getElementById("profileLocation").value
  };

  localStorage.setItem("userProfile", JSON.stringify(profile));
  showToast("Profile Saved");
}

function loadProfile(){
  let profile = JSON.parse(localStorage.getItem("userProfile"));
  if(!profile) return;

  document.getElementById("profileName").value = profile.name || "";
  document.getElementById("profileEmail").value = profile.email || "";
  document.getElementById("profilePhone").value = profile.phone || "";
  document.getElementById("profileLocation").value = profile.location || "";
}
function openProfile(){
  let p = JSON.parse(localStorage.getItem("userProfile"));
  if(!p) return;

  document.getElementById("pName").innerText = "Name: " + p.name;
  document.getElementById("pEmail").innerText = "Email: " + p.email;
  document.getElementById("pPhone").innerText = "Phone: " + p.phone;
  document.getElementById("pLocation").innerText = "Location: " + p.location;

  document.getElementById("profileModal").style.display = "flex";
  loadOrders();
}

function closeProfile(){
  document.getElementById("profileModal").style.display = "none";
}
function getOrders(){
  return JSON.parse(localStorage.getItem("orders")) || [];
}
function saveOrders(arr){
  localStorage.setItem("orders", JSON.stringify(arr));
}
function loadOrders(){
  let list = document.getElementById("orderList");
  if(!list) return;

  let orders = getOrders();
  list.innerHTML = "";

  orders.slice(-5).reverse().forEach(o=>{
    let li = document.createElement("li");
    li.innerHTML = `
    ${o.material} – ₹${o.price} – ${o.status}
    <button onclick="trackOrder(${o.id})">Track</button>
  `;
  
    list.appendChild(li);
  });
}
function trackOrder(id){
  let orders = getOrders();
  let order = orders.find(o => o.id === id);

  openModal(`Order Status: ${order.status}`);
}
function loadMaterialsFromBackend(){
  fetch("http://localhost:3000/materials")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // later you can fill table here
  });
}
function loadMaterialsFromBackend(){
  fetch("http://localhost:3000/materials")
    .then(res => res.json())
    .then(data => {
      console.log(data);   // later you can fill table here
    })
    .catch(err => console.log(err));
}
