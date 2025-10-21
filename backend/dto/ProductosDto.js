class CreateProductoDto {
    constructor(payload= {}){
        this.nombre = typeof payload.nombre === "string" ? payload.nombre.trim() : payload.nombre;
        this.categoria_id = payload.categoria_id;
        this.precio_actual = payload.precio_actual;
        this.stock = payload.stock;
        this.activo = payload.activo;
    }

    validate(){
        const errors = [];
        if(!this.nombre) errors.push('nombre es requerido y no pueden ser solo espacios en blanco');
        if(this.stock) {
            if(this.stock < 0) errors.push('stock no puede ser negativo')
        }
        if(this.precio_actual) {
            if(this.precio_actual < 0) errors.push('precio no puede ser negativo')
        }
        return errors;
    }

    toModel(){
        return{
            nombre : this.nombre,
            categoria_id : this.categoria_id,
            precio_actual : this.precio_actual,
            stock : this.stock,
            activo : this.activo
        };
    }
}

class UpdateProductoDto {
    constructor(payload={}){
        this.nombre = payload.nombre === undefined ? undefined:(typeof payload.nombre === "string" ? payload.nombre.trim() : payload.nombre);
    }
    
    validate(){
        const errors = [];
        if(this.nombre !== undefined){
            if(!this.nombre) errors.push('nombre no puede ser solo espacios');
        }
        
        return errors;
    }

    toPatchObject(){
        const out = {};
        ['nombre','categoria_id','precio_actual','stock','activo'].forEach(k=>{
            if(this[k] !== undefined) 
            out[k] = this[k];
        });
        return out;
    }
}

module.exports = {CreateProductoDto,UpdateProductoDto}