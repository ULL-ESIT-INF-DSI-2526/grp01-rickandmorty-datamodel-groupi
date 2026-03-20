import { Dimension } from "./dimension.js";
import { Personaje } from "./personaje.js";
import { Especie } from "./especie.js";
import { Localizacion } from "./localizacion.js";
import { Artefacto } from "./artefacto.js";
import { RegistroViaje } from "./registroviaje.js";

/**
 * Clase que gestiona el estado global del multiverso, controlando dimensiones, personajes, especies, localizaciones, artefactos y viajes entre dimensiones. 
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
   * @param nuevoPersonaje Personaje a añadir 
   */
  public crearPersonaje(nuevoPersonaje: Personaje): void {
    this.#personajes.push(nuevoPersonaje);
  }
  /**
   * Función para añadir a la lista una nueva especie
   * @param nuevaEspecie Especie a añadir 
   */
  public crearEspecie(nuevaEspecie: Especie): void {
    this.#especies.push(nuevaEspecie);
  }
  /**
   * Función para añadir a la lista una nueva localizacion
   * @param nuevaLocalizacion Localizacion a añadir 
   */
  public crearLocalizacion(nuevaLocalizacion: Localizacion): void {
    this.#localizaciones.push(nuevaLocalizacion);
  }
  /**
   * Función para añadir a la lista un nuevo artefacto
   * @param nuevoArtefacto Artefacto a añadir 
   */
  public crearArtefacto(nuevoArtefacto: Artefacto): void {
    this.#artefactos.push(nuevoArtefacto);
  }
  /**
   * Controla el estado global del multiverso, detectando dimensiones destruidas o personajes cuya dimensión de origen ya no existe.
   * @returns Devuelve las dimensiones destruidas y los personajes que se han quedado sin dimensión de origen.
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
   * Controla los viajes de un personaje de una dimensión a otra con fecha y motivo.
   * @param id_personaje - Identificador del personaje que realiza el viaje
   * @param id_dimension_destino - Identificador de la dimensión destino del viaje
   * @param motivo - Motivo del viaje
   * @returns Devuelve el registro del viaje realizado
   */
  public registrarViaje(id_personaje: string, id_dimension_destino: string , motivo: string): RegistroViaje {
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
   * Registra la creación de una nueva dimensión en el multiverso.
   * @param nuevaDimension - Dimension a crear
   */
  public crearDimension(nuevaDimension: Dimension): void {
    this.#dimensiones.push(nuevaDimension);
  }
  /**
   * Registra la destrucción de una dimensión existente debido a un experimento o paradoja.
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
   * Despliegue de un artefacto en una localización concreta.
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
   * Lista las dimensiones activas del multiverso.
   * @returns Devuelve un listado de las dimensiones activas del multiverso
   */
  public listadoDimActivas(): Dimension[] {
    const listadoActivas: Dimension[] = [];
    this.#dimensiones.forEach((dim) => {
      if (dim.estado === "Activa") {
        listadoActivas.push(dim);
      }
    });
    return listadoActivas;
  }
  /**
   * Lista los personajes con mayor número de versiones alternativas registradas.
   * @returns La lista de personajes con mayor número de versiones alternativas registradas.
   */
  public mayorVersionAlternativa(): Personaje[] {
    const conteoNombres = new Map<string, number>();
    this.#personajes.forEach(per => {
      const cantidad = conteoNombres.get(per.nombre);
      if (cantidad === undefined) {
        conteoNombres.set(per.nombre, 1);
      } else {
        conteoNombres.set(per.nombre, cantidad + 1);
      }
    });

    let maxRepeticiones = 0;
    conteoNombres.forEach(cantidad => {
      if (cantidad > maxRepeticiones) {
        maxRepeticiones = cantidad;
      }
    });

    const resultado: Personaje[] = [];
    this.#personajes.forEach(per => {
      if (conteoNombres.get(per.nombre) === maxRepeticiones) {
        resultado.push(per);
      }
    });

    return resultado;
  }
  /**
   * Lista los artefactos desplegados mas peligrosos.
   * @returns Devuelve un listado de los artefactos desplegados ordenados por nivel de peligrosidad.
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
   * Lista el historial de viajes realizados por un personaje concreto.
   * @param personaje - Personaje del que se quiere obtener el historial de viajes.
   * @returns Devuelve un listado de los viajes realizados por el personaje indicado.
   */
  public historialViajes(personaje: Personaje): RegistroViaje[] {
    const viajesDelPersonaje: RegistroViaje[] = [];
    this.#historialViajes.forEach((viaje) => {
      if (viaje.id_personaje === personaje.id) {
        viajesDelPersonaje.push(viaje);
      }
    });
    return viajesDelPersonaje;
  }
}


