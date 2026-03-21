import prompts from "prompts";
import { GestorMultiverso } from "./gestor.js";
import { IRepositorio } from "./repositorio.js";
import { Dimension, Estado } from "./dimension.js";
import { Personaje } from "./personaje.js";
import { Especie } from "./especie.js";
import { Localizacion } from "./localizacion.js";
import { Artefacto } from "./artefacto.js";

/**
 * Clase que representa el menú interactivo por consola del multiverso
 */
export class MenuInteractivo {
  #gestor: GestorMultiverso;
  #repositorio: IRepositorio;

  /**
   * Crea una instancia del Menú Interactivo
   * @param gestor - Gestor del multiverso
   * @param repositorio - Repositorio para guardar los datos
   */
  constructor(gestor: GestorMultiverso, repositorio: IRepositorio) {
    this.#gestor = gestor;
    this.#repositorio = repositorio;
  }

  /**
   * Muestra un formulario para registrar una nueva Dimensión
   * Si el usuario completa el proceso, guarda la dimensión
   */
  async #crearDimension(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (Ej: C-137):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "select", name: "estado", message: "Estado:", choices: [
          { title: "Activa", value: "Activa" },
          { title: "Destruida", value: "Destruida" },
          { title: "En cuarentena", value: "En cuarentena" },
        ],
      },
      { type: "number", name: "nivel_tecnologico", message: "Nivel Tecnológico (1-10):" },
      { type: "text", name: "descripcion", message: "Descripción:" },
    ]);

    // Si el usuario cancela (Ctrl+C), volvemos al menú
    if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
      return;
    }

    try {
      const nueva = new Dimension(respuestas.id, respuestas.nombre, respuestas.estado as Estado, respuestas.nivel_tecnologico, respuestas.descripcion);
      
      this.#gestor.crearDimension(nueva);
      await this.#repositorio.guardar();
      
      console.log("Sistema: Dimensión guardada.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    await this.#pausa();
  }


  /**
   * Muestra un formulario para crear una nueva Localización
   * Si el usuario completa el proceso, guarda la localización
   */
  async #crearLocalizacion(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (LOC-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "tipo", message: "Tipo:" },
      { type: "text", name: "id_dimension", message: "ID Dimensión:" },
      { type: "number", name: "poblacion", message: "Población:" },
      { type: "text", name: "descripcion", message: "Descripción:" },
    ]);

    if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
      return;
    }

    try {
      const nuevaLoc = new Localizacion(respuestas.id, respuestas.nombre, respuestas.tipo, respuestas.id_dimension, respuestas.poblacion, respuestas.descripcion);
      
      this.#gestor.crearLocalizacion(nuevaLoc);
      await this.#repositorio.guardar();
      
      console.log("Sistema: Localización cartografiada.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    await this.#pausa();
  }


  /**
   * Muestra un formulario para registrar un nuevo Artefacto inventado
   * Si el usuario completa el proceso, guarda el artefacto
   */
  async #crearArtefacto(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (ART-XXX):" },
      { type: "text", name: "nombre", message: "Nombre del invento:" },
      { type: "text", name: "id_inventor", message: "ID del Inventor:" },
      { type: "text", name: "tipo", message: "Tipo de tecnología:" },
      { type: "number", name: "nivel_peligrosidad", message: "Peligrosidad (1-10):" },
      { type: "text", name: "descripcion", message: "Descripción:" },
    ]);

    if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
      return;
    }

    try {
      const nuevoArt = new Artefacto(respuestas.id, respuestas.nombre, respuestas.id_inventor, respuestas.tipo, respuestas.nivel_peligrosidad, respuestas.descripcion);
      
      this.#gestor.crearArtefacto(nuevoArt);
      await this.#repositorio.guardar();
      
      console.log("Sistema: Artefacto registrado en el inventario de Rick.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    await this.#pausa();
  }


  /**
   * Pide al usuario el nombre de un personaje y busca todas sus variantes
   * en el multiverso, mostrándolas en una tabla
   */
  async #buscarVersiones(): Promise<void> {
    const { nombre } = await prompts({
      type: "text",
      name: "nombre",
      message: "Nombre del personaje a buscar (ej. Rick):",
    });

    if (!nombre) {
      return;
    }

    const coincidencias = this.#gestor.personajes.filter((p) =>
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

    await this.#pausa();
  }


  /**
   * Muestra un formulario para crear una nueva Especie
   * Si el usuario completa el proceso, guarda la especie
   */
  async #crearEspecie(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (ESP-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "id_origen", message: "ID Origen (Dim/Loc):" },
      { type: "text", name: "tipo", message: "Tipo (Humanoide, Alien, etc.):" },
      { type: "number", name: "esperanza_de_vida", message: "Esperanza de vida (años):" },
      { type: "text", name: "descripcion", message: "Descripción:" },
    ]);

    if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
      return;
    }

    try {
      const nuevaEspecie = new Especie(respuestas.id, respuestas.nombre, respuestas.id_origen, respuestas.tipo, respuestas.esperanza_de_vida, respuestas.descripcion);
      
      this.#gestor.crearEspecie(nuevaEspecie);
      await this.#repositorio.guardar();
      
      console.log("Sistema: Especie registrada correctamente.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    await this.#pausa();
  }
  

  /**
   * Muestra una lista de los artefactos ordenados por su nivel de peligrosidad
   */
  async #mostrarPeligros(): Promise<void> {
    const peligrosos = this.#gestor.inventosMasPeligrosos();

    console.log("\n--- REPORTE DE SEGURIDAD: ARTEFACTOS PELIGROSOS ---");
    console.table(
      peligrosos.map((item) => ({
        Artefacto: item.artefacto.nombre,
        Nivel_Peligro: item.artefacto.nivel_peligrosidad,
        Ubicación: item.localizacion.nombre,
      })),
    );

    await this.#pausa();
  }


  /**
   * Muestra una lista de personajes cuya dimensión de origen no existe o está destruida
   */
  async #mostrarAnomalias(): Promise<void> {
    const { personajesSinDim } = this.#gestor.detectarAnomalias();
    console.table(
      personajesSinDim.map((p) => ({
        Nombre: p.nombre,
        Ubicacion: p.id_dimension,
      })),
    );
    await this.#pausa();
  }


  /**
   * Muestra un formulario para crear a un nuevo Personaje
   * Si el usuario completa el proceso, guarda el personaje
   */
  async #crearPersonaje(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (PER-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "id_especie", message: "ID Especie (ESP-XXX):" },
      { type: "text", name: "id_dimension", message: "ID Dimensión Origen:" },
      { type: "text", name: "estado", message: "Estado (Vivo, Muerto, etc.):" },
      { type: "text", name: "afiliacion", message: "Afiliación:" },
      { type: "number", name: "nivel_inteligencia", message: "Inteligencia (1-10):", min: 1, max: 10 },
      { type: "text", name: "descripcion", message: "Descripción:" },
    ]);

    if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
      return;
    }

    try {
      const nuevo = new Personaje(respuestas.id, respuestas.nombre, respuestas.id_especie, respuestas.id_dimension, respuestas.estado, respuestas.afiliacion, respuestas.nivel_inteligencia, respuestas.descripcion);
      
      this.#gestor.crearPersonaje(nuevo);
      await this.#repositorio.guardar();
      
      console.log("Sistema: Personaje registrado correctamente.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Muestra un formulario para registrar un viaje interdimensional, actualizando
   * la ubicación del personaje y guardando el evento en el historial
   */
  async #registrarViaje(): Promise<void> {
    const viaje = await prompts([
      { type: "text", name: "personaje", message: "ID del Personaje:" },
      { type: "text", name: "destino", message: "ID Dimensión Destino:" },
      { type: "text", name: "motivo", message: "Motivo del viaje:" },
    ]);

    try {
      this.#gestor.registrarViaje(viaje.personaje, viaje.destino, viaje.motivo);
      await this.#repositorio.guardar();
      console.log("Sistema: El viaje ha sido procesado y guardado.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }


  /**
   * Pide el ID de un personaje por consola y lo elimina del sistema
   */
  async #eliminarPersonaje(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID del personaje a ELIMINAR (ej. PER-001):"
    });

    if (!id) {
      return;
    }

    try {
      this.#gestor.eliminarPersonaje(id);
      await this.#repositorio.guardar();
      console.log(`Sistema: Personaje ${id} eliminado correctamente (borrado del multiverso)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una dimensión por consola y la elimina del sistema
   */
  async #eliminarDimension(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la dimensión a ELIMINAR (ej: C-137):"
    });

    if (!id) {
      return;
    }

    try {
      this.#gestor.eliminarDimension(id);
      await this.#repositorio.guardar();
      console.log(`Sistema: Dimensión ${id} eliminada correctamente (borrada del multiverso)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una especie por consola y la elimina del sistema
   */
  async #eliminarEspecie(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la especie a ELIMINAR (ej: ESP-001):"
    });

    if (!id) {
      return;
    }

    try {
      this.#gestor.eliminarEspecie(id);
      await this.#repositorio.guardar();
      console.log(`Sistema: Especie ${id} eliminada correctamente (borrada del multiverso)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una localización por consola y la elimina del sistema
   */
  async #eliminarLocalizacion(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la localización a ELIMINAR (ej: LOC-001):"
    });

    if (!id) {
      return;
    }

    try {
      this.#gestor.eliminarLocalizacion(id);
      await this.#repositorio.guardar();
      console.log(`Sistema: Localización ${id} eliminada correctamente (borrada del multiverso)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de un artefacto por consola y lo elimina del sistema
   */
  async #eliminarArtefacto(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID del artefacto a ELIMINAR (ej: ART-001):"
    });

    if (!id) {
      return;
    }

    try {
      this.#gestor.eliminarArtefacto(id);
      await this.#repositorio.guardar();
      console.log(`Sistema: Artefacto ${id} eliminado correctamente (borrado del multiverso)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }
  

  /**
   * Pide el ID de un personaje, muestra sus datos actuales y permite modificarlos
   */
  async #modificarPersonaje(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID del personaje a MODIFICAR (ej. PER-001):"
    });

    if (!id) {
      return;
    }

    const actual = this.#gestor.personajes.find(per => per.id === id);
    
    if (!actual) {
      console.log(`Sistema: No se encontró ningún personaje con el ID ${id}`);
      await this.#pausa();
      return;
    }

    const respuestas = await prompts([
      { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
      { type: "text", name: "id_especie", message: "ID Especie:", initial: actual.id_especie },
      { type: "text", name: "id_dimension", message: "ID Dimensión:", initial: actual.id_dimension },
      { type: "text", name: "estado", message: "Estado:", initial: actual.estado },
      { type: "text", name: "afiliacion", message: "Afiliación:", initial: actual.afiliacion },
      { type: "number", name: "nivel_inteligencia", message: "Inteligencia (1-10):", min: 1, max: 10, initial: actual.nivel_inteligencia },
      { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
    ]);

    if (Object.keys(respuestas).length === 0) {
      return;
    }

    try {
      this.#gestor.modificarPersonaje(id, respuestas);
      await this.#repositorio.guardar();
      console.log(`Sistema: Personaje ${id} modificado y guardado correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una dimensión, muestra sus datos actuales y permite modificarlos
   */
  async #modificarDimension(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la dimensión a MODIFICAR (ej. C-137):"
    });

    if (!id) {
      return;
    }

    const actual = this.#gestor.dimensiones.find(dim => dim.id === id);
    
    if (!actual) {
      console.log(`Sistema: No se encontró ninguna dimensión con el ID ${id}`);
      await this.#pausa();
      return;
    }

    const respuestas = await prompts([
      { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
      { type: "text", name: "estado", message: "Estado:", initial: actual.estado },
      { type: "number", name: "nivel_tecnologico", message: "Tecnología (1-10):", min: 1, max: 10, initial: actual.nivel_tecnologico },
      { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
    ]);

    if (Object.keys(respuestas).length === 0) {
      return;
    }

    try {
      this.#gestor.modificarDimension(id, respuestas);
      await this.#repositorio.guardar();
      console.log(`Sistema: Dimensión ${id} modificada y guardada correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una especie, muestra sus datos actuales y permite modificarlos
   */
  async #modificarEspecie(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la especie a MODIFICAR (ej. ESP-001):"
    });

    if (!id) {
      return;
    }

    const actual = this.#gestor.especies.find(esp => esp.id === id);
    
    if (!actual) {
      console.log(`Sistema: No se encontró ninguna especie con el ID ${id}`);
      await this.#pausa();
      return;
    }

    const respuestas = await prompts([
      { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
      { type: "text", name: "id_origen", message: "ID Origen:", initial: actual.id_origen },
      { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
      { type: "number", name: "esperanza_de_vida", message: "Esperanza de vida:", min: 0, initial: actual.esperanza_de_vida },
      { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
    ]);

    if (Object.keys(respuestas).length === 0) {
      return;
    }

    try {
      this.#gestor.modificarEspecie(id, respuestas);
      await this.#repositorio.guardar();
      console.log(`Sistema: Especie ${id} modificada y guardada correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de una localización, muestra sus datos actuales y permite modificarlos
   */
  async #modificarLocalizacion(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID de la localización a MODIFICAR (ej. LOC-001):"
    });

    if (!id) {
      return;
    }

    const actual = this.#gestor.localizaciones.find(loc => loc.id === id);
    
    if (!actual) {
      console.log(`Sistema: No se encontró ninguna localización con el ID ${id}`);
      await this.#pausa();
      return;
    }

    const respuestas = await prompts([
      { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
      { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
      { type: "text", name: "id_dimension", message: "ID Dimensión:", initial: actual.id_dimension },
      { type: "number", name: "poblacion", message: "Población:", min: 0, initial: actual.poblacion },
      { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
    ]);

    if (Object.keys(respuestas).length === 0) {
      return;
    }

    try {
      this.#gestor.modificarLocalizacion(id, respuestas);
      await this.#repositorio.guardar();
      console.log(`Sistema: Localización ${id} modificada y guardada correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Pide el ID de un artefacto, muestra sus datos actuales y permite modificarlos
   */
  async #modificarArtefacto(): Promise<void> {
    const { id } = await prompts({
      type: "text",
      name: "id",
      message: "Introduce el ID del artefacto a MODIFICAR (ej. ART-001):"
    });

    if (!id) {
      return;
    }

    const actual = this.#gestor.artefactos.find(art => art.id === id);
    
    if (!actual) {
      console.log(`Sistema: No se encontró ningún artefacto con el ID ${id}`);
      await this.#pausa();
      return;
    }

    const respuestas = await prompts([
      { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
      { type: "text", name: "id_inventor", message: "ID Inventor:", initial: actual.id_inventor },
      { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
      { type: "number", name: "nivel_peligrosidad", message: "Peligrosidad (1-10):", min: 1, max: 10, initial: actual.nivel_peligrosidad },
      { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
    ]);

    if (Object.keys(respuestas).length === 0) {
      return;
    }

    try {
      this.#gestor.modificarArtefacto(id, respuestas);
      await this.#repositorio.guardar();
      console.log(`Sistema: Artefacto ${id} modificado y guardado correctamente.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#pausa();
  }


  /**
   * Muestra un asistente interactivo para buscar localizaciones usando filtros
   */
  async #consultarLocalizaciones(): Promise<void> {
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

    let listaFiltrada = [...this.#gestor.localizaciones];

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

    await this.#pausa();
  }
  /**
   * Función para consultar los personajes
   * Permite filtrar por nombre, afiliación, estado y dimension de origen
   * Permite ordenarlos por nombre o nivel de inteligencia, de forma ascendente o descendente
   */
  async #consultarPersonajes(): Promise<void> {
    const { filtro } = await prompts ({
      type: "select",
      name: "filtro",
      message: "¿Por qué campo quiere filtrar?",
      choices: [
        { title: "Todos (sin filtro)", value: "TODOS"},
        { title: "Nombre", value: "nombre"},
        { title: "Especie", value: "id_especie"},
        { title: "Afiliación", value: "afilicacion"},
        { title: "Estado", value: "estado"},
        { title: "Dimension", value: "id_dimension" },
      ],
    });
    if (!filtro) {
      return;
    }
    let listaFiltrada = [...this.#gestor.personajes];

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
    await this.#pausa();
  }

  /**
   * Función para consultar los artefactos (inventos).
   * Permite filtrar por nombre, tipo, inventor o peligrosidad.
   */
  
  async #consultarArtefactos(): Promise<void> {
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

    let listaFiltrada = [...this.#gestor.artefactos];

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

    await this.#pausa();
  }

  /**
   * Detiene la pantalla mostrando un prompt para que el usuario
   * presione Enter antes de limpiar la pantalla y volver al menú principal
   */
  async #pausa(): Promise<void> {
    await prompts({
      type: "text",
      name: "key",
      message: "Presione Enter para continuar...",
    });
  }


  /**
   * Inicia el menú principal de la aplicación
   */
  public async iniciar(): Promise<void> {
    let salir = false;

    // Diccionario de comandos
    const acciones = new Map<string, () => Promise<void>>([
      ["ADD_DIM", () => this.#crearDimension()],
      ["ADD_PER", () => this.#crearPersonaje()],
      ["ADD_ESP", () => this.#crearEspecie()],
      ["ADD_LOC", () => this.#crearLocalizacion()],
      ["ADD_ART", () => this.#crearArtefacto()],
      ["VIAJE", () => this.#registrarViaje()],
      ["SEARCH_VAR", () => this.#buscarVersiones()],
      ["ANOM", () => this.#mostrarAnomalias()],
      ["PELIGRO", () => this.#mostrarPeligros()],
      ["DEL_PER", () => this.#eliminarPersonaje()],
      ["DEL_DIM", () => this.#eliminarDimension()],
      ["DEL_ESP", () => this.#eliminarEspecie()],
      ["DEL_LOC", () => this.#eliminarLocalizacion()],
      ["DEL_ART", () => this.#eliminarArtefacto()],
      ["MOD_PER", () => this.#modificarPersonaje()],
      ["MOD_DIM", () => this.#modificarDimension()],
      ["MOD_ESP", () => this.#modificarEspecie()],
      ["MOD_LOC", () => this.#modificarLocalizacion()],
      ["MOD_ART", () => this.#modificarArtefacto()],
      ["CONSULTAR_LOC", () => this.#consultarLocalizaciones()],
      ["CONSULTAR_PER", () => this.#consultarPersonajes()],
      ["CONSULTAR_ART", () => this.#consultarArtefactos()]
    ]);

    while (!salir) {
      console.clear();
      const { opcion } = await prompts({
        type: "select",
        name: "opcion",
        message: "=== GESTOR MULTIVERSAL RICK & MORTY ===",
        choices: [
          { title: "Nueva Dimensión", value: "ADD_DIM" },
          { title: "Nuevo Personaje", value: "ADD_PER" },
          { title: "Nueva Especie", value: "ADD_ESP" },
          { title: "Nueva Localización", value: "ADD_LOC" },
          { title: "Nuevo Artefacto", value: "ADD_ART" },
          { title: "Modificar Personaje", value: "MOD_PER" },
          { title: "Modificar Dimensión", value: "MOD_DIM" },
          { title: "Modificar Especie", value: "MOD_ESP" },
          { title: "Modificar Localización", value: "MOD_LOC" },
          { title: "Modificar Artefacto", value: "MOD_ART" },
          { title: "Eliminar Personaje", value: "DEL_PER" },
          { title: "Eliminar Dimensión", value: "DEL_DIM" },
          { title: "Eliminar Especie", value: "DEL_ESP" },
          { title: "Eliminar Localización", value: "DEL_LOC" },
          { title: "Eliminar Artefacto", value: "DEL_ART" },
          { title: "Consultar Localizaciones", value: "CONSULTAR_LOC" },
          { title: "Consultar Personajes", value: "CONSULTAR_PER"},
          { title: "Consultar Artefactos", value: "CONSULTAR_ART" },
          { title: "Registrar Viaje", value: "VIAJE" },
          { title: "Buscar Variantes", value: "SEARCH_VAR" },
          { title: "Informe: Anomalías", value: "ANOM" },
          { title: "Informe: Peligrosidad", value: "PELIGRO" },
          { title: "Salir", value: "EXIT" },
        ],
      });

      if (opcion === "EXIT" || opcion === undefined) {
        salir = true;
      } else {
        const accionAEjecutar = acciones.get(opcion);
        
        if (accionAEjecutar) {
          await accionAEjecutar();
        }
      }
    }
  }

}
