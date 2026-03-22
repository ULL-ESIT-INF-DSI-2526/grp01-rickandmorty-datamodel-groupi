import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { IRepositorio } from "../../src/interfaces/operaciones.js";
import {
  menuCrearDimension,
  menuCrearPersonaje,
  menuCrearEspecie,
  menuCrearLocalizacion,
  menuCrearArtefacto,
} from "../../src/menu/creacion.js";

// Mockeamos para que no se quede colgado esperando el Enter
vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

describe("Menú de Creación", () => {
  let gestor: GestorMultiverso;
  let repositorio: IRepositorio;
  let espiaLog: ReturnType<typeof vi.spyOn>;
  let espiaError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Quitamos los console para que la terminal no se llene de basura
    espiaLog = vi.spyOn(console, "log").mockImplementation(() => {});
    espiaError = vi.spyOn(console, "error").mockImplementation(() => {});

    gestor = new GestorMultiverso([], [], [], [], [], []);

    repositorio = {
      guardar: vi.fn().mockResolvedValue(undefined),
    } as unknown as IRepositorio;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TESTS DE CREAR DIMENSIÓN
  describe("menuCrearDimension", () => {
    test("Debería crear una dimensión y guardarla exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "C-137", nombre: "Tierra", estado: "Activa", nivel_tecnologico: 10, descripcion: "Test",
      });
      await menuCrearDimension(gestor, repositorio);
      expect(gestor.dimensiones.length).toBe(1);
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Dimensión guardada.");
    });

    test("Debería salir sin guardar si el usuario cancela (prompt vacío)", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuCrearDimension(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería salir sin guardar si el prompt devuelve datos pero sin ID", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Tierra" });
      await menuCrearDimension(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error por validación de ID inválido", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "137-C", nombre: "Tierra", estado: "Activa", nivel_tecnologico: 10, descripcion: "Test",
      });
      await menuCrearDimension(gestor, repositorio);
      expect(espiaError).toHaveBeenCalledWith("ERROR: ID introducido inválido");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "C-137", nombre: "Tierra", estado: "Activa", nivel_tecnologico: 10, descripcion: "Test",
      });
      vi.spyOn(gestor, "crearDimension").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuCrearDimension(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE CREAR PERSONAJE
  describe("menuCrearPersonaje", () => {
    test("Debería crear un personaje y guardarlo exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "PER-01", nombre: "Rick", id_especie: "ESP-01", id_dimension: "C-137", estado: "Vivo", afiliacion: "Ninguna", nivel_inteligencia: 10, descripcion: "Test",
      });
      await menuCrearPersonaje(gestor, repositorio);
      expect(gestor.personajes.length).toBe(1);
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuCrearPersonaje(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería salir sin guardar si el prompt devuelve datos pero sin ID", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Rick" });
      await menuCrearPersonaje(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar el error por validación de rango de inteligencia", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "PER-01", nombre: "Rick", id_especie: "ESP-01", id_dimension: "C-137", estado: "Vivo", afiliacion: "Ninguna", nivel_inteligencia: 99, descripcion: "Test",
      });
      await menuCrearPersonaje(gestor, repositorio);
      expect(espiaError).toHaveBeenCalledWith("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "PER-01", nombre: "Rick", id_especie: "ESP-01", id_dimension: "C-137", estado: "Vivo", afiliacion: "Ninguna", nivel_inteligencia: 10, descripcion: "Test",
      });
      vi.spyOn(gestor, "crearPersonaje").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuCrearPersonaje(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE CREAR ESPECIE
  describe("menuCrearEspecie", () => {
    test("Debería crear una especie y guardarla exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ESP-01", nombre: "Humano", id_origen: "C-137", tipo: "Humanoide", esperanza_de_vida: 80, descripcion: "Test",
      });
      await menuCrearEspecie(gestor, repositorio);
      expect(gestor.especies.length).toBe(1);
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuCrearEspecie(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería salir sin guardar si el prompt devuelve datos pero sin ID", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Humano" });
      await menuCrearEspecie(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar el error por validación de esperanza de vida negativa", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ESP-01", nombre: "Humano", id_origen: "C-137", tipo: "Humanoide", esperanza_de_vida: -5, descripcion: "Test",
      });
      await menuCrearEspecie(gestor, repositorio);
      expect(espiaError).toHaveBeenCalledWith("ERROR: La esperanza de vida no puede ser negativa");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ESP-01", nombre: "Humano", id_origen: "C-137", tipo: "Humanoide", esperanza_de_vida: 80, descripcion: "Test",
      });
      vi.spyOn(gestor, "crearEspecie").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuCrearEspecie(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE CREAR LOCALIZACIÓN
  describe("menuCrearLocalizacion", () => {
    test("Debería crear una localización y guardarla exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "LOC-01", nombre: "Citadela", tipo: "Estacion", id_dimension: "C-137", poblacion: 100, descripcion: "Test",
      });
      await menuCrearLocalizacion(gestor, repositorio);
      expect(gestor.localizaciones.length).toBe(1);
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuCrearLocalizacion(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería salir sin guardar si el prompt devuelve datos pero sin ID", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Citadela" });
      await menuCrearLocalizacion(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar el error por validación de población negativa", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "LOC-01", nombre: "Citadela", tipo: "Estacion", id_dimension: "C-137", poblacion: -50, descripcion: "Test",
      });
      await menuCrearLocalizacion(gestor, repositorio);
      expect(espiaError).toHaveBeenCalledWith("ERROR: La población no puede ser negativa");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "LOC-01", nombre: "Citadela", tipo: "Estacion", id_dimension: "C-137", poblacion: 100, descripcion: "Test",
      });
      vi.spyOn(gestor, "crearLocalizacion").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuCrearLocalizacion(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE CREAR ARTEFACTO
  describe("menuCrearArtefacto", () => {
    test("Debería crear un artefacto y guardarlo exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ART-01", nombre: "Pistola", id_inventor: "PER-01", tipo: "Arma", nivel_peligrosidad: 9, descripcion: "Test",
      });
      await menuCrearArtefacto(gestor, repositorio);
      expect(gestor.artefactos.length).toBe(1);
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuCrearArtefacto(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería salir sin guardar si el prompt devuelve datos pero sin ID", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Pistola" });
      await menuCrearArtefacto(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar el error por validación de ID de inventor incorrecto", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ART-01", nombre: "Pistola", id_inventor: "FALSO-01", tipo: "Arma", nivel_peligrosidad: 9, descripcion: "Test",
      });
      await menuCrearArtefacto(gestor, repositorio);
      expect(espiaError).toHaveBeenCalledWith("ERROR: ID del inventor introducido inválido");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({
        id: "ART-01", nombre: "Pistola", id_inventor: "PER-01", tipo: "Arma", nivel_peligrosidad: 9, descripcion: "Test",
      });
      vi.spyOn(gestor, "crearArtefacto").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuCrearArtefacto(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });
});