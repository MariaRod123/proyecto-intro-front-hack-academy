const yearSelect = document.querySelector("#year-select");
const brandSelect = document.querySelector("#brand-select");
const modelSelect = document.querySelector("#model-select");
const statusSelect = document.querySelector("#status-select");

const buttonFilter = document.querySelector("#button-filter");

let aniosAagregar = "";
let today = new Date(); // instancio la clase Date (creo un nuevo objeto de esta clase)
let anioActual = today.getFullYear(); //accedo al metodo getFullYear() de la clase Date que devuelve el año actual
for (let index = anioActual; index >= 1900; index--) {
  aniosAagregar = aniosAagregar + `<option value="${index}">${index}</option>`;
}
yearSelect.insertAdjacentHTML("beforeend", aniosAagregar);

fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
  .then(function (datosDeLaAPI) {
    return datosDeLaAPI.json();
  })
  .then(function (listaMarcas) {
    let marcasAAgregar = "";
    for (const marca of listaMarcas) {
      marcasAAgregar += `<option value="${marca}">${marca}</option>`;
    }

    brandSelect.insertAdjacentHTML("beforeend", marcasAAgregar);
  });

//------------------------Agregar listado de modelos para cada marca------------------------

brandSelect.addEventListener("change", function () {
  fetch(
    "https://ha-front-api-proyecto-final.vercel.app/models?brand=" +
      brandSelect.value
  )
    .then(function (datosDeLaAPI) {
      return datosDeLaAPI.json();
    })
    .then(function (listaModelos) {
      let modelosAAgregar = "";
      for (const modelo of listaModelos) {
        modelosAAgregar += `<option value="${modelo}">${modelo}</option>`;
      }
      modelSelect.innerHTML =
        '<option value="" disabled selected>Seleccionar...</option>';

      modelSelect.insertAdjacentHTML("beforeend", modelosAAgregar);
    });
});

//------------------------Agregar badge en los autos nuevos, agregar estrellas y mostrar todos los autos----------------------------
function cargarAutos(autos) {
  document.querySelector("#cars").innerHTML = "";
  for (const auto of autos) {
    let autoNuevo = "";
    if (auto.status == 1) {
      autoNuevo = `<span class="badge">Nuevo</span>`;
    } else {
      autoNuevo = "";
    }

    let estrellas = "";
    let estrellaCompleta = `<i class="fas fa-star"></i>`;
    let estrellaVacia = `<i class="far fa-star"></i>`;
    for (let contador = 0; contador < auto.rating; contador++) {
      estrellas += estrellaCompleta;
    }
    for (let contador = auto.rating; contador < 5; contador++) {
      estrellas += estrellaVacia;
    }

    const precio = auto.price_usd.toLocaleString("es-UY"); //Formatea el valor que trae para agregarle la sintaxis numerica del punto

    document.querySelector("#cars").insertAdjacentHTML(
      "beforeend",
      `<div class="car">
                <div class="row">
                  <div class="col-img col-lg-4">
                    <div class="position-relative">
                      <img
                        src=${auto.image}
                        alt="Audi Q5"
                      />
                      ${autoNuevo}
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="row">
                      <div class="col-xl-6">
                        <h3>${auto.brand} ${auto.model}</h3>
                      </div>

                      <div class="col-xl-6">
                        <div class="car-info">
                          ${auto.year} | USD ${precio} |
                          <div class="rating">
                          ${estrellas}
  
                          </div>
                          <!-- /.rating -->
                        </div>
                        <!-- /.car-info -->
                      </div>
                    </div>

                    <p class="car-description">
                     ${auto.description}
                    </p>
                    <div class="car-footer">
                      <button
                        type="button"
                        name="button"
                        class="btn btn-success btn-sm"
                      >
                        <i class="fas fa-shopping-cart"></i> Comprar
                      </button>
                      <button
                        type="button"
                        name="button"
                        class="btn btn-outline-secondary btn-sm"
                      >
                        <i class="far fa-plus-square"></i> Más info<span
                          >rmación</span
                        >
                      </button>
                      <button
                        type="button"
                        name="button"
                        class="btn btn-outline-secondary btn-sm"
                      >
                        <i class="far fa-share-square"></i> Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>`
    );
  }
}

fetch("https://ha-front-api-proyecto-final.vercel.app/cars")
  .then(function (datosDeLaAPI) {
    return datosDeLaAPI.json();
  })
  .then(function (autos) {
    cargarAutos(autos);
  });

//-------------------Funcionalidad de filtrado-------------------------------------

buttonFilter.addEventListener("click", function () {
  fetch(
    "https://ha-front-api-proyecto-final.vercel.app/cars?year=" +
      yearSelect.value +
      "&brand=" +
      brandSelect.value +
      "&model=" +
      modelSelect.value +
      "&status=" +
      statusSelect.value
  )
    .then(function (datosDeLaAPI) {
      return datosDeLaAPI.json();
    })
    .then(function (autos) {
      document.querySelector("#cars").innerHTML = "";
      if (autos.length === 0) {
        document.querySelector("#cars").insertAdjacentHTML(
          "beforeend",
          `<div class="alert alert-danger" role="alert">
          No hay autos que mostrar!
        </div>`
        );
      } else {
        cargarAutos(autos);
      }
    });
});
