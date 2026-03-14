
/**
 * Define los posibles estados de una dimensión
 */
export type Estado = "Activa" | "Destruida" | "En cuarentena";

/**
 * Clase que representa a una dimensión dentro del universo de Rick y Morty
 */
export class Dimension {
  #id: string;
  #nombre: string;
  #estado: Estado;
  #nivel_tecnologico: number;
  #descripcion: string;

  /**
   * Crea una instancia de la clase Dimension
   * @param id - Identificador único de la dimensión
   * @param nombre - Nombre de la dimensión
   * @param estado - Estado de la dimensión (activa, destruida o en cuarentena)
   * @param nivel_tecnologico - Escala del 1 al 10 que refleja el avance científico medio de sus habitantes
   * @param descripcion - Notas sobre las particularidades de la dimensión
   * @throws Error - Lanza un error si el id de la dimensión no es válido o si el nivel tecnológico introducido está fuera del rango
   */
  constructor(id: string, nombre: string, estado: Estado, nivel_tecnologico: number, descripcion: string) {
    const expresion_id = /^[A-Z]-?[A-Za-z0-9α-ωΑ-Ω]+$/;
    if (!expresion_id.test(id)) {
      throw new Error("ERROR: ID introducido inválido");
    } 

    if (nivel_tecnologico < 1 || nivel_tecnologico > 10) {
      throw new Error("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
    }
    
    this.#id = id;
    this.#nombre = nombre;
    this.#estado = estado;
    this.#nivel_tecnologico = nivel_tecnologico;
    this.#descripcion = descripcion;
  }

  /**
   * Obtiene el identificador de la dimensión
   * @returns El id de la dimensión
   */
  public get id(): string {
    return this.#id;
  }

  /**
   * Obtiene el nombre de la dimensión
   * @returns El nombre de la dimensión
   */
  public get nombre(): string {
    return this.#nombre;
  }

  /**
   * Obtiene el estado de la dimensión
   * @returns El estado de la dimensión
   */
  public get estado(): Estado {
    return this.#estado;
  }

  /**
   * Obtiene el nivel tecnológico de la dimensión
   * @returns El nivel tecnológico de la dimensión
   */
  public get nivel_tecnologico(): number {
    return this.#nivel_tecnologico;
  }

  /**
   * Obtiene la descripción de la dimensión
   * @returns La descripción de la dimensión
   */
  public get descripcion(): string {
    return this.#descripcion;
  }

  /**
   * Modifica el nombre de la dimensión
   * @param nuevo_nombre - El nuevo nombre que se le asignará
   */
  public set nombre(nuevo_nombre: string) {
    this.#nombre = nuevo_nombre;
  }

  /**
   * Modifica el estado de la dimensión
   * @param nuevo_estado - El nuevo estado que se le asignará
   */
  public set estado(nuevo_estado: Estado) {
    this.#estado = nuevo_estado;
  }

  /**
   * Modifica el nivel tecnológico de la dimensión
   * @param nuevo_nivel_tecnologico - El nuevo nivel tecnológico que se le asignará
   * @throws Error - Lanza un error si el nuevo nivel tecnológico está fuera del rango permitido
   */
  public set nivel_tecnologico(nuevo_nivel_tecnologico: number) {
    if (nuevo_nivel_tecnologico < 1 || nuevo_nivel_tecnologico > 10) {
      throw new Error("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
    }

    this.#nivel_tecnologico = nuevo_nivel_tecnologico;
  }

  /**
   * Modifica la descripción de la dimensión
   * @param nueva_descripcion - La nueva descripción que se le asignará
   */
  public set descripcion(nueva_descripcion: string) {
    this.#descripcion = nueva_descripcion;
  }

}