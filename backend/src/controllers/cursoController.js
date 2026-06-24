const { sql, getConnection } = require('../config/db');

// Obtener todos los cursos
exports.obtenerCursos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Cursos');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los cursos' });
  }
};

// Obtener un curso por ID
exports.obtenerCursoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Cursos WHERE Id = @Id');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el curso' });
  }
};

// Crear un nuevo curso
exports.crearCurso = async (req, res) => {
  const { Nombre, Categoria, Duracion, CuposDisponibles, Activo } = req.body;
  try {
    const pool = await getConnection();
    
    // Si no se envía 'Activo', por defecto lo ponemos en true (1)
    const isActive = Activo !== undefined ? Activo : 1; 

    const result = await pool.request()
      .input('Nombre', sql.NVarChar(100), Nombre)
      .input('Categoria', sql.NVarChar(100), Categoria)
      .input('Duracion', sql.Int, Duracion)
      .input('CuposDisponibles', sql.Int, CuposDisponibles)
      .input('Activo', sql.Bit, isActive)
      .query(`
        INSERT INTO Cursos (Nombre, Categoria, Duracion, CuposDisponibles, Activo)
        OUTPUT inserted.*
        VALUES (@Nombre, @Categoria, @Duracion, @CuposDisponibles, @Activo)
      `);
      
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el curso' });
  }
};

// Eliminar un curso
exports.eliminarCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Cursos WHERE Id = @Id');

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Curso eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el curso' });
  }
};
