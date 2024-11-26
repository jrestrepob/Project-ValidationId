//Botones de la A
let bh = document.getElementById('bhBtn');
let salesforce = document.getElementById('salesforceBtn');
let diogenes = document.getElementById('diogenesBtn');

let btnConsultar = document.getElementById('btnConsultar');

let btnVolver = document.getElementById('btnVolver');

let bhBtn = document.getElementById('bhBtn');
let salesforceBtn = document.getElementById('salesforceBtn');
let diogenesBtn = document.getElementById('diogenesBtn');

//Contenedores por area
let containerBh = document.getElementById('containerBh');
let containerSalesforce = document.getElementById('containerSalesforce');
let containerDiogenes = document.getElementById('containerDiogenes');

let loadingSpinner = document.getElementById("loadingSpinner")

let tipoIdentificacion = document.getElementById("tipo-identificacion");
let numeroIdentificacion = document.getElementById("numero-identificacion");
let datosNoEncontrados = document.getElementById('successMessage');
let navegacion = document.getElementById('navegacion');

let nav = document.getElementById('nav');
let container = document.getElementById('container');
let inputs = document.getElementById('inputs');
let area = document.getElementById('area');
let navContainer = document.getElementById('navContainer');


datosNoEncontrados.style.display = 'none';
containerBh.style.display = 'none';
containerSalesforce.style.display = 'none';
containerDiogenes.style.display = 'none';
loadingSpinner.style.display = 'none';
navContainer.style.display = 'none';
datosNoEncontrados.style.display = 'none';
area.style.display = 'none';

const buttons = document.querySelectorAll('.navbar ul li a');

buttons.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        buttons.forEach(a => {
            a.style.backgroundColor = '';
            a.style.color = '';
        });
        this.style.backgroundColor = '#0033A0';
        this.style.color = '#FFFFFF';
    });
});

document.getElementById("tipo-identificacion").addEventListener("change", function () {
    let select = document.getElementById("tipo-identificacion");
    let tipoIdentificacion = select.value;
    if (tipoIdentificacion === 'Cedula') {
        if (condición_para_1) {
            select.value = "1";
        } else {
            select.value = "C";
        }
    }
});

let map = new Map();

let validarPeople;
let tipoIdentificacionBh
let tipoIdentificacionSalesforce

btnConsultar.addEventListener('click', function (event) {
    let tipoIdentificacionValue = tipoIdentificacion.value;
    let numeroIdentificacionValue = numeroIdentificacion.value;
    // Si es 1 o C de la tipoCedula.
    tipoIdentificacionBh = document.getElementById('cedulaBh').value;
    tipoIdentificacionSalesforce = document.getElementById('cedulaSalesforce').value;

    container.style.display = 'none';
    datosNoEncontrados.style.display = 'none';
    navContainer.style.display = 'block';
    loadingSpinner.style.display = 'none';

    event.preventDefault();

    // map.set(tipoIdentificacionValue, numeroIdentificacionValue);
    validarPeople = {
        idTipo: tipoIdentificacionValue,
        nroId: numeroIdentificacionValue
    }
    agregarPersona(validarPeople);

    let mensajeError = document.getElementById('mensaje-error');
    mensajeError.textContent = "";
});
let urlGeneral = '';
let bodyData = null;

bhBtn.addEventListener('click', function () {
    datosNoEncontrados.style.display = 'none';
    area.style.display = 'none';
    loadingSpinner.style.display = 'block';
    urlGeneral = 'https://prod-95.westus.logic.azure.com:443/workflows/f0b58f5141f347b3af4bd08ab080dc84/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xpK-firT1Dwpk0L9Vmauj9cFb4IhB1Nnbn4oFzdUnek';
    bodyData = {
        tipoIdentificacion: 1,
        numeroIdentificacion: validarPeople.nroId,
        tipoConsulta: "1",
        origen: "BH"
    };
    requestData(urlGeneral, bodyData, 1);
})


salesforceBtn.addEventListener('click', function () {
    datosNoEncontrados.style.display = 'none';
    area.style.display = 'none';
    loadingSpinner.style.display = 'block';
    urlGeneral = 'https://prod-147.westus.logic.azure.com:443/workflows/cf2eaa1504f04077a533fe852b17f196/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OtS1lc2L0QijenoeTvXNKz9LA0ZnTeZGLSIIH8RmI-w';
    bodyData = {
        "persona": {
            "tipoIdentificacion": "C",
            "numeroIdentificacion": validarPeople.nroId
        },
        "tipoVinculacion": "vigentes",
        "tipoBusqueda": "DNI",
        "valorBusqueda": `D${validarPeople.nroId}`,
        "filtros": [],
        "paginacion": {
            "pagina": "1",
            "registros": "50"
        }
    };
    requestData(urlGeneral, bodyData, 2);
})

diogenesBtn.addEventListener('click', function () {
    datosNoEncontrados.style.display = 'none';
    area.style.display = 'none';
    loadingSpinner.style.display = 'block';
    urlGeneral = '';
    bodyData = {
        "persona": {
            "tipoIdentificacion": 1,
            "numeroIdentificacion": validarPeople.nroId
        }
    };
    requestData(urlGeneral, bodyData, 3);
})

function requestData(urlGeneral, data, idTag) {
    let estructura = requestOptions(data);
    fetchRequest(urlGeneral, estructura, idTag);
}

function agregarPersona(validarPeople) {
    let persona = new Map();
    persona.set('tipoId', validarPeople.idTipo)
    persona.set('nroId', validarPeople.nroId)

    map.set(Date.now(), persona)
}

btnVolver.addEventListener('click', function () {
    location.reload();
    container.style.display = 'flex';
    inputs.style.display = 'flex';
    navContainer.style.display = 'none';
    loadingSpinner.style.display = 'none';
    datosNoEncontrados.style.display = 'none';
})



function fetchRequest(url, options, idTag) {
    fetch(url, options)
        .then(response => {
            let rq = validarRequest(response);
            return rq;
        })
        .then(data => {
            if (idTag === 1) {
                if (recorrerDataBh(data)) {
                    area.style.display = 'block';
                    area.style.height = 'auto';
                    containerBh.style.display = 'flex';
                    loadingSpinner.style.display = 'none';
                }
            } else if (idTag === 2) {
                if (recorrerDataSalesforce(data)) {
                    area.style.display = 'block';
                    area.style.height = 'auto';
                    containerSalesforce.style.display = 'flex';
                    loadingSpinner.style.display = 'none';
                }
            }
        }
        ).catch(error => {
            containerBh.style.display = 'none';
            containerSalesforce.style.display = 'none';
            loadingSpinner.style.display = 'none';
            Swal.fire({
                icon: 'error',
                title: 'Datos no encontrados',
                text: 'Lo siento, no se han encontrado los datos que estás buscando.',
                confirmButtonText: 'Aceptar'
            });
        })
}


function validarRequest(response) {
    if (!response.ok) {
        throw new Error('Error al obtener los datos.');
    }
    return response.json();
}

function requestOptions(bodyData) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    }
}

function recorrerDataBh(data) {
    let empleador = null;
    let afiliadoExtendido = null;
    let afiliadoConsulta = null;
    let grupoFamiliar = null;

    for (let index = 0; index < data.length; index++) {
        const item = data[index];

        switch (index) {
            case 0:
                empleador = item ? item.EmpleadorPOS : {};
                break;
            case 1:
                afiliadoExtendido = item.afiliadoConsultaExtendido;
                break;
            case 2:
                afiliadoConsulta = item.afiliadoConsulta;
                break;
            case 3:
                grupoFamiliar = item.grupoFamiliar;
                break;
            default:
                break;
        }
    }

    if (data[0].EmpleadorPOS !== null) {
        empleador = data[0].EmpleadorPOS;
        console.log(data[0].EmpleadorPOS);
    }
    if (data[1].afiliadoConsultaExtendido !== null) {
        afiliadoExtendido = data[1].afiliadoConsultaExtendido;
    }

    if(data[2].afiliadoConsulta !== null) {
        afiliadoConsulta = data[2].afiliadoConsulta;
    }

    if(data[3].grupoFamiliar !== null) {
        grupoFamiliar = data[3].grupoFamiliar;
    }

    if (empleador === null && afiliadoExtendido === null) {
        return null;
    }

    infoEmpleador(empleador);
    infoAfiliadoExtendido(afiliadoExtendido);
    infoAfiliado(afiliadoConsulta);
    infoGrupoFamiliar(grupoFamiliar);

    return [empleador, afiliadoConsulta, afiliadoExtendido, grupoFamiliar];
}

function recorrerDataSalesforce(data) {
    let cliente = null;
    let vinculaciones = null;

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if (index === 0) {
            cliente = item ? item.persona : {};
        } else {
            vinculaciones = item.vinculaciones;
            break;
        }
    }

    console.log(cliente);
    console.log(vinculaciones)
    if (data[0].persona !== null) {
        cliente = data[0].persona;
    }
    if (data[1].viculaciones !== null) {
        vinculaciones = data[1].vinculaciones;
    }

    if (cliente === null && vinculaciones === null) {
        return null;
    }

    infoCliente(cliente);

    infoVinculaciones(vinculaciones);


    return [cliente, vinculaciones];
}
function infoEmpleador(empleador) {
    const tablaEmpleador = document.getElementById('info-empleador');
    tablaEmpleador.innerHTML = `
    <tr>
        <th>Fecha De Matricula</th>
        <td>${empleador.fechaMatricula}</td>
    </tr>
    <tr>
        <th>Cotizantes Activos</th>
        <td>${empleador.cotizantesActivos}</td>
    </tr>
    <tr>
        <th>Representante Legal</th>
        <td>${empleador.representanteLegal}</td>
    </tr>
    <tr>
        <th>ARP</th>
        <td>${empleador.arp}</td>
    </tr>
    `
}

function infoAfiliadoExtendido(afiliadoExtendido) {
    const tabla = document.getElementById('info-afiliadoExtendido');
    tabla.innerHTML = `
    <tr>
        <th>Nombres</th>
        <td>${afiliadoExtendido.primerNombre} ${afiliadoExtendido.segundoNombre}</td>
    </tr>
    <tr>
        <th>Apellidos</th>
        <td>${afiliadoExtendido.primerApellido} ${afiliadoExtendido.segundoApellido}</td>
    </tr>
    <tr>
        <th>Correo electrónico</th>
        <td>${afiliadoExtendido.ubicacion.direccionElectronica}</td>
    </tr>
    <tr>
        <th>Edad</th>
        <td>${afiliadoExtendido.edad}</td>
    </tr>
    <tr>
        <th>Fecha de Nacimiento</th>
        <td>${afiliadoExtendido.fechaNacimiento}</td>
    </tr>
    <tr>
        <th>Razón Social Del Empleador</th>   
        <td>${afiliadoExtendido.razonSocialEmpleador}</td>
    </tr>
    <tr>
        <th>Ubicación</th>
        <td>
            <p>Dirección: ${afiliadoExtendido.ubicacion.direccion}</p>
            <p>Teléfono: ${afiliadoExtendido.ubicacion.telefono}</p>
            <p>Municipio: ${afiliadoExtendido.ubicacion.municipio}</p>
            <p>Departamento: ${afiliadoExtendido.ubicacion.departamento}</p>
            <p>Tipo de Dirección: ${afiliadoExtendido.ubicacion.tipoDireccion}</p>
        </td>
    </tr>
    <tr>
        <th>Estado De Suspensión</th>
        <td>${afiliadoExtendido.estadoSuspension}</td>
    </tr>
    <tr>
        <th>Fecha De Inicio Cobertura</th>
        <td>${afiliadoExtendido.fechaInicioCobertura}</td>
    </tr>
    <tr>
        <th>Fecha De Fin Cobertura</th>
        <td>${afiliadoExtendido.fechaFinCobertura}</td>
    </tr>
    <tr>
        <th>Tipo Afiliado</th>
        <td>${afiliadoExtendido.tipoAfiliado}</td>
    </tr>
    <tr>
        <th>Tipo Trabajador</th>
        <td>${afiliadoExtendido.tipoTrabajador}</td>
    </tr>
`;
}

function infoAfiliado(afiliadoConsulta) {
    const tabla = document.getElementById('info-afiliado');
    tabla.innerHTML = `
    <tr>
        <th>Estado de suspensión</th>
        <td>${afiliadoConsulta.estadoSuspension}</td>
    </tr>
    `
}

function infoGrupoFamiliar(grupoFamiliar) {
    const tabla = document.getElementById('info-grupoFamiliar');
    let currentIndex = 0;
    const anteriorBtn = document.getElementById('anterior-btn-grupoFamiliar');
    const siguienteBtn = document.getElementById('siguiente-btn-grupoFamiliar');
    const mostrarRegistro = (index) => {
        const afiliados = grupoFamiliar.afiliados[index];
        tabla.innerHTML = `
        <tr>
            <th>Tipo de identificación</th>
            <td>${afiliados.tipide} </td>
        </tr>
        <tr>
            <th>Número de identificación</th>
            <td>${afiliados.numide} </td>
        </tr>
        <tr>
            <th>Nombres</th>
            <td>${afiliados.primernombre} ${afiliados.segundonombre} </td>
        </tr>
        <tr>
            <th>Apellidos</th>
            <td>${afiliados.primerapellido} ${afiliados.segundoapellido} </td>
        </tr>
        <tr>
            <th>Genero</th>
            <td>${afiliados.genero} </td>
        </tr>
        <tr>
            <th>Fecha de nacimiento</th>
            <td>${afiliados.fechanacimiento} </td>
        </tr>
        <tr>
            <th>Cod. Tipo Afiliado</th>
            <td>${afiliados.cdTipoafiliado} </td>
        </tr>
        <tr>
            <th>Tipo Afiliado</th>
            <td>${afiliados.tipoafiliado} </td>
        </tr>
        `

        anteriorBtn.style.display = index === 0 ? 'none' : 'inline';

        siguienteBtn.style.display = index === grupoFamiliar.afiliados.length - 1 ? 'none' : 'inline';
    }

    mostrarRegistro(currentIndex);

    anteriorBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            mostrarRegistro(currentIndex);
        }
    });

    siguienteBtn.addEventListener('click', () => {
        if (currentIndex < grupoFamiliar.afiliados.length - 1) {
            currentIndex++;
            mostrarRegistro(currentIndex);
        }
    });
}
function infoVinculaciones(vinculaciones) {
    const tabla = document.getElementById('info-vinculaciones');
    let currentIndex = 0;
    const anteriorBtn = document.getElementById('anterior-btn-vinculaciones');
    const siguienteBtn = document.getElementById('siguiente-btn-vinculaciones');

    const mostrarRegistro = (index) => {
        const vinculacion = vinculaciones[index];
        tabla.innerHTML = `
            <tr>
                <th>Dni</th>
                <td>${vinculacion.dni}</td>
            </tr>
            <tr>
                <th>Dni Homologado</th>
                <td>${vinculacion.dniHomologado}</td>
            </tr>
            <tr>
                <th>Tipo Dni Homologado</th>
                <td>${vinculacion.cdTipoDniHomologado}</td>
            </tr>
            <tr>
                <th>Número Dni Homologado</th>
                <td>${vinculacion.nmDniHomologado}</td>
            </tr>
            <tr>
                <th>Codigo Contrato Principal</th>
                <td>${vinculacion.cdContratoPrincipal}</td>
            </tr>
        `;

        anteriorBtn.style.display = index === 0 ? 'none' : 'inline';

        siguienteBtn.style.display = index === vinculaciones.length - 1 ? 'none' : 'inline';
    };

    mostrarRegistro(currentIndex);

    anteriorBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            mostrarRegistro(currentIndex);
            console.log(vinculaciones[currentIndex]);
        }
    });

    siguienteBtn.addEventListener('click', () => {
        if (currentIndex < vinculaciones.length - 1) {
            currentIndex++;
            mostrarRegistro(currentIndex);
            console.log(vinculaciones[currentIndex]);
        }
    });
}

function infoCliente(cliente) {
    const tabla = document.getElementById('info-cliente');
    tabla.innerHTML = `
    <tr>
        <th>Tipo Persona</th>
        <td>${cliente.tipoPersona}</td>
    </tr>
    <tr>
        <th>Descripción Tipo Persona</th>
        <td>${cliente.descripcionTipoPersona}</td>
    </tr>
    <tr>
        <th>Tipo Identificación</th>
        <td>${cliente.tipoIdentificacion}</td>
    </tr>
    <tr>
        <th>Numero Identificación</th>
        <td>${cliente.numeroIdentificacion}</td>
    </tr>
    <tr>
        <th>Nombres</th>
        <td>${cliente.nombre1} ${cliente.nombre2}</td>   
    </tr>
    <tr>
        <th>Apellidos</th>
        <td>${cliente.apellido1} ${cliente.apellido2}</td>
    </tr>
    `
}

