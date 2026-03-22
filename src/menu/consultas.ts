import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { pausa } from "./utilidades.js";

/**
 * Pide al usuario el nombre de un personaje y busca todas sus variantes
 * en el multiverso, mostrándolas en una tabla
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuBuscarVersiones(gestor: GestorMultiverso): Promise<void> {
  const { nombre } = await prompts({
    type: "text",
    name: "nombre",
    message: "Nombre del personaje a buscar (ej. Rick):",
  });

  if (!nombre) {
    return;
  }

  const coincidencias = gestor.personajes.filter((p) =>
    p.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );

  console.log(`\n--- VARIANTES DE ${nombre.toUpperCase()} ---`);
  console.table(
    coincidencias.map((p) => ({
      ID: p.id,
      Nombre: p.nombre,
      Dimensión: p.id_dimension,
      Estado: p.estado,
    })),
  );

  await pausa();
}

/**
 * Muestra un asistente interactivo para buscar localizaciones usando filtros
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuConsultarLocalizaciones(gestor: GestorMultiverso): Promise<void> {
  const { filtro } = await prompts({
    type: "select",
    name: "filtro",
    message: "¿Por qué campo quieres filtrar las localizaciones?",
    choices: [
      { title: "Sin filtro (Mostrar todas)", value: "TODOS" },
      { title: "Nombre", value: "nombre" },
      { title: "Tipo", value: "tipo" },
      { title: "Dimensión (ID)", value: "id_dimension" }
    ]
  });

  if (!filtro) {
    return;
  }

  let listaFiltrada = [...gestor.localizaciones];

  if (filtro !== "TODOS") {
    const { valor } = await prompts({
      type: "text",
      name: "valor",
      message: `Introduce el valor para buscar por ${filtro}:`
    });

    if (!valor) {
      return;
    }

    // Aplicamos el filtro ignorando mayúsculas y minúsculas
    listaFiltrada = listaFiltrada.filter(loc => {
      let propiedad = "";
      switch (filtro) {
        case "nombre": propiedad = loc.nombre; break;
        case "tipo": propiedad = loc.tipo; break;
        case "id_dimension": propiedad = loc.id_dimension; break;
      }
      return propiedad.toLowerCase().includes(valor.toLowerCase());
    });
  }

  console.log(`\n--- RESULTADOS DE LA CONSULTA (${listaFiltrada.length} localizaciones) ---`);
  
  if (listaFiltrada.length > 0) {
    console.table(
      listaFiltrada.map((loc) => ({
        ID: loc.id,
        Nombre: loc.nombre,
        Tipo: loc.tipo,
        Dimensión: loc.id_dimension,
        Población: loc.poblacion
      }))
    );
  } else {
    console.log("No se encontraron localizaciones con esos criterios.");
  }

  await pausa();
}

/**
 * Función para consultar los personajes
 * Permite filtrar por nombre, afiliación, estado y dimension de origen
 * Permite ordenarlos por nombre o nivel de inteligencia, de forma ascendente o descendente
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuConsultarPersonajes(gestor: GestorMultiverso): Promise<void> {
  const { filtro } = await prompts ({
    type: "select",
    name: "filtro",
    message: "¿Por qué campo quiere filtrar?",
    choices: [
      { title: "Todos (sin filtro)", value: "TODOS"},
      { title: "Nombre", value: "nombre"},
      { title: "Especie", value: "id_especie"},
      { title: "Afiliación", value: "afiliacion"},
      { title: "Estado", value: "estado"},
      { title: "Dimension", value: "id_dimension" },
    ],
  });
  if (!filtro) {
    return;
  }
  let listaFiltrada = [...gestor.personajes];

  if (filtro !== "TODOS") {
    const { valor } = await prompts({
      type: "text",
      name: "valor",
      message: `Introduce el valor para buscar por ${filtro}:`
    });
    if (valor === undefined) {
      return;
    }
    listaFiltrada = listaFiltrada.filter(personaje => {
      let propiedad = "";
      switch (filtro) {
        case "nombre": propiedad = personaje.nombre; break;
        case "id_especie": propiedad = personaje.id_especie; break;
        case "afiliacion": propiedad = personaje.afiliacion; break;
        case "estado": propiedad = personaje.estado; break;
        case "id_dimension": propiedad = personaje.id_dimension; break;
      }
      return propiedad.toLowerCase().includes(valor.toLowerCase());
    });
  }
  //Para aplicar la ordenación de los personajes

  const { criterio, sentido } = await prompts([
    {
      type: "select",
      name: "criterio",
      message: "Criterio de ordenación:",
      choices: [
        { title: "Nombre", value: "nombre" },
        { title: "Inteligencia", value: "nivel_inteligencia"}
      ]
    },
    {
      type: "select",
      name: "sentido",
      message: "Sentido de la búsqueda:",
      choices: [
        { title: "Ascendente", value: "ASC"},
        { title: "Descendente", value: "DES"}
      ]
    }
  ]);
  if (criterio === undefined || sentido === undefined) {
    return;
  }
  listaFiltrada.sort((a,b) => {
    let resultado = 0;
    
    if(criterio === "nombre") {
      const valA = a.nombre.toLowerCase();
      const valB = b.nombre.toLowerCase();
      resultado = valA.localeCompare(valB);
    } else {
      const valA = a.nivel_inteligencia;
      const valB = b.nivel_inteligencia;
      if (valA > valB) {
        resultado = 1;
      } else if (valA < valB) {
        resultado = -1;
      } else {
        resultado = 0;
      }
    }
    if (sentido  === "DES") { 
      return resultado * -1; // Para que invierta el resultado, es decir, que vaya al réves
    }
    return resultado;
  });
  
  //Mostrar el resultado final 
  console.log(`\n---RESULTADOS DE LA CONSULTA (${listaFiltrada.length} personajes)---`);
  if (listaFiltrada.length > 0) {
    console.table(
      listaFiltrada.map((per) => ({
        Nombre: per.nombre,
        Especie: per.id_especie,
        Dimension: per.id_dimension,
        Inteligencia: per.nivel_inteligencia,
        Estado: per.estado,
        Afiliacion: per.afiliacion
      }))
    );
  } else {
    console.log("No se encontraron personajes con dichos criterios.");
  }
  await pausa();
}

/**
 * Función para consultar los artefactos (inventos)
 * Permite filtrar por nombre, tipo, inventor o peligrosidad
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuConsultarArtefactos(gestor: GestorMultiverso): Promise<void> {
  const { filtro } = await prompts({
    type: "select",
    name: "filtro",
    message: "¿Por qué campo quieres filtrar los artefactos?",
    choices: [
      { title: "Sin filtro (Mostrar todos)", value: "TODOS" },
      { title: "Nombre", value: "nombre" },
      { title: "Tipo", value: "tipo" },
      { title: "Inventor (ID)", value: "id_inventor" },
      { title: "Nivel de peligrosidad", value: "nivel_peligrosidad" }
    ]
  });

  if (!filtro) {
    return;
  }

  let listaFiltrada = [...gestor.artefactos];

  if (filtro !== "TODOS") {
    const { valor } = await prompts({
      type: "text",
      name: "valor",
      message: `Introduce el valor para buscar por ${filtro}:`
    });
    if (!valor) {
      return;
    }
    listaFiltrada = listaFiltrada.filter(art => {
      let propiedad = "";
      switch (filtro) {
        case "nombre": 
          propiedad = art.nombre; 
          break;
        case "tipo": 
          propiedad = art.tipo; 
          break;
        case "id_inventor": 
          propiedad = art.id_inventor; 
          break;
        case "nivel_peligrosidad": 
          propiedad = art.nivel_peligrosidad.toString(); 
          break;
      }
      return propiedad.toLowerCase().includes(valor.toLowerCase());
    });
  }

  console.log(`\n--- RESULTADOS DE LA CONSULTA (${listaFiltrada.length} artefactos) ---`);
  
  if (listaFiltrada.length > 0) {
    console.table(
      listaFiltrada.map((art) => ({
        ID: art.id,
        Nombre: art.nombre,
        Tipo: art.tipo,
        Inventor: art.id_inventor,
        Peligrosidad: art.nivel_peligrosidad
      }))
    );
  } else {
    console.log("No se encontraron artefactos con esos criterios.");
  }

  await pausa();
}