import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { insertarDocumento, leerActivos } from "./crud.js";

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

        // Definición de los documentos
        const nuevoUsuario = {
            nombre: "Agostina Méndez",
            email: "agostina@gmail.com",
            password_hash: "$2b$12$xyz",
            roles: ["visitante"],
            activo: true,
            fecha_registro: new Date(),
            perfil: {
                ciudad: "La Plata",
                avatar_url: "https://cdn.museo.art/avatars/agostina.jpg"
            }
        };

        const nuevaObra = {
            titulo: "Cielo Patagónico",
            descripcion: "Paisaje realizado en óleo.",
            tecnica: "Óleo",
            anio_creacion: 2026,
            precio_usd: 700,
            imagen_url: "https://cdn.museo.art/obras/cielo.jpg",
            dimensiones: {
                alto_cm: 60,
                ancho_cm: 90
            },
            categorias: ["paisaje"],
            disponible_venta: true,
            activo: true,
            fecha_publicacion: new Date(),
            artista_snapshot: {
                nombre: "Valentina Ríos",
                ciudad: "Bariloche"
            },
            estadisticas: {
                total_vistas: 0,
                promedio_puntuacion: 0
            }
        };

        // Ejecución del CREATE
        console.log("\n--- INSERTANDO DOCUMENTOS ---");
        const idUsuario = await insertarDocumento(db, "usuarios", nuevoUsuario);
        console.log(`Usuario registrado correctamente con ID: ${idUsuario}`);

        const idObra = await insertarDocumento(db, "obras", nuevaObra);
        console.log(`Obra registrada correctamente con ID: ${idObra}\n`);

        // Ejecución del READ
        console.log("\n--- LEYENDO DOCUMENTOS ACTIVOS ---");
        const usuariosActivos = await leerActivos(db, "usuarios");
        console.log(`Usuarios activos encontrados: ${usuariosActivos.length}`);

        const obrasActivas = await leerActivos(db, "obras");
        console.log(`Obras activas encontradas: ${obrasActivas.length}`);

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