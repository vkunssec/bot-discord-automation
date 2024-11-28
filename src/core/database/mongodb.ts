import { Db, MongoClient } from "mongodb";

import { MONGODB_DATABASE, MONGODB_URI } from "@/config";

/**
 * Classe MongoDB
 *
 * Responsável por gerenciar a conexão com o banco de dados MongoDB
 */
export class MongoDB {
    private static instance: MongoDB;
    private client: MongoClient;
    private database: Db | null = null;

    private constructor() {
        this.client = new MongoClient(MONGODB_URI, {
            // Configurações recomendadas para produção
            maxPoolSize: 10,
            minPoolSize: 1,
            retryWrites: true,
            w: "majority",
        });
    }

    /**
     * Método para obter a instância da classe MongoDB
     *
     * @returns - Instância da classe MongoDB
     */
    public static getInstance(): MongoDB {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }

    /**
     * Método para conectar ao banco de dados MongoDB
     */
    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.database = this.client.db(MONGODB_DATABASE);
            console.log("✅ Conexão com MongoDB estabelecida com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao conectar com MongoDB:", error);
            throw error;
        }
    }

    /**
     * Método para obter o banco de dados MongoDB
     *
     * @returns - Banco de dados MongoDB
     */
    public getDatabase(): Db {
        if (!this.database) {
            throw new Error("Database não está conectado. Execute connect() primeiro.");
        }
        return this.database;
    }

    /**
     * Método para desconectar do banco de dados MongoDB
     */
    public async disconnect(): Promise<void> {
        try {
            await this.client.close();
            this.database = null;
            console.log("Conexão com MongoDB fechada.");
        } catch (error) {
            console.error("Erro ao desconectar do MongoDB:", error);
            throw error;
        }
    }

    /**
     * Método para verificar o status da conexão com o MongoDB
     *
     * @returns - Objeto com status da conexão e latência
     */
    public async checkConnection(): Promise<{ isConnected: boolean; latency: number }> {
        try {
            const startTime = Date.now();

            // Verifica se já está conectado
            if (!this.database) {
                await this.connect();
            }

            // Executa um comando simples para verificar a conexão
            await this.database?.command({ ping: 1 });

            const latency = Date.now() - startTime;
            return {
                isConnected: true,
                latency,
            };
        } catch (error) {
            return {
                isConnected: false,
                latency: 0,
            };
        }
    }
}
