import { describe, expect, test } from "vitest";
import { GestorMultiverso } from "../src/gestor.js";
import { Dimension} from "../src/entidades/dimension.js";
import { Personaje } from "../src/entidades/personaje.js";
import { Localizacion } from "../src/entidades/localizacion.js";
import { Artefacto } from "../src/entidades/artefacto.js";
import { RegistroViaje } from "../src/interfaces/registroviaje.js"; 
import { Especie } from "../src/entidades/especie.js";

describe("Pruebas de la clase GestorMultiverso", () => {

  test("Testa para ver si los Getters funcionan correctamente", () => {
    const dim = new Dimension("C-137", "Tierra", "Activa", 10, "Origen");
    const per = new Personaje("PER-01", "Rick", "ESP-01", "C-137", "Vivo", "Ricks", 10, "");
    const esp = new Especie("ESP-01", "Humano", "C-137", "Mamífero", 80, "");
    
    const gestor = new GestorMultiverso([dim], [per], [esp], [], [], []);

    expect(gestor.dimensiones.length).toBe(1);
    expect(gestor.personajes.length).toBe(1);
    expect(gestor.especies.length).toBe(1);
  });
  
  describe("Tests para las creaciones", () => {
    test("crearPersonaje: Debería añadir un personaje y lanzar error si el ID ya existe", () => {
      const gestor = new GestorMultiverso([], [], [], [], [], []);
      const p1 = new Personaje("PER-01", "Morty", "ESP-01", "C-137", "Vivo", "", 3, "");
      
      gestor.crearPersonaje(p1);
      expect(gestor.personajes.length).toBe(1);
      // Caso de error
      expect(() => gestor.crearPersonaje(p1)).toThrow("ERROR: Ya existe un personaje con el ID PER-01");
    });

    test("crearEspecie: Debería añadir una especie y controlar IDs duplicados", () => {
      const gestor = new GestorMultiverso([], [], [], [], [], []);
      const esp = new Especie("ESP-01", "Alien", "C-137", "Desconocido", 1000, "");

      gestor.crearEspecie(esp);
      expect(gestor.especies.length).toBe(1);
      // Caso de error
      expect(() => gestor.crearEspecie(esp)).toThrow("ERROR: Ya existe una especie con el ID ESP-01");
    });

    test("crearLocalizacion: Debería añadir una localización correctamente", () => {
      const gestor = new GestorMultiverso([], [], [], [], [], []);
      const loc = new Localizacion("LOC-01", "Ciudadela", "Estación", "C-137", 100000, "");

      gestor.crearLocalizacion(loc);
      expect(gestor.localizaciones.length).toBe(1);
      // Caso de error
      expect(() => gestor.crearLocalizacion(loc)).toThrow("ERROR: Ya existe una localización con el ID LOC-01");
    });

    test("crearArtefacto: Debería añadir un artefacto a la lista", () => {
      const gestor = new GestorMultiverso([], [], [], [], [], []);
      const art = new Artefacto("ART-01", "Portal", "PER-01", "Tecnológico", 10, "");

      gestor.crearArtefacto(art);
      expect(gestor.artefactos.length).toBe(1);
      // Caso de error 
      expect(() => gestor.crearArtefacto(art)).toThrow("ERROR: Ya existe un artefacto con el ID ART-01");
    });

    test("crearDimension: Deberían añadir una dimensión", () => {
      const gestor = new GestorMultiverso([], [], [], [], [], []);
      const nuevaDim = new Dimension("Z-999", "Dimensión de prueba", "Activa", 1, "Test");
    
      gestor.crearDimension(nuevaDim);
      expect(gestor.listadoDimActivas().length).toBe(1); 
      // Caso error
      expect(() => { gestor.crearDimension(nuevaDim); }).toThrow("ERROR: Ya existe una dimensión con el ID Z-999");
    });
  });

  describe("Test para las funcionalidades del gestor", () => {
  
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
    
    test("mayorVersionAlternativa: Debería devolver a los personajes con el nombre más repetido", () => {
      const morty1 = new Personaje("PER-002", "Morty Smith", "ESP-001", "C-137", "Vivo", "Ninguna", 3, "");
      const morty2 = new Personaje("PER-003", "Morty Smith", "ESP-001", "C-500", "Vivo", "Ninguna", 3, "");
      const rick = new Personaje("PER-001", "Rick Sanchez", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "");

      const gestor = new GestorMultiverso([], [morty1, morty2, rick], [], [], [], []);
      
      const maxVersiones = gestor.mayorVersionAlternativa();
      
      const ganador = maxVersiones[0];

      if (ganador !== undefined) {
        expect(ganador.nombre).toBe("Morty Smith");
        expect(ganador.cantidad).toBe(2);
      } else {
          throw new Error("El array de versiones está vacío");
      }
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

    test("neutralizarArtefacto: Debería eliminar el despliegue de la lista interna", () => {
      const loc = new Localizacion("LOC-001", "Garaje", "Habitación", "C-137", 2, "");
      const art = new Artefacto("ART-001", "Pistola", "PER-001", "Tech", 10, "");

      const gestor = new GestorMultiverso([], [], [], [loc], [art], []);

      gestor.despliegueArtefacto("ART-001", "LOC-001");
      expect(gestor.artefactosDesplegados.length).toBe(1);

      gestor.neutralizarArtefacto("ART-001", "LOC-001");
      expect(gestor.artefactosDesplegados.length).toBe(0);
      // Caso de error
      expect(() => { gestor.neutralizarArtefacto("ART-001", "LOC-002");}).toThrow("ERROR: El artefacto no se encuentra desplegado en esa localización");
    });
    
    test("destruirDimension: Debería cambiar el estado a 'Destruida' o lanzar error si no existe", () => {
      const dim = new Dimension("C-137", "Tierra", "Activa", 10, "Origen");
      const gestor = new GestorMultiverso([dim], [], [], [], [], []);
      gestor.destruirDimension("C-137");
      const dimModificada = gestor.dimensiones[0];
      
      if (dimModificada !== undefined) {
        expect(dimModificada.estado).toBe("Destruida");
      
      }
      expect(() => {gestor.destruirDimension("Z-999");}).toThrow("ERROR: La dimensión a destruir no existe en el multiverso");
    });
  });

  describe("Pruebas de los métodos de eliminación del GestorMultiverso", () => {
    test("eliminarDimension: Debería borrar la dimensión o lanzar error si no existe", () => {
      const dim = new Dimension("C-137", "Tierra", "Activa", 10, "");
      const gestor = new GestorMultiverso([dim], [], [], [], [], []);
      gestor.eliminarDimension("C-137");
      expect(gestor.dimensiones.length).toBe(0);
      // Caso error
      expect(() => {gestor.eliminarDimension("C-137");}).toThrow("ERROR: La dimensión que intentas eliminar no existe");
    });

    test("eliminarEspecie: Debería reducir el array al borrar una especie", () => {
      const esp = new Especie("ESP-001", "Humano", "C-137", "Mamífero", 80, "");
      const gestor = new GestorMultiverso([], [], [esp], [], [], []);
      gestor.eliminarEspecie("ESP-001");
      expect(gestor.especies.length).toBe(0);
      // Caso error
      expect(() => {gestor.eliminarEspecie("ESP-001");}).toThrow("ERROR: La especie que intentas eliminar no existe");
    });

    test("eliminarLocalizacion: Debería eliminar la localización correctamente", () => {
      const loc = new Localizacion("LOC-001", "Ciudadela", "Estación", "C-137", 1000, "");
      const gestor = new GestorMultiverso([], [], [], [loc], [], []);
      expect(gestor.localizaciones.length).toBe(1);
      gestor.eliminarLocalizacion("LOC-001");
      expect(gestor.localizaciones.length).toBe(0);
      // Caso error
      expect(() => gestor.eliminarLocalizacion("LOC-001")).toThrow("ERROR: La localización que intentas eliminar no existe");
    });

    test("eliminarArtefacto: Debería gestionar el borrado de artefactos", () => {
      const art = new Artefacto("ART-001", "Portal", "PER-001", "Tecnologico", 10, "");
      const gestor = new GestorMultiverso([], [], [], [], [art], []);
      gestor.eliminarArtefacto("ART-001");
      expect(gestor.artefactos.length).toBe(0);
      // Caso de error
      expect(() => gestor.eliminarArtefacto("ART-001")).toThrow("ERROR: El artefacto que intentas eliminar no existe");
    });

    test("eliminarPersonaje: Debería borrar al personaje o lanzar error si no existe", () => {
      const rick = new Personaje("PER-001", "Rick", "ESP-001", "C-137", "Vivo", "Ricks", 10, "");
      const gestor = new GestorMultiverso([], [rick], [], [], [], []);
      gestor.eliminarPersonaje("PER-001");
      expect(gestor.personajes.length).toBe(0);
      // Caso de error
      expect(() => gestor.eliminarPersonaje("PER-001")).toThrow("ERROR: El personaje que intentas eliminar no existe");
    });
  });

  describe("Pruebas de modificación de las entidades", () => {
    test("modificarPersonaje: Debería actualizar los campos", () => {
      const rickOriginal = new Personaje("PER-001", "Rick", "ESP-001", "C-137", "Vivo", "Ricks", 10, "Original");
      const gestor = new GestorMultiverso([], [rickOriginal], [], [], [], []);
      gestor.modificarPersonaje("PER-001", {});
  
      const personajeSinCambios = gestor.personajes[0];
      if (personajeSinCambios !== undefined) {
        expect(personajeSinCambios.nombre).toBe("Rick"); 
      }

      gestor.modificarPersonaje("PER-001", { 
        nombre: "Rick Sanchez",
        id_especie: "ESP-002",
        id_dimension: "Z-001",
        estado: "Desaparecido", 
        afiliacion: "Consejo de Ricks", 
        nivel_inteligencia: 9,
        descripcion: "Actualizado"
      });

      const personajeModificado = gestor.personajes[0];

      if (personajeModificado !== undefined) {
        expect(personajeModificado.nombre).toBe("Rick Sanchez");
        expect(personajeModificado.id_especie).toBe("ESP-002");
        expect(personajeModificado.id_dimension).toBe("Z-001");
        expect(personajeModificado.estado).toBe("Desaparecido");
        expect(personajeModificado.afiliacion).toBe("Consejo de Ricks");
        expect(personajeModificado.nivel_inteligencia).toBe(9);
        expect(personajeModificado.descripcion).toBe("Actualizado");
      }
      // Caso error
      expect(() => {gestor.modificarPersonaje("PER-999", {nombre: "Pepe"})}).toThrow("ERROR: El personaje que intentas modificar no existe.");
    });
    
    test("modificarDimension: Debería gestionar cambios vacíos, totales y errores", () => {
      const dim = new Dimension("C-137", "Tierra", "Activa", 5, "Original");
      const gestor = new GestorMultiverso([dim], [], [], [], [], []);

      gestor.modificarDimension("C-137", {});
      gestor.modificarDimension("C-137", {
        nombre: "Tierra Cronenberg",
        estado: "Destruida",       
        nivel_tecnologico: 2,
        descripcion: "Colapso total" 
      });

      const modificado = gestor.dimensiones[0];
      if (modificado !== undefined) {
        expect(modificado.nombre).toBe("Tierra Cronenberg");
        expect(modificado.estado).toBe("Destruida");
        expect(modificado.nivel_tecnologico).toBe(2);
        expect(modificado.descripcion).toBe("Colapso total");
      }
      // Caso error
      expect(() => gestor.modificarDimension("C-980", { nombre: "Error" })).toThrow("ERROR: La dimensión que intentas modificar no existe.");
    });
    
    test("modificarLocalizacion: Debería gestionar cambios vacíos, totales y errores", () => {
      const loc = new Localizacion("LOC-001", "Garaje", "Habitación", "C-137", 2, "Viejo");
      const gestor = new GestorMultiverso([], [], [], [loc], [], []);

      gestor.modificarLocalizacion("LOC-001", {});
      gestor.modificarLocalizacion("LOC-001", {
        nombre: "Laboratorio Rick",
        tipo: "Taller",
        id_dimension: "C-137",
        poblacion: 1,
        descripcion: "Sótano secreto"
      });

      const modificado = gestor.localizaciones[0];
      if (modificado !== undefined) {
        expect(modificado.nombre).toBe("Laboratorio Rick");
        expect(modificado.tipo).toBe("Taller");
        expect(modificado.poblacion).toBe(1);
        expect(modificado.descripcion).toBe("Sótano secreto");
      }
      // Caso error
      expect(() => gestor.modificarLocalizacion("L-999", {})).toThrow("ERROR: La localización que intentas modificar no existe.");
    });

    test("modificarArtefacto: Debería gestionar cambios", () => {
      const art = new Artefacto("ART-001", "Pistola", "PER-001", "Arma", 5, "Normal");
      const gestor = new GestorMultiverso([], [], [], [], [art], []);

      gestor.modificarArtefacto("ART-001", {});
      gestor.modificarArtefacto("ART-001", {
        nombre: "Portal Gun",
        id_inventor: "PER-001",
        tipo: "Herramienta",
        nivel_peligrosidad: 10,
        descripcion: "Viaje interdimensional"
      });

      const modificado = gestor.artefactos[0];
      if (modificado !== undefined) {
        expect(modificado.nombre).toBe("Portal Gun");
        expect(modificado.nivel_peligrosidad).toBe(10);
        expect(modificado.descripcion).toBe("Viaje interdimensional");
      }
      // Caso error
      expect(() => gestor.modificarArtefacto("ART-", {})).toThrow("ERROR: El artefacto que intentas modificar no existe.");
    });
    
    test("modificarEspecie: Debería gestionar cambios vacíos, totales y errores", () => {
      const esp = new Especie("ESP-001", "Humano", "C-137", "Mamífero", 80, "Básica");
      const gestor = new GestorMultiverso([], [], [esp], [], [], []);

      gestor.modificarEspecie("ESP-001", {});
      gestor.modificarEspecie("ESP-001", {
        nombre: "Humano Mutante",
        id_origen: "Z-500",
        tipo: "Mutante",
        esperanza_de_vida: 150,
        descripcion: "Evolución"
      });

      const modificado = gestor.especies[0];
      if (modificado !== undefined) {
        expect(modificado.nombre).toBe("Humano Mutante");
        expect(modificado.id_origen).toBe("Z-500");
        expect(modificado.tipo).toBe("Mutante");
        expect(modificado.esperanza_de_vida).toBe(150);
        expect(modificado.descripcion).toBe("Evolución");
      }
      // Caso error
      expect(() => gestor.modificarEspecie("ESP-999", { nombre: "Inexistente" })).toThrow("ERROR: La especie que intentas modificar no existe.");
    });
  });
});