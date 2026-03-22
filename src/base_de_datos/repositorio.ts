import { Low } from "lowdb";
import { GestorMultiverso } from "../gestor.js";
import { EntidadesSchema, DimensionData, PersonajeData, EspecieData, LocalizacionData, ArtefactoData, RegistroViajeData } from "./schema.js";
import { IRepositorio } from "../interfaces/operaciones.js"

/**
 * Clase que representa el sistema de almacenamiento del multiverso
 * Se encarga de traducir los datos del Gestor al formato del archivo JSON para guardarlos
 */
export class RepositorioMultiverso implements IRepositorio {
  #gestor: GestorMultiverso;
  #db: Low<EntidadesSchema>;

  /**
   * Crea una instancia del Repositorio Multiverso
   * @param gestor - Referencia al gestor que contiene los datos en memoria
   * @param db - Referencia a la instancia de la base de datos Lowdb
   */
  constructor(gestor: GestorMultiverso, db: Low<EntidadesSchema>) {
    this.#gestor = gestor;
    this.#db = db;
  }

  
  /**
   * Extrae los datos actuales del GestorMultiverso y los guarda en el archivo JSON
   */
  public async guardar(): Promise<void> {
    this.#db.data = {
      dimensiones: this.#gestor.dimensiones.map((dim): DimensionData => ({
        id: dim.id,
        nombre: dim.nombre,
        estado: dim.estado,
        nivel_tecnologico: dim.nivel_tecnologico,
        descripcion: dim.descripcion,
      })),
      personajes: this.#gestor.personajes.map((per): PersonajeData => ({
        id: per.id,
        nombre: per.nombre,
        id_especie: per.id_especie,
        id_dimension: per.id_dimension,
        estado: per.estado,
        afiliacion: per.afiliacion,
        nivel_inteligencia: per.nivel_inteligencia,
        descripcion: per.descripcion,
      })),
      especies: this.#gestor.especies.map((esp): EspecieData => ({
        id: esp.id,
        nombre: esp.nombre,
        id_origen: esp.id_origen,
        tipo: esp.tipo,
        esperanza_de_vida: esp.esperanza_de_vida,
        descripcion: esp.descripcion,
      })),
      localizaciones: this.#gestor.localizaciones.map((loc): LocalizacionData => ({
        id: loc.id,
        nombre: loc.nombre,
        tipo: loc.tipo,
        id_dimension: loc.id_dimension,
        poblacion: loc.poblacion,
        descripcion: loc.descripcion,
      })),
      artefactos: this.#gestor.artefactos.map((art): ArtefactoData => ({
        id: art.id,
        nombre: art.nombre,
        id_inventor: art.id_inventor,
        tipo: art.tipo,
        nivel_peligrosidad: art.nivel_peligrosidad,
        descripcion: art.descripcion,
      })),
      historialViajes: this.#gestor.todosLosViajes.map((viaj): RegistroViajeData => ({
        id_personaje: viaj.id_personaje,
        id_dimension_origen: viaj.id_dimension_origen,
        id_dimension_destino: viaj.id_dimension_destino,
        fecha: viaj.fecha.toISOString(),
        motivo: viaj.motivo,
      })),
    };

    await this.#db.write();
  }
}
