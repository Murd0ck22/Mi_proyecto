// Variables y Selectores
const formulario = document.getElementById('agregar-gasto') as HTMLFormElement;
const gastosListado = document.querySelector('#gastos ul') as HTMLUListElement;
const presupuestoButton = document.querySelector<HTMLButtonElement>('.presupuesto-btn')
const presupuestoInput = document.querySelector<HTMLInputElement>('#presupuesto-main')
const formContent = document.querySelector<HTMLDivElement>('#formulario')
// Eventos
eventListeners();

function eventListeners(): void {
    presupuestoButton?.addEventListener('click', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto);
    gastosListado.addEventListener('click', eliminarGasto);
}

interface GastoType {
    nombre: string;
    cantidad: number;
    id: number;
}


// Classes
class Presupuesto {
    presupuesto: number;
    restante: number;
    gastos: GastoType[]
    constructor(presupuesto: string) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto: GastoType): void {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    eliminarGasto(id: string): void {
        this.gastos = this.gastos.filter(gasto => gasto.id.toString() !== id);
        this.calcularRestante();
    }

    calcularRestante(): void {
        const gastado: number = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
}



class UI {


    insertarPresupuesto(cantidad:Presupuesto) {
        document.querySelector<HTMLParagraphElement>('#total')!.textContent = cantidad.presupuesto.toString();
        document.querySelector<HTMLSpanElement>('#restante')!.textContent = cantidad.restante.toString();
    }

    imprimirAlerta(mensaje: string, tipo: 'error' | 'correcto'| '') {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        // Si es de tipo error agrega una clase
        if (tipo === "error") {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector<HTMLDivElement>('.primario')!.insertBefore(divMensaje, formulario);

        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            document.querySelector<HTMLDivElement>('.primario .alert')!.remove();
        }, 3000);
    }

    // Inserta los gastos a la lista 
    agregarGastoListado(gastos: GastoType[]) {

        // Limpiar HTML
        this.limpiarHTML();

        // Iterar sobre los gastos 
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id.toString();

            // Insertar el gasto
            nuevoGasto.innerHTML = `
                ${nombre}
                <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;

            // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
    }

    // Comprueba el presupuesto restante
    actualizarRestante(restante: number) {
        document.querySelector<HTMLSpanElement>('span#restante')!.textContent = restante.toString();
    }

    // Cambia de color el presupuesto restante
    comprobarPresupuesto(presupuestoObj:{presupuesto:number,restante:number}) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // console.log(restante);
        // console.log( presupuesto);

        // Comprobar el 25% 
        if ((presupuesto / 4) > restante) {
            restanteDiv!.classList.remove('alert-success', 'alert-warning');
            restanteDiv!.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv!.classList.remove('alert-success');
            restanteDiv!.classList.add('alert-warning');
        } else {
            restanteDiv!.classList.remove('alert-danger', 'alert-warning');
            restanteDiv!.classList.add('alert-success');
        }

        // Si presupuesta es igual a 0 
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
        }
    }

    limpiarHTML() {
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }
}



const ui = new UI();

let presupuesto:Presupuesto;

function preguntarPresupuesto():void {
    
    const presupuestoUsuario = presupuestoInput?.value;

    if (!presupuestoUsuario || Number(presupuestoUsuario) <= 0) {
        window.location.reload();
        return
    }

    
    formContent?.classList.remove('d-none')

    presupuestoInput.disabled = true
    presupuestoButton!.disabled = true
    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    // console.log(presupuesto);
    console.log(presupuesto);
    
    // Agregarlo en el HTML
    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto(e:Event) {
    e.preventDefault();

    // Leer del formulario de Gastos
    const nombre = document.querySelector<HTMLInputElement>('#gasto')!.value;
    const cantidad = Number(document.querySelector<HTMLInputElement>('#cantidad')!.value);

    // Comprobar que los campos no esten vacios
    if (!nombre || !cantidad) {
        // 2 parametros: mensaje y tipo
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) {

        // si hay una cantidad negativa o letras...
        ui.imprimirAlerta('Cantidad no válida', 'error')
    } else {
        const gasto = { nombre, cantidad, id: Date.now() };

        // Añadir nuevo gasto 
        presupuesto.nuevoGasto(gasto)

        // Insertar en el HTML
        ui.imprimirAlerta('Correcto', 'correcto');

        // Pasa los gastos para que se impriman...
        const { gastos } = presupuesto;
        ui.agregarGastoListado(gastos);

        // Cambiar la clase que nos avisa si se va terminando
        ui.comprobarPresupuesto(presupuesto);

        // Actualiza el presupuesto restante
        const { restante } = presupuesto;

        // Actualizar cuanto nos queda
        ui.actualizarRestante(restante)

        // Reiniciar el form
        formulario.reset();
    }
}

function eliminarGasto(e):void {
    if (e.target.classList.contains('borrar-gasto')) {
        const { id } = e.target.parentElement.dataset;
        presupuesto.eliminarGasto(id);
        // Reembolsar
        ui.comprobarPresupuesto(presupuesto);

        // Pasar la cantidad restante para actualizar el DOM
        const { restante } = presupuesto;
        ui.actualizarRestante(restante);

        // Eliminar del DOM
        e.target.parentElement.remove();
    }
}