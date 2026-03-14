import { describe, expect, test } from "vitest";
import { GestorMultiverso } from "../src/gestor";
import { Dimension} from "../src/dimension";
import { Personaje } from "../src/personaje";
import { Localizacion } from "../src/localizacion";
import { Artefacto } from "../src/artefacto";
import { RegistroViaje } from "../src/registroviaje"; 

describe("Pruebas de la clase GestorMultiverso", () => {

  test("detectarAnomalias: Debería detectar dimensiones destruidas y personajes huérfanos", () => {
    const dimActiva = new Dimension("C-137", "Tierra C-137", "Activa", 8, "");
    const dimDestruida = new Dimension("C-500", "Mundo Cronenberg", "Destruida", 5, "");
    const rick = new Personaje("PER-001", "Rick Sanchez", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "");
    const morty = new Personaje("PER-002", "Morty", "ESP-001", "C-500", "Vivo", "Ninguna", 3, "");
    const gestor = new GestorMultiverso([dimActiva, dimDestruida], [rick, morty], [], [], [], []);
    const anomalias = gestor.detectarAnomalias();

    expect(anomalias.dimensionesDestruidas.length).toBe(1);
    expect(anomalias.dimensionesDestruidas[0].id).toBe("C-500");
    expect(anomalias.personajesSinDim.length).toBe(1);
    expect(anomalias.personajesSinDim[0].id).toBe("PER-002");
  });

  test("registrarViaje: Debería mover al personaje y guardar el historial", () => {
    const dimOrigen = new Dimension("C-137", "Tierra", "Activa", 8, "");
    const dimDestino = new Dimension("Z-001", "Plutón", "Activa", 4, "");
    const rick = new Personaje("PER-001", "Rick", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "");

    const gestor = new GestorMultiverso([dimOrigen, dimDestino], [rick], [], [], [], []);
    
    const viaje = gestor.registrarViaje("PER-001", "Z-001", "Aventura");
    
    expect(viaje.id_personaje).toBe("PER-001");
    expect(viaje.id_dimension_destino).toBe("Z-001");
    expect(rick.id_dimension).toBe("Z-001"); 
    expect(gestor.historialViajes(rick).length).toBe(1); 
    expect(() => { gestor.registrarViaje("PER-999", "Z-001", "Aventura"); }).toThrow("ERROR: El personaje no existe en el multiverso");
    expect(() => { gestor.registrarViaje("PER-001", "Z-999", "Aventura"); }).toThrow("ERROR: Esta dimensión no existe en el multiverso");
  });

  test("crearDimension y destruirDimension: Deberían modificar el array y los estados", () => {
    const gestor = new GestorMultiverso([], [], [], [], [], []);
    const nuevaDim = new Dimension("Z-999", "Dimensión de prueba", "Activa", 1, "Test");
    
    gestor.crearDimension(nuevaDim);
    expect(gestor.listadoDimActivas().length).toBe(1); 

    gestor.destruirDimension("Z-999");
    expect(gestor.listadoDimActivas().length).toBe(0); 

    expect(() => { gestor.destruirDimension("Z-989"); }).toThrow("ERROR: La dimensión a destruir no existe en el multiverso");
  });
  
  test("mayorVersionAlternativa: Debería devolver a los personajes con el nombre más repetido", () => {
    const morty1 = new Personaje("PER-002", "Morty Smith", "ESP-001", "C-137", "Vivo", "Ninguna", 3, "");
    const morty2 = new Personaje("PER-003", "Morty Smith", "ESP-001", "C-500", "Vivo", "Ninguna", 3, "");
    const rick = new Personaje("PER-001", "Rick Sanchez", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "");

    const gestor = new GestorMultiverso([], [morty1, morty2, rick], [], [], [], []);
    
    const maxVersiones = gestor.mayorVersionAlternativa();
    
    expect(maxVersiones.length).toBe(2);
    expect(maxVersiones[0].nombre).toBe("Morty Smith");
    expect(maxVersiones[1].nombre).toBe("Morty Smith");
  });

  test("ListadoDimActivas: Debería devolver solo las dimensiones activas", () => {
    const dimActiva = new Dimension("C-137", "Tierra C-137", "Activa", 8, "");
    const dimDestruida = new Dimension("C-500", "Mundo Cronenberg", "Destruida", 5, "");
    const gestor = new GestorMultiverso([dimActiva, dimDestruida], [], [], [], [], []);
    
    const activas = gestor.listadoDimActivas();
    
    expect(activas.length).toBe(1);
    expect(activas[0].id).toBe("C-137");
  });

  test("despliegueArtefacto: Debería registrar el despliegue o lanzar error si no existen", () => {
    const GarajeRick = new Localizacion("LOC-001", "Garaje de Rick", "Habitacion", "C-137", 2, "");
    const PistolaPortales = new Artefacto("ART-001", "Pistola Portales", "PER-001", "Viaje", 10, "");
    
    const gestor = new GestorMultiverso([], [], [], [GarajeRick], [PistolaPortales], []);

    gestor.despliegueArtefacto("ART-001", "LOC-001");
    expect(gestor.inventosMasPeligrosos().length).toBe(1);
    expect(() => { 
      gestor.despliegueArtefacto("ART-999", "LOC-001"); 
    }).toThrow("ERROR: Artefacto no encontrado");
    expect(() => { 
      gestor.despliegueArtefacto("ART-001", "LOC-999"); 
    }).toThrow("ERROR: Localización no encontrada");
  });

  test("inventosMasPeligrosos: Debería devolver inventos desplegados ordenados por peligrosidad", () => {
      const GarajeRick = new Localizacion("LOC-001", "Garaje de Rick", "Habitacion", "C-137", 2, "");
      const PistolaPortales = new Artefacto("ART-001", "Pistola Portales", "PER-001", "Viaje", 10, "");
      const ArmaPepinillo = new Artefacto("ART-002", "Arma Pepinillo", "PER-001", "Ayuda", 6, "");
      const nave = new Artefacto("ART-003", "Nave Espacial", "PER-001", "Vehiculo", 8, "");

      const misArtefactos = [PistolaPortales, ArmaPepinillo, nave];

      const gestor = new GestorMultiverso([], [], [], [GarajeRick], misArtefactos, []);

      gestor.despliegueArtefacto("ART-002", "LOC-001"); 
      gestor.despliegueArtefacto("ART-001", "LOC-001"); 
      gestor.despliegueArtefacto("ART-003", "LOC-001"); 

      misArtefactos.pop(); 

      const peligrosos = gestor.inventosMasPeligrosos();
      expect(peligrosos.length).toBe(2);
      expect(peligrosos[0].artefacto.nombre).toBe("Pistola Portales");
      expect(peligrosos[1].artefacto.nombre).toBe("Arma Pepinillo");
    });

  test("historialViajes: Debería devolver solo los viajes del personaje solicitado", () => {
    const rick = new Personaje("PER-001", "Rick Sanchez", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "");
    const morty = new Personaje("PER-002", "Morty Smith", "ESP-001", "C-137", "Vivo", "Ninguna", 3, "");

    const viajesDePrueba: RegistroViaje[] = [
      { id_personaje: "PER-001", id_dimension_origen: "C-137", id_dimension_destino: "C-500", fecha: new Date(), motivo: "Aventura" },
      { id_personaje: "PER-001", id_dimension_origen: "C-500", id_dimension_destino: "Z-001", fecha: new Date(), motivo: "Escapar" },
      { id_personaje: "PER-002", id_dimension_origen: "C-137", id_dimension_destino: "Z-001", fecha: new Date(), motivo: "Acompañar a Rick" }
    ];

    const gestor = new GestorMultiverso([], [rick, morty], [], [], [], viajesDePrueba);
    const historialRick = gestor.historialViajes(rick);
    const historialMorty = gestor.historialViajes(morty);
    expect(historialRick.length).toBe(2);
    expect(historialMorty.length).toBe(1);
    
    expect(historialMorty[0].motivo).toBe("Acompañar a Rick");
  });
});