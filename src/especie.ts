/**
 * Clase que representa a una especie dentro del universo de Rick y Morty
 */
export class Especie {
  #id: string;
  #nombre: string;
  #id_origen: string; // Referencia a la dimensión o localización
  #tipo: string;
  #esperanza_de_vida: number;
  #descripcion: string;

  /**
   * Crea una instancia de la clase Especie
   * @param id - Identificador único de la especie (Comienza por ESP)
   * @param nombre - Nombre de la especie
   * @param id_origen - Referencia al origen (dimension o localizacion) de la especie
   * @param tipo - Tipo de la especie
   * @param esperanza_de_vida - Esperanza de vida media de la especie
   * @param descripcion - Notas sobre las particularidades de la especie
   * @throws Error - Lanza un error si el id de la especie o del origen no son válids o si la esperanza de vida es negativa
   */
  constructor(id: string, nombre: string, id_origen: string, tipo: string, esperanza_de_vida: number, descripcion: string) {
    const expresion_id = /^ESP-[A-Za-z0-9-]+$/;
    const expresion_id_localizacion = /^LOC-[A-Za-z0-9-]+$/;
    const expresion_id_dimension = /^[A-Z]-?[A-Za-z0-9α-ωΑ-Ω]+$/; 

    if (!expresion_id.test(id)) {
      throw new Error("ERROR: ID introducido inválido");
    } 

    if (!expresion_id_localizacion.test(id_origen) && !expresion_id_dimension.test(id_origen)) {
      throw new Error("ERROR: ID origen introducido inválido");
    } 

    if (esperanza_de_vida < 0) {
      throw new Error("ERROR: La esperanza de vida no puede ser negativa");
    }
    
    this.#id = id;
    this.#nombre = nombre;
    this.#id_origen = id_origen;
    this.#tipo = tipo;
    this.#esperanza_de_vida = esperanza_de_vida;
    this.#descripcion = descripcion;  
  }

  /**
   * Obtiene el identificador de la especie
   * @returns El id de la especie
   */
  public get id(): string {
    return this.#id;
  }
  
  /**
   * Obtiene el nombre de la especie
   * @returns El nombre de la especie
   */
  public get nombre(): string {
    return this.#nombre;
  }

  /**
   * Obtiene la referencia al origen(dimensión o localización) de la especie
   * @returns La referencia al origen de la especie
   */
  public get id_origen(): string {
    return this.#id_origen;
  }

  /**
   * Obtiene el tipo de la especie
   * @returns El tipo de la especie
   */
  public get tipo(): string {
    return this.#tipo;
  }


  /**
   * Obtiene la esperanza de vida de la especie
   * @returns La esperanza de vida de la especie
   */
  public get esperanza_de_vida(): number {
    return this.#esperanza_de_vida;
  }
  
  /**
   * Obtiene la descripción de la especie
   * @returns La descripción de la especie
   */
  public get descripcion(): string {
    return this.#descripcion;
  }

  /**
   * Modifica el nombre de la especie
   * @param nuevo_nombre - El nuevo nombre que se le asignará
   */
  public set nombre(nuevo_nombre: string) {
    this.#nombre = nuevo_nombre;
  }

  /**
   * Modifica el tipo de la especie
   * @param nuevo_tipo - El nuevo tipo que se le asignará
   */
  public set tipo(nuevo_tipo: string) {
    this.#tipo = nuevo_tipo;
  }

  /**
   * Modifica la esperanza de vida de la especie
   * @param nueva_esperanza_vida - La nueva esperanza de vida que se le asignará
   * @throws Error - Lanza un error si la nueva esperanza de vida es negativa
   */
  public set esperanza_de_vida(nueva_esperanza_vida: number) {
    if (nueva_esperanza_vida < 0) {
      throw new Error("ERROR: La esperanza de vida no puede ser negativa");
    }

    this.#esperanza_de_vida = nueva_esperanza_vida;
  }

  /**
   * Modifica la descripción de la especie
   * @param nueva_descripcion - La nueva descripción que se le asignará
   */
  public set descripcion(nueva_descripcion: string) {
    this.#descripcion = nueva_descripcion;
  }

}