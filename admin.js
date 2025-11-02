const tableBody = document.querySelector("#menuTable tbody");
let menuData = [];

fetch("/api/menu")
  .then(res => res.json())
  .then(data => {
    menuData = data;
    renderTable();
  })
  .catch(err => console.error("Error loading menu:", err));

function renderTable() {
  tableBody.innerHTML = "";
  menuData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" value="${item.name}" data-field="name"></td>
      <td><input type="text" value="${item.category}" data-field="category"></td>
      <td><input type="text" value="${item.description}" data-field="description"></td>
      <td><input type="number" value="${item.price}" step="0.01" data-field="price"></td>
      <td><input type="text" value="${item.image}" data-field="image"></td>
      <td>
        <button class="delete" data-index="${index}">🗑 Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.getElementById("addRow").addEventListener("click", () => {
  menuData.push({
    name: "New Dish",
    category: "category",
    description: "Description",
    price: 0,
    image: "assets/new.webp"
  });
  renderTable();
});

tableBody.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const index = e.target.dataset.index;
    menuData.splice(index, 1);
    renderTable();
  }
});

document.getElementById("saveMenu").addEventListener("click", () => {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, i) => {
    const inputs = row.querySelectorAll("input");
    inputs.forEach(input => {
      menuData[i][input.dataset.field] = input.value;
    });
    menuData[i].price = parseFloat(menuData[i].price);
  });

  fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(menuData)
  })
    .then(res => res.json())
    .then(msg => alert(msg.message))
    .catch(err => alert("Error saving menu: " + err));
});
