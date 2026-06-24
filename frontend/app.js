const API_URL = 'http://localhost:3000/api/cursos';

document.addEventListener('DOMContentLoaded', () => {
    loadCursos();
    
    const form = document.getElementById('cursoForm');
    form.addEventListener('submit', handleFormSubmit);
});

// Obtener y mostrar cursos
async function loadCursos() {
    const grid = document.getElementById('coursesGrid');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Error al obtener los cursos');
        
        const cursos = await response.json();
        
        if (cursos.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay cursos registrados todavía.</p>';
            return;
        }

        grid.innerHTML = '';
        cursos.forEach(curso => {
            const card = document.createElement('div');
            card.className = 'glass-card course-card';
            
            // Determinar color de badge si está activo o no
            const badgeBg = curso.Activo ? 'rgba(20, 184, 166, 0.1)' : 'rgba(236, 72, 153, 0.1)';
            const badgeColor = curso.Activo ? 'var(--accent)' : 'var(--secondary)';
            const statusText = curso.Activo ? 'Activo' : 'Inactivo';

            card.innerHTML = `
                <span class="course-badge" style="background: ${badgeBg}; color: ${badgeColor};">${statusText}</span>
                <h3 class="course-title">${curso.Nombre}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">Categoría: ${curso.Categoria}</p>
                <div class="course-info">
                    <span>⏱ ${curso.Duracion} horas</span>
                    <span>👥 ${curso.CuposDisponibles} cupos</span>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary);">Error de conexión con el servidor.</p>';
    }
}

// Registrar nuevo curso
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const msgDiv = document.getElementById('formMessage');
    const submitBtn = event.target.querySelector('button');
    
    // Recolectar datos
    const nuevoCurso = {
        Nombre: document.getElementById('nombre').value,
        Categoria: document.getElementById('categoria').value,
        Duracion: parseInt(document.getElementById('duracion').value),
        CuposDisponibles: parseInt(document.getElementById('cupos').value),
        Activo: document.getElementById('activo').value === 'true'
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCurso)
        });

        if (!response.ok) throw new Error('Error al guardar el curso');

        // Mostrar éxito
        msgDiv.style.color = 'var(--accent)';
        msgDiv.textContent = '¡Curso registrado exitosamente!';
        
        // Limpiar formulario y recargar lista
        event.target.reset();
        await loadCursos();
        
    } catch (error) {
        console.error(error);
        msgDiv.style.color = 'var(--secondary)';
        msgDiv.textContent = 'Hubo un error al registrar el curso.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar Curso';
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
            msgDiv.textContent = '';
        }, 3000);
    }
}
