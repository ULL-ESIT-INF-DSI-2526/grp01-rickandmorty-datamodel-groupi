/**
 * Clase que representa a un personaje dentro del universo de Rick y Morty
 */
export class Personaje {
  #id: string;
  #nombre: string;
  #id_especie: string; // Referencia
  #id_dimension: string; // Referencia
  #estado: string;
  #afiliacion: string;
  #nivel_inteligencia: number;
  #descripcion: string;

  /**
   * Crea una instancia de la clase Personaje
   * @param id - Identificador único del personaje (Comienza por PER)
   * @param nombre - Nombre del personaje
   * @param id_especie - Referencia a la especie del personaje
   * @param id_dimension - Referencia a la dimension de origen del personaje
   * @param estado - Estado del personaje
   * @param afiliacion - Afiliación del personaje
   * @param nivel_inteligencia - Escala del 1 al 10 que refleja la inteligencia del personaje
   * @param descripcion - Notas sobre las particularidades del personaje
   * @throws Error - Lanza un error si el id del personaje, especie o dimensión no son válidos o si el nivel de inteligencia está fuera del rango permitido
   */
  constructor(id: string, nombre: string, id_especie: string, id_dimension: string, estado: string, afiliacion: string, nivel_inteligencia: number, descripcion: string) {
    const expresion_id = /^PER-[A-Za-z0-9-]+$/;
    const expresion_id_especie = /^ESP-[A-Za-z0-9-]+$/;
    const expresion_id_dimension = /^[A-Z]-?[A-Za-z0-9α-ωΑ-Ω]+$/;

    if (!expresion_id.test(id)) {
      throw new Error("ERROR: ID introducido inválido");
    } 

    if (!expresion_id_especie.test(id_especie)) {
      throw new Error("ERROR: ID de la especie introducido inválido");
    } 

    if (!expresion_id_dimension.test(id_dimension)) {
      throw new Error("ERROR: ID de la dimensión introducido inválido");
    } 

    if (nivel_inteligencia < 1 || nivel_inteligencia > 10) {
      throw new Error("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
    }

    this.#id = id;
    this.#nombre = nombre;
    this.#id_especie = id_especie;
    this.#id_dimension = id_dimension;
    this.#estado = estado;
    this.#afiliacion = afiliacion;
    this.#nivel_inteligencia = nivel_inteligencia;
    this.#descripcion = descripcion;
  }

  /**
   * Obtiene el identificador del personaje
   * @returns El id del personaje
   */
  public get id(): string {
    return this.#id;
  }
  
  /**
   * Obtiene el nombre del personaje
   * @returns El nombre del personaje
   */
  public get nombre(): string {
    return this.#nombre;
  }

  /**
   * Obtiene la referencia a la especie del personaje
   * @returns La referencia a la especie del personaje
   */
  public get id_especie(): string {
    return this.#id_especie;
  }

  /**
   * Obtiene la referencia a la dimension del personaje
   * @returns La referencia a la dimension del personaje
   */
  public get id_dimension(): string {
    return this.#id_dimension;
  }

  /**
   * Obtiene el estado del personaje
   * @returns El estado del personaje
   */
  public get estado(): string {
    return this.#estado;
  }


  /**
   * Obtiene la afiliacion del personaje
   * @returns La afiliacion del personaje
   */
  public get afiliacion(): string {
    return this.#afiliacion;
  }

  /**
   * Obtiene el nivel de inteligencia del personaje
   * @returns El nivel de inteligencia del personaje
   */
  public get nivel_inteligencia(): number {
    return this.#nivel_inteligencia;
  }
  
  /**
   * Obtiene la descripción del personaje
   * @returns La descripción del personaje
   */
  public get descripcion(): string {
    return this.#descripcion;
  }

  /**
   * Modifica el nombre del personaje
   * @param nuevo_nombre - El nuevo nombre que se le asignará
   */
  public set nombre(nuevo_nombre: string) {
    this.#nombre = nuevo_nombre;
  }

  /**
   * Modifica la especie del personaje
   * @param nuevo_id_especie - La nueva especie que se le asignará
   * @throws Error - Lanza un error si el id de la nueva especie no es válido
   */
  public set id_especie(nuevo_id_especie: string) {
    const expresion_id_especie = /^ESP-[A-Za-z0-9-]+$/;
    if (!expresion_id_especie.test(nuevo_id_especie)) {
      throw new Error("ERROR: ID de la especie introducido inválido");
    } 

    this.#id_especie = nuevo_id_especie;
  }

  /**
   * Modifica el estado del personaje
   * @param nuevo_estado - El nuevo estado que se le asignará
   */
  public set estado(nuevo_estado: string) {
    this.#estado = nuevo_estado;
  }

  /**
   * Modifica la afiliacion del personaje
   * @param nueva_afiliacion - La nueva afiliación que se le asignará
   */
  public set afiliacion(nueva_afiliacion: string) {
    this.#afiliacion = nueva_afiliacion;
  }

  /**
   * Modifica el nivel de inteligencia del personaje
   * @param nuevo_nivel_inteligencia - El nuevo nivel de inteligencia que se le asignará
   * @throws Error - Lanza un error si el nuevo nivel de inteligencia está fuera del rango permitido
   */
  public set nivel_inteligencia(nuevo_nivel_inteligencia: number) {
    if (nuevo_nivel_inteligencia < 1 || nuevo_nivel_inteligencia > 10) {
      throw new Error("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
    }

    this.#nivel_inteligencia = nuevo_nivel_inteligencia;
  }

  /**
   * Modifica la descripción del personaje
   * @param nueva_descripcion - La nueva descripción que se le asignará
   */
  public set descripcion(nueva_descripcion: string) {
    this.#descripcion = nueva_descripcion;
  }

}