import { describe, expect, test, vi, beforeEach } from "vitest";
import prompts from "prompts";
import { GestorMultiverso } from "../../src/gestor.js";
import { Dimension } from "../../src/entidades/dimension.js";
import { Personaje } from "../../src/entidades/personaje.js";
import { Artefacto } from "../../src/entidades/artefacto.js";
import { Localizacion } from "../../src/entidades/localizacion.js";
import { menuMostrarAnomalias, menuMostrarPeligros, menuInformeDimensionesActivas, menuInformeMayorVersion, menuInformeHistorialViajes } from "../../src/menu/informes.js";

// Mockeamos para que no se quede colgado esperando el Enter
vi.mock("prompts");
vi.mock("../../src/menu/utilidades.js", () => ({ pausa: vi.fn() }));

describe("Pruebas del Menú, Informes y funciones de mostrar", () => {
  let gestor: GestorMultiverso;
  let art: Artefacto;
  let loc: Localizacion;
  let per: Personaje;

  beforeEach(() => {
    
    art = new Artefacto("ART-1", "Pistola", "PER-101", "Arma", 10, "");
    loc = new Localizacion("LOC-1", "Garaje", "Casa", "C-137", 1, "");
    per = new Personaje("PER-01", "Rick", "ESP-101", "C-137", "Vivo", "", 10, "");
    
    gestor = new GestorMultiverso([], [], [], [], [], []);
    
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  test("menuMostrarPeligros: Debería mostrar el reporte", async () => {
    vi.spyOn(gestor, "inventosMasPeligrosos").mockReturnValue([{ artefacto: art, localizacion: loc }]);

    await menuMostrarPeligros(gestor);
    
    expect(console.log).toHaveBeenCalledWith("\n--- REPORTE DE SEGURIDAD: ARTEFACTOS PELIGROSOS ---");
    expect(console.table).toHaveBeenCalled();
  });

  test("menuMostrarAnomalias: ", async () => {
    vi.spyOn(gestor, "detectarAnomalias").mockReturnValue({ 
      personajesSinDim: [per], 
      dimensionesDestruidas: [] 
    });

    await menuMostrarAnomalias(gestor);
    expect(console.table).toHaveBeenCalled();
  });

  test("menuInformeDimensionesActivas: Debería calcular la media tecnológica o avisar si no hay", async () => {
    await menuInformeDimensionesActivas(gestor);
    expect(console.log).toHaveBeenCalledWith("No hay dimensiones activas en este momento");

    const d1 = new Dimension("C-137", "Tierra", "Activa", 10, "");
    const d2 = new Dimension("C-138", "Marte", "Activa", 6, "");
    const gestorConDatos = new GestorMultiverso([d1, d2], [], [], [], [], []);

    await menuInformeDimensionesActivas(gestorConDatos);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("8.00/10"));
  });

  test("menuInformeMayorVersion: Debería mostrar la tabla si hay datos o error si no", async () => {
    await menuInformeMayorVersion(gestor);
    expect(console.log).toHaveBeenCalledWith("No hay suficientes datos registrados");

    vi.spyOn(gestor, "mayorVersionAlternativa").mockReturnValue([{ nombre: "Rick", cantidad: 3 }]);
    await menuInformeMayorVersion(gestor);
    expect(console.table).toHaveBeenCalled();
  });

  test("menuInformeHistorialViajes: Éxito al mostrar historial con viajes", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-01" });
    const viaje = { 
      id_personaje: "PER-01",
      fecha: new Date(), 
      id_dimension_origen: "C-137", 
      id_dimension_destino: "C-138", 
      motivo: "Test" 
    };
    
    const gestorConPer = new GestorMultiverso([], [per], [], [], [], []);
    vi.spyOn(gestorConPer, "historialViajes").mockReturnValue([viaje]);

    await menuInformeHistorialViajes(gestorConPer);
    
    expect(console.log).toHaveBeenCalledWith("\n--- HISTORIAL DE VIAJES: RICK ---");
    expect(console.table).toHaveBeenCalled();
  });

  test("menuInformeHistorialViajes: Mensaje cuando el personaje no tiene viajes", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "PER-01" });
    const gestorConPer = new GestorMultiverso([], [per], [], [], [], []);
    vi.spyOn(gestorConPer, "historialViajes").mockReturnValue([]);

    await menuInformeHistorialViajes(gestorConPer);

    expect(console.log).toHaveBeenCalledWith("\n--- HISTORIAL DE VIAJES: RICK ---");
    expect(console.log).toHaveBeenCalledWith("Este personaje no ha realizado ningún viaje interdimensional");
  });

  test("menuInformeHistorialViajes: Error si el personaje no existe", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({ id: "ID-FALSO" });
    await menuInformeHistorialViajes(gestor);
    expect(console.log).toHaveBeenCalledWith("Sistema: Personaje no encontrado");
  });

  test("menuInformeHistorialViajes: Salida inmediata si se cancela el prompt", async () => {
    vi.mocked(prompts).mockResolvedValueOnce({});
    await menuInformeHistorialViajes(gestor);
    expect(console.log).not.toHaveBeenCalled();
  });
});