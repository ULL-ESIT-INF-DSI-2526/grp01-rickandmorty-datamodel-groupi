import { describe, expect, test } from "vitest";
import { Localizacion } from "../../src/entidades/localizacion.js";

describe("Clase Localizacion", () => {
  const id_valido = "LOC-001"; 
  const nombre_valido = "Citadela de los Ricks";
  const tipo_valido = "Estación espacial";
  const dim_referencia = "C-137";
  const poblacion_valida = 500000;
  const descripcion_valida = "Punto de encuentro político del Consejo de Ricks.";

  test("Creación de instancia y getters básicos", () => {
    const loc = new Localizacion(
      id_valido, 
      nombre_valido, 
      tipo_valido, 
      dim_referencia, 
      poblacion_valida, 
      descripcion_valida
    );
    
    expect(loc.id).toBe("LOC-001");
    expect(loc.nombre).toBe("Citadela de los Ricks");
    expect(loc.tipo).toBe("Estación espacial");
    expect(loc.id_dimension).toBe("C-137");
    expect(loc.poblacion).toBe(500000);
    expect(loc.descripcion).toBe(descripcion_valida);
  })

  test("Debería lanzar error si el ID no comienza por LOC-", () => {
    expect(() => {
      new Localizacion("001-LOC", "Planeta Gazorpazorp", "Planeta", "C-137", 100, "Desc");
    }).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si la referencia a la dimensión es inválida", () => {
    expect(() => {
      new Localizacion(id_valido, nombre_valido, tipo_valido, "DIM-INVALIDA", 100, "Desc");
    }).toThrow("ERROR: ID de la dimensión introducido inválido");
  })

  test("Debería lanzar error con población negativa en el constructor", () => {
    expect(() => {
      new Localizacion(id_valido, nombre_valido, tipo_valido, dim_referencia, -500, "Desc");
    }).toThrow("ERROR: La población no puede ser negativa");
  })

  test("Setters: actualización de nombre, tipo y descripción", () => {
    const loc = new Localizacion(id_valido, nombre_valido, tipo_valido, dim_referencia, 0, "Desc original");
    
    loc.nombre = "Sector 7-G";
    loc.tipo = "Dimensión de bolsillo";
    loc.descripcion = "Características geográficas y políticas destacadas";
    
    expect(loc.id).toBe("LOC-001"); 
    expect(loc.nombre).toBe("Sector 7-G");
    expect(loc.tipo).toBe("Dimensión de bolsillo");
    expect(loc.descripcion).toBe("Características geográficas y políticas destacadas");
  })

  test("Setter id_dimension: cambio de referencia de dimensión con ID del Consejo", () => {
    const loc = new Localizacion(id_valido, nombre_valido, tipo_valido, dim_referencia, 0, "Desc");

    loc.id_dimension = "J19ζ7";
    expect(loc.id_dimension).toBe("J19ζ7");
    
    expect(() => { loc.id_dimension = "ERROR-404"; }).toThrow("ERROR: ID de la dimensión introducido inválido");
  })

  test("Setter poblacion: actualización y validación", () => {
    const loc = new Localizacion("LOC-002", "Planeta Gazorpazorp", "Planeta", "C-137", 1000, "Desc");
    
    loc.poblacion = 2000;
    expect(loc.poblacion).toBe(2000);
    
    expect(() => { loc.poblacion = -1; }).toThrow("ERROR: La población no puede ser negativa");
  })
});