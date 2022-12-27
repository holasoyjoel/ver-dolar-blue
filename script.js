let registros = [
    {
        id:1,
        buyCant: 300,
        buyValue:323
    },
]

window.addEventListener("load" ,  function(){
    asignarValores();  
    updateDate();
    mostrarRegistros(registros);
    this.setInterval(async function(){
        asignarValores();
        updateDate();
        mostrarRegistros(registros);
      console.log("actualizando datos");  
    }, 30000)
    
})



function updateDate(){
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const dateTimeLastUpdate = document.getElementById("dateTimeLastUpdate");
    dateTimeLastUpdate.innerHTML =  `${day}-${month}-${year} ${hours}:${minutes}`;
}

async function asignarValores(){
    const blueData = await peticionApi();
    const dataCompraValue = this.document.getElementById("data-compra-value");
    const dataVentaValue = this.document.getElementById("data-venta-value");
    dataCompraValue.innerHTML = `$${blueData.value_buy}`;
    dataVentaValue.innerHTML = `$${blueData.value_sell}`
}

async function peticionApi(){
    const resp = await fetch("https://api.bluelytics.com.ar/v2/latest");
    const data = await resp.json();
    const {blue} = data;
    return blue;
}



async function mostrarRegistros(registros){
    const tablaRegistros = document.getElementById("tabla-registros");
    const trDatos = document.getElementsByClassName("trData");
    console.log(trDatos)
    if(trDatos.length > 0){
        trDatos.map(tr => {
            tablaRegistros.removeChild(trDatos);
        })
    }

    const {value_buy} = await peticionApi();

    console.log(value_buy)

    registros.map(registro => {
        console.log(registro);
        const tr = document.createElement("tr");
        const tdCantidadComprada = document.createElement("td");
        const tdPrecioComprado = document.createElement("td");
        const tdGananciaPerdidadUnidad = document.createElement("td");
        const tdGananciaPerdidadTotal = document.createElement("td");

        let intCantidadComprada = registro.buyCant;
        let intPrecioComprado = registro.buyValue;
        let intGananciaPerdida = parseInt(value_buy) - registro.buyValue;
        let intTotalGanciaPerdida = intGananciaPerdida * registro.buyCant
        tr.className = "trData";

        tdCantidadComprada.innerHTML = intCantidadComprada;
        tdPrecioComprado.innerHTML = `$${intPrecioComprado}`;
        tdGananciaPerdidadUnidad.innerHTML = `$${intGananciaPerdida}`;
        tdGananciaPerdidadTotal.innerHTML = `$${intTotalGanciaPerdida}`;
        
        tdGananciaPerdidadUnidad.classList += (intGananciaPerdida > 0)? "positivo" : "negativo";
        tdGananciaPerdidadTotal.classList += (intTotalGanciaPerdida > 0)? "positivo" : "negativo";

        tr.appendChild(tdCantidadComprada);
        tr.appendChild(tdPrecioComprado);
        tr.appendChild(tdGananciaPerdidadUnidad);
        tr.appendChild(tdGananciaPerdidadTotal);

        tablaRegistros.append(tr);
    })
}