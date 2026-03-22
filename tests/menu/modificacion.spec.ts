import { describe, expect, test, vi, beforeEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { Dimension } from "../../src/entidades/dimension.js";
import { Personaje } from "../../src/entidades/personaje.js";
import { Especie } from "../../src/entidades/especie.js";
import { Localizacion } from "../../src/entidades/localizacion.js";
import { Artefacto } from "../../src/entidades/artefacto.js";
import { IRepositorio } from "../../src/interfaces/operaciones.js";
import { menuModificarPersonaje, menuModificarDimension, menuModificarEspecie, menuModificarLocalizacion, menuModificarArtefacto } from "../../src/menu/modificacion.js";

vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

describe("Pruebas de Menús de Modificaciones", () => {
  let gestor: GestorMultiverso;
  let repositorio: IRepositorio;

  beforeEach(() => {
    repositorio = { guardar: vi.fn() } as unknown as IRepositorio;
    gestor = new GestorMultiverso(
      [new Dimension("C-137", "Tierra", "Activa", 1, "")],
      [new Personaje("PER-101", "Rick", "ESP-101", "C-137", "Vivo", "", 1, "")],
      [new Especie("ESP-101", "Humano", "C-137", "Mamífero", 1, "")],
      [new Localizacion("LOC-01", "Garaje", "Habitación", "C-137", 1, "")],
      [new Artefacto("ART-01", "Portal", "PER-101", "Tecnológico", 1, "")],
      []
    );
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  test("menuModificarPersonaje: ", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "" });
    await menuModificarPersonaje(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-99" });
    await menuModificarPersonaje(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-101" }).mockResolvedValueOnce({});
    await menuModificarPersonaje(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-101" }).mockResolvedValueOnce({ nombre: "Rick" });
    await menuModificarPersonaje(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-101" }).mockResolvedValueOnce({ nombre: "Rick" });
    vi.spyOn(gestor, "modificarPersonaje").mockImplementationOnce(() => { throw new Error("E"); });
    await menuModificarPersonaje(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-101" }).mockResolvedValueOnce({ nombre: "Rick" });
    vi.spyOn(gestor, "modificarPersonaje").mockImplementationOnce(() => { throw "Error de string"; });
    await menuModificarPersonaje(gestor, repositorio);
  });

  test("menuModificarDimension: ", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "" });
    await menuModificarDimension(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "C-999" });
    await menuModificarDimension(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" }).mockResolvedValueOnce({});
    await menuModificarDimension(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" }).mockResolvedValueOnce({ nombre: "Prueba" });
    await menuModificarDimension(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" }).mockResolvedValueOnce({ nombre: "Prueba" });
    vi.spyOn(gestor, "modificarDimension").mockImplementationOnce(() => { throw new Error("E"); });
    await menuModificarDimension(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "C-137" }).mockResolvedValueOnce({ nombre: "Prueba" });
    vi.spyOn(gestor, "modificarDimension").mockImplementationOnce(() => { throw 123; });
    await menuModificarDimension(gestor, repositorio);
  });

  test("menuModificarEspecie: ", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "" });
    await menuModificarEspecie(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-99" });
    await menuModificarEspecie(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-101" }).mockResolvedValueOnce({});
    await menuModificarEspecie(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-101" }).mockResolvedValueOnce({ nombre: "Lagarto" });
    await menuModificarEspecie(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-101" }).mockResolvedValueOnce({ nombre: "Lagarto" });
    vi.spyOn(gestor, "modificarEspecie").mockImplementationOnce(() => { throw new Error("E"); });
    await menuModificarEspecie(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ESP-101" }).mockResolvedValueOnce({ nombre: "Lagarto" });
    vi.spyOn(gestor, "modificarEspecie").mockImplementationOnce(() => { throw null; });
    await menuModificarEspecie(gestor, repositorio);
  });

  test("menuModificarLocalizacion: ", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "" });
    await menuModificarLocalizacion(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-99" });
    await menuModificarLocalizacion(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" }).mockResolvedValueOnce({});
    await menuModificarLocalizacion(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" }).mockResolvedValueOnce({ nombre: "Ciudad" });
    await menuModificarLocalizacion(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" }).mockResolvedValueOnce({ nombre: "Ciudad" });
    vi.spyOn(gestor, "modificarLocalizacion").mockImplementationOnce(() => { throw new Error("E"); });
    await menuModificarLocalizacion(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "LOC-01" }).mockResolvedValueOnce({ nombre: "Ciudad" });
    vi.spyOn(gestor, "modificarLocalizacion").mockImplementationOnce(() => { throw false; });
    await menuModificarLocalizacion(gestor, repositorio);
  });

  test("menuModificarArtefacto:", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "" });
    await menuModificarArtefacto(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-99" });
    await menuModificarArtefacto(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" }).mockResolvedValueOnce({});
    await menuModificarArtefacto(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" }).mockResolvedValueOnce({ nombre: "Portal" });
    await menuModificarArtefacto(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" }).mockResolvedValueOnce({ nombre: "Portal" });
    vi.spyOn(gestor, "modificarArtefacto").mockImplementationOnce(() => { throw new Error("E"); });
    await menuModificarArtefacto(gestor, repositorio);

    vi.mocked(prompts).mockResolvedValueOnce({ id: "ART-01" }).mockResolvedValueOnce({ nombre: "Portal" });
    vi.spyOn(gestor, "modificarArtefacto").mockImplementationOnce(() => { throw {}; });
    await menuModificarArtefacto(gestor, repositorio);
  });
});