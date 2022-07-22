import { formValidate, clearMsj, loadStorageForm, updateCart, updateStorage } from "./form.js";
import { createSelect, loadCards } from "./content.js";
import { arrayCars, arrayReservations } from "./class.js";

window.addEventListener("DOMContentLoaded", (event) => {

    //Carga tarjetas desde JSON y crea lista para formulario
    fetch("./cars.json")
    .then((response) => response.json())
    .then((data) => {
      loadCards(data);
      createSelect(data);
    })  

  const daysInput = document.getElementById("daysInput");
  // Se puede usar document.querySelector('#daysInput')
  const quantityInput = document.getElementById("quantityInput");
  const clearFormBtn = document.getElementById("clearFormBtn");
  const bookingForm = document.getElementById("bookingForm");
  

  //createSelect(arrayCars);
  //loadCards(arrayCars); 
  loadStorageForm();
  updateCart();

});

// Cuando se deja de escribir se guarda el nuevo valor en el storage
daysInput.addEventListener("keyup", () => {
  localStorage.setItem("daysInput", JSON.stringify(daysInput.value));
});

// Cuando se deja de escribir se guarda el nuevo valor en el storage
quantityInput.addEventListener("keyup", () => {
  localStorage.setItem("quantityInput", JSON.stringify(quantityInput.value));
});

// El boton limpiar quita los valores del campo y del storage
clearFormBtn.addEventListener("click", () => {
  localStorage.clear();
  bookingForm.reset();
  arrayReservations.length = 0;
  updateStorage();
  updateCart();
});

// Ejecutamos la validacion del forumlario al ser enviado
bookingForm.addEventListener("submit", formValidate);

function nextIndexOf(array) {
  return array.length + 1;
}

export { nextIndexOf };
