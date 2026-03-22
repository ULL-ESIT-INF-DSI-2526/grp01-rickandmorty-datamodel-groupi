import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { IRepositorio } from "../interfaces/operaciones.js";
import { menuCrearPersonaje, menuCrearDimension, menuCrearEspecie, menuCrearArtefacto, menuCrearLocalizacion } from "./creacion.js"
import { menuEliminarPersonaje, menuEliminarDimension, menuEliminarEspecie, menuEliminarLocalizacion, menuEliminarArtefacto } from "./eliminacion.js"
import { menuModificarPersonaje, menuModificarDimension, menuModificarEspecie, menuModificarLocalizacion, menuModificarArtefacto } from "./modificacion.js"
import { menuBuscarVersiones, menuConsultarArtefactos, menuConsultarLocalizaciones, menuConsultarPersonajes } from "./consultas.js"
import { menuDesplegarArtefacto, menuEjecutarExperimento, menuNeutralizarArtefacto, menuRegistrarViaje } from "./eventos.js"
import { menuInformeDimensionesActivas, menuInformeHistorialViajes, menuInformeMayorVersion, menuMostrarAnomalias, menuMostrarPeligros } from "./informes.js"

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
   * Inicia el menú principal de la aplicación
   */
  public async iniciar(): Promise<void> {
    let salir = false;

    // Diccionario de comandos
    const acciones = new Map<string, () => Promise<void>>([
      // Creación
      ["ADD_DIM", () => menuCrearDimension(this.#gestor, this.#repositorio)],
      ["ADD_PER", () => menuCrearPersonaje(this.#gestor, this.#repositorio)],
      ["ADD_ESP", () => menuCrearEspecie(this.#gestor, this.#repositorio)],
      ["ADD_LOC", () => menuCrearLocalizacion(this.#gestor, this.#repositorio)],
      ["ADD_ART", () => menuCrearArtefacto(this.#gestor, this.#repositorio)],
      // Modificación
      ["MOD_PER", () => menuModificarPersonaje(this.#gestor, this.#repositorio)],
      ["MOD_DIM", () => menuModificarDimension(this.#gestor, this.#repositorio)],
      ["MOD_ESP", () => menuModificarEspecie(this.#gestor, this.#repositorio)],
      ["MOD_LOC", () => menuModificarLocalizacion(this.#gestor, this.#repositorio)],
      ["MOD_ART", () => menuModificarArtefacto(this.#gestor, this.#repositorio)],
      // Eliminación
      ["DEL_PER", () => menuEliminarPersonaje(this.#gestor, this.#repositorio)],
      ["DEL_DIM", () => menuEliminarDimension(this.#gestor, this.#repositorio)],
      ["DEL_ESP", () => menuEliminarEspecie(this.#gestor, this.#repositorio)],
      ["DEL_LOC", () => menuEliminarLocalizacion(this.#gestor, this.#repositorio)],
      ["DEL_ART", () => menuEliminarArtefacto(this.#gestor, this.#repositorio)],
      // Consultas
      ["CONSULTAR_LOC", () => menuConsultarLocalizaciones(this.#gestor)],
      ["CONSULTAR_PER", () => menuConsultarPersonajes(this.#gestor)],
      ["CONSULTAR_ART", () => menuConsultarArtefactos(this.#gestor)],
      ["SEARCH_VAR", () => menuBuscarVersiones(this.#gestor)],
      // Eventos
      ["VIAJE", () => menuRegistrarViaje(this.#gestor, this.#repositorio)],
      ["DESPLEGAR_ART", () => menuDesplegarArtefacto(this.#gestor)],
      ["NEUTRALIZAR_ART", () => menuNeutralizarArtefacto(this.#gestor)],
      ["EXPERIMENTO", () => menuEjecutarExperimento(this.#gestor, this.#repositorio)],
      // Informes
      ["INF_DIM", () => menuInformeDimensionesActivas(this.#gestor)],
      ["INF_MAYOR_VER", () => menuInformeMayorVersion(this.#gestor)],
      ["INF_VIAJES", () => menuInformeHistorialViajes(this.#gestor)],
      ["ANOM", () => menuMostrarAnomalias(this.#gestor)],
      ["PELIGRO", () => menuMostrarPeligros(this.#gestor)]
    ]);

    while (!salir) {
      console.clear();
      const { opcion } = await prompts({
        type: "select",
        name: "opcion",
        message: "=== GESTOR MULTIVERSAL RICK & MORTY ===",
        choices: [
          { title: "--- CREACIÓN ---", value: "", disabled: true },
          { title: "Nueva Dimensión", value: "ADD_DIM" },
          { title: "Nuevo Personaje", value: "ADD_PER" },
          { title: "Nueva Especie", value: "ADD_ESP" },
          { title: "Nueva Localización", value: "ADD_LOC" },
          { title: "Nuevo Artefacto", value: "ADD_ART" },

          { title: "--- MODIFICACIÓN ---", value: "", disabled: true },
          { title: "Modificar Personaje", value: "MOD_PER" },
          { title: "Modificar Dimensión", value: "MOD_DIM" },
          { title: "Modificar Especie", value: "MOD_ESP" },
          { title: "Modificar Localización", value: "MOD_LOC" },
          { title: "Modificar Artefacto", value: "MOD_ART" },

          { title: "--- ELIMINACIÓN ---", value: "", disabled: true },
          { title: "Eliminar Personaje", value: "DEL_PER" },
          { title: "Eliminar Dimensión", value: "DEL_DIM" },
          { title: "Eliminar Especie", value: "DEL_ESP" },
          { title: "Eliminar Localización", value: "DEL_LOC" },
          { title: "Eliminar Artefacto", value: "DEL_ART" },

          { title: "--- CONSULTAS ---", value: "", disabled: true },
          { title: "Consultar Localizaciones", value: "CONSULTAR_LOC" },
          { title: "Consultar Personajes", value: "CONSULTAR_PER"},
          { title: "Consultar Artefactos", value: "CONSULTAR_ART" },
          { title: "Buscar Variantes", value: "SEARCH_VAR" },

          { title: "--- EVENTOS ---", value: "", disabled: true },
          { title: "Registrar Viaje", value: "VIAJE" },
          { title: "Desplegar Artefacto", value: "DESPLEGAR_ART" },
          { title: "Neutralizar Artefacto", value: "NEUTRALIZAR_ART" },
          { title: "Ejecutar Experimento / Paradoja", value: "EXPERIMENTO" },

          { title: "--- INFORMES ---", value: "", disabled: true },
          { title: "Informe: Dimensiones Activas y Media", value: "INF_DIM" },
          { title: "Informe: Personajes con más versiones", value: "INF_MAYOR_VER" },
          { title: "Informe: Historial de viajes", value: "INF_VIAJES" },
          { title: "Informe: Anomalías", value: "ANOM" },
          { title: "Informe: Peligrosidad", value: "PELIGRO" },

          { title: "--- SALIR ---", value: "", disabled: true },
          { title: "Salir del gestor", value: "EXIT" },
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
