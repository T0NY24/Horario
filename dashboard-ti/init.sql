-- 1. LIMPIEZA: Eliminar tablas viejas para evitar errores
DROP TABLE IF EXISTS schedule;

DROP TABLE IF EXISTS notes;

-- 2. ESTRUCTURA: Crear la tabla con la columna 'sort_order' (IMPORTANTE)
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20),
    time_range VARCHAR(50),
    title VARCHAR(100),
    type VARCHAR(50),
    location VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE,
    sort_order INTEGER -- Esta columna es la que ordenará tu día
);

CREATE TABLE notes ( id SERIAL PRIMARY KEY, content TEXT );

-- 3. DATOS: Insertar tu horario completo

-- LUNES
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Lunes',
        '06:00 - 06:30',
        'Despertar + Aseo',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Lunes',
        '06:30 - 07:00',
        'Desayuno Ligero',
        'Rutina',
        '🏠 Cocina',
        2
    ),
    (
        'Lunes',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Escritorio',
        3
    ),
    (
        'Lunes',
        '09:00 - 09:15',
        'Preparar Mochila',
        'Rutina',
        '🏠 Casa',
        4
    ),
    (
        'Lunes',
        '09:15 - 10:00',
        'Transporte a U',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'Lunes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 Universidad',
        6
    ),
    (
        'Lunes',
        '13:00 - 13:30',
        'Almuerzo',
        'Comida',
        '🏫 Comedor U',
        7
    ),
    (
        'Lunes',
        '13:30 - 15:00',
        'Bibliot. (Deberes)',
        'Estudio',
        '📚 Biblioteca',
        8
    ),
    (
        'Lunes',
        '15:00 - 18:00',
        'Simulación',
        'Presencial',
        '🏫 Aula 102',
        9
    ),
    (
        'Lunes',
        '18:00 - 21:00',
        'Gestión Calidad',
        'Presencial',
        '🏫 Aula 204',
        10
    ),
    (
        'Lunes',
        '21:00 - 21:30',
        'Regreso a Casa',
        'Transporte',
        '🚌 Bus',
        11
    ),
    (
        'Lunes',
        '21:30 - 22:00',
        'Cena + Relax',
        'Rutina',
        '🏠 Casa',
        12
    ),
    (
        'Lunes',
        '22:00 - 06:00',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        13
    );

-- MARTES
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Martes',
        '06:30 - 07:00',
        'Rutina Mañana',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Martes',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'Martes',
        '09:00 - 10:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        3
    ),
    (
        'Martes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        4
    ),
    (
        'Martes',
        '13:00 - 13:30',
        'Regreso a Casa',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'Martes',
        '13:30 - 14:30',
        'Almuerzo Casero',
        'Comida',
        '🏠 Casa',
        6
    ),
    (
        'Martes',
        '14:30 - 17:00',
        'PRODUCCIÓN MUSICAL',
        'Música',
        '🎹 Studio',
        7
    ),
    (
        'Martes',
        '17:00 - 19:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        8
    ),
    (
        'Martes',
        '19:00 - 20:00',
        'Cena / Libre',
        'Rutina',
        '🏠 Casa',
        9
    ),
    (
        'Martes',
        '20:00 - 22:00',
        'Repaso Ligero',
        'Estudio',
        '🏠 Casa',
        10
    ),
    (
        'Martes',
        '22:30 - 06:30',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        11
    );

-- MIÉRCOLES
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Miércoles',
        '06:30 - 07:00',
        'Desayuno',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Miércoles',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'Miércoles',
        '09:00 - 10:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        3
    ),
    (
        'Miércoles',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        4
    ),
    (
        'Miércoles',
        '13:00 - 13:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'Miércoles',
        '13:30 - 15:00',
        'Almuerzo + Descanso',
        'Comida',
        '🏠 Casa',
        6
    ),
    (
        'Miércoles',
        '15:00 - 17:00',
        'GYM / DEPORTE',
        'Deporte',
        '🏋️ Gym',
        7
    ),
    (
        'Miércoles',
        '17:00 - 18:30',
        'Ducha + Merienda',
        'Rutina',
        '🏠 Casa',
        8
    ),
    (
        'Miércoles',
        '18:30 - 19:00',
        'Prep. Clase',
        'Estudio',
        '🏠 Escritorio',
        9
    ),
    (
        'Miércoles',
        '19:00 - 22:00',
        'Legislación',
        'Virtual',
        '🏠 Casa',
        10
    ),
    (
        'Miércoles',
        '22:30 - 06:30',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        11
    );

-- JUEVES
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Jueves',
        '07:30 - 08:30',
        'Despertar + Desayuno',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Jueves',
        '08:30 - 09:30',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        2
    ),
    (
        'Jueves',
        '10:00 - 12:00',
        'Programación',
        'Presencial',
        '🏫 Campus Loja',
        3
    ),
    (
        'Jueves',
        '12:00 - 13:30',
        'Almuerzo',
        'Comida',
        '🏫 Cerca U',
        4
    ),
    (
        'Jueves',
        '13:30 - 15:00',
        'Biblioteca (Focus)',
        'Estudio',
        '📚 U',
        5
    ),
    (
        'Jueves',
        '15:00 - 17:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        6
    ),
    (
        'Jueves',
        '17:00 - 17:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        7
    ),
    (
        'Jueves',
        '18:00 - 20:00',
        'Música (Teoría)',
        'Música',
        '🎹 Casa',
        8
    ),
    (
        'Jueves',
        '20:00 - 23:00',
        'Cena + Series',
        'Descanso',
        '🏠 Casa',
        9
    );

-- VIERNES
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Viernes',
        '06:30 - 07:15',
        'Rutina Mañana',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Viernes',
        '07:15 - 08:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        2
    ),
    (
        'Viernes',
        '08:00 - 10:00',
        'Programación',
        'Presencial',
        '🏫 Campus',
        3
    ),
    (
        'Viernes',
        '10:00 - 10:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        4
    ),
    (
        'Viernes',
        '10:30 - 15:00',
        'PRODUCCIÓN DEEP',
        'Música',
        '🎹 Studio',
        5
    ),
    (
        'Viernes',
        '15:00 - 16:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        6
    ),
    (
        'Viernes',
        '16:00 - 18:00',
        'Arquitectura',
        'Presencial',
        '🏫 Campus',
        7
    ),
    (
        'Viernes',
        '19:00 - 23:00',
        'LIBRE / SOCIAL',
        'Social',
        '🍻',
        8
    );

-- SÁBADO
INSERT INTO
    schedule (
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'Sábado',
        '06:30 - 07:00',
        'Café',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'Sábado',
        '07:00 - 10:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'Sábado',
        '10:00 - 12:00',
        'Fútbol / Deporte',
        'Deporte',
        '⚽ Canchas',
        3
    ),
    (
        'Sábado',
        '13:00 - 18:00',
        'Música / Beats',
        'Música',
        '🎹 Studio',
        4
    );

-- MENSAJE DE ÉXITO
INSERT INTO
    notes (content)
VALUES (
        '¡Base de datos sincronizada y funcionando!'
    );