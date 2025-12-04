CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20),
    time_range VARCHAR(50),
    title VARCHAR(100),
    type VARCHAR(50), -- Virtual, Presencial, Transporte, Música, Deporte
    location VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content TEXT
);

-- Tu horario OFICIAL y CORREGIDO
INSERT INTO schedule (day, time_range, title, type, location) VALUES
-- Lunes
('Lunes', '07:00 - 09:00', 'Inglés', 'Virtual', '🏠 Casa'),
('Lunes', '09:00 - 10:00', 'Sprint a la U', 'Transporte', '🚌 Bus'),
('Lunes', '10:00 - 13:00', 'Prácticas Pre', 'Presencial', '🏫 Universidad'),
('Lunes', '13:00 - 15:00', 'Almuerzo + Deberes', 'Estudio', '📚 Biblioteca U'),
('Lunes', '15:00 - 18:00', 'Simulación', 'Presencial', '🏫 Aula'),
('Lunes', '18:00 - 21:00', 'Gestión Calidad', 'Presencial', '🏫 Aula'),
-- Martes
('Martes', '07:00 - 09:00', 'Inglés', 'Virtual', '🏠 Casa'),
('Martes', '10:00 - 13:00', 'Prácticas Pre', 'Presencial', '🏫 Universidad'),
('Martes', '13:00 - 13:30', 'Regreso a Casa', 'Transporte', '🚌 Bus'),
('Martes', '13:30 - 17:00', 'MÚSICA / LIBRE', 'Música', '🎹 Home Studio'),
('Martes', '17:00 - 19:00', 'Computación', 'Virtual', '🏠 Casa'),
-- Miércoles
('Miércoles', '07:00 - 09:00', 'Inglés', 'Virtual', '🏠 Casa'),
('Miércoles', '10:00 - 13:00', 'Prácticas Pre', 'Presencial', '🏫 Universidad'),
('Miércoles', '13:00 - 13:30', 'Regreso a Casa', 'Transporte', '🚌 Bus'),
('Miércoles', '13:30 - 15:00', 'Almuerzo Relax', 'Descanso', '🏠 Casa'),
('Miércoles', '15:00 - 17:00', 'DEPORTE', 'Deporte', '🏋️ Gym'),
('Miércoles', '19:00 - 22:00', 'Legislación', 'Virtual', '🏠 Casa'),
-- Jueves
('Jueves', '10:00 - 12:00', 'Programación', 'Presencial', '🏫 Campus Loja'),
('Jueves', '15:00 - 17:00', 'Prácticas Pre', 'Presencial', '🏫 Universidad'),
-- Viernes
('Viernes', '08:00 - 10:00', 'Programación', 'Presencial', '🏫 Campus Loja'),
('Viernes', '10:00 - 15:00', 'PRODUCCIÓN DEEP WORK', 'Música', '🎹 Casa'),
('Viernes', '16:00 - 18:00', 'Arquitectura', 'Presencial', '🏫 Campus Loja'),
-- Sábado
('Sábado', '07:00 - 10:00', 'Computación', 'Virtual', '🏠 Casa');

INSERT INTO notes (content) VALUES ('Metas: Aprobar Semestre y terminar 2 beats.');
