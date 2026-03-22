import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { Dimension } from "../../src/entidades/dimension.js";
import { Personaje } from "../../src/entidades/personaje.js";
import { Localizacion } from "../../src/entidades/localizacion.js";
import { Artefacto } from "../../src/entidades/artefacto.js";
import { Especie } from "../../src/entidades/especie.js";
import { menuBuscarVersiones, menuConsultarLocalizaciones, menuConsultarPersonajes, menuConsultarArtefactos } from "../../src/menu/consultas.js";

// Mockeamos para que no se quede colgado esperando el Enter
vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

describe("Menú de consultas", () => {
  let gestor: GestorMultiverso;
  let espiaLog: ReturnType<typeof vi.spyOn>;
  let espiaTabla: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Quitamos los console para que la terminal no se llene
    espiaLog = vi.spyOn(console, "log").mockImplementation(() => {});
    espiaTabla = vi.spyOn(console, "table").mockImplementation(() => {});

    const dim = new Dimension("C-137", "Tierra", "Activa", 10, "Test");
    const esp = new Especie("ESP-01", "Humano", "C-137", "Humanoide", 80, "Test");
    const loc = new Localizacion("LOC-01", "Citadela", "Estacion", "C-137", 100, "Test");
    const art = new Artefacto("ART-01", "Pistola", "PER-01", "Arma", 9, "Test");
    
    const per1 = new Personaje("PER-01", "Rick", "ESP-01", "C-137", "Vivo", "Ninguna", 2, "Test");
    const per2 = new Personaje("PER-02", "Morty", "ESP-01", "C-137", "Muerto", "Secundaria", 10, "Test");
    const per3 = new Personaje("PER-03", "Rick Clon", "ESP-01", "C-137", "Vivo", "Ninguna", 5, "Test");
    const per4 = new Personaje("PER-04", "Jerry", "ESP-01", "C-137", "Vivo", "Ninguna", 5, "Test");

    gestor = new GestorMultiverso([dim], [per1, per2, per3, per4], [esp], [loc], [art], []);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TESTS DE BUSCAR VERSIONES  
  test("Debería buscar un personaj y mostrar la tabla", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ nombre: "Rick" });
    await menuBuscarVersiones(gestor);
    expect(espiaTabla).toHaveBeenCalledTimes(1);
  })

  test("Debería salir si el usuario le da a enter sin poner nada", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({});
    await menuBuscarVersiones(gestor);
    expect(espiaTabla).not.toHaveBeenCalled();
  })

  // TESTS DE LOCALIZACIONES
  test("Localizaciones: filtro TODOS", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "TODOS" });
    await menuConsultarLocalizaciones(gestor);
    expect(espiaTabla).toHaveBeenCalledTimes(1);
  })

  test("Localizaciones: filtro por nombre", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "nombre" })
      .mockResolvedValueOnce({ valor: "Citadela" });
    await menuConsultarLocalizaciones(gestor);
    expect(espiaTabla).toHaveBeenCalledTimes(1);
  })

  test("Localizaciones: filtro por tipo", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "tipo" })
      .mockResolvedValueOnce({ valor: "Estacion" });
    await menuConsultarLocalizaciones(gestor);
    expect(espiaTabla).toHaveBeenCalledTimes(1);
  })

  test("Localizaciones: filtro por id_dimension", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "id_dimension" })
      .mockResolvedValueOnce({ valor: "C-137" });
    await menuConsultarLocalizaciones(gestor);
    expect(espiaTabla).toHaveBeenCalledTimes(1);
  })

  test("Localizaciones: filtro que no existe, tabla vacia", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "nombre" })
      .mockResolvedValueOnce({ valor: "XJ-9000" }); // no existe
    await menuConsultarLocalizaciones(gestor);
    expect(espiaLog).toHaveBeenCalledWith("No se encontraron localizaciones con esos criterios.");
  })

  test("Localizaciones: cancelar prompts", async () => {
    // cancela el primero
    vi.mocked(prompts).mockResolvedValueOnce({});
    await menuConsultarLocalizaciones(gestor);
    
    // cancela el segundo
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nombre" }).mockResolvedValueOnce({});
    await menuConsultarLocalizaciones(gestor);
  })

  // TESTS DE PERSONAJES
  test("Personajes: filtro por nombre y ordena por inteligencia descendente", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "nombre" })
      .mockResolvedValueOnce({ valor: "i" })
      .mockResolvedValueOnce({ criterio: "nivel_inteligencia", sentido: "DES" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: filtro por especie y ordena ascendente", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "id_especie" })
      .mockResolvedValueOnce({ valor: "ESP-01" })
      .mockResolvedValueOnce({ criterio: "nivel_inteligencia", sentido: "ASC" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: filtro por afiliacion", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "afiliacion" })
      .mockResolvedValueOnce({ valor: "Ninguna" })
      .mockResolvedValueOnce({ criterio: "nombre", sentido: "ASC" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: filtro por estado", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "estado" })
      .mockResolvedValueOnce({ valor: "Vivo" })
      .mockResolvedValueOnce({ criterio: "nombre", sentido: "DES" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: filtro por id_dimension", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "id_dimension" })
      .mockResolvedValueOnce({ valor: "C-137" })
      .mockResolvedValueOnce({ criterio: "nivel_inteligencia", sentido: "ASC" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: TODOS y ordenamos por nombre", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "TODOS" })
      .mockResolvedValueOnce({ criterio: "nombre", sentido: "ASC" });
    await menuConsultarPersonajes(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Personajes: Filtro falso", async () => {
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "nombre" })
      .mockResolvedValueOnce({ valor: "Pepe" }) // No hay ningun pepe
      .mockResolvedValueOnce({ criterio: "nombre", sentido: "ASC" });
    await menuConsultarPersonajes(gestor);
    expect(espiaLog).toHaveBeenCalledWith("No se encontraron personajes con dichos criterios.");
  })

  test("Personajes: cancelar a mitad de camino", async () => {
    // Falla el 1
    vi.mocked(prompts).mockResolvedValueOnce({});
    await menuConsultarPersonajes(gestor);

    // Falla el 2
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nombre" }).mockResolvedValueOnce({});
    await menuConsultarPersonajes(gestor);

    // Falla el 3
    vi.mocked(prompts)
      .mockResolvedValueOnce({ filtro: "nombre" })
      .mockResolvedValueOnce({ valor: "Rick" })
      .mockResolvedValueOnce({}); 
    await menuConsultarPersonajes(gestor);
  })

  // TESTS DE ARTEFACTOS
  test("Artefactos: filtro TODOS", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "TODOS" });
    await menuConsultarArtefactos(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Artefactos: filtro por nombre", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nombre" }).mockResolvedValueOnce({ valor: "Pistola" });
    await menuConsultarArtefactos(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Artefactos: filtro por tipo", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "tipo" }).mockResolvedValueOnce({ valor: "Arma" });
    await menuConsultarArtefactos(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Artefactos: filtro por id_inventor", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "id_inventor" }).mockResolvedValueOnce({ valor: "PER-01" });
    await menuConsultarArtefactos(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Artefactos: filtro por peligrosidad", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nivel_peligrosidad" }).mockResolvedValueOnce({ valor: "9" });
    await menuConsultarArtefactos(gestor);
    expect(espiaTabla).toHaveBeenCalled();
  })

  test("Artefactos: no encuentra nada", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nombre" }).mockResolvedValueOnce({ valor: "Cuchara" });
    await menuConsultarArtefactos(gestor);
    expect(espiaLog).toHaveBeenCalledWith("No se encontraron artefactos con esos criterios.");
  })

  test("Artefactos: cancelar prompt", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({});
    await menuConsultarArtefactos(gestor);

    vi.mocked(prompts).mockResolvedValueOnce({ filtro: "nombre" }).mockResolvedValueOnce({});
    await menuConsultarArtefactos(gestor);
  })

});