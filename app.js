import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { insertarDocumento, leerActivos, actualizarDocumento, desactivarDocumento } from "./crud.js";

dotenv.config();

// Se obtienen las variables del archivo .env
const uri = process.env.MONGODB_URI;
const database = process.env.DATABASE_NAME;
const client = new MongoClient(uri);

async function main() {
    try {
        // Conexión
        await client.connect();
        console.log("Conectado exitosamente a MongoDB Atlas.\n");
        const db = client.db(database);
        
        // IDs de documentos existentes del TPI Parte 1
        const idArtistaExistente = new ObjectId("64a1f2e3b5c6d7e8f9a0b1c2");
        const idObraExistente    = new ObjectId("64b2a3c4d5e6f7a8b9c0d1e2");
        const idVisitanteExistente = new ObjectId("60c72b2f1f3a2b0015d89a23");

        // Ejecución del CREATE
        console.log("\n--- INSERTANDO DOCUMENTOS ---");

        // Definición e inserción de un nuevo Usuario (artista)
        const nuevoUsuario = {
            nombre: "Lucía Peralta",
            email: "lucia.peralta@gmail.com",
            password_hash: "$2b$12$abc",
            roles: ["artista"],
            activo: true,
            fecha_registro: new Date(),
            perfil: {
                bio: "Pintora mendocina especializada en acuarela.",
                pais: "Argentina",
                ciudad: "Mendoza",
                avatar_url: "https://cdn.museo.art/avatars/lucia.jpg",
                redes_sociales: {
                    instagram: "@lucia.peralta.arte"
                }
            },
            estadisticas_artista: {
                total_obras: 0,
                total_seguidores: 0,
                promedio_puntuacion: 0
            }
        };

        const idUsuario = await insertarDocumento(db, "usuarios", nuevoUsuario);
        console.log(`\nUsuario creado con ID: ${idUsuario}`);

        // Definición e inserción de una nueva Obra
        const nuevaObra = {
            titulo: "Viñedos al atardecer",
            descripcion: "Acuarela que captura los viñedos mendocinos bajo la luz del ocaso.",
            tecnica: "Acuarela",
            anio_creacion: 2026,
            precio_usd: 600,
            imagen_url: "https://cdn.museo.art/obras/vinedos.jpg",
            dimensiones: { alto_cm: 50, ancho_cm: 70 },
            categorias: ["paisaje", "naturaleza", "acuarela"],
            disponible_venta: true,
            activo: true,
            fecha_publicacion: new Date(),
            // LINKING al artista recién creado
            artista_id: idUsuario,
            // EMBEDDING parcial para listados
            artista_snapshot: {
                nombre: "Lucía Peralta",
                avatar_url: "https://cdn.museo.art/avatars/lucia.jpg",
                ciudad: "Mendoza"
            },
            estadisticas: {
                total_vistas: 0,
                promedio_puntuacion: 0
            }
        };

        const idObra = await insertarDocumento(db, "obras", nuevaObra);
        console.log(`\nObra creada con ID: ${idObra}`);

        // Definición e inserción de una nueva Exposición
        const nuevaExposicion = {
            titulo: "Paisajes Argentinos",
            descripcion: "Una selección de obras que recorren los paisajes más icónicos de Argentina.",
            tipo: "colectiva",
            imagen_portada_url: "https://cdn.museo.art/expo/paisajes-argentinos.jpg",
            fecha_inicio: new Date("2026-07-01"),
            fecha_fin: new Date("2026-09-30"),
            activo: true,
            // LINKING al nuevo usuario (artista) como curador de la exposición
            artista_id: idUsuario,
            // EMBEDDING parcial de las obras
            obras: [
                {
                    // Obra del TPI Parte 1 (Valentina Ríos)
                    obra_id: idObraExistente,
                    titulo: "Atardecer en la Cordillera",
                    imagen_url: "https://cdn.museo.art/obras/atardecer.jpg",
                    tecnica: "Óleo sobre tela",
                    precio_usd: 850
                },
                {
                    // Obra recién creada (Lucía Peralta)
                    obra_id: idObra,
                    titulo: "Viñedos al atardecer",
                    imagen_url: "https://cdn.museo.art/obras/vinedos.jpg",
                    tecnica: "Acuarela",
                    precio_usd: 600
                }
            ]
        };

        const idExposicion = await insertarDocumento(db, "exposiciones", nuevaExposicion);
        console.log(`\nExposición creada con ID: ${idExposicion}`);

        // Definición e inserción de una nueva Opinión
        const nuevaOpinion = {
            puntuacion: 5,
            comentario: "Una combinación de paisajes increíble. Se nota la pasión de los artistas.",
            fecha: new Date(),
            activo: true,
            // LINKING a la exposición recién creada
            exposicion_id: idExposicion,
            obra_id: null,
            // LINKING al visitante existente del TPI 1
            visitante_id: idVisitanteExistente,
            // EMBEDDING mínimo para mostrar sin consulta extra
            visitante_snapshot: {
                nombre: "Marcos Heredia",
                avatar_url: "https://cdn.museo.art/avatars/marcos.jpg"
            }
        };

        const idOpinion = await insertarDocumento(db, "opiniones", nuevaOpinion);
        console.log(`\nOpinión creada con ID: ${idOpinion}`);

        // Ejecución del READ
        console.log("\n--- LEYENDO DOCUMENTOS ACTIVOS ---");

        const usuariosActivos = await leerActivos(db, "usuarios");
        console.log(`Usuarios activos encontrados: ${usuariosActivos.length}`);
        console.log(usuariosActivos.map(us => ({ id: us._id, nombre: us.nombre })));

        const obrasActivas = await leerActivos(db, "obras");
        console.log(`Obras activas encontradas: ${obrasActivas.length}`);
        console.log(obrasActivas.map(ob => ({ id: ob._id, titulo: ob.titulo })));

        const exposicionesActivas = await leerActivos(db, "exposiciones");
        console.log(`Exposiciones activas: ${exposicionesActivas.length}`);
        console.log(exposicionesActivas.map(ex => ({ id: ex._id, titulo: ex.titulo })));

        const opinionesActivas = await leerActivos(db, "opiniones");
        console.log(`Opiniones activas: ${opinionesActivas.length}`);
        console.log(opinionesActivas.map(op => ({ id: op._id, puntuacion: op.puntuacion })));
        
        // Ejecución del UPDATE
        console.log("\n--- ACTUALIZANDO DOCUMENTO ---");

        const modificados = await actualizarDocumento(
            db,
            "obras",
            { _id: idObra },
            { precio_usd: 900, disponible_venta: false }
        );
        console.log(`Documentos modificados: ${modificados}`);

        // Ejecución del DELETE (Baja Lógica)
        console.log("\n--- DESACTIVANDO DOCUMENTO (BAJA LÓGICA) ---");
        const desactivados = await desactivarDocumento(
            db,
            "usuarios",
            { _id: idUsuario }
        );
        console.log(`Documentos desactivados: ${desactivados}`);
    }
    catch (error) {
        // Manejo de errores
        console.error("Ocurrió un error durante la ejecución:", error);
    } finally {
        // Cierre de conexión para liberar memoria
        await client.close();
        console.log("\nDesconectado de MongoDB Atlas. Proceso finalizado.");
    }
}

main();