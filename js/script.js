document.addEventListener('DOMContentLoaded', () => {
    // Array de objetos con la información de las empanadas
    const empanadas = [
        {
            nombre: "Salteña",
            imagen: "imagenes/empanada-saltena.jpg",
            descripcionCorta: "Deliciosa empanada rellena de carne cortada a cuchillo, papa, cebolla y condimentos. ¡Un clásico del norte argentino!",
            descripcionAmpliada: "Esta empanada, típica de la provincia de Salta, se caracteriza por su relleno jugoso y sabroso. La carne, cortada a cuchillo, se combina con papas, cebollas y una mezcla secreta de condimentos que le dan un sabor único. ¡No te la pierdas!",
            precio: 1200
        },
        {
            nombre: "Tucumana",
            imagen: "imagenes/empanada-tucumana.jpg",
            descripcionCorta: "Empanada jugosa con relleno de carne picada, cebolla, huevo duro y aceitunas. ¡Un sabor que te transportará a Tucumán!",
            descripcionAmpliada: "La empanada tucumana es famosa por su relleno abundante y su sabor intenso. La carne picada se cocina con cebolla, huevo duro, aceitunas verdes y una pizca de comino. ¡Una verdadera delicia!",
            precio: 1200
        },
        {
            nombre: "Patagónica",
            imagen: "imagenes/empanada-patagonica.jpg",
            descripcionCorta: "Exquisita empanada rellena de cordero, cebolla, pimiento y especias. ¡Un sabor único de la Patagonia argentina!",
            descripcionAmpliada: "Directamente desde la Patagonia argentina, esta empanada te sorprenderá con su relleno de cordero tierno y especiado. La cebolla, el pimiento y las especias patagónicas le dan un toque único e inigualable. ¡Tienes que probarla!",
            precio: 1300
        },
        {
            nombre: "Porteña",
            imagen: "imagenes/empanada-portena.jpg",
            descripcionCorta: "La tradicional empanada de Buenos Aires, rellena de carne picada, cebolla, huevo duro, aceitunas y pasas de uva. ¡Un sabor inconfundible!",
            descripcionAmpliada: "La empanada porteña es un clásico de la gastronomía argentina. Su relleno combina carne picada, cebolla, huevo duro, aceitunas verdes y pasas de uva, creando una mezcla de sabores dulce y salado que la hace irresistible.",
            precio: 1200
        }
    ];

    // Seleccionar elementos del DOM
    const contenedorEmpanadas = document.querySelector('.contenedor-empanadas');
    const carritoItems = document.getElementById('carrito-items');
    const modalCarrito = document.getElementById('carritoModal');
    const cerrarModal = document.querySelector('.close-btn');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const verCarritoBtn = document.getElementById('ver-carrito');
    const mensajeCarrito = document.getElementById('mensaje-carrito');
    const pagarPedidoBtn = document.getElementById('pagar-pedido');

    // Cargar empanadas en el HTML
    empanadas.forEach((empanada, index) => {
        const divEmpanada = document.createElement('div');
        divEmpanada.classList.add('empanada');
        divEmpanada.innerHTML = `
            <img src="${empanada.imagen}" alt="${empanada.nombre}">
            <h3>${empanada.nombre}</h3>
            <p>${empanada.descripcionCorta || ""}</p>
            <button class="ver-mas">Ver más</button>
            <p class="descripcion-ampliada"><i>${empanada.descripcionAmpliada || ""}</i></p>
            <button class="agregar-al-carrito" data-index="${index}">Agregar al carrito</button>
        `;

        // Agregar evento para mostrar/ocultar descripción ampliada
        const botonVerMas = divEmpanada.querySelector('.ver-mas');
        const descripcionAmpliada = divEmpanada.querySelector('.descripcion-ampliada');
        botonVerMas.addEventListener('click', () => {
            descripcionAmpliada.classList.toggle('mostrar');
            botonVerMas.textContent = descripcionAmpliada.classList.contains('mostrar') ? 'Ver menos' : 'Ver más';
        });

        contenedorEmpanadas.appendChild(divEmpanada);
    });

    // Obtener las empanadas del carrito del localStorage o inicializar un array vacío
    let empanadasEnCarrito = JSON.parse(localStorage.getItem('empanadasEnCarrito')) || [];

    // Función para agregar una empanada al carrito
    function agregarAlCarrito(index) {
        const empanadaNombre = empanadas[index].nombre;
        let cantidad = parseInt(localStorage.getItem(empanadaNombre) || 0);
        cantidad++;
        localStorage.setItem(empanadaNombre, cantidad);

        // Agregar el nombre de la empanada al array si no existe
        if (!empanadasEnCarrito.includes(empanadaNombre)) {
            empanadasEnCarrito.push(empanadaNombre);
        }

        localStorage.setItem('empanadasEnCarrito', JSON.stringify(empanadasEnCarrito));
        actualizarCarrito();

        mensajeCarrito.textContent = "¡Empanada agregada al carrito!";
        mensajeCarrito.style.display = "block";
        setTimeout(() => {
            mensajeCarrito.style.display = "none";
        }, 2000);
    }

    // Evento click para los botones "Agregar al carrito" 
    contenedorEmpanadas.addEventListener('click', (event) => {
        if (event.target.classList.contains('agregar-al-carrito')) {
            const index = parseInt(event.target.dataset.index);
            agregarAlCarrito(index);
        }
    });

    // Función para actualizar el carrito
    function actualizarCarrito() {
        carritoItems.innerHTML = ''; // Limpiar el contenido del carrito
        let subtotal = 0;
        const empanadasAgregadas = new Set(); // Para evitar duplicados

        empanadasEnCarrito.forEach(nombreEmpanada => {
            const cantidad = parseInt(localStorage.getItem(nombreEmpanada));
            const empanada = empanadas.find(empanada => empanada.nombre === nombreEmpanada);

            if (empanada && cantidad > 0 && !empanadasAgregadas.has(nombreEmpanada)) {
                empanadasAgregadas.add(nombreEmpanada);
                subtotal += empanada.precio * cantidad;

                // Crear elementos del carrito
                const listItem = document.createElement('li');
                const btnDisminuir = document.createElement('button');
                btnDisminuir.textContent = "-";
                btnDisminuir.addEventListener('click', () => {
                    let nuevaCantidad = cantidad - 1;
                    if (nuevaCantidad > 0) {
                        localStorage.setItem(nombreEmpanada, nuevaCantidad);
                    } else {
                        localStorage.removeItem(nombreEmpanada);
                        empanadasEnCarrito = empanadasEnCarrito.filter(nombre => nombre !== nombreEmpanada);
                    }
                    actualizarCarrito();
                });

                const btnAumentar = document.createElement('button');
                btnAumentar.textContent = "+";
                btnAumentar.addEventListener('click', () => {
                    localStorage.setItem(nombreEmpanada, cantidad + 1);
                    actualizarCarrito();
                });

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = "Eliminar";
                btnEliminar.addEventListener('click', () => {
                    localStorage.removeItem(nombreEmpanada);
                    empanadasEnCarrito = empanadasEnCarrito.filter(nombre => nombre !== nombreEmpanada);
                    actualizarCarrito();
                });

                listItem.innerHTML = `
                    ${nombreEmpanada} (cantidad: <span class="cantidad">${cantidad}</span>) - Precio unitario: $${empanada.precio}
                `;

                listItem.appendChild(btnDisminuir);
                listItem.appendChild(btnAumentar);
                listItem.appendChild(btnEliminar);

                carritoItems.appendChild(listItem);
            }
        });

        // Agregar fila para el subtotal si hay productos en el carrito
        if (subtotal > 0) {
            const subtotalItem = document.createElement('li');
            subtotalItem.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
            carritoItems.appendChild(subtotalItem);

            // Calcular el IVA 
            const iva = subtotal * 0.21;
            const ivaItem = document.createElement('li');
            ivaItem.textContent = `IVA (21%): $${iva.toFixed(2)}`;
            carritoItems.appendChild(ivaItem);

            // Calcular Total
            const total = subtotal + iva;
            const totalItem = document.createElement('li');
            totalItem.textContent = `Total: $${total.toFixed(2)}`;
            carritoItems.appendChild(totalItem);
        }

        // Actualizar el número de items en el botón "Ver Carrito"
        let totalEmpanadas = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Si la clave corresponde al nombre de una empanada, sumar la cantidad
            if (empanadas.some(e => e.nombre === key)) {
                totalEmpanadas += parseInt(localStorage.getItem(key) || 0);
            }
        }
        verCarritoBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Ver Carrito (${totalEmpanadas})`;
    }

    // Evento para abrir el modal del carrito
    verCarritoBtn.addEventListener('click', () => {
        modalCarrito.style.display = 'block';
    });

    // Evento para cerrar el modal
    cerrarModal.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });

    // Evento para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Remover cada empanada del localStorage
        empanadasEnCarrito.forEach(nombreEmpanada => {
            localStorage.removeItem(nombreEmpanada);
        });
        // Limpiar el array de empanadas en carrito
        empanadasEnCarrito = [];
        // Remover la clave del carrito del localStorage
        localStorage.removeItem('empanadasEnCarrito');
        actualizarCarrito();
    });

    // Evento para simular un pago
    pagarPedidoBtn.addEventListener('click', () => {
        // Verificar si hay empanadas en el carrito
        let totalEmpanadas = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (empanadas.some(e => e.nombre === key)) {
                totalEmpanadas += parseInt(localStorage.getItem(key) || 0);
            }
        }

        if (totalEmpanadas > 0) {
            alert('¡Gracias por su compra!');
            vaciarCarritoBtn.click(); // Vaciar el carrito después del pago
            modalCarrito.style.display = 'none';
        } else {
            alert('Primero debe agregar productos al carrito para realizar la compra.');
        }
    });

    // Inicializar el carrito
    actualizarCarrito();
});