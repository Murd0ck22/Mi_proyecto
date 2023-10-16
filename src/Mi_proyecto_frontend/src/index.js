import { Mi_proyecto_backend } from "../../declarations/Mi_proyecto_backend";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
// Variables y Selectores
var formulario = document.getElementById('agregar-gasto');
var gastosListado = document.querySelector('#gastos ul');
var presupuestoButton = document.querySelector('.presupuesto-btn');
var presupuestoInput = document.querySelector('#presupuesto-main');
var formContent = document.querySelector('#formulario');
// Eventos
eventListeners();
function eventListeners() {
  presupuestoButton === null || presupuestoButton === void 0 ? void 0 : presupuestoButton.addEventListener('click', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
  gastosListado.addEventListener('click', eliminarGasto);
}
// Classes
var Presupuesto = /** @class */ (function () {
  function Presupuesto(presupuesto) {
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
      this.gastos = [];
  }
  Presupuesto.prototype.nuevoGasto = function (gasto) {
      this.gastos = __spreadArray(__spreadArray([], this.gastos, true), [gasto], false);
      this.calcularRestante();
  };
  Presupuesto.prototype.eliminarGasto = function (id) {
      this.gastos = this.gastos.filter(function (gasto) { return gasto.id.toString() !== id; });
      this.calcularRestante();
  };
  Presupuesto.prototype.calcularRestante = function () {
      var gastado = this.gastos.reduce(function (total, gasto) { return total + gasto.cantidad; }, 0);
      this.restante = this.presupuesto - gastado;
  };
  return Presupuesto;
}());
var UI = /** @class */ (function () {
  function UI() {
  }
  UI.prototype.insertarPresupuesto = function (cantidad) {
      document.querySelector('#total').textContent = cantidad.presupuesto.toString();
      document.querySelector('#restante').textContent = cantidad.restante.toString();
  };
  UI.prototype.imprimirAlerta = function (mensaje, tipo) {
      // Crea el div
      var divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert');
      // Si es de tipo error agrega una clase
      if (tipo === "error") {
          divMensaje.classList.add('alert-danger');
      }
      else {
          divMensaje.classList.add('alert-success');
      }
      // Mensaje de error
      divMensaje.textContent = mensaje;
      // Insertar en el DOM
      document.querySelector('.primario').insertBefore(divMensaje, formulario);
      // Quitar el alert despues de 3 segundos
      setTimeout(function () {
          document.querySelector('.primario .alert').remove();
      }, 3000);
  };
  // Inserta los gastos a la lista 
  UI.prototype.agregarGastoListado = function (gastos) {
      // Limpiar HTML
      this.limpiarHTML();
      // Iterar sobre los gastos 
      gastos.forEach(function (gasto) {
          var nombre = gasto.nombre, cantidad = gasto.cantidad, id = gasto.id;
          // Crear un LI
          var nuevoGasto = document.createElement('li');
          nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
          nuevoGasto.dataset.id = id.toString();
          // Insertar el gasto
          nuevoGasto.innerHTML = "\n                ".concat(nombre, "\n                <span class=\"badge badge-primary badge-pill\">$ ").concat(cantidad, "</span>\n            ");
          // boton borrar gasto.
          var btnBorrar = document.createElement('button');
          btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
          btnBorrar.textContent = 'Borrar';
          nuevoGasto.appendChild(btnBorrar);
          // Insertar al HTML
          gastosListado.appendChild(nuevoGasto);
      });
  };
  // Comprueba el presupuesto restante
  UI.prototype.actualizarRestante = function (restante) {
      document.querySelector('span#restante').textContent = restante.toString();
  };
  // Cambia de color el presupuesto restante
  UI.prototype.comprobarPresupuesto = function (presupuestoObj) {
      var presupuesto = presupuestoObj.presupuesto, restante = presupuestoObj.restante;
      var restanteDiv = document.querySelector('.restante');
      // console.log(restante);
      // console.log( presupuesto);
      // Comprobar el 25% 
      if ((presupuesto / 4) > restante) {
          restanteDiv.classList.remove('alert-success', 'alert-warning');
          restanteDiv.classList.add('alert-danger');
      }
      else if ((presupuesto / 2) > restante) {
          restanteDiv.classList.remove('alert-success');
          restanteDiv.classList.add('alert-warning');
      }
      else {
          restanteDiv.classList.remove('alert-danger', 'alert-warning');
          restanteDiv.classList.add('alert-success');
      }
      // Si presupuesta es igual a 0 
      if (restante <= 0) {
          ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
          formulario.querySelector('button[type="submit"]').disabled = true;
      }
  };
  UI.prototype.limpiarHTML = function () {
      while (gastosListado.firstChild) {
          gastosListado.removeChild(gastosListado.firstChild);
      }
  };
  return UI;
}());
var ui = new UI();
var presupuesto;
function preguntarPresupuesto() {
  var presupuestoUsuario = presupuestoInput === null || presupuestoInput === void 0 ? void 0 : presupuestoInput.value;
  if (!presupuestoUsuario || Number(presupuestoUsuario) <= 0) {
      window.location.reload();
      return;
  }
  formContent === null || formContent === void 0 ? void 0 : formContent.classList.remove('d-none');
  presupuestoInput.disabled = true;
  presupuestoButton.disabled = true;
  // Presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  // console.log(presupuesto);
  console.log(presupuesto);
  // Agregarlo en el HTML
  ui.insertarPresupuesto(presupuesto);
}
function agregarGasto(e) {
  e.preventDefault();
  // Leer del formulario de Gastos
  var nombre = document.querySelector('#gasto').value;
  var cantidad = Number(document.querySelector('#cantidad').value);
  // Comprobar que los campos no esten vacios
  if (!nombre || !cantidad) {
      // 2 parametros: mensaje y tipo
      ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
  }
  else if (cantidad <= 0 || isNaN(cantidad)) {
      // si hay una cantidad negativa o letras...
      ui.imprimirAlerta('Cantidad no válida', 'error');
  }
  else {
      var gasto = { nombre: nombre, cantidad: cantidad, id: Date.now() };
      // Añadir nuevo gasto 
      presupuesto.nuevoGasto(gasto);
      // Insertar en el HTML
      ui.imprimirAlerta('Correcto', 'correcto');
      // Pasa los gastos para que se impriman...
      var gastos = presupuesto.gastos;
      ui.agregarGastoListado(gastos);
      // Cambiar la clase que nos avisa si se va terminando
      ui.comprobarPresupuesto(presupuesto);
      // Actualiza el presupuesto restante
      var restante = presupuesto.restante;
      // Actualizar cuanto nos queda
      ui.actualizarRestante(restante);
      // Reiniciar el form
      formulario.reset();
  }
}
function eliminarGasto(e) {
  if (e.target.classList.contains('borrar-gasto')) {
      var id = e.target.parentElement.dataset.id;
      presupuesto.eliminarGasto(id);
      // Reembolsar
      ui.comprobarPresupuesto(presupuesto);
      // Pasar la cantidad restante para actualizar el DOM
      var restante = presupuesto.restante;
      ui.actualizarRestante(restante);
      // Eliminar del DOM
      e.target.parentElement.remove();
  }
}

