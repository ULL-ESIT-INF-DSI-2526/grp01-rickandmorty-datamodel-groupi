import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { IRepositorio } from "../../src/interfaces/operaciones.js";
import { Dimension } from "../../src/entidades/dimension.js";
import { Personaje } from "../../src/entidades/personaje.js";
import { Localizacion } from "../../src/entidades/localizacion.js";
import { Artefacto } from "../../src/entidades/artefacto.js";
import { Especie } from "../../src/entidades/especie.js";
import { menuRegistrarViaje, menuDesplegarArtefacto, menuNeutralizarArtefacto, menuEjecutarExperimento } from "../../src/menu/eventos.js"; 
import { menuCrearDimension } from "../../src/menu/creacion.js";

// Mockeamos prompts y pausas
vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

// Mockeamos el menú de creación porque lo llama el experimento
vi.mock("../../src/menu/creacion.js", () => ({
  menuCrearDimension: vi.fn(),
}));

describe("Menú de eventos", () => {
  let gestor: GestorMultiverso;
  let repositorio: IRepositorio;
  let espiaLog: ReturnType<typeof vi.spyOn>;
  let espiaError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    espiaLog = vi.spyOn(console, "log").mockImplementation(() => {});
    espiaError = vi.spyOn(console, "error").mockImplementation(() => {});

    const dim1 = new Dimension("C-137", "Tierra", "Activa", 10, "Test");
    const dim2 = new Dimension("C-131", "Tierra Reemplazo", "Activa", 10, "Test");
    const esp = new Especie("ESP-01", "Humano", "C-137", "Humanoide", 80, "Test");
    const loc = new Localizacion("LOC-01", "Citadela", "Estacion", "C-137", 100, "Test");
    const art = new Artefacto("ART-01", "Pistola de Portales", "PER-01", "Transporte", 9, "Test");
    const per = new Personaje("PER-01", "Rick", "ESP-01", "C-137", "Vivo", "Ninguna", 10, "Test");

    gestor = new GestorMultiverso([dim1, dim2], [per], [esp], [loc], [art], []);

    repositorio = {
      guardar: vi.fn().mockResolvedValue(undefined),
    } as unknown as IRepositorio;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TESTS DE REGISTRAR VIAJE
  describe("menuRegistrarViaje", () => {
    test("Debería registrar un viaje correctamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        personaje: "PER-01", destino: "C-131", motivo: "Huir" 
      });

      await menuRegistrarViaje(gestor, repositorio);

      expect(gestor.todosLosViajes.length).toBe(1);
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: El viaje ha sido procesado y guardado.");
    })

    test("Debería capturar el error si el personaje no existe", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        personaje: "PER-99", destino: "C-131", motivo: "Huir" 
      });

      await menuRegistrarViaje(gestor, repositorio);

      expect(espiaError).toHaveBeenCalledWith("ERROR: El personaje no existe en el multiverso");
      expect(repositorio.guardar).not.toHaveBeenCalled();
    })

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        personaje: "PER-01", destino: "C-131", motivo: "Huir" 
      });
      vi.spyOn(gestor, "registrarViaje").mockImplementationOnce(() => { throw "Error raro"; });
      
      await menuRegistrarViaje(gestor, repositorio);
      
      expect(espiaError).not.toHaveBeenCalled(); 
    })
  });

  // TESTS DE DESPLEGAR ARTEFACTO
  describe("menuDesplegarArtefacto", () => {
    test("Debería desplegar un artefacto correctamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        id_artefacto: "ART-01", id_localizacion: "LOC-01" 
      });

      await menuDesplegarArtefacto(gestor);

      expect(gestor.artefactosDesplegados.length).toBe(1);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Artefacto desplegado correctamente en la localización.");
    })

    test("Debería salir sin hacer nada si falta el id del artefacto", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_localizacion: "LOC-01" });
      await menuDesplegarArtefacto(gestor);
      expect(gestor.artefactosDesplegados.length).toBe(0);
    })

    test("Debería salir sin hacer nada si falta el id de la localización", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_artefacto: "ART-01" });
      await menuDesplegarArtefacto(gestor);
      expect(gestor.artefactosDesplegados.length).toBe(0);
    })

    test("Debería capturar el error si el artefacto no existe", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        id_artefacto: "ART-99", id_localizacion: "LOC-01" 
      });

      await menuDesplegarArtefacto(gestor);

      expect(espiaError).toHaveBeenCalledWith("ERROR: Artefacto no encontrado");
    })

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_artefacto: "ART-01", id_localizacion: "LOC-01" });
      vi.spyOn(gestor, "despliegueArtefacto").mockImplementationOnce(() => { throw "Error raro"; });
      await menuDesplegarArtefacto(gestor);
      expect(espiaError).not.toHaveBeenCalled(); 
    })
  });

  // TESTS DE NEUTRALIZAR ARTEFACTO
  describe("menuNeutralizarArtefacto", () => {
    beforeEach(() => {
      gestor.despliegueArtefacto("ART-01", "LOC-01");
    });

    test("Debería neutralizar un artefacto correctamente", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        id_artefacto: "ART-01", id_localizacion: "LOC-01" 
      });

      await menuNeutralizarArtefacto(gestor);

      expect(gestor.artefactosDesplegados.length).toBe(0);
      expect(espiaLog).toHaveBeenCalledWith("Sistema: Artefacto ART-01 neutralizado correctamente y retirado de la localización");
    })

    test("Debería salir sin hacer nada si falta el id del artefacto", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_localizacion: "LOC-01" });
      await menuNeutralizarArtefacto(gestor);
      expect(gestor.artefactosDesplegados.length).toBe(1); 
    })

    test("Debería salir sin hacer nada si falta el id de la localización", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_artefacto: "ART-01" });
      await menuNeutralizarArtefacto(gestor);
      expect(gestor.artefactosDesplegados.length).toBe(1); 
    })

    test("Debería capturar el error si no estaba desplegado", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ 
        id_artefacto: "ART-99", id_localizacion: "LOC-01" 
      });

      await menuNeutralizarArtefacto(gestor);

      expect(espiaError).toHaveBeenCalledWith("ERROR: El artefacto no se encuentra desplegado en esa localización");
    })

    test("Debería silenciar el error si no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ id_artefacto: "ART-01", id_localizacion: "LOC-01" });
      vi.spyOn(gestor, "neutralizarArtefacto").mockImplementationOnce(() => { throw "Error raro"; });
      await menuNeutralizarArtefacto(gestor);
      expect(espiaError).not.toHaveBeenCalled(); 
    })
  });

  // TESTS DE EXPERIMENTO
  describe("menuEjecutarExperimento", () => {
    test("Debería salir si el usuario no introduce tipo", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({});
      await menuEjecutarExperimento(gestor, repositorio);
      expect(prompts).toHaveBeenCalledTimes(1); 
    })

    test("Debería salir si el usuario elige cancelar", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ tipo: "cancelar" });
      await menuEjecutarExperimento(gestor, repositorio);
      expect(prompts).toHaveBeenCalledTimes(1);
    })

    test("Debería destruir una dimensión correctamente", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ tipo: "destruir" })
        .mockResolvedValueOnce({ id: "C-137" });

      await menuEjecutarExperimento(gestor, repositorio);

      expect(gestor.dimensiones[0].estado).toBe("Destruida"); 
      expect(repositorio.guardar).toHaveBeenCalledTimes(1);
      expect(espiaLog).toHaveBeenCalledWith("\n La dimensión C-137 ha colapsado y su estado ahora es 'Destruida'");
    })

    test("No debería hacer nada si elige destruir pero no pone ID", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ tipo: "destruir" })
        .mockResolvedValueOnce({}); 

      await menuEjecutarExperimento(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
    })

    test("Debería capturar el error si intenta destruir una dimensión que no existe", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ tipo: "destruir" })
        .mockResolvedValueOnce({ id: "FALSA" });

      await menuEjecutarExperimento(gestor, repositorio);

      expect(espiaError).toHaveBeenCalledWith("ERROR: La dimensión a destruir no existe en el multiverso");
    })

    test("Debería silenciar el error si en destruir no es una instancia de Error", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ tipo: "destruir" }).mockResolvedValueOnce({ id: "C-137" });
      vi.spyOn(gestor, "destruirDimension").mockImplementationOnce(() => { throw "Error raro"; });
      
      await menuEjecutarExperimento(gestor, repositorio);
      
      expect(espiaError).not.toHaveBeenCalled(); 
    })

    test("Debería llamar al menú de crear dimensión si elige crear", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ tipo: "crear" });

      await menuEjecutarExperimento(gestor, repositorio);

      expect(espiaLog).toHaveBeenCalledWith("\n El experimento ha creado una nueva dimensión");
      expect(menuCrearDimension).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería ignorar un tipo de experimento desconocido", async () => {
      vi.mocked(prompts).mockResolvedValueOnce({ tipo: "mutacion_extraña" });

      await menuEjecutarExperimento(gestor, repositorio);

      expect(repositorio.guardar).not.toHaveBeenCalled();
      expect(menuCrearDimension).not.toHaveBeenCalled();
    })
    
  });
});