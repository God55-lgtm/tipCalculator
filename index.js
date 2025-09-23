document.addEventListener('DOMContentLoaded', () => {
    const billInput = document.querySelector('.amount input');
    const peopleInput = document.querySelector('.numberOfPeople input');
    const buttonReset = document.querySelector('.buttonReset');
    const customInput = document.querySelector('.CustomInput');
    const elementoPadreSpan = document.getElementById('spanPeople');

    let priceResult1 = document.querySelector('.price-result1');
    let priceResult2 = document.querySelector('.price-result2');
    let BillValue = 0;
    let PeopleValue = 0;
    let porcentajeMonto = 0;
    let errorSpan = null;




    // Guardar el estado original del botón reset
    const originalResetBg = getComputedStyle(buttonReset).backgroundColor;
    const originalResetColor = getComputedStyle(buttonReset).color;

    // Función para mostrar el error
    const mostrarError = () => {
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error-message');
            errorSpan.textContent = "Can't be zero";
            errorSpan.style.color = 'hsla(32, 71%, 57%, 1.00)';
            errorSpan.style.position = 'absolute';
            errorSpan.style.right = '0';
            errorSpan.style.top = '0';
            errorSpan.style.fontSize = '15px';
            peopleInput.style.border = 'solid';
            peopleInput.style.borderColor = 'hsla(22, 71%, 57%, 1.00)';

            elementoPadreSpan.appendChild(errorSpan);
        }
    };



    // Función para ocultar el error
    const ocultarError = () => {
        if (errorSpan) {
            elementoPadreSpan.removeChild(errorSpan);
            errorSpan = null;
        }
    };


    const formatNumber = (num) => {
        if (num >= 1000) {

            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return num.toFixed(2);
    };

    // Función para calcular 
    const calcular = () => {
        if (BillValue > 0 && PeopleValue > 0 && porcentajeMonto > 0) {
            let porcentajeDecimal = porcentajeMonto / 100;
            let tipAmount = BillValue * porcentajeDecimal;
            let total = BillValue + tipAmount;
            let tipPerPerson = tipAmount / PeopleValue;
            let totalPerPerson = total / PeopleValue;

            // Formatear los resultados para números grandes
            priceResult1.textContent = `$${formatNumber(tipPerPerson)}`;
            priceResult2.textContent = `$${formatNumber(totalPerPerson)}`;
        } else {
            priceResult1.textContent = '$0.00';
            priceResult2.textContent = '$0.00';
        }
    };

    // Actualizar estado del botón reset
    const actualizarBotonReset = () => {
        if (BillValue === 0 && PeopleValue === 0 && porcentajeMonto === 0) {
            // Restaurar colores originales
            buttonReset.style.backgroundColor = originalResetBg;
            buttonReset.style.color = originalResetColor;
            buttonReset.disabled = true;
            buttonReset.style.cursor = 'not-allowed';
            buttonReset.style.opacity = '0.35';
        } else {
            // Aplicar estilo activo
            buttonReset.style.backgroundColor = 'hsl(172, 67%, 45%)';
            buttonReset.style.color = 'hsl(183, 100%, 15%)';
            buttonReset.disabled = false;
            buttonReset.style.cursor = 'pointer';
            buttonReset.style.opacity = '1';
        }
    };

    // Función de reset completo
    const resetCompleto = () => {
        BillValue = 0;
        PeopleValue = 0;
        porcentajeMonto = 0;
        billInput.value = '0';
        peopleInput.value = '0';
        customInput.value = '';
        customInput.placeholder = 'Custom';
        priceResult1.textContent = '$0.00';
        priceResult2.textContent = '$0.00';
        ocultarError();

        // Restablecer botones de porcentaje
        document.querySelectorAll('.porcentajeButton').forEach(button => {
            button.classList.remove('active');
            button.style.backgroundColor = '';
            button.style.color = '';
        });

        // Restaurar estilo original del botón reset
        buttonReset.style.backgroundColor = originalResetBg;
        buttonReset.style.color = originalResetColor;
        buttonReset.disabled = true;
        buttonReset.style.cursor = 'not-allowed';
        buttonReset.style.opacity = '0.35';
    };

    buttonReset.addEventListener('click', resetCompleto);

    billInput.addEventListener('input', (e) => {
        let currentValue = e.target.value
        BillValue = parseFloat(e.target.value);
        // Solo calcular y actualizar, NO validar error
        calcular();
        actualizarBotonReset();
        if(currentValue === "0" ){
           e.target.value = e.data
        }
    });

    peopleInput.addEventListener('input', (e) => {
        // Validar que solo se permitan números enteros
        let inputValue = e.target.value;

        // Si contiene decimales, eliminarlos
        if (inputValue.includes('.')) {
            inputValue = inputValue.split('.')[0];
            e.target.value = inputValue;
        }

        // Si está vacío, establecer a 0
        if (inputValue === '') {
            e.target.value = '0';
            PeopleValue = 0;
            mostrarError();
        } else {
            const newValue = parseInt(inputValue) || 0;
            PeopleValue = newValue;

            // Validar error SOLO para el input de personas
            if (newValue === 0) {
                mostrarError();
            } else {
                ocultarError();
            }
        }

        calcular();
        actualizarBotonReset();
    });

    customInput.addEventListener('input', (e) => {
        document.querySelectorAll('.porcentajeButton').forEach(button => {
            button.classList.remove('active');
            button.style.backgroundColor = '';
            button.style.color = '';
        });

        porcentajeMonto = parseFloat(e.target.value) || 0;

        calcular();
        actualizarBotonReset();
    });

    const handleFocus = (event) => {
        if (event.target.value === '0') {
            event.target.value = '';
        }
    };

    const handleBlur = (event) => {
        if (event.target.value === '') {
            event.target.value = '0';
            // Si es el peopleInput y está en 0, mostrar error
            if (event.target === peopleInput) {
                PeopleValue = 0;
                mostrarError();
                calcular();
                actualizarBotonReset();
            }
        }


        if (event.target === peopleInput && event.target.value.includes('.')) {
            event.target.value = event.target.value.split('.')[0];
            PeopleValue = parseInt(event.target.value) || 0;

            if (PeopleValue === 0) {
                mostrarError();
            } else {
                ocultarError();
            }

            calcular();
            actualizarBotonReset();
        }
    };

    billInput.addEventListener('focus', handleFocus);
    billInput.addEventListener('blur', handleBlur);
    peopleInput.addEventListener('focus', handleFocus);
    peopleInput.addEventListener('blur', handleBlur);
    customInput.addEventListener('focus', handleFocus);
    customInput.addEventListener('blur', (e) => {
        if (e.target.value === '') {
            e.target.placeholder = 'Custom';
        }
    });

    // Prevenir entrada de decimales en peopleInput
    peopleInput.addEventListener('keydown', (e) => {

        if (e.key === '.' || e.key === ',') {
            e.preventDefault();
        }
    });

    // Event listener para botones de porcentaje
    document.querySelector('.buttonsContainer').addEventListener('click', (event) => {
        if (event.target.classList.contains('porcentajeButton')) {
            customInput.value = '';
            customInput.placeholder = 'Custom';

            porcentajeMonto = parseFloat(event.target.value);

            document.querySelectorAll('.porcentajeButton').forEach(button => {
                button.classList.remove('active');
                button.style.backgroundColor = '';
                button.style.color = '';
            });

            event.target.classList.add('active');
            event.target.style.backgroundColor = 'hsl(172, 67%, 45%)';
            event.target.style.color = 'hsl(183, 100%, 15%)';

            calcular();
            actualizarBotonReset();
        }
    });

    // Inicializar el estado del botón reset
    actualizarBotonReset();
});