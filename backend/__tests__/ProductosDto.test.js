const { CreateProductoDto, UpdateProductoDto } = require('../dto/ProductosDto');

// ──────────────────────────────────────────────────────────────────────────────
// Tests para CreateProductoDto
// ──────────────────────────────────────────────────────────────────────────────
describe('CreateProductoDto', () => {

    // ── Validación de stock ──────────────────────────────────────────────────
    describe('Validación de stock (Issue #12 – stock negativo)', () => {
        test('stock negativo genera un error de validación', () => {
            const dto = new CreateProductoDto({
                nombre: 'Teclado Mecánico',
                categoria_id: 1,
                precio_actual: 150000,
                stock: -5
            });
            const errors = dto.validate();
            expect(errors).toContain('stock no puede ser negativo');
        });

        test('stock igual a 0 es válido', () => {
            const dto = new CreateProductoDto({
                nombre: 'Mouse Gamer',
                categoria_id: 2,
                precio_actual: 80000,
                stock: 0
            });
            const errors = dto.validate();
            expect(errors).not.toContain('stock no puede ser negativo');
        });

        test('stock positivo es válido', () => {
            const dto = new CreateProductoDto({
                nombre: 'Monitor 24"',
                categoria_id: 3,
                precio_actual: 900000,
                stock: 10
            });
            const errors = dto.validate();
            expect(errors).not.toContain('stock no puede ser negativo');
        });

        test('sin campo stock usa valor por defecto 0 (válido)', () => {
            const dto = new CreateProductoDto({
                nombre: 'Auriculares',
                categoria_id: 2,
                precio_actual: 120000
            });
            expect(dto.stock).toBe(0);
            const errors = dto.validate();
            expect(errors).not.toContain('stock no puede ser negativo');
        });
    });

    // ── Validación de precio ─────────────────────────────────────────────────
    describe('Validación de precio (Issue #13 – precio negativo)', () => {
        test('precio negativo genera un error de validación', () => {
            const dto = new CreateProductoDto({
                nombre: 'Tarjeta Gráfica',
                categoria_id: 1,
                precio_actual: -100
            });
            const errors = dto.validate();
            expect(errors).toContain('precio no puede ser negativo');
        });

        test('precio igual a 0 es válido', () => {
            const dto = new CreateProductoDto({
                nombre: 'Artículo gratuito',
                categoria_id: 1,
                precio_actual: 0,
                stock: 1
            });
            const errors = dto.validate();
            expect(errors).not.toContain('precio no puede ser negativo');
        });

        test('precio positivo es válido', () => {
            const dto = new CreateProductoDto({
                nombre: 'Procesador i9',
                categoria_id: 1,
                precio_actual: 3000000,
                stock: 5
            });
            const errors = dto.validate();
            expect(errors).not.toContain('precio no puede ser negativo');
        });

        test('precio undefined genera error de campo requerido', () => {
            const dto = new CreateProductoDto({
                nombre: 'SSD 1TB',
                categoria_id: 1
            });
            const errors = dto.validate();
            expect(errors).toContain('precio_actual es requerido');
        });
    });

    // ── Validación de nombre ─────────────────────────────────────────────────
    describe('Validación de nombre', () => {
        test('nombre vacío genera un error de validación', () => {
            const dto = new CreateProductoDto({
                nombre: '',
                categoria_id: 1,
                precio_actual: 50000
            });
            const errors = dto.validate();
            expect(errors).toContain('nombre es requerido');
        });

        test('nombre válido no genera error', () => {
            const dto = new CreateProductoDto({
                nombre: 'RAM DDR5 16GB',
                categoria_id: 1,
                precio_actual: 250000,
                stock: 3
            });
            const errors = dto.validate();
            expect(errors).not.toContain('nombre es requerido');
        });
    });

    // ── Sin errores ──────────────────────────────────────────────────────────
    describe('Producto válido completo', () => {
        test('datos correctos no generan errores', () => {
            const dto = new CreateProductoDto({
                nombre: 'Placa Madre ATX',
                categoria_id: 1,
                precio_actual: 450000,
                stock: 7,
                estado: 1
            });
            const errors = dto.validate();
            expect(errors).toHaveLength(0);
        });
    });

    // ── toModel ──────────────────────────────────────────────────────────────
    describe('toModel()', () => {
        test('convierte el DTO al objeto de modelo correctamente', () => {
            const dto = new CreateProductoDto({
                nombre: 'Fuente de poder 750W',
                categoria_id: 4,
                precio_actual: 320000,
                stock: 12,
                estado: 1,
                descripcion_corta: 'Fuente modular 80+ Gold'
            });
            const model = dto.toModel();
            expect(model.nombre).toBe('Fuente de poder 750W');
            expect(model.precio_actual).toBe(320000);
            expect(model.stock).toBe(12);
            expect(model.descripcion_corta).toBe('Fuente modular 80+ Gold');
        });
    });
});

// ──────────────────────────────────────────────────────────────────────────────
// Tests para UpdateProductoDto
// ──────────────────────────────────────────────────────────────────────────────
describe('UpdateProductoDto', () => {

    // ── Validación de stock ──────────────────────────────────────────────────
    describe('Validación de stock (Issue #12 – stock negativo)', () => {
        test('stock negativo en actualización genera error de validación', () => {
            const dto = new UpdateProductoDto({ stock: -3 });
            const errors = dto.validate();
            expect(errors).toContain('stock no puede ser negativo');
        });

        test('stock igual a 0 en actualización es válido', () => {
            const dto = new UpdateProductoDto({ stock: 0 });
            const errors = dto.validate();
            expect(errors).not.toContain('stock no puede ser negativo');
        });

        test('sin campo stock no genera error (campo opcional)', () => {
            const dto = new UpdateProductoDto({ nombre: 'Nuevo nombre' });
            const errors = dto.validate();
            expect(errors).not.toContain('stock no puede ser negativo');
        });
    });

    // ── Validación de precio ─────────────────────────────────────────────────
    describe('Validación de precio (Issue #13 – precio negativo)', () => {
        test('precio negativo en actualización genera error de validación', () => {
            const dto = new UpdateProductoDto({ precio_actual: -500 });
            const errors = dto.validate();
            expect(errors).toContain('precio no puede ser negativo');
        });

        test('precio positivo en actualización es válido', () => {
            const dto = new UpdateProductoDto({ precio_actual: 199000 });
            const errors = dto.validate();
            expect(errors).not.toContain('precio no puede ser negativo');
        });

        test('sin campo precio no genera error (campo opcional)', () => {
            const dto = new UpdateProductoDto({ stock: 5 });
            const errors = dto.validate();
            expect(errors).not.toContain('precio no puede ser negativo');
        });
    });

    // ── toPatchObject ────────────────────────────────────────────────────────
    describe('toPatchObject()', () => {
        test('solo incluye los campos enviados', () => {
            const dto = new UpdateProductoDto({ nombre: 'Producto actualizado', stock: 20 });
            const patch = dto.toPatchObject();
            expect(patch).toHaveProperty('nombre', 'Producto actualizado');
            expect(patch).toHaveProperty('stock', 20);
            expect(patch).not.toHaveProperty('precio_actual');
        });

        test('retorna objeto vacío si no hay campos', () => {
            const dto = new UpdateProductoDto({});
            const patch = dto.toPatchObject();
            expect(Object.keys(patch)).toHaveLength(0);
        });
    });
});
