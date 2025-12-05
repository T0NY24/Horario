-- 1. LIMPIEZA
DROP TABLE IF EXISTS schedule;

DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS finance;

DROP TABLE IF EXISTS habits;

DROP TABLE IF EXISTS gym_logs;

-- 2. CREAR TABLAS (Con la mejora en habits)
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    day VARCHAR(20),
    time_range VARCHAR(50),
    title VARCHAR(100),
    type VARCHAR(50),
    location VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE,
    sort_order INTEGER
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Media',
    status VARCHAR(20) DEFAULT 'todo'
);

CREATE TABLE finance (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    description VARCHAR(100),
    amount DECIMAL(10, 2),
    type VARCHAR(10),
    date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    title VARCHAR(100),
    frequency VARCHAR(20) DEFAULT 'Diario', -- 'Diario' o 'Semanal'
    target_days TEXT DEFAULT '', -- NUEVO: Ej "Lunes,Miércoles"
    history TEXT DEFAULT ''
);

CREATE TABLE gym_logs (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    exercise VARCHAR(100),
    weight VARCHAR(20),
    reps VARCHAR(20),
    date DATE DEFAULT CURRENT_DATE
);

-- 3. RESTAURAR DATOS ANTHONY
INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Lunes',
        '06:00 - 06:30',
        'Despertar + Aseo',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Lunes',
        '06:30 - 07:00',
        'Desayuno Ligero',
        'Rutina',
        '🏠 Cocina',
        2
    ),
    (
        'anthony',
        'Lunes',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Escritorio',
        3
    ),
    (
        'anthony',
        'Lunes',
        '09:00 - 09:15',
        'Preparar Mochila',
        'Rutina',
        '🏠 Casa',
        4
    ),
    (
        'anthony',
        'Lunes',
        '09:15 - 10:00',
        'Transporte a U',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'anthony',
        'Lunes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 Universidad',
        6
    ),
    (
        'anthony',
        'Lunes',
        '13:00 - 13:30',
        'Almuerzo',
        'Comida',
        '🏫 Comedor U',
        7
    ),
    (
        'anthony',
        'Lunes',
        '13:30 - 15:00',
        'Bibliot. (Deberes)',
        'Estudio',
        '📚 Biblioteca',
        8
    ),
    (
        'anthony',
        'Lunes',
        '15:00 - 18:00',
        'Simulación',
        'Presencial',
        '🏫 Aula 102',
        9
    ),
    (
        'anthony',
        'Lunes',
        '18:00 - 21:00',
        'Gestión Calidad',
        'Presencial',
        '🏫 Aula 204',
        10
    ),
    (
        'anthony',
        'Lunes',
        '21:00 - 21:30',
        'Regreso a Casa',
        'Transporte',
        '🚌 Bus',
        11
    ),
    (
        'anthony',
        'Lunes',
        '21:30 - 22:00',
        'Cena + Relax',
        'Rutina',
        '🏠 Casa',
        12
    ),
    (
        'anthony',
        'Lunes',
        '22:00 - 06:00',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        13
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Martes',
        '06:30 - 07:00',
        'Rutina Mañana',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Martes',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'anthony',
        'Martes',
        '09:00 - 10:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        3
    ),
    (
        'anthony',
        'Martes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        4
    ),
    (
        'anthony',
        'Martes',
        '13:00 - 13:30',
        'Regreso a Casa',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'anthony',
        'Martes',
        '13:30 - 14:30',
        'Almuerzo Casero',
        'Comida',
        '🏠 Casa',
        6
    ),
    (
        'anthony',
        'Martes',
        '14:30 - 17:00',
        'PRODUCCIÓN MUSICAL',
        'Música',
        '🎹 Studio',
        7
    ),
    (
        'anthony',
        'Martes',
        '17:00 - 19:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        8
    ),
    (
        'anthony',
        'Martes',
        '19:00 - 20:00',
        'Cena / Libre',
        'Rutina',
        '🏠 Casa',
        9
    ),
    (
        'anthony',
        'Martes',
        '20:00 - 22:00',
        'Repaso Ligero',
        'Estudio',
        '🏠 Casa',
        10
    ),
    (
        'anthony',
        'Martes',
        '22:30 - 06:30',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        11
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Miércoles',
        '06:30 - 07:00',
        'Desayuno',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Miércoles',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'anthony',
        'Miércoles',
        '09:00 - 10:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        3
    ),
    (
        'anthony',
        'Miércoles',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        4
    ),
    (
        'anthony',
        'Miércoles',
        '13:00 - 13:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        5
    ),
    (
        'anthony',
        'Miércoles',
        '13:30 - 15:00',
        'Almuerzo + Descanso',
        'Comida',
        '🏠 Casa',
        6
    ),
    (
        'anthony',
        'Miércoles',
        '15:00 - 17:00',
        'GYM / DEPORTE',
        'Deporte',
        '🏋️ Gym',
        7
    ),
    (
        'anthony',
        'Miércoles',
        '17:00 - 18:30',
        'Ducha + Merienda',
        'Rutina',
        '🏠 Casa',
        8
    ),
    (
        'anthony',
        'Miércoles',
        '18:30 - 19:00',
        'Prep. Clase',
        'Estudio',
        '🏠 Escritorio',
        9
    ),
    (
        'anthony',
        'Miércoles',
        '19:00 - 22:00',
        'Legislación',
        'Virtual',
        '🏠 Casa',
        10
    ),
    (
        'anthony',
        'Miércoles',
        '22:30 - 06:30',
        'DORMIR',
        'Sueño',
        '💤 Cama',
        11
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Jueves',
        '07:30 - 08:30',
        'Despertar + Desayuno',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Jueves',
        '08:30 - 09:30',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        2
    ),
    (
        'anthony',
        'Jueves',
        '10:00 - 12:00',
        'Programación',
        'Presencial',
        '🏫 Campus Loja',
        3
    ),
    (
        'anthony',
        'Jueves',
        '12:00 - 13:30',
        'Almuerzo',
        'Comida',
        '🏫 Cerca U',
        4
    ),
    (
        'anthony',
        'Jueves',
        '13:30 - 15:00',
        'Biblioteca (Focus)',
        'Estudio',
        '📚 U',
        5
    ),
    (
        'anthony',
        'Jueves',
        '15:00 - 17:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        6
    ),
    (
        'anthony',
        'Jueves',
        '17:00 - 17:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        7
    ),
    (
        'anthony',
        'Jueves',
        '18:00 - 20:00',
        'Música (Teoría)',
        'Música',
        '🎹 Casa',
        8
    ),
    (
        'anthony',
        'Jueves',
        '20:00 - 23:00',
        'Cena + Series',
        'Descanso',
        '🏠 Casa',
        9
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Viernes',
        '06:30 - 07:15',
        'Rutina Mañana',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Viernes',
        '07:15 - 08:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        2
    ),
    (
        'anthony',
        'Viernes',
        '08:00 - 10:00',
        'Programación',
        'Presencial',
        '🏫 Campus',
        3
    ),
    (
        'anthony',
        'Viernes',
        '10:00 - 10:30',
        'Regreso',
        'Transporte',
        '🚌 Bus',
        4
    ),
    (
        'anthony',
        'Viernes',
        '10:30 - 15:00',
        'PRODUCCIÓN DEEP',
        'Música',
        '🎹 Studio',
        5
    ),
    (
        'anthony',
        'Viernes',
        '15:00 - 16:00',
        'Transporte',
        'Transporte',
        '🚌 Bus',
        6
    ),
    (
        'anthony',
        'Viernes',
        '16:00 - 18:00',
        'Arquitectura',
        'Presencial',
        '🏫 Campus',
        7
    ),
    (
        'anthony',
        'Viernes',
        '19:00 - 23:00',
        'LIBRE / SOCIAL',
        'Social',
        '🍻',
        8
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'anthony',
        'Sábado',
        '06:30 - 07:00',
        'Café',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Sábado',
        '07:00 - 10:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        2
    ),
    (
        'anthony',
        'Sábado',
        '10:00 - 12:00',
        'Fútbol / Deporte',
        'Deporte',
        '⚽ Canchas',
        3
    ),
    (
        'anthony',
        'Sábado',
        '13:00 - 18:00',
        'Música / Beats',
        'Música',
        '🎹 Studio',
        4
    );

-- 4. RESTAURAR DATOS SOFIA
INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'sofia',
        'Lunes',
        '08:00 - 09:00',
        'Rutina Mañana',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'sofia',
        'Lunes',
        '09:00 - 10:00',
        'Enf. Mujer y RN',
        'Presencial',
        '🏥 Facultad',
        2
    ),
    (
        'sofia',
        'Lunes',
        '12:00 - 13:00',
        'Enf. Mujer y RN',
        'Presencial',
        '🏥 Facultad',
        3
    ),
    (
        'sofia',
        'Lunes',
        '15:00 - 18:00',
        'Enf. Niño y Adolescente',
        'Presencial',
        '🏥 Facultad',
        4
    ),
    (
        'sofia',
        'Lunes',
        '18:00 - 19:00',
        'Enf. Mujer y RN',
        'Presencial',
        '🏥 Facultad',
        5
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'sofia',
        'Martes',
        '08:00 - 16:00',
        'Estudio / Libre',
        'Rutina',
        '🏠 Casa',
        1
    ),
    (
        'sofia',
        'Martes',
        '17:00 - 20:00',
        'Practicum 2',
        'Práctica',
        '🚑 Hospital',
        2
    ),
    (
        'sofia',
        'Martes',
        '20:00 - 22:00',
        'Practicum 2 (Cont.)',
        'Práctica',
        '🚑 Hospital',
        3
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'sofia',
        'Miércoles',
        '09:00 - 12:00',
        'Repaso General',
        'Estudio',
        '🏠 Casa',
        1
    ),
    (
        'sofia',
        'Miércoles',
        '19:00 - 21:00',
        'Psicología en Enfermería',
        'Presencial',
        '🏫 Aula',
        2
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'sofia',
        'Jueves',
        '14:00 - 15:00',
        'Enf. Niño y Adolescente',
        'Presencial',
        '🏥 Facultad',
        1
    ),
    (
        'sofia',
        'Jueves',
        '18:00 - 21:00',
        'Enf. Niño y Adolescente',
        'Presencial',
        '🏥 Facultad',
        2
    );

INSERT INTO
    schedule (
        owner,
        day,
        time_range,
        title,
        type,
        location,
        sort_order
    )
VALUES (
        'sofia',
        'Viernes',
        '10:00 - 11:00',
        'Bioética',
        'Presencial',
        '🏫 Aula',
        1
    ),
    (
        'sofia',
        'Viernes',
        '11:00 - 12:00',
        'Bioética',
        'Presencial',
        '🏫 Aula',
        2
    ),
    (
        'sofia',
        'Viernes',
        '13:00 - 14:00',
        'Bioética',
        'Presencial',
        '🏫 Aula',
        3
    ),
    (
        'sofia',
        'Viernes',
        '14:00 - 17:00',
        'Practicum 2',
        'Práctica',
        '🚑 Hospital',
        4
    ),
    (
        'sofia',
        'Viernes',
        '18:00 - 21:00',
        'Psicología en Enfermería',
        'Presencial',
        '🏫 Aula',
        5
    );

INSERT INTO
    tasks (
        owner,
        title,
        priority,
        status
    )
VALUES (
        'anthony',
        'Probar exportar CSV',
        'Alta',
        'todo'
    ),
    (
        'sofia',
        'Organizar apuntes',
        'Media',
        'todo'
    );