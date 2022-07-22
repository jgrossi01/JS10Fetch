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
    let img = reserveThis.img;

    saveThis(name, img, quantityInput, daysInput, dayprice, total);

    if (voucherReturn) {
      /* addMsj(voucherReturn, true); */
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
    } else {
      /* addMsj(
        `Reservó correctamente ${finalQty} vehiculos por un total de \$${finalTotal}`,
        true
      ); */
    }
  } else {
    errors.forEach((e) => addErrorMsj(e, true));
  }
}

function saveThis(name, img, quantityInput, daysInput, dayprice, total) {
  localStorage.setItem("quantityInput", JSON.stringify(quantityInput));
  localStorage.setItem("daysInput", JSON.stringify(daysInput));

  let id = nextIndexOf(arrayReservations);
  arrayReservations.push(
    new Reservation(id, name, img, quantityInput, daysInput, dayprice, total)
  );
  console.log(
    `Agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`
  );
  /* addMsj(
    `Agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`,
    false
  ); */
  Toastify({
      text: `Agregó a tu carrito ${quantityInput} ${name} por ${daysInput} días. Total parcial: \$${total}`,
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
  
  clearMsj(true);

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

function loadStorageForm () {
  const storageQuantity = JSON.parse(localStorage.getItem("quantityInput"));
  const storageDays = JSON.parse(localStorage.getItem("daysInput"));
  const quantityInput = document.getElementById("quantityInput");
  const daysInput = document.getElementById("daysInput");

  if(storageQuantity) {quantityInput.value = storageQuantity};
  if(storageDays) {daysInput.value = storageDays};
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
        const { id, carname, img, quantity, renteddays, total } = element;
        cartItems.innerHTML += `
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
                                        <div class="text-center">${renteddays}</div>
                                    </td>
                                    <td class="p-2 whitespace-nowrap">
                                        <div class="text-center font-medium text-green-500">$ ${total}</div>
                                    </td>
                                    <td class="p-2 whitespace-nowrap">
                                        <div class="text-sm text-center text-red-700"><a href="#" class="remove" id="remove-${id}">Eliminar</a></div>
                                    </td>
                                </tr> 
        `;

        const removeLink = document.getElementsByClassName("remove");

        // Eliminar elementos del carrito
        Array.from(removeLink).forEach(function (element) {
            event.preventDefault();
            element.addEventListener("click", () => {
                let selectedId = element.id;
                selectedId = selectedId.split('-')[1]
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

        /* addMsj(`Se agregó a tu carrito ${element.quantity} ${element.carname} por ${element.renteddays} días. Total parcial: ${element.total}`,false);
        addMsj(`Reservó correctamente ${storageFinalQuantity} vehiculos por un total de \$${storageFinalTotal}`,true); */
      })

      
      if (finalTotal > 0) {
        
        finalMsj.innerHTML = `<p>Reservó correctamente ${finalQty} vehiculos por un total de \$${finalTotal}<p>`;
        if(voucherReturn){
          finalMsj.innerHTML += `<p>${voucherReturn}</p>`;
        }
        
      } 
  } else {
    // Si el carrito esta vacio
    if (!cart.classList.contains("hidden")) {
      cart.classList.add("hidden");
    }
    if (jumbo.classList.contains("hidden")) {
      jumbo.classList.remove("hidden");
    }
    //finalMsj.innerHTML = `<p>Su carrito está vacío<p>`;
  }
  console.log(arrayReservations);
  console.log(JSON.parse(localStorage.getItem("cart")));
}

function updateStorage () {
  localStorage.setItem("finalQty", JSON.stringify(finalQty));
  localStorage.setItem("finalTotal", JSON.stringify(finalTotal));
  localStorage.setItem("cart", JSON.stringify(arrayReservations));
}

export { formValidate, addMsj, clearMsj, loadStorageForm, updateCart, updateStorage};
