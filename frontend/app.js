const API_URL = 'http://localhost:3000/api/cursos';

let allCursos = []; // Variable global para guardar todos los cursos

document.addEventListener('DOMContentLoaded', () => {
    loadCursos();
    
    const form = document.getElementById('cursoForm');
    form.addEventListener('submit', handleFormSubmit);

    // Evento para el checkbox de filtro
    const filtro = document.getElementById('filtroActivos');
    if (filtro) {
        filtro.addEventListener('change', renderCursos);
    }
});

// Obtener y mostrar cursos
async function loadCursos() {
    const grid = document.getElementById('coursesGrid');
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Error al obtener los cursos');
        
        allCursos = await response.json();
        renderCursos();

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--secondary);">Error de conexión con el servidor.</p>';
    }
}

// Función separada para renderizar (y filtrar si es necesario)
function renderCursos() {
    const grid = document.getElementById('coursesGrid');
    const filtro = document.getElementById('filtroActivos');
    
    // Verificamos si el checkbox está marcado
    let cursosAMostrar = allCursos;
    if (filtro && filtro.checked) {
        cursosAMostrar = allCursos.filter(curso => curso.Activo === true);
    }

    if (cursosAMostrar.length === 0) {
        grid.innerHTML = '<p style="text-align: center; width: 100%;">No se encontraron cursos.</p>';
        return;
    }

    grid.innerHTML = '';
    cursosAMostrar.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'course-card';
        
        // Estilos ultra-básicos en línea por si no están en el CSS
        const badgeColor = curso.Activo ? '#28a745' : '#dc3545';
        const statusText = curso.Activo ? 'Activo' : 'Inactivo';

        card.innerHTML = `
            <span class="course-badge" style="background-color: ${badgeColor};">${statusText}</span>
            <h3 class="course-title">${curso.Nombre}</h3>
            <p><strong>Categoría:</strong> ${curso.Categoria}</p>
            <div class="course-info">
                <p>⏱ ${curso.Duracion} horas</p>
                <p>👥 ${curso.CuposDisponibles} cupos</p>
            </div>
        `;
        grid.appendChild(card);
    });
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
