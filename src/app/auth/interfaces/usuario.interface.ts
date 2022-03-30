export interface Usuario {
    nombre?: string;
    apellido_p?: string;
    apellido_m?: string;
    correo?: string;
    clave?: string,
    clave_confirmacion?: string,
    puesto?: string;
}


// ------ Respuestas Interfaces
export interface AuthResponse {
    message: string;
    status: string;
    token?: string;
}

export interface Verificacion {
    correo: string;
    codigo: string;
}