import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { IRepositorio } from "../../src/interfaces/operaciones.js";
import { MenuInteractivo } from "../../src/menu/menu.js";
import { menuCrearPersonaje, menuCrearDimension, menuCrearEspecie, menuCrearArtefacto, menuCrearLocalizacion } from "../../src/menu/creacion.js";
import { menuEliminarPersonaje, menuEliminarDimension, menuEliminarEspecie, menuEliminarLocalizacion, menuEliminarArtefacto } from "../../src/menu/eliminacion.js";
import { menuModificarPersonaje, menuModificarDimension, menuModificarEspecie, menuModificarLocalizacion, menuModificarArtefacto } from "../../src/menu/modificacion.js";
import { menuBuscarVersiones, menuConsultarArtefactos, menuConsultarLocalizaciones, menuConsultarPersonajes } from "../../src/menu/consultas.js";
import { menuDesplegarArtefacto, menuEjecutarExperimento, menuNeutralizarArtefacto, menuRegistrarViaje } from "../../src/menu/eventos.js";
import { menuInformeDimensionesActivas, menuInformeHistorialViajes, menuInformeMayorVersion, menuMostrarAnomalias, menuMostrarPeligros } from "../../src/menu/informes.js";

// Mockeamos prompts
vi.mock("prompts");

//Mockeamos para que no se ejecute el código real al llamar desde el menú
vi.mock("../../src/menu/creacion.js");
vi.mock("../../src/menu/eliminacion.js");
vi.mock("../../src/menu/modificacion.js");
vi.mock("../../src/menu/consultas.js");
vi.mock("../../src/menu/eventos.js");
vi.mock("../../src/menu/informes.js");

describe("Menú principal", () => {
  let gestor: GestorMultiverso;
  let repositorio: IRepositorio;
  let menu: MenuInteractivo;
  let espiaClear: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    espiaClear = vi.spyOn(console, "clear").mockImplementation(() => {});
    gestor = {} as GestorMultiverso;
    repositorio = {} as IRepositorio;
    menu = new MenuInteractivo(gestor, repositorio);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Debería iniciar y salir si el usuario elige exit", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ opcion: "EXIT" });

    await menu.iniciar();

    expect(espiaClear).toHaveBeenCalledTimes(1);
    expect(prompts).toHaveBeenCalledTimes(1);
  })

  test("Debería salir si el usuario cancela el prompt", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ opcion: undefined });
    await menu.iniciar();
    expect(prompts).toHaveBeenCalledTimes(1);
  })

  test("Debería ejecutar una acción y luego salir", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ opcion: "ADD_DIM" })
      .mockResolvedValueOnce({ opcion: "EXIT" });

    await menu.iniciar();
    expect(espiaClear).toHaveBeenCalledTimes(2);
    expect(prompts).toHaveBeenCalledTimes(2);
    expect(menuCrearDimension).toHaveBeenCalledWith(gestor, repositorio);
  })

  test("Debería ignorar una opción no contemplada y volver a preguntar", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ opcion: "OPCION_INVENTADA" })
      .mockResolvedValueOnce({ opcion: "EXIT" });

    await menu.iniciar();
    expect(prompts).toHaveBeenCalledTimes(2);
    expect(menuCrearDimension).not.toHaveBeenCalled();
  })

  // TESTS DE CREACIÓN
  describe("Opciones de creación", () => {
    test("Debería llamar a menuCrearDimension", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ADD_DIM" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuCrearDimension).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuCrearPersonaje", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ADD_PER" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuCrearPersonaje).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuCrearEspecie", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ADD_ESP" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuCrearEspecie).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuCrearLocalizacion", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ADD_LOC" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuCrearLocalizacion).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuCrearArtefacto", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ADD_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuCrearArtefacto).toHaveBeenCalledWith(gestor, repositorio);
    })
  });

  // TESTS DE MODIFICACIÓN
  describe("Opciones de Modificación", () => {
    test("Debería llamar a menuModificarPersonaje", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "MOD_PER" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuModificarPersonaje).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuModificarDimension", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "MOD_DIM" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuModificarDimension).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuModificarEspecie", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "MOD_ESP" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuModificarEspecie).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuModificarLocalizacion", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "MOD_LOC" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuModificarLocalizacion).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuModificarArtefacto", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "MOD_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuModificarArtefacto).toHaveBeenCalledWith(gestor, repositorio);
    })
  });

  // TESTS DE ELIMINACIÓN
  describe("Opciones de eliminación", () => {
    test("Debería llamar a menuEliminarPersonaje", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DEL_PER" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEliminarPersonaje).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuEliminarDimension", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DEL_DIM" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEliminarDimension).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuEliminarEspecie", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DEL_ESP" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEliminarEspecie).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuEliminarLocalizacion", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DEL_LOC" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEliminarLocalizacion).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuEliminarArtefacto", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DEL_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEliminarArtefacto).toHaveBeenCalledWith(gestor, repositorio);
    })
  });

  // TESTS DE CONSULTAS
  describe("Opciones de consultas", () => {
    test("Debería llamar a menuConsultarLocalizaciones", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "CONSULTAR_LOC" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuConsultarLocalizaciones).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuConsultarPersonajes", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "CONSULTAR_PER" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuConsultarPersonajes).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuConsultarArtefactos", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "CONSULTAR_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuConsultarArtefactos).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuBuscarVersiones", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "SEARCH_VAR" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuBuscarVersiones).toHaveBeenCalledWith(gestor);
    })
  });

  // TESTS DE EVENTOS
  describe("Opciones de eventos", () => {
    test("Debería llamar a menuRegistrarViaje", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "VIAJE" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuRegistrarViaje).toHaveBeenCalledWith(gestor, repositorio);
    })

    test("Debería llamar a menuDesplegarArtefacto", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "DESPLEGAR_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuDesplegarArtefacto).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuNeutralizarArtefacto", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "NEUTRALIZAR_ART" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuNeutralizarArtefacto).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuEjecutarExperimento", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "EXPERIMENTO" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuEjecutarExperimento).toHaveBeenCalledWith(gestor, repositorio);
    })
  });

  // TESTS DE INFORMES
  describe("Opciones de informes", () => {
    test("Debería llamar a menuInformeDimensionesActivas", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "INF_DIM" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuInformeDimensionesActivas).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuInformeMayorVersion", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "INF_MAYOR_VER" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuInformeMayorVersion).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuInformeHistorialViajes", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "INF_VIAJES" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuInformeHistorialViajes).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuMostrarAnomalias", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "ANOM" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuMostrarAnomalias).toHaveBeenCalledWith(gestor);
    })

    test("Debería llamar a menuMostrarPeligros", async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({ opcion: "PELIGRO" })
        .mockResolvedValueOnce({ opcion: "EXIT" });
      await menu.iniciar();
      expect(menuMostrarPeligros).toHaveBeenCalledWith(gestor);
    })
  });
});
