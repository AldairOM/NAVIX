/* ============================================================
    1. Previsualización de Foto del Cliente
============================================================ */
const inputFoto = document.querySelector("#clientPhoto");
const photoBox = document.querySelector("#photoBox");
let fotoBase64 = null; // Variable para almacenar la foto en base64

if (inputFoto) {
    inputFoto.addEventListener("change", () => {
        const file = inputFoto.files[0];
        if (!file) return;

        // Previsualización
        const url = URL.createObjectURL(file);
        photoBox.innerHTML = `
            <img src="${url}" 
                 style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
        `;

        // Convertir a base64 para guardar
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoBase64 = e.target.result; // Guardar base64 completo (incluye data:image/...)
        };
        reader.readAsDataURL(file);
    });
}

function agotado(){
     alert("Este Producto esta agotado.");
}

/* ============================================================
    2. Distancias y Costos Fijos/Tiempos de Ruta (MODIFICADO)
============================================================ */
const dist = { H_Ob: 252.0, Ob_Cu: 445.6, Cu_Ma: 219.4, Ma_Te: 274.1, Te_Col: 363.1 };
const distBase = 1554.2; 

// Distancias oficiales por proveedor (Asumiendo que se sigue la ruta completa)
const distancias = {
    p1: distBase, 
    p2: distBase, 
    p3: distBase, 
    p4: distBase
};

// A. Tiempos Totales (NUEVO)
const tiempoRuta = {
    total: "29h:50m",
    conduciendo: "21h:40m",
    paradas: "00h:00m",
    descansando: "08h:00m",
    gasolineras: "00h:10m",
};

// B. Costos Fijos por Ruta (NUEVO)
const costoRuta = {
    totalBase: 22328.30,
    casetas: 5063.00,
    combustible: 8304.10,
    chofer: 2538.35,
    descansos: 700.00,
    mantenimiento: 468.35,
    llantas: 557.56,
    depreciacion: 936.70,
    costosFijos: 808.78,
    otrosCostos: 2951.46,
    costoKm: 14.30 
};

const nombresProveedor = {
    p1: "Proveedor 1 — Ciudad Obregón",
    p2: "Proveedor 2 — Culiacán",
    p3: "Proveedor 3 — Mazatlán",
    p4: "Proveedor 4 — Tepic"
};

const rutasProveedor = {
    p1: "Hermosillo → Obregón → Colima",
    p2: "Hermosillo → Culiacán → Colima",
    p3: "Hermosillo → Mazatlán → Colima",
    p4: "Hermosillo → Tepic → Colima"
};

/* ============================================================
    3. Temperaturas por producto
============================================================ */
const temperaturas = {
    "Coñac y Brandy XO o Vintage": "18–20°C",
    "Whisky Escocés Single Malt": "15–18°C",
    "Ron Añejo Ultra-Premium": "18°C",
    "Tequila Extra Añejo": "18–20°C",
    "Whisky Japonés Premium": "17–20°C",
    "Mezcal Artesanal": "16–18°C",
    "Absenta Especial": "12–15°C",
    "Hierbas Artesanales": "10–13°C",
    "Calvados Añejo": "12–15°C",
    "Grappa Riserva": "8–12°C",
    "Singani Gran Reserva": "6–10°C",
    "Bourbon & Rye": "15–18°C",
    "Irish Whiskey": "15–18°C",
    "Whisky Canadiense": "12–16°C",
    "Jerez Viejo PX": "12–14°C",
    "Vinos Madeira": "14–16°C",
    "Sotol Premium": "16–18°C",
    "Raicilla/Bacanora": "16–18°C",
    "Cachaça Añeja": "16–18°C",
    "Eau-de-Vie": "6–10°C"
};

/* ============================================================
    4. Precios por producto (precio por caja)
============================================================ */
const preciosPorCaja = {
    "Coñac y Brandy XO o Vintage": 8200,
    "Whisky Escocés Single Malt": 6500,
    "Ron Añejo Ultra-Premium": 4900,
    "Tequila Extra Añejo": 5800,
    "Whisky Japonés Premium": 7200,
    "Mezcal Artesanal": 3200,
    "Absenta Especial": 2900,
    "Hierbas Artesanales": 3400,
    "Calvados Añejo": 4300,
    "Grappa Riserva": 5600,
    "Singani Gran Reserva": 3900,
    "Bourbon & Rye": 5200,
    "Irish Whiskey": 5000,
    "Whisky Canadiense": 4100,
    "Jerez Viejo PX": 3800,
    "Vinos Madeira": 4700,
    "Sotol Premium": 3600,
    "Raicilla/Bacanora": 3200,
    "Cachaça Añeja": 2900,
    "Eau-de-Vie": 4200
};


/* ============================================================
    5. Proveedores y utilidades
============================================================ */
const proveedores = ["p1","p2","p3","p4"];
function formatMXN(n){ return n.toLocaleString("es-MX",{style:"currency",currency:"MXN"}); }

/* ============================================================
    6. Crear / quitar input cantidad
============================================================ */
function createQtyInputForCheckbox(checkbox){
    const container = checkbox.closest("label");
    if(!container) return null;
    const prodName = checkbox.value;
    const wrapperId = `qty-wrapper-${btoa(prodName).replace(/=/g,'')}`;
    if(container.querySelector(`#${wrapperId}`)) return container.querySelector(`#${wrapperId}`);

    const wrapper = document.createElement("span");
    wrapper.id = wrapperId;
    wrapper.style.marginLeft="8px";
    wrapper.style.fontSize="13px";
    wrapper.style.display="inline-flex";
    wrapper.style.alignItems="center";
    wrapper.style.gap="8px";

    const priceSpan = document.createElement("span");
    priceSpan.textContent = `Caja: ${formatMXN(preciosPorCaja[prodName])}`;
    priceSpan.style.color="#666";
    priceSpan.style.fontWeight="700";

    const input = document.createElement("input");
    input.type="number";
    input.min="1";
    input.value="1";
    input.style.width="60px";
    input.style.padding="4px";
    input.style.borderRadius="6px";
    input.style.border="1px solid rgba(0,0,0,0.12)";
    input.setAttribute("data-prod",prodName);
    input.addEventListener("change",()=>actualizarTotales());

    wrapper.appendChild(priceSpan);
    wrapper.appendChild(document.createTextNode("Cajas:"));
    wrapper.appendChild(input);
    container.appendChild(wrapper);
    return wrapper;
}

function removeQtyInputForCheckbox(checkbox){
    const container=checkbox.closest("label");
    if(!container) return;
    const prodName=checkbox.value;
    const wrapperId=`qty-wrapper-${btoa(prodName).replace(/=/g,'')}`;
    const wrapper=container.querySelector(`#${wrapperId}`);
    if(wrapper) wrapper.remove();
}

/* ============================================================
    7. Limitar productos por proveedor
============================================================ */
function limitarProductos(id){
    const checks=document.querySelectorAll(`input[data-prov="${id}"]`);
    const seleccionados=[...checks].filter(c=>c.checked);
    if(seleccionados.length>3){
        alert("Solo puedes seleccionar máximo 3 productos para este proveedor.");
        const ultimo=seleccionados.pop();
        ultimo.checked=false;
        removeQtyInputForCheckbox(ultimo);
    }
    actualizarTotales();
}

/* ============================================================
    8. Actualizar totales y resumen (MODIFICADO)
============================================================ */
function actualizarTotales(){
    let totalProveedores=0,totalProductos=0,totalKm=0,totalGeneral=0;
    let costoRutaAcumulado = 0; 

    let resumenHTML="";
    let productosSubtotal = 0;

    proveedores.forEach(id=>{
        const card=document.querySelector(`.prov-card[data-id="${id}"]`);
        const checks=[...document.querySelectorAll(`input[data-prov="${id}"]:checked`)];
        if(card.classList.contains("active")){
            totalProveedores++;
            totalProductos+=checks.length;
            totalKm=distancias[id]; // El km total es distBase (1554.2 km)
            
            let subtotalProv=0;
            const productosHTML = checks.length===0 ? "<em>— Ninguno —</em>" :
            checks.map(c=>{
                const prodName=c.value;
                const wrapperId=`qty-wrapper-${btoa(prodName).replace(/=/g,'')}`;
                const wrapper=c.closest("label")?.querySelector(`#${wrapperId}`);
                let qty=1;
                if(wrapper){
                    const inp=wrapper.querySelector("input[type='number']");
                    if(inp) qty=parseInt(inp.value,10)||1;
                }
                const price=preciosPorCaja[prodName]||0;
                const totalProd=price*qty;
                subtotalProv+=totalProd;
                productosSubtotal+=totalProd; 
                
                return `<div style="margin-left:8px;margin-bottom:6px;">• <strong>${prodName}</strong>
                    <span style="color:#995E8E;font-weight:700;"> — ${temperaturas[prodName]||"N/A"}</span><br>
                    &nbsp;&nbsp;&nbsp;Precio por caja: ${formatMXN(price)} — Cajas: ${qty} — Total: <strong>${formatMXN(totalProd)}</strong>
                    </div>`;
            }).join("");
            
            resumenHTML+=`<div style="padding:12px;margin-bottom:12px;background:#faf5ff;border-radius:10px;border-left:5px solid #995E8E;">
                <strong style="font-size:15px;color:#6b3570;">${nombresProveedor[id]}</strong><br>
                <span style="font-size:13px;color:#555;">Ruta: ${rutasProveedor[id]}</span><br>
                <span style="font-size:13px;color:#444;">Kilómetros asignados: <strong>${distancias[id].toFixed(1)} km</strong></span><br><br>
                <u style="font-weight:bold;">Productos Seleccionados:</u><br>${productosHTML}
                <div style="margin-top:8px;font-weight:800;color:#333;">Subtotal proveedor: ${formatMXN(subtotalProv)}</div>
            </div>`;
        }
    });
    
    // Si hay algún proveedor activo, se aplica el costo de ruta una sola vez
    if(totalProveedores > 0){
        costoRutaAcumulado = costoRuta.totalBase;
    }

    // Total General = Productos + Costo Fijo de la Ruta
    totalGeneral = productosSubtotal + costoRutaAcumulado;

    document.querySelector("#selectedCount").textContent=totalProveedores;
    document.querySelector("#selectedProducts").textContent=totalProductos;
    document.querySelector("#totalKm").textContent=totalKm.toFixed(1)+" km";

    const totalsCard=document.querySelector(".totals-card");
    const existingDetalle=document.querySelector("#detalleResumen");
    if(existingDetalle) existingDetalle.remove();

    const detalleDiv=document.createElement("div");
    detalleDiv.id="detalleResumen";
    detalleDiv.style.marginTop="15px";

    // NUEVO: Mostrar el desglose de Costos y Tiempos
    let rutaInfoHTML = '';
    if (totalProveedores > 0) {
        rutaInfoHTML = `
            <div style="padding:15px;margin-bottom:12px;background:#f5faff;border-radius:10px;border-left:5px solid #F08BB0;">
                <strong style="font-size:15px;color:#995E8E;">COSTOS Y TIEMPOS DE RUTA BASE (1,554.2 km)</strong>
                <hr style="border:0;border-top:1px dashed #ccc;margin:8px 0;">

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;">
                    <div>
                        <strong>TIEMPO TOTAL: ${tiempoRuta.total}</strong><br>
                        • Conduciendo: ${tiempoRuta.conduciendo}<br>
                        • Descansando: ${tiempoRuta.descansando}<br>
                    </div>
                    <div>
                        <strong>COSTO BASE: ${formatMXN(costoRutaAcumulado)}</strong><br>
                        • Casetas: ${formatMXN(costoRuta.casetas)}<br>
                        • Combustible: ${formatMXN(costoRuta.combustible)}<br>
                        • Chofer: ${formatMXN(costoRuta.chofer)}<br>
                    </div>
                </div>
                
            </div>
        `;
    } 

    detalleDiv.innerHTML=`
        ${rutaInfoHTML}
        ${resumenHTML}
        <div style="padding:12px;background:#fff7fb;border-radius:10px;margin-top:8px;border-left:4px solid #995E8E;">
            <strong>Total General:</strong> ${formatMXN(totalGeneral)}
        </div>`;
    totalsCard.appendChild(detalleDiv);
}

/* ============================================================
    9. Guardar registro (MODIFICADO)
============================================================ */
document.querySelector("#generateBtn")?.addEventListener("click",()=>{
    const cliente={
        nombre:document.querySelector("#clientName")?.value,
        telefono:document.querySelector("#clientPhone")?.value,
        email:document.querySelector("#clientEmail")?.value,
        direccion:document.querySelector("#clientAddress")?.value,
        notas:document.querySelector("#clientNotes")?.value
    };
    if(!cliente.nombre){ alert("Por favor llena el nombre del cliente."); return; }
    
    const proveedoresActivos = proveedores.filter(id=>document.querySelector(`.prov-card[data-id="${id}"]`).classList.contains("active"));
    if(proveedoresActivos.length === 0){ alert("Debes seleccionar al menos un proveedor."); return; }

    let costoRutaAcumulado = proveedoresActivos.length > 0 ? costoRuta.totalBase : 0;
    let totalGeneralTemporal = 0; 
    let productosArray = [];

    proveedoresActivos.forEach(id=>{
        const productos=[...document.querySelectorAll(`input[data-prov="${id}"]:checked`)]
            .map(c=>{
                const prodName=c.value;
                const wrapperId=`qty-wrapper-${btoa(prodName).replace(/=/g,'')}`;
                const wrapper=c.closest("label")?.querySelector(`#${wrapperId}`);
                let qty=1;
                if(wrapper){
                    const inp=wrapper.querySelector("input[type='number']");
                    if(inp) qty=parseInt(inp.value,10)||1;
                }
                const price=preciosPorCaja[prodName]||0;
                const totalProd=price*qty;
                return {nombre:prodName,temperatura:temperaturas[prodName],precioPorCaja:price,cajas:qty,total:totalProd};
            });
        
        const subtotalProv=productos.reduce((s,x)=>s+x.total,0);
        totalGeneralTemporal += subtotalProv; 
        productosArray.push({proveedor:nombresProveedor[id],ruta:rutasProveedor[id],kms:distancias[id].toFixed(1),productos,subtotal:subtotalProv});
    });

    const registro = {
        cliente,
        proveedores: productosArray,
        totalKm: document.querySelector("#totalKm").textContent,
        totalProveedores: document.querySelector("#selectedCount").textContent,
        totalProductos: document.querySelector("#selectedProducts").textContent,
        
        // DATOS ADICIONALES PARA EL TICKET FINAL
        costoRuta, 
        tiempoRuta, 
        costoRutaAcumulado: costoRutaAcumulado, 
        
        // Suma de productos + costo de ruta
        totalGeneral: totalGeneralTemporal + costoRutaAcumulado,
        
        // Foto del cliente en base64 (si existe)
        fotoCliente: fotoBase64
    };

    localStorage.setItem("ticketDAMAF",JSON.stringify(registro));
    window.location.href="mostradatos.html";
});

/* ============================================================
    10. Reset (MODIFICADO)
============================================================ */
document.querySelector("#resetAll")?.addEventListener("click",()=>{
    // Usa el ID del formulario
    document.querySelector("#clientForm")?.reset(); 
    if(photoBox) photoBox.innerHTML="Foto";
    
    proveedores.forEach(id=>{
        const card=document.querySelector(`.prov-card[data-id="${id}"]`);
        const body=document.querySelector(`#body-${id}`);
        const checks=document.querySelectorAll(`input[data-prov="${id}"]`);
        
        // Si el elemento <details> está abierto, lo cierra forzando el evento 'toggle'
        const details=card.querySelector("summary")?.parentElement;
        if(details && details.open) details.open = false; 
        
        card.classList.remove("active"); 
        card.classList.add("disabled"); 
        body.style.display="none";
        checks.forEach(c=>{c.checked=false;c.disabled=true;removeQtyInputForCheckbox(c);});
    });
    actualizarTotales();
});

/* ============================================================
    11. Inicialización (eventos, toggle proveedor)
============================================================ */
function inicializar(){
    proveedores.forEach(id=>{
        const card=document.querySelector(`.prov-card[data-id="${id}"]`);
        const body=document.querySelector(`#body-${id}`);
        const checks=document.querySelectorAll(`input[data-prov="${id}"]`);

        card.classList.add("disabled");
        body.style.display="none";
        checks.forEach(c=>c.disabled=true);

        // toggle con event toggle de <details>
        const details=card.querySelector("summary")?.parentElement;
        if(details){
            details.addEventListener("toggle",()=>{
                if(details.open){
                    card.classList.add("active");
                    card.classList.remove("disabled");
                    body.style.display="block";
                    checks.forEach(c=>c.disabled=false);
                } else{
                    card.classList.remove("active");
                    card.classList.add("disabled");
                    body.style.display="none";
                    checks.forEach(c=>{c.checked=false;c.disabled=true;removeQtyInputForCheckbox(c);});
                }
                actualizarTotales();
            });
        }

        checks.forEach(c=>{
            c.addEventListener("change",(e)=>{
                if(e.target.checked) createQtyInputForCheckbox(e.target);
                else removeQtyInputForCheckbox(e.target);
                limitarProductos(id);
            });
        });
    });

    // Abrir proveedor 1 por defecto
    const prov1=document.querySelector(`.prov-card[data-id="p1"] summary`)?.parentElement;
    if(prov1) prov1.open=true;
}

inicializar();