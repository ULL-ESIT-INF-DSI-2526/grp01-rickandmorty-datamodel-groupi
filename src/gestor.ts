import { Dimension, Estado } from "./dimension.js";
import { Personaje } from "./personaje.js";
import { Especie } from "./especie.js";
import { Localizacion } from "./localizacion.js";
import { Artefacto } from "./artefacto.js";
import { RegistroViaje } from "./registroviaje.js";

/**
 * Clase que gestiona el estado global del multiverso, controlando dimensiones, personajes, especies, localizaciones, artefactos y viajes entre dimensiones
 */
export class GestorMultiverso {
  #dimensiones: Dimension[];
  #personajes: Personaje[];
  #especies: Especie[];
  #localizaciones: Localizacion[];
  #artefactos: Artefacto[];
  #historialViajes: RegistroViaje[];
  
  #artefactosDesplegados: { id_artefacto: string, id_localizacion: string }[] = [];
 
  /**
   * Constructor de la clase GestorMultiverso
   * @param dimensiones - Dimensiones del multiverso
   * @param personajes - Personajes del multiverso
   * @param especies - Especies del multiverso
   * @param localizaciones - Localizaciones del multiverso
   * @param artefactos - Artefactos del multiverso
   * @param historialViajes - Historial de viajes entre dimensiones del multiverso
   */
  constructor(dimensiones: Dimension[], personajes: Personaje[], especies: Especie[], localizaciones: Localizacion[], artefactos: Artefacto[], historialViajes: RegistroViaje[]) {
    this.#dimensiones = dimensiones;
    this.#personajes = personajes;
    this.#especies = especies;
    this.#localizaciones = localizaciones;
    this.#artefactos = artefactos;
    this.#historialViajes = historialViajes;
  }
  
  /**
   * Getter para las dimensiones
   */
  public get dimensiones(): Dimension[] {
    return this.#dimensiones;
  }
  
  /**
   * Getter para los personajes
   */
  public get personajes(): Personaje[] {
    return this.#personajes;
  }
  
  /**
   * Getter para las especies
   */
  public get especies(): Especie[] {
    return this.#especies;
  }
  
  /**
   * Getter para las localizaciones
   */
  public get localizaciones(): Localizacion[] {
    return this.#localizaciones;
  }
  
  /**
   * Getter para los artefactos
   */
  public get artefactos(): Artefacto[] {
    return this.#artefactos;
  }
  
  /**
   * Getter para los viajes
   */
  public get todosLosViajes(): RegistroViaje[] {
    return this.#historialViajes;
  }
  
  /**
   * Función para añadir a la lista un nuevo personaje
   * @param nuevoPersonaje - Personaje a añadir 
   * * @throws Error - Lanza un error si el ID ya existe en el multiverso
   */
  public crearPersonaje(nuevoPersonaje: Personaje): void {
    if (this.#personajes.some(per => per.id === nuevoPersonaje.id)) {
      throw new Error(`ERROR: Ya existe un personaje con el ID ${nuevoPersonaje.id}`);
    }

    this.#personajes.push(nuevoPersonaje);
  }
  
  /**
   * Función para añadir a la lista una nueva especie
   * @param nuevaEspecie - Especie a añadir 
   * @throws Error - Lanza un error si el ID ya existe en el multiverso
   */
  public crearEspecie(nuevaEspecie: Especie): void {
    if (this.#especies.some(esp => esp.id === nuevaEspecie.id)) {
      throw new Error(`ERROR: Ya existe una especie con el ID ${nuevaEspecie.id}`);
    }

    this.#especies.push(nuevaEspecie);
  }
  
  /**
   * Función para añadir a la lista una nueva localizacion
   * @param nuevaLocalizacion - Localizacion a añadir 
   * @throws Error - Lanza un error si el ID ya existe en el multiverso
   */
  public crearLocalizacion(nuevaLocalizacion: Localizacion): void {
    if (this.#localizaciones.some(loc => loc.id === nuevaLocalizacion.id)) {
      throw new Error(`ERROR: Ya existe una localización con el ID ${nuevaLocalizacion.id}`);
    }

    this.#localizaciones.push(nuevaLocalizacion);
  }
  
  /**
   * Función para añadir a la lista un nuevo artefacto
   * @param nuevoArtefacto - Artefacto a añadir 
   * @throws Error - Lanza un error si el ID ya existe en el multiverso
   */
  public crearArtefacto(nuevoArtefacto: Artefacto): void {
    if (this.#artefactos.some(art => art.id === nuevoArtefacto.id)) {
      throw new Error(`ERROR: Ya existe un artefacto con el ID ${nuevoArtefacto.id}`);
    }

    this.#artefactos.push(nuevoArtefacto);
  }
  
  /**
   * Controla el estado global del multiverso, detectando dimensiones destruidas o personajes cuya dimensión de origen ya no existe
   * @returns Devuelve las dimensiones destruidas y los personajes que se han quedado sin dimensión de origen
   */
  public detectarAnomalias(): {dimensionesDestruidas: Dimension[], personajesSinDim: Personaje[]} {
    const dimensionesDestruidas = this.#dimensiones.filter(dim => dim.estado === "Destruida");
    const personajesSinDim: Personaje[] = [];
    
    this.#personajes.forEach((personaje) => {
      const dimensionEncontrada = this.#dimensiones.find(dim => dim.id === personaje.id_dimension);

      if (dimensionEncontrada === undefined || dimensionEncontrada.estado === "Destruida") {
        personajesSinDim.push(personaje);
      }
    });

    return {dimensionesDestruidas, personajesSinDim};
  }

  /**
   * Controla los viajes de un personaje de una dimensión a otra con fecha y motivo
   * @param id_personaje - Identificador del personaje que realiza el viaje
   * @param id_dimension_destino - Identificador de la dimensión destino del viaje
   * @param motivo - Motivo del viaje
   * @returns Devuelve el registro del viaje realizado
   * @throws Error - Lanza un error si el personaje o dimensión indicadas no existen en el multiverso
   */
  public registrarViaje(id_personaje: string, id_dimension_destino: string, motivo: string): RegistroViaje {
    const personajeExiste = this.#personajes.find(per => per.id === id_personaje);
    if (personajeExiste === undefined) {
      throw new Error("ERROR: El personaje no existe en el multiverso");
    }

    const dimensionExiste = this.#dimensiones.find(dim => dim.id === id_dimension_destino);
    if (dimensionExiste === undefined) {
      throw new Error("ERROR: Esta dimensión no existe en el multiverso");
    }

    const nuevoViaje: RegistroViaje = {
      id_personaje: id_personaje,
      id_dimension_origen: personajeExiste.id_dimension, 
      id_dimension_destino: id_dimension_destino,
      fecha: new Date(),
      motivo: motivo
    };

    this.#historialViajes.push(nuevoViaje);
    personajeExiste.id_dimension = id_dimension_destino; //Realizamos el viaje del personaje a otra dimensión
    return nuevoViaje;
  }

  /**
   * Registra la creación de una nueva dimensión en el multiverso
   * @param nuevaDimension - Dimension a crear
   * @throws Error - Lanza un error si el ID ya existe en el multiverso
   */
  public crearDimension(nuevaDimension: Dimension): void {
    if (this.#dimensiones.some(dim => dim.id === nuevaDimension.id)) {
      throw new Error(`ERROR: Ya existe una dimensión con el ID ${nuevaDimension.id}`);
    }

    this.#dimensiones.push(nuevaDimension);
  }

  /**
   * Registra la destrucción de una dimensión existente debido a un experimento o paradoja
   * @param id_dimension - Identificador de la dimensión a destruir
   * @throws Error - Lanza un error si la dimensión a destruir no existe en el multiverso
   */
  public destruirDimension(id_dimension: string): void {
    const dimEncontrada = this.#dimensiones.find(dim => dim.id === id_dimension);
    if (dimEncontrada === undefined) {
      throw new Error("ERROR: La dimensión a destruir no existe en el multiverso");
    }
    dimEncontrada.estado = "Destruida";
  }

  /**
   * Despliegue de un artefacto en una localización concreta
   * @param id_artefacto - Identificador del artefacto a desplegar
   * @param id_localizacion - Identificador de la localización donde se desplegará el artefacto
   * @throws Error - Lanza un error si el artefacto o la localización no existen en el multiverso
   */
  public despliegueArtefacto(id_artefacto: string, id_localizacion: string): void {
    const artefactoExiste = this.#artefactos.find(art => art.id === id_artefacto);
    if (artefactoExiste === undefined) {
      throw new Error("ERROR: Artefacto no encontrado");
    }
    
    const localizacionExiste = this.#localizaciones.find(loc => loc.id === id_localizacion);
    if (localizacionExiste === undefined) {
      throw new Error("ERROR: Localización no encontrada");
    }

    this.#artefactosDesplegados.push({ id_artefacto: id_artefacto, id_localizacion: id_localizacion });
  }

  /**
   * Lista las dimensiones activas del multiverso
   * @returns Devuelve un listado de las dimensiones activas del multiverso
   */
  public listadoDimActivas(): Dimension[] {
    return this.#dimensiones.filter(dim => dim.estado === "Activa");
  }
  
  /**
   * Lista los personajes con mayor número de versiones alternativas registradas
   * @returns Una lista con el nombre del personaje y su número de versiones
   */
  public mayorVersionAlternativa(): { nombre: string, cantidad: number }[] {
    const conteoNombres = new Map<string, number>();
    
    this.#personajes.forEach(per => {
      const cantidad = conteoNombres.get(per.nombre) || 0;
      conteoNombres.set(per.nombre, cantidad + 1);
    });

    let maxRepeticiones = 0;
    conteoNombres.forEach(cantidad => {
      if (cantidad > maxRepeticiones) {
        maxRepeticiones = cantidad;
      }
    });

    const resultado: { nombre: string, cantidad: number }[] = [];
    conteoNombres.forEach((cantidad, nombre) => {
      if (cantidad === maxRepeticiones) {
        resultado.push({ nombre, cantidad });
      }
    });

    return resultado;
  }

  /**
   * Lista los artefactos desplegados más peligrosos
   * @returns Devuelve un listado de los artefactos desplegados ordenados por nivel de peligrosidad
   */
  public inventosMasPeligrosos(): { artefacto: Artefacto, localizacion: Localizacion }[] {
    const inventosDesplegados: { artefacto: Artefacto, localizacion: Localizacion }[] = [];

    this.#artefactosDesplegados.forEach(despliegue => {
      const art = this.#artefactos.find(a => a.id === despliegue.id_artefacto);
      const loc = this.#localizaciones.find(l => l.id === despliegue.id_localizacion);

      if (art !== undefined && loc !== undefined) {
        inventosDesplegados.push({ artefacto: art, localizacion: loc });
      }
    });

    inventosDesplegados.sort((a, b) => b.artefacto.nivel_peligrosidad - a.artefacto.nivel_peligrosidad);
    return inventosDesplegados;
  } 

  /**
   * Lista el historial de viajes realizados por un personaje concreto
   * @param personaje - Personaje del que se quiere obtener el historial de viajes
   * @returns Devuelve un listado de los viajes realizados por el personaje indicado
   */
  public historialViajes(personaje: Personaje): RegistroViaje[] {
    return this.#historialViajes.filter(viaje => viaje.id_personaje === personaje.id);
  }


  /**
   * Elimina un personaje del multiverso dado su ID
   * @param id_personaje - Identificador del personaje a eliminar
   * @throws Error - Lanza un error si el personaje no existe
   */
  public eliminarPersonaje(id_personaje: string): void {
    const size_previo = this.#personajes.length;
    this.#personajes = this.#personajes.filter(per => per.id !== id_personaje);
  
    // Si el tamaño es el mismo, es que no hemos borrado nada
    if (this.#personajes.length === size_previo) {
      throw new Error("ERROR: El personaje que intentas eliminar no existe");
    }
  }


  /**
   * Elimina una dimensión del multiverso dado su ID
   * @param id_dimension - Identificador de la dimensión a eliminar
   * @throws Error - Lanza un error si la dimensión no existe
   */
  public eliminarDimension(id_dimension: string): void {
    const size_previo = this.#dimensiones.length;
    this.#dimensiones = this.#dimensiones.filter(dim => dim.id !== id_dimension);
  
    // Si el tamaño es el mismo, es que no hemos borrado nada
    if (this.#dimensiones.length === size_previo) {
      throw new Error("ERROR: La dimensión que intentas eliminar no existe");
    }
  }


  /**
   * Elimina una especie del multiverso dado su ID
   * @param id_especie - Identificador de la especie a eliminar
   * @throws Error - Lanza un error si la especie no existe
   */
  public eliminarEspecie(id_especie: string): void {
    const size_previo = this.#especies.length;
    this.#especies = this.#especies.filter(esp => esp.id !== id_especie);
  
    // Si el tamaño es el mismo, es que no hemos borrado nada
    if (this.#especies.length === size_previo) {
      throw new Error("ERROR: La especie que intentas eliminar no existe");
    }
  }


  /**
   * Elimina una localización del multiverso dado su ID
   * @param id_localizacion - Identificador de la localización a eliminar
   * @throws Error - Lanza un error si la localización no existe
   */
  public eliminarLocalizacion(id_localizacion: string): void {
    const size_previo = this.#localizaciones.length;
    this.#localizaciones = this.#localizaciones.filter(loc => loc.id !== id_localizacion);
  
    // Si el tamaño es el mismo, es que no hemos borrado nada
    if (this.#localizaciones.length === size_previo) {
      throw new Error("ERROR: La localización que intentas eliminar no existe");
    }
  }


  /**
   * Elimina un artefacto del multiverso dado su ID
   * @param id_artefacto - Identificador del artefacto a eliminar
   * @throws Error - Lanza un error si el artefacto no existe
   */
  public eliminarArtefacto(id_artefacto: string): void {
    const size_previo = this.#artefactos.length;
    this.#artefactos = this.#artefactos.filter(art => art.id !== id_artefacto);
  
    // Si el tamaño es el mismo, es que no hemos borrado nada
    if (this.#artefactos.length === size_previo) {
      throw new Error("ERROR: El artefacto que intentas eliminar no existe");
    }
  }


  /**
   * Modifica los datos de un personaje existente
   * @param id_personaje - El ID del personaje a modificar
   * @param nuevosDatos - Objeto con los campos a actualizar
   * @throws Error - Lanza un error si el personaje no existe
   */
  public modificarPersonaje(id_personaje: string, nuevosDatos: { nombre?: string, id_especie?: string, id_dimension?: string, estado?: string, afiliacion?: string, nivel_inteligencia?: number, descripcion?: string }): void {
    const personaje = this.#personajes.find(per => per.id === id_personaje);
    
    if (personaje === undefined) {
      throw new Error("ERROR: El personaje que intentas modificar no existe.");
    }

    // Actualizamos solo los campos que nos hayan pasado
    if (nuevosDatos.nombre !== undefined) {
      personaje.nombre = nuevosDatos.nombre;
    }
    if (nuevosDatos.id_especie !== undefined) {
      personaje.id_especie = nuevosDatos.id_especie;
    }
    if (nuevosDatos.id_dimension !== undefined) {
      personaje.id_dimension = nuevosDatos.id_dimension;
    }
    if (nuevosDatos.estado !== undefined) {
      personaje.estado = nuevosDatos.estado;
    }
    if (nuevosDatos.afiliacion !== undefined) {
      personaje.afiliacion = nuevosDatos.afiliacion;
    }
    if (nuevosDatos.nivel_inteligencia !== undefined) {
      personaje.nivel_inteligencia = nuevosDatos.nivel_inteligencia;
    }
    if (nuevosDatos.descripcion !== undefined) {
      personaje.descripcion = nuevosDatos.descripcion;
    }
  }


  /**
   * Modifica los datos de una dimensión existente
   * @param id_dimension - El ID de la dimensión a modificar
   * @param nuevosDatos - Objeto con los campos a actualizar
   * @throws Error - Lanza un error si la dimensión no existe
   */
  public modificarDimension(id_dimension: string, nuevosDatos: { nombre?: string, estado?: Estado, nivel_tecnologico?: number, descripcion?: string }): void {
    const dimension = this.#dimensiones.find(dim => dim.id === id_dimension);
    
    if (dimension === undefined) {
      throw new Error("ERROR: La dimensión que intentas modificar no existe.");
    }

    // Actualizamos solo los campos que nos hayan pasado
    if (nuevosDatos.nombre !== undefined) {
      dimension.nombre = nuevosDatos.nombre;
    }
    if (nuevosDatos.estado !== undefined) {
      dimension.estado = nuevosDatos.estado;
    }
    if (nuevosDatos.nivel_tecnologico !== undefined) {
      dimension.nivel_tecnologico = nuevosDatos.nivel_tecnologico;
    }
    if (nuevosDatos.descripcion !== undefined) {
      dimension.descripcion = nuevosDatos.descripcion;
    }
  }


   /**
   * Modifica los datos de una especie existente
   * @param id_especie - El ID de la especie a modificar
   * @param nuevosDatos - Objeto con los campos a actualizar
   * @throws Error - Lanza un error si la especie no existe
   */
  public modificarEspecie(id_especie: string, nuevosDatos: { nombre?: string, id_origen?: string, tipo?: string, esperanza_de_vida?: number, descripcion?: string }): void {
    const especie = this.#especies.find(esp => esp.id === id_especie);
    
    if (especie === undefined) {
      throw new Error("ERROR: La especie que intentas modificar no existe.");
    }

    // Actualizamos solo los campos que nos hayan pasado
    if (nuevosDatos.nombre !== undefined) {
      especie.nombre = nuevosDatos.nombre;
    }
    if (nuevosDatos.id_origen !== undefined) {
      especie.id_origen = nuevosDatos.id_origen;
    }
    if (nuevosDatos.tipo !== undefined) {
      especie.tipo = nuevosDatos.tipo;
    }
    if (nuevosDatos.esperanza_de_vida !== undefined) {
      especie.esperanza_de_vida = nuevosDatos.esperanza_de_vida;
    }
    if (nuevosDatos.descripcion !== undefined) {
      especie.descripcion = nuevosDatos.descripcion;
    }
  }


   /**
   * Modifica los datos de una localización existente
   * @param id_localizacion - El ID de la localización a modificar
   * @param nuevosDatos - Objeto con los campos a actualizar
   * @throws Error - Lanza un error si la localización no existe
   */
  public modificarLocalizacion(id_localizacion: string, nuevosDatos: { nombre?: string, tipo?: string, id_dimension?: string, poblacion?: number, descripcion?: string }): void {
    const localizacion = this.#localizaciones.find(loc => loc.id === id_localizacion);
    
    if (localizacion === undefined) {
      throw new Error("ERROR: La localización que intentas modificar no existe.");
    }

    // Actualizamos solo los campos que nos hayan pasado
    if (nuevosDatos.nombre !== undefined) {
      localizacion.nombre = nuevosDatos.nombre;
    }
    if (nuevosDatos.tipo !== undefined) {
      localizacion.tipo = nuevosDatos.tipo;
    }
    if (nuevosDatos.id_dimension !== undefined) {
      localizacion.id_dimension = nuevosDatos.id_dimension;
    }
    if (nuevosDatos.poblacion !== undefined) {
      localizacion.poblacion = nuevosDatos.poblacion;
    }
    if (nuevosDatos.descripcion !== undefined) {
      localizacion.descripcion = nuevosDatos.descripcion;
    }
  }


  /**
   * Modifica los datos de un artefacto existente
   * @param id_artefacto - El ID del artefacto a modificar
   * @param nuevosDatos - Objeto con los campos a actualizar
   * @throws Error - Lanza un error si el artefacto no existe
   */
  public modificarArtefacto(id_artefacto: string, nuevosDatos: { nombre?: string, id_inventor?: string, tipo?: string, nivel_peligrosidad?: number, descripcion?: string }): void {
    const artefacto = this.#artefactos.find(art => art.id === id_artefacto);
    
    if (artefacto === undefined) {
      throw new Error("ERROR: El artefacto que intentas modificar no existe.");
    }

    // Actualizamos solo los campos que nos hayan pasado
    if (nuevosDatos.nombre !== undefined) {
      artefacto.nombre = nuevosDatos.nombre;
    }
    if (nuevosDatos.id_inventor !== undefined) {
      artefacto.id_inventor = nuevosDatos.id_inventor;
    }
    if (nuevosDatos.tipo !== undefined) {
      artefacto.tipo = nuevosDatos.tipo;
    }
    if (nuevosDatos.nivel_peligrosidad !== undefined) {
      artefacto.nivel_peligrosidad = nuevosDatos.nivel_peligrosidad;
    }
    if (nuevosDatos.descripcion !== undefined) {
      artefacto.descripcion = nuevosDatos.descripcion;
    }
  }
}


