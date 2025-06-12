const API_URL = "http://localhost:3000/students";


function getStudents() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => renderStudents(data))
    .catch((error) => console.error("Помилка при отриманні студентів:", error));
}
 

function renderStudents(students) {
  const tableBody = document.querySelector("#students-table tbody");
  tableBody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(", ")}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? "Записаний" : "Не записаний"}</td>
      <td>
        <button onclick="updateStudent(${student.id})">Оновити</button>
        <button onclick="deleteStudent(${student.id})">Видалити</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}


function addStudent(e) {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    age: +document.getElementById("age").value,
    course: document.getElementById("course").value,
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((s) => s.trim()),
    email: document.getElementById("email").value,
    isEnrolled: document.getElementById("isEnrolled").checked,
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  })
    .then((res) => res.json())
    .then(() => {
      getStudents();
      document.getElementById("add-student-form").reset();
    })
    .catch((error) => console.error("Помилка при додаванні студента:", error));
}


function updateStudent(id) {
  const newName = prompt("Введіть нове ім’я студента:");
  if (newName) {
    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
      .then((res) => res.json())
      .then(() => getStudents())
      .catch((error) => console.error("Помилка при оновленні:", error));
  }
}


function deleteStudent(id) {
  if (confirm("Ви дійсно хочете видалити цього студента?")) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => getStudents())
      .catch((error) => console.error("Помилка при видаленні:", error));
  }
}


document
  .getElementById("get-students-btn")
  .addEventListener("click", getStudents);
document
  .getElementById("add-student-form")
  .addEventListener("submit", addStudent);
