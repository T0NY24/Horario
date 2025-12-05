-- 1. LIMPIEZA
DROP TABLE IF EXISTS schedule;

DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS finance;

DROP TABLE IF EXISTS habits;

DROP TABLE IF EXISTS notes;

-- 2. CREAR TABLAS
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL, -- 'anthony' o 'sofia'
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
    type VARCHAR(10)
);

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(20) NOT NULL,
    title VARCHAR(100),
    history TEXT DEFAULT ''
);

-- ==========================================
-- 3. DATOS DE ANTHONY (TI)
-- ==========================================
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
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Escritorio',
        1
    ),
    (
        'anthony',
        'Lunes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 Universidad',
        2
    ),
    (
        'anthony',
        'Lunes',
        '13:00 - 15:00',
        'Almuerzo + Deberes',
        'Estudio',
        '📚 Biblioteca',
        3
    ),
    (
        'anthony',
        'Lunes',
        '15:00 - 18:00',
        'Simulación',
        'Presencial',
        '🏫 Aula 102',
        4
    ),
    (
        'anthony',
        'Lunes',
        '18:00 - 21:00',
        'Gestión Calidad',
        'Presencial',
        '🏫 Aula 204',
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
        'anthony',
        'Martes',
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Martes',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        2
    ),
    (
        'anthony',
        'Martes',
        '13:30 - 17:00',
        'PRODUCCIÓN MUSICAL',
        'Música',
        '🎹 Studio',
        3
    ),
    (
        'anthony',
        'Martes',
        '17:00 - 19:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        4
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
        '07:00 - 09:00',
        'Inglés',
        'Virtual',
        '🏠 Casa',
        1
    ),
    (
        'anthony',
        'Miércoles',
        '10:00 - 13:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
        2
    ),
    (
        'anthony',
        'Miércoles',
        '15:00 - 17:00',
        'GYM / DEPORTE',
        'Deporte',
        '🏋️ Gym',
        3
    ),
    (
        'anthony',
        'Miércoles',
        '19:00 - 22:00',
        'Legislación',
        'Virtual',
        '🏠 Casa',
        4
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
        '10:00 - 12:00',
        'Programación',
        'Presencial',
        '🏫 Campus',
        1
    ),
    (
        'anthony',
        'Jueves',
        '15:00 - 17:00',
        'Prácticas Pre',
        'Presencial',
        '🏫 U',
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
        'anthony',
        'Viernes',
        '08:00 - 10:00',
        'Programación',
        'Presencial',
        '🏫 Campus',
        1
    ),
    (
        'anthony',
        'Viernes',
        '10:30 - 15:00',
        'PRODUCCIÓN DEEP',
        'Música',
        '🎹 Studio',
        2
    ),
    (
        'anthony',
        'Viernes',
        '16:00 - 18:00',
        'Arquitectura',
        'Presencial',
        '🏫 Campus',
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
        'anthony',
        'Sábado',
        '07:00 - 10:00',
        'Computación',
        'Virtual',
        '🏠 Casa',
        1
    );

-- ==========================================
-- 4. DATOS DE SOFIA (ENFERMERÍA)
-- ==========================================
-- Lunes
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
        '09:00 - 10:00',
        'Enf. Mujer y Recién Nacido',
        'Presencial',
        '🏥 Facultad',
        1
    ),
    (
        'sofia',
        'Lunes',
        '12:00 - 13:00',
        'Enf. Mujer y Recién Nacido',
        'Presencial',
        '🏥 Facultad',
        2
    ),
    (
        'sofia',
        'Lunes',
        '15:00 - 18:00',
        'Enf. Niño y Adolescente',
        'Presencial',
        '🏥 Facultad',
        3
    ),
    (
        'sofia',
        'Lunes',
        '18:00 - 19:00',
        'Enf. Mujer y Recién Nacido',
        'Presencial',
        '🏥 Facultad',
        4
    );
-- Martes
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
        '17:00 - 20:00',
        'Practicum 2',
        'Práctica',
        '🚑 Hospital/Clínica',
        1
    ),
    (
        'sofia',
        'Martes',
        '20:00 - 22:00',
        'Practicum 2 (Continuación)',
        'Práctica',
        '🚑 Hospital/Clínica',
        2
    );
-- Miércoles
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
        '19:00 - 21:00',
        'Psicología en Enfermería',
        'Presencial',
        '🏫 Aula',
        1
    );
-- Jueves
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
-- Viernes
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

-- Tareas de Ejemplo
INSERT INTO
    tasks (
        owner,
        title,
        priority,
        status
    )
VALUES (
        'anthony',
        'Subir cambios a GitHub',
        'Alta',
        'todo'
    ),
    (
        'sofia',
        'Comprar uniforme prácticas',
        'Alta',
        'todo'
    ),
    (
        'sofia',
        'Leer guía de Bioética',
        'Media',
        'doing'
    );