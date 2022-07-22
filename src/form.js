import { nextIndexOf } from "./main.js";
import { arrayCars, arrayReservations, Reservation } from "./class.js";


let finalQty;
let finalTotal;

let voucherReturn;
let totalDiscount;

const msjBox = document.getElementById("msj");
const msjMsj = document.getElementById("msjmsj");
const msjFinal = document.getElementById("msjfinal");

const errorMsjBox = document.getElementById("errormsj");
const errorMsjMsj = document.getElementById("errormsjmsj");
const errorMsjFinal = document.getElementById("errormsjfinal");

function formValidate(event) {
  event.preventDefault();

  let modelInput = document.getElementById("modelInput").value;
  let quantityInput = document.getElementById("quantityInput").value;
  let daysInput = document.getElementById("daysInput").value;
  let voucher = document.getElementById("voucherInput").value;

  const errors = [];
  let reserveThis;

  if (modelInput) {
    modelInput = modelInput.toLowerCase();
    reserveThis = arrayCars.find(
      (model) => model.name.toLowerCase() === modelInput
    );

    if (!reserveThis) {
      errors.push("No encontramos el modelo solicitado");
      Toastify({
          text: "No encontramos el modelo solicitado",
          duration: 3000,
          stopOnFocus: true,
          close: true,
          style: {
            background: "linear-gradient(90deg, rgba(163,27,15,1) 0%, rgba(255,98,0,1) 100%)",
          },
          offset: {
            x: 300,
            y: 30 
          },
          gravity: 'bottom'
      }).showToast();
    }
  }

  if (!quantityInput || isNaN(quantityInput) || quantityInput < 1) {
    errors.push(`Ingrese una cantidad de vehiculos valida.`);
    Toastify({
        text: `Ingrese una cantidad de vehiculos valida.`,
        duration: 3000,
        stopOnFocus: true,
        close: true,
        style: {
          background: "linear-gradient(90deg, rgba(163,27,15,1) 0%, rgba(255,98,0,1) 100%)",
        },
        offset: {
          x: 300,
          y: 30 
        },
        gravity: 'bottom'
    }).showToast();
  }

  if (!daysInput || isNaN(daysInput) || daysInput < 1) {
    errors.push(`Ingrese una cantidad de días válida.`);
    Toastify({
        text: `Ingrese una cantidad de días válida.`,
        duration: 3000,
        stopOnFocus: true,
        close: true,
        style: {
          background: "linear-gradient(90deg, rgba(163,27,15,1) 0%, rgba(255,98,0,1) 100%)",
        },
        offset: {
          x: 300,
          y: 30 
        },
        gravity: 'bottom'
    }).showToast();
  }

  if (voucher) {
    voucherReturn = applyVoucher(voucher);
    if (!voucherReturn) {
      clearMsj(false,true);
      Toastify({
          text: `No encontramos el cupón ingresado.`,
          duration: 3000,
          stopOnFocus: true,
          close: true,
          style: {
            background: "linear-gradient(90deg, rgba(163,27,15,1) 0%, rgba(255,98,0,1) 100%)",
          },
          offset: {
            x: 300,
            y: 30 
          },
          gravity: 'bottom'
      }).showToast();
      errors.push(`No encontramos el cupón ingresado.`);
    }
  }

  if (errors.length === 0) {
    let name = reserveThis.name;
    let dayprice = reserveThis.dayprice;
    let total = Number(reserveThis.dayprice) * daysInput * quantityInput;

    saveThis(name, quantityInput, daysInput, dayprice, total);

    if (voucherReturn) {
      addMsj(voucherReturn, true);
      Toastify({
          text: voucherReturn,
          duration: 3000,
          stopOnFocus: true,
          close: true,
          style: {
            background: "linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)",
          },
          offset: {
            x: 300,
            y: 30
          },
          gravity: 'bottom'
      }).showToast();
    } else {
      addMsj(
        `Reservó correctamente ${finalQty} vehiculos por un total de \$${finalTotal}`,
        true
      );
    }
  } else {
    errors.forEach((e) => addErrorMsj(e, true));
  }
}

function saveThis(name, quantityInput, daysInput, dayprice, total) {
  localStorage.setItem("quantityInput", JSON.stringify(quantityInput));
  localStorage.setItem("daysInput", JSON.stringify(daysInput));

  let id = nextIndexOf(arrayReservations);
  arrayReservations.push(
    new Reservation(id, name, quantityInput, daysInput, dayprice, total)
  );
  console.log(
    `Se agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`
  );
  addMsj(
    `Se agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`,
    false
  );
  Toastify({
      text: `Se agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`,
      duration: 3000,
      stopOnFocus: true,
      close: true,
      style: {
        background: "linear-gradient(to right, rgb(99 181 79), rgb(150, 201, 61))",
      },
      offset: {
        x: 300, 
        y: 30 
      },
      gravity: 'bottom'
  }).showToast();

  console.log(arrayReservations);
  finalQty = arrayReservations.reduce((a, b) => a + b["quantity"], 0);
  finalTotal = arrayReservations.reduce((a, b) => a + b["total"], 0);

  localStorage.setItem("finalQty", JSON.stringify(finalQty));
  localStorage.setItem("finalTotal", JSON.stringify(finalTotal));
  localStorage.setItem("cart", JSON.stringify(arrayReservations));
  clearMsj(true);
}

function applyVoucher(voucherCode) {
  switch (voucherCode) {
    case "bariloche":
      totalDiscount = finalTotal - Number(finalTotal) * 0.1;
      return `Se le aplicó el descuento "bariloche" del 10% sobre $${finalTotal}. Su monto a pagar es de $${totalDiscount}`;
    case "rentit2022":
      totalDiscount = finalTotal - Number(finalTotal) * 0.15;
      return `Se le aplicó el descuento "rentit" del 15% sobre $${finalTotal}. Su monto a pagar es de $${totalDiscount}`;
    default:
      return false;
  }
}

function addErrorMsj(msj, final = null) {
  if (errorMsjBox.classList.contains("hidden")) {
    errorMsjBox.classList.remove("hidden");
  }

  if (final) {
    errorMsjFinal.innerHTML = "<p>" + msj + "</p>";
  } else {
    errorMsjMsj.innerHTML += "<p>" + msj + "</p>";
  }
}

function addMsj(msj, final = null) {
  if (msjBox.classList.contains("hidden")) {
    msjBox.classList.remove("hidden");
  }

  if (final) {
    msjFinal.innerHTML = "<p>" + msj + "</p>";
  } else {
    msjMsj.innerHTML += "<p>" + msj + "</p>";
  }
}

function clearMsj(error = null, keepText = true) {
  let destiny1;
  let destiny2;
  if (error) {
    destiny1 = errorMsjFinal;
    destiny2 = errorMsjMsj;
  } else {
    destiny1 = msjFinal;
    if(!keepText) { msjMsj.innerHTML = "" }
    
  }
  
  destiny1.innerHTML = "";
  destiny1.parentElement.classList.add("hidden");
}

export { formValidate, addMsj, clearMsj };
