import { ILocalizacion } from "../interfaces/entidades.js"

/**
 * Clase que representa a una localización dentro del universo de Rick y Morty
 */
export class Localizacion implements ILocalizacion {
  #id: string;
  #nombre: string;
  #tipo: string;
  #id_dimension: string; // Referencia
  #poblacion: number;
  #descripcion: string;

  /**
   * Crea una instancia de la clase Localizacion
   * @param id - Identificador único de la localizacion (Comienza por LOC)
   * @param nombre - Nombre de la localizacion
   * @param tipo - Tipo de la localizacion
   * @param id_dimension - Referencia a la dimension en la que se encuentra la localizacion
   * @param poblacion - Población aproximada de la localizacion
   * @param descripcion - Notas sobre las particularidades de la localizacion
   * @throws Error - Lanza un error si el id de la localizacion no es válido o si la población es negativa o si el id de la dimensión no es válido
   */
  constructor(id: string, nombre: string, tipo: string, id_dimension: string, poblacion: number, descripcion: string) {
    const expresion_id = /^LOC-[A-Za-z0-9-]+$/;
    const expresion_id_dimension = /^[A-Z]-?[A-Za-z0-9α-ωΑ-Ω]+$/;
    if (!expresion_id.test(id)) {
      throw new Error("ERROR: ID introducido inválido");
    } 

    if (!expresion_id_dimension.test(id_dimension)) {
      throw new Error("ERROR: ID de la dimensión introducido inválido");
    } 

    if (poblacion < 0) {
      throw new Error("ERROR: La población no puede ser negativa");
    }
    
    this.#id = id;
    this.#nombre = nombre;
    this.#tipo = tipo;
    this.#id_dimension = id_dimension;
    this.#poblacion = poblacion;
    this.#descripcion = descripcion;
  }

  /**
   * Obtiene el identificador de la localización
   * @returns El id de la localización
   */
  public get id(): string {
    return this.#id;
  }
  
  /**
   * Obtiene el nombre de la localización
   * @returns El nombre de la localización
   */
  public get nombre(): string {
    return this.#nombre;
  }
  
  /**
   * Obtiene el tipo de la localización
   * @returns El tipo de la localización
   */
  public get tipo(): string {
    return this.#tipo;
  }
  
  /**
   * Obtiene la referencia a la dimensión de la localización
   * @returns La referencia a la dimensión de la localización
   */
  public get id_dimension(): string {
    return this.#id_dimension;
  }

  /**
   * Obtiene la población de la localización
   * @returns La población de la localización
   */
  public get poblacion(): number {
    return this.#poblacion;
  }
  
  /**
   * Obtiene la descripción de la localización
   * @returns La descripción de la localización
   */
  public get descripcion(): string {
    return this.#descripcion;
  }

  /**
   * Modifica el nombre de la localización
   * @param nuevo_nombre - El nuevo nombre que se le asignará
   */
  public set nombre(nuevo_nombre: string) {
    this.#nombre = nuevo_nombre;
  }

  /**
   * Modifica el tipo de la localización
   * @param nuevo_tipo - El nuevo tipo que se le asignará
   */
  public set tipo(nuevo_tipo: string) {
    this.#tipo = nuevo_tipo;
  }

  /**
   * Modifica la dimension de la localización
   * @param nuevo_id_dimension - La nueva dimensión que se le asignará
   * @throws Error - Lanza un error si el id de la nueva dimensión no es válido
   */
  public set id_dimension(nuevo_id_dimension: string) {
    const expresion_id_dimension = /^[A-Z]-?[A-Za-z0-9α-ωΑ-Ω]+$/;
    if (!expresion_id_dimension.test(nuevo_id_dimension)) {
      throw new Error("ERROR: ID de la dimensión introducido inválido");
    } 

    this.#id_dimension = nuevo_id_dimension;
  }

  /**
   * Modifica la población de la localización
   * @param nueva_poblacion - La nueva población que se le asignará
   * @throws Error - Lanza un error si la población es negativa
   */
  public set poblacion(nueva_poblacion: number) {
    if (nueva_poblacion < 0) {
      throw new Error("ERROR: La población no puede ser negativa");
    }

    this.#poblacion = nueva_poblacion;
  }

  /**
   * Modifica la descripción de la localización
   * @param nueva_descripcion - La nueva descripción que se le asignará
   */
  public set descripcion(nueva_descripcion: string) {
    this.#descripcion = nueva_descripcion;
  }
}