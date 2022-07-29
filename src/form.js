import { nextIndexOf } from "./main.js";
import { arrayCars, arrayReservations, Reservation } from "./class.js";

let finalQty;
let finalTotal;

let voucherReturn;
let totalDiscount;

const errorBox = document.getElementById("errorbox");
const errorMsj = document.getElementById("errormsj");
const errorBold = document.getElementById("errorbold");

function formValidate(event) {
  event.preventDefault();

  let modelInput = document.getElementById("modelInput").value;
  let quantityInput = document.getElementById("quantityInput").value;
  
  let days;
  let voucher = document.getElementById("voucherInput").value;
  
  let startDateInput = document.getElementById("startInput").value;
  let endDateInput = document.getElementById("endInput").value;
  const splitStart = startDateInput.split('/');
  const splitEnd = endDateInput.split('/');
  console.log(splitEnd);
  const startDate = new Date(splitStart[2], splitStart[1], splitStart[0]);
  const endDate = new Date(splitEnd[2], splitEnd[1], splitEnd[0]);

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

  if ((Date.parse(startDate) >= Date.parse(endDate))) {
    errors.push(`La fecha de devolución debe ser posterior a la fecha de entrega.`);
    Toastify({
      text: `La fecha de devolución debe ser posterior a la fecha de entrega.`,
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
  } else {
    // To calculate the time difference of two dates
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    days = diffDays;

    if (isNaN(days) || days < 1) {
      errors.push(`Ingrese fechas de retiro y entrega válidas.`);
      Toastify({
          text: `Ingrese fechas de retiro y entrega válidas.`,
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
    let total = Number(reserveThis.dayprice) * days * quantityInput;
    let img = reserveThis.img;

    saveThis(name, img, quantityInput, startDate, endDate, days, dayprice, total);

    if (voucherReturn) {
      Toastify({
          text: voucherReturn,
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
    }
  } else {
    errors.forEach((e) => addErrorMsj(e, true));
  }
}

function saveThis(name, img, quantityInput, startDate, endDate, days, dayprice, total) {
  localStorage.setItem("startDate", JSON.stringify(startDate));
  localStorage.setItem("endDate", JSON.stringify(endDate));

  let id = nextIndexOf(arrayReservations);
  arrayReservations.unshift(
    new Reservation(id, name, img, quantityInput, startDate, endDate, days, dayprice, total)
  );
  console.log(
    `Agregó a tu carrito ${quantityInput} ${name} por ${days} días. Total parcial: \$${total}`
  );
 
  Toastify({
      text: `Agregó a tu carrito ${quantityInput} ${name} por ${days} días. Total parcial: \$${total}`,
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

  updateStorage();
  updateCart();
}

function applyVoucher(voucherCode) {
  switch (voucherCode) {
    case "bariloche":
      totalDiscount = finalTotal - Number(finalTotal) * 0.1;
      return `Se le aplicó el descuento "bariloche" del 10% sobre $${finalTotal}. Total final: $${totalDiscount}`;
    case "rentit2022":
      totalDiscount = finalTotal - Number(finalTotal) * 0.15;
      return `Se le aplicó el descuento "rentit" del 15% sobre $${finalTotal}. Total final: $${totalDiscount}`;
    default:
      return false;
  }
}

function addErrorMsj(msj, final = null) {
  if (errorBox.classList.contains("hidden")) {
    errorBox.classList.remove("hidden");
  }
  if (final) {
    errorBold.innerHTML = "<p>" + msj + "</p>";
  } else {
    errorMsj.innerHTML += "<p>" + msj + "</p>";
  }
}

function clearMsj() {
  if (!errorBox.classList.contains("hidden")) {
    errorBox.classList.add("hidden");
  }
  let destiny1;
  let destiny2;
  if (error) {
    destiny1 = errorBold;
    destiny2 = errorMsj;
  } else {
    destiny1 = msjFinal;
    if(!keepText) { msjMsj.innerHTML = "" }
    
  }
  
  destiny1.innerHTML = "";
  destiny1.parentElement.classList.add("hidden");
}

function loadStorageForm () {
  const storageQuantity = JSON.parse(localStorage.getItem("quantityInput"));
  let storageStartDate = JSON.parse(localStorage.getItem("startDate"));
  let storageEndDate = JSON.parse(localStorage.getItem("endDate"));

  const quantityInput = document.getElementById("quantityInput");
  let startDateInput = document.getElementById("startInput");
  let endDateInput = document.getElementById("endInput");

  if(storageQuantity) {quantityInput.value = storageQuantity};

  if(storageStartDate){
    const a = new Date(storageStartDate);
    let startDate = a.toLocaleDateString("es-ES");
    startDateInput.value = startDate
  }

  if(storageEndDate){
    const b = new Date(storageEndDate);
    let endDate = b.toLocaleDateString("es-ES");
    endDateInput.value = endDate
  }
  
}

function updateCart (){
  const cart = document.getElementById("cart");
  const jumbo = document.getElementById("jumbo");
  const cartItems = document.getElementById("cartItems");
  const finalMsj = document.getElementById("finalMsj");

  finalQty = arrayReservations.reduce((a, b) => a + b["quantity"], 0);
  finalTotal = arrayReservations.reduce((a, b) => a + b["total"], 0);

  cartItems.innerHTML = "";
  // Carga arrayReservations en el carrito
  if(arrayReservations.length > 0) { 

    if (cart.classList.contains("hidden")) {
      cart.classList.remove("hidden");
    }
    if (!jumbo.classList.contains("hidden")) {
      jumbo.classList.add("hidden");
    }
    
    arrayReservations.forEach(element => {
        const { id, carname, img, quantity, renteddays, total, startDate, endDate } = element;
        cartItems.innerHTML += 
        `
        <tr>
            <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img class="rounded-full scale-150" src="/public/img/${img}" width="40" height="40" alt="${carname}"></div>
                    <div class="font-medium text-gray-800 text-center">${carname}</div>
                </div>
            </td>
            <td class="p-2 whitespace-nowrap">
                <div class="text-center">${quantity}</div>
            </td>
            <td class="p-2 whitespace-nowrap">
                <div class="text-center" data-tooltip-target="tooltip-animation">${renteddays}</div>
                <div id="tooltip-animation" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                  Desde: ${startDate} Hasta: ${endDate}
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
                
                
            </td>
            <td class="p-2 whitespace-nowrap">
                <div class="text-center font-medium text-green-500">$ ${total}</div>
            </td>
            <td class="p-2 whitespace-nowrap">
                <div class="text-sm text-center text-red-700"><p class="remove" id="remove-${id}">Eliminar</p></div>
            </td>
        </tr> 
        `;

        const removeLink = document.getElementsByClassName("remove");

        // Eliminar elementos del carrito
        Array.from(removeLink).forEach(function (element) {
            event.preventDefault();
            element.addEventListener("click", () => {
                let selectedId = element.id;
                selectedId = selectedId.split('-')[1];
                //console.log(selectedId);
                const target = arrayReservations.find((model) => model.id === parseInt(selectedId)); 
                const index = arrayReservations.indexOf(target);
                //alert(index);
                arrayReservations.splice(index, 1);
                updateStorage();
                updateCart();

                const { quantity, carname, renteddays } = target
                Toastify({
                    text: `Elimino de su carrito ${quantity} ${carname} por ${renteddays} días.`,
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
            });
        });
      });

      if (finalTotal > 0) {
        finalMsj.innerHTML = `<p>Reservó correctamente ${finalQty} vehiculos por un total de \$${finalTotal}<p>`;
        if(voucherReturn){
          finalMsj.innerHTML += `<p>${voucherReturn}</p>`;
        }    
      } 
  } else { // Si el carrito esta vacio
    if (!cart.classList.contains("hidden")) {
      cart.classList.add("hidden");
    }
    if (jumbo.classList.contains("hidden")) {
      jumbo.classList.remove("hidden");
    }
    finalMsj.innerHTML = `<p>Su carrito está vacío<p>`; // No se ve xq se oculta
  }
  console.log(arrayReservations);
  console.log(JSON.parse(localStorage.getItem("cart")));
}

function updateStorage () {
  localStorage.setItem("finalQty", JSON.stringify(finalQty));
  localStorage.setItem("finalTotal", JSON.stringify(finalTotal));
  localStorage.setItem("cart", JSON.stringify(arrayReservations));
}

export { formValidate, clearMsj, loadStorageForm, updateCart, updateStorage }
