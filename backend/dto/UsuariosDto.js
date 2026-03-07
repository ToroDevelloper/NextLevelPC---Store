class UsuarioCreateDTO {
    constructor(payload = {}) {
        this.nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : payload.nombre;
        this.apellido = typeof payload.apellido === 'string' ? payload.apellido.trim() : payload.apellido;
        this.correo = typeof payload.correo === 'string' ? payload.correo.trim() : payload.correo;
        this.hash_password = typeof payload.hash_password === 'string' ? payload.hash_password.trim() : payload.hash_password;
        this.rol_id = typeof payload.rol_id === 'number' ? payload.rol_id : 2;
        this.username = typeof payload.username === 'string' ? payload.username.trim() : payload.username;
        this.foto_perfil = typeof payload.foto_perfil === 'string' ? payload.foto_perfil.trim() : payload.foto_perfil;
        this.bibliografia = typeof payload.bibliografia === 'string' ? payload.bibliografia.trim() : payload.bibliografia;
        this.estado = typeof payload.estado === 'string' ? payload.estado.trim() : payload.estado;
    }

    validate() {
        const errors = [];
        if (!this.nombre) errors.push('nombre es obligatorio y no puede ser solo espacios');
        if (!this.apellido) errors.push('apellido es obligatorio y no puede ser solo espacios');
        if (!this.correo) errors.push('correo es obligatorio y no puede ser solo espacios');
        if (!this.hash_password) errors.push('password es obligatorio y no puede ser solo espacios');
        if (this.hash_password && this.hash_password.length < 6) errors.push('password debe tener al menos 6 caracteres');
        if (this.correo && !/^\S+@\S+\.\S+$/.test(this.correo)) errors.push('correo inválido');

        if (this.username) {
            if (this.username.length < 3 || this.username.length > 50) {
                errors.push('username debe tener entre 3 y 50 caracteres');
            }
        }

        if (this.estado && !['activo', 'inactivo'].includes(this.estado)) {
            errors.push('estado inválido');
        }

        return errors;
    }

    toModel() {
        return {
            nombre: this.nombre,
            apellido: this.apellido,
            correo: this.correo,
            hash_password: this.hash_password,
            rol_id: this.rol_id,
            username: this.username,
            foto_perfil: this.foto_perfil,
            bibliografia: this.bibliografia,
            estado: this.estado
        };
    }
}

class UsuarioUpdateDTO {
    constructor(payload = {}) {
        this.nombre = payload.nombre === undefined ? undefined : (typeof payload.nombre === 'string' ? payload.nombre.trim() : payload.nombre);
        this.apellido = payload.apellido === undefined ? undefined : (typeof payload.apellido === 'string' ? payload.apellido.trim() : payload.apellido);
        this.correo = payload.correo === undefined ? undefined : (typeof payload.correo === 'string' ? payload.correo.trim() : payload.correo);
        this.hash_password = payload.hash_password === undefined ? undefined : (typeof payload.hash_password === 'string' ? payload.hash_password.trim() : payload.hash_password);
        this.rol_id = payload.rol_id === undefined ? undefined : (typeof payload.rol_id === 'number' ? payload.rol_id : undefined);
        this.username = payload.username === undefined ? undefined : (typeof payload.username === 'string' ? payload.username.trim() : payload.username);
        this.foto_perfil = payload.foto_perfil === undefined ? undefined : (typeof payload.foto_perfil === 'string' ? payload.foto_perfil.trim() : payload.foto_perfil);
        this.bibliografia = payload.bibliografia === undefined ? undefined : (typeof payload.bibliografia === 'string' ? payload.bibliografia.trim() : payload.bibliografia);
        this.estado = payload.estado === undefined ? undefined : (typeof payload.estado === 'string' ? payload.estado.trim() : payload.estado);

        // Evitar enviar valores vacíos que puedan romper el enum de la DB
        if (this.estado === '') this.estado = undefined;
        if (this.username === '') this.username = undefined;
        if (this.foto_perfil === '') this.foto_perfil = undefined;
        if (this.bibliografia === '') this.bibliografia = undefined;
    }

    validate() {
        const errors = [];
        if (this.nombre !== undefined){
            if(!this.nombre){
                errors.push("nombre no puede ser solo espacios en blanco")
            }
        }
        if (this.apellido !== undefined){
            if(!this.apellido){
                errors.push("apellido no puede ser solo espacios en blanco")
            }
        }
        if (this.hash_password !== undefined) {
            if (!this.hash_password) errors.push('password no puede ser solo espacios');
            else if (this.hash_password.length < 6) errors.push('password debe tener al menos 6 caracteres');
        }
        if (this.correo !== undefined && this.correo && !/^\S+@\S+\.\S+$/.test(this.correo)) {
            errors.push('correo inválido');
        }

        if (this.username !== undefined && this.username) {
            if (this.username.length < 3 || this.username.length > 50) {
                errors.push('username debe tener entre 3 y 50 caracteres');
            }
        }

        if (this.estado !== undefined && this.estado) {
            if (!['activo', 'inactivo'].includes(this.estado)) {
                errors.push('estado inválido');
            }
        }

        return errors;
    }

    toPatchObject() {
        const out = {};
        ['nombre','apellido','correo','hash_password','rol_id','username','foto_perfil','bibliografia','estado'].forEach(k => {
            if (this[k] !== undefined) out[k] = this[k];
        });
        return out;
    }
}

class LoginDTO{
    constructor(payload = {}) {
        this.correo = typeof payload.correo === 'string' ? payload.correo.trim() : payload.correo;
        this.hash_password = typeof payload.hash_password === 'string' ? payload.hash_password.trim() : payload.hash_password;
    }
    validate() {
        const errors = [];
        if (!this.correo) errors.push('correo es obligatorio y no puede ser solo espacios');
        if (!this.hash_password) errors.push('password es obligatorio y no puede ser solo espacios');
        return errors;
    }

    toLogin(){
        return{
            correo: this.correo,
            hash_password:this.hash_password
        }
    }
}

module.exports = { UsuarioCreateDTO, UsuarioUpdateDTO, LoginDTO };