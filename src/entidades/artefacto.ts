import { IArtefacto } from "../interfaces/entidades.js"

/**
 * Clase que representa a un artefacto dentro del universo de Rick y Morty
 */
export class Artefacto implements IArtefacto {
  #id: string;
  #nombre: string;
  #id_inventor: string; // Referencia
  #tipo: string;
  #nivel_peligrosidad: number;
  #descripcion: string;

  /**
   * Crea una instancia de la clase Artefacto
   * @param id - Identificador único del artefacto (Comienza por ART)
   * @param nombre - Nombre del artefacto
   * @param id_inventor - Referencia al inventor (personaje) del artefacto
   * @param tipo - Tipo del artefacto
   * @param nivel_peligrosidad - Escala del 1 al 10 que refleja la peligrosidad del artefacto
   * @param descripcion - Notas sobre las particularidades del artefacto
   * @throws Error - Lanza un error si el id del artefacto o inventor no son válidos o si el nivel de peligrosidad está fuera del rango permitido
   */
  constructor(id: string, nombre: string, id_inventor: string, tipo: string, nivel_peligrosidad: number, descripcion: string) {
    const expresion_id = /^ART-[A-Za-z0-9-]+$/;
    const expresion_id_inventor = /^PER-[A-Za-z0-9-]+$/;
    
    if (!expresion_id.test(id)) {
      throw new Error("ERROR: ID introducido inválido");
    } 

    if (!expresion_id_inventor.test(id_inventor)) {
      throw new Error("ERROR: ID del inventor introducido inválido");
    } 

    if (nivel_peligrosidad < 1 || nivel_peligrosidad > 10) {
      throw new Error("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    }

    this.#id = id;
    this.#nombre = nombre;
    this.#id_inventor = id_inventor;
    this.#tipo = tipo;
    this.#nivel_peligrosidad = nivel_peligrosidad;
    this.#descripcion = descripcion;
  }

  /**
   * Obtiene el identificador del artefacto
   * @returns El id del artefacto
   */
  public get id(): string {
    return this.#id;
  }
  
  /**
   * Obtiene el nombre del artefacto
   * @returns El nombre del artefacto
   */
  public get nombre(): string {
    return this.#nombre;
  }

  /**
   * Obtiene la referencia al personaje inventor
   * @returns La referencia al personaje inventor
   */
  public get id_inventor(): string {
    return this.#id_inventor;
  }

  /**
   * Obtiene el tipo del artefacto
   * @returns El tipo del artefacto 
   */
  public get tipo(): string {
    return this.#tipo;
  }


  /**
   * Obtiene el nivel de peligrosidad del artefacto
   * @returns El nivel de peligrosidad del artefacto
   */
  public get nivel_peligrosidad(): number {
    return this.#nivel_peligrosidad;
  }
  
  /**
   * Obtiene la descripción del artefacto
   * @returns La descripción del artefacto
   */
  public get descripcion(): string {
    return this.#descripcion;
  }

  /**
   * Modifica el nombre del artefacto
   * @param nuevo_nombre - El nuevo nombre que se le asignará
   */
  public set nombre(nuevo_nombre: string) {
    this.#nombre = nuevo_nombre;
  }

  /**
   * Modifica el inventor del artefacto
   * @param nuevo_id_inventor - El nuevo inventor que se le asignará
   */
  public set id_inventor(nuevo_id_inventor: string) {
    this.#id_inventor = nuevo_id_inventor;
  }

  /**
   * Modifica el tipo del artefacto
   * @param nuevo_tipo - El nuevo tipo que se le asignará
   */
  public set tipo(nuevo_tipo: string) {
    this.#tipo = nuevo_tipo;
  }

  /**
   * Modifica el nivel de peligrosidad del artefacto
   * @param nuevo_nivel_peligrosidad - El nuevo nivel de peligrosidad que se le asignará
   * @throws Error - Lanza un error si el nuevo nivel de peligrosidad está fuera del rango permitido
   */
  public set nivel_peligrosidad(nuevo_nivel_peligrosidad: number) {
    if (nuevo_nivel_peligrosidad < 1 || nuevo_nivel_peligrosidad > 10) {
      throw new Error("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    }

    this.#nivel_peligrosidad = nuevo_nivel_peligrosidad;
  }

  /**
   * Modifica la descripción del artefacto
   * @param nueva_descripcion - La nueva descripción que se le asignará
   */
  public set descripcion(nueva_descripcion: string) {
    this.#descripcion = nueva_descripcion;
  }

}