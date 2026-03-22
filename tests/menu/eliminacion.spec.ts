import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { IRepositorio } from "../../src/interfaces/operaciones.js";
import {
  menuEliminarPersonaje,
  menuEliminarDimension,
  menuEliminarEspecie,
  menuEliminarLocalizacion,
  menuEliminarArtefacto,
} from "../../src/menu/eliminacion.js";

// Mockeamos para que no se quede colgado esperando el Enter
vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

describe("Menú de Eliminación", () => {
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

  // TESTS DE ELIMINAR PERSONAJE
  describe("menuEliminarPersonaje", () => {
    test("Debería eliminar un personaje y guardar exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-01" });
 
      vi.spyOn(gestor, "eliminarPersonaje").mockImplementationOnce(() => {});

      await menuEliminarPersonaje(gestor, repositorio);

      expect(gestor.eliminarPersonaje).toHaveBeenCalledWith("PER-01");
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Personaje PER-01 eliminado correctamente (borrado del multiverso)");
    });

    test("Debería salir sin guardar si el usuario cancela (prompt vacío)", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      
      await menuEliminarPersonaje(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error si el gestor lanza una excepción", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-01" });
      
      vi.spyOn(gestor, "eliminarPersonaje").mockImplementationOnce(() => { 
        throw new Error("El personaje no existe"); 
      });

      await menuEliminarPersonaje(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(espiaError).toHaveBeenCalledWith("El personaje no existe");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-01" });
      vi.spyOn(gestor, "eliminarPersonaje").mockImplementationOnce(() => { throw "Error de texto simple"; });
      
      await menuEliminarPersonaje(gestor, repositorio);
      
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE ELIMINAR DIMENSIÓN
  describe("menuEliminarDimension", () => {
    test("Debería eliminar una dimensión y guardar exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" });
      vi.spyOn(gestor, "eliminarDimension").mockImplementationOnce(() => {});

      await menuEliminarDimension(gestor, repositorio);

      expect(gestor.eliminarDimension).toHaveBeenCalledWith("C-137");
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Dimensión C-137 eliminada correctamente (borrada del multiverso)");
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuEliminarDimension(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error si el gestor lanza una excepción", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" });
      vi.spyOn(gestor, "eliminarDimension").mockImplementationOnce(() => { 
        throw new Error("La dimensión no existe"); 
      });

      await menuEliminarDimension(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(espiaError).toHaveBeenCalledWith("La dimensión no existe");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" });
      vi.spyOn(gestor, "eliminarDimension").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuEliminarDimension(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE ELIMINAR ESPECIE
  describe("menuEliminarEspecie", () => {
    test("Debería eliminar una especie y guardar exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-01" });
      vi.spyOn(gestor, "eliminarEspecie").mockImplementationOnce(() => {});

      await menuEliminarEspecie(gestor, repositorio);

      expect(gestor.eliminarEspecie).toHaveBeenCalledWith("ESP-01");
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Especie ESP-01 eliminada correctamente (borrada del multiverso)");
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuEliminarEspecie(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error si el gestor lanza una excepción", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-01" });
      vi.spyOn(gestor, "eliminarEspecie").mockImplementationOnce(() => { 
        throw new Error("La especie está en uso"); 
      });

      await menuEliminarEspecie(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(espiaError).toHaveBeenCalledWith("La especie está en uso");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-01" });
      vi.spyOn(gestor, "eliminarEspecie").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuEliminarEspecie(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });

  // TESTS DE ELIMINAR LOCALIZACIÓN
  describe("menuEliminarLocalizacion", () => {
    test("Debería eliminar una localización y guardar exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" });
      vi.spyOn(gestor, "eliminarLocalizacion").mockImplementationOnce(() => {});

      await menuEliminarLocalizacion(gestor, repositorio);

      expect(gestor.eliminarLocalizacion).toHaveBeenCalledWith("LOC-01");
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Localización LOC-01 eliminada correctamente (borrada del multiverso)");
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuEliminarLocalizacion(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error si el gestor lanza una excepción", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" });
      vi.spyOn(gestor, "eliminarLocalizacion").mockImplementationOnce(() => { 
        throw new Error("No se pudo eliminar la localización"); 
      });

      await menuEliminarLocalizacion(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(espiaError).toHaveBeenCalledWith("No se pudo eliminar la localización");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" });
      vi.spyOn(gestor, "eliminarLocalizacion").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuEliminarLocalizacion(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });


  // TESTS DE ELIMINAR ARTEFACTO
  describe("menuEliminarArtefacto", () => {
    test("Debería eliminar un artefacto y guardar exitosamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" });
      vi.spyOn(gestor, "eliminarArtefacto").mockImplementationOnce(() => {});

      await menuEliminarArtefacto(gestor, repositorio);

      expect(gestor.eliminarArtefacto).toHaveBeenCalledWith("ART-01");
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Artefacto ART-01 eliminado correctamente (borrado del multiverso)");
    });

    test("Debería salir sin guardar si el usuario cancela", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuEliminarArtefacto(gestor, repositorio);
      expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    test("Debería capturar e imprimir un error si el gestor lanza una excepción", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" });
      vi.spyOn(gestor, "eliminarArtefacto").mockImplementationOnce(() => { 
        throw new Error("Artefacto no encontrado"); 
      });

      await menuEliminarArtefacto(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(espiaError).toHaveBeenCalledWith("Artefacto no encontrado");
    });

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" });
      vi.spyOn(gestor, "eliminarArtefacto").mockImplementationOnce(() => { throw "Error de texto simple"; });
      await menuEliminarArtefacto(gestor, repositorio);
      expect(espiaError).not.toHaveBeenCalled(); 
    });
  });
});