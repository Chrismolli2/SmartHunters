-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-06-2026 a las 07:58:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smarthunters_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases_programadas`
--

CREATE TABLE `clases_programadas` (
  `id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `dia` varchar(50) NOT NULL,
  `hora` varchar(50) NOT NULL,
  `modalidad` varchar(50) NOT NULL,
  `lugar` varchar(100) NOT NULL,
  `observacion` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases_programadas`
--

INSERT INTO `clases_programadas` (`id`, `docente_id`, `titulo`, `dia`, `hora`, `modalidad`, `lugar`, `observacion`, `createdAt`) VALUES
(1, 1, 'Álgebra básica', 'Lunes', '15:00', 'Presencial', 'Aula 2', 'Repaso para examen prefacultativo', '2026-06-08 05:14:34'),
(2, 1, 'Cálculo diferencial', 'Miércoles', '17:00', 'Virtual', 'Google Meet', 'Clase de derivadas y límites', '2026-06-08 05:14:34'),
(3, 2, 'Mecánica básica', 'Viernes', '16:00', 'Presencial', 'Aula 1', 'Ejercicios de MRU y MRUV', '2026-06-08 05:14:34'),
(4, 3, 'Química general', 'Lunes', '14:00', 'Presencial', 'Laboratorio 1', 'Formulación química básica', '2026-06-08 05:14:34'),
(5, 4, 'Comprensión lectora', 'Jueves', '10:00', 'Virtual', 'Zoom', 'Práctica de lectura crítica', '2026-06-08 05:14:34'),
(6, 5, 'Clase escolar Mateo', 'Miercoles', '22:00', 'Presencial', 'aula 1', 'repasar los apuntes del estudiante y prepararlo para su proximo examen', '2026-06-08 05:36:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

CREATE TABLE `docentes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `materia` varchar(100) NOT NULL,
  `horario` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `imagen` varchar(200) NOT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `nombre`, `materia`, `horario`, `descripcion`, `imagen`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'Sergio', 'Matemáticas', 'Lunes, miércoles y viernes', 'Docente especializado en álgebra, cálculo y preparación universitaria.', 'img/profe-sergio.png', 'activo', '2026-06-05 17:59:20', '2026-06-05 17:59:20'),
(2, 'Fred', 'Física', 'Lunes a viernes', 'Docente enfocado en física básica, mecánica y resolución de ejercicios.', 'img/profe-fred.png', 'activo', '2026-06-05 17:59:20', '2026-06-05 17:59:20'),
(3, 'Andrea', 'Química', 'Lunes a viernes', 'Docente preparado para química general y ejercicios prácticos.', 'img/profe-andrea.png', 'activo', '2026-06-05 17:59:20', '2026-06-05 17:59:20'),
(4, 'Mariana', 'Lenguaje', 'Martes y jueves', 'Apoyo en redacción y comprensión lectora.', 'img/profe-mariano.png', 'activo', '2026-06-05 17:59:20', '2026-06-08 05:49:49'),
(5, 'Gustavo', 'Electronica', 'Lunes y martes', 'profesor experto en examenes prefacultativos especialista en electronica y fundamentos digitales', 'img/profe-gustavo.png', 'activo', '2026-06-08 04:50:44', '2026-06-08 04:50:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `nombre_estudiante` varchar(100) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `comentario` text DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `docente_id`, `nombre_estudiante`, `telefono`, `comentario`, `estado`, `createdAt`) VALUES
(1, 1, 'Pedro Mamani', '76543210', 'Quiero clases de álgebra los fines de semana', 'pendiente', '2026-06-08 05:42:41'),
(2, 3, 'Christian Mollinedo', '69829046', 'quisiera clases los martes y jueves si es posible', 'pendiente', '2026-06-08 05:45:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_acceso`
--

CREATE TABLE `logs_acceso` (
  `id` int(11) NOT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `evento` varchar(50) DEFAULT NULL,
  `browser` text DEFAULT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs_acceso`
--

INSERT INTO `logs_acceso` (`id`, `usuario`, `ip`, `evento`, `browser`, `fecha_hora`) VALUES
(1, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:13:28'),
(2, 'admin2', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:17:06'),
(3, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:17:55'),
(4, 'admin2', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:24:50'),
(5, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:45:09'),
(6, 'admin2', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:46:08'),
(7, 'Licenciado', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:46:26'),
(8, 'Licenciado', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:47:31'),
(9, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-05 20:47:43'),
(10, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 04:41:46'),
(11, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 04:52:19'),
(12, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:01:15'),
(13, 'admin2', '::ffff:127.0.0.1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:01:39'),
(14, 'Docente2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:01:52'),
(15, 'Docente2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:08:39'),
(16, 'Docente2', '::ffff:127.0.0.1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:27:44'),
(17, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:34:38'),
(18, 'admin2', '::ffff:127.0.0.1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:35:07'),
(19, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:35:38'),
(20, 'admin2', '::ffff:127.0.0.1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:36:53'),
(21, 'Docente2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:37:04'),
(22, 'Docente2', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:37:26'),
(23, 'admin2', '::1', 'ingreso', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:48:37'),
(24, 'admin2', '::1', 'salida', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-08 05:50:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `rol`, `createdAt`) VALUES
(3, 'admin', '$2b$10$tAY2o/4zXiiA761IpeMJ9ucIiX6mF/afDplyRd0zs98842Oo/zoGe', 'admin', '2026-06-05 18:38:30'),
(4, 'docente', '$2b$10$Zse2TL/pY..MbA4V2i5CuOVTW4T0yW/cNBluneZp.IJs1y4nFlRtS', 'docente', '2026-06-05 18:38:54'),
(5, 'admin2', '$2b$10$XL/M8piu64ByamWdaiXf5uhetNIJO.oU3Hiw3zEhWZxf1i6WHS6wu', 'admin', '2026-06-05 18:43:15'),
(6, 'Licenciado', '$2b$10$N1eUVAJRP8zrIvfa4Z72v.BH0CSGxZYl5l4QTl6f2B7PCq5aBzh4q', 'docente', '2026-06-05 20:46:05'),
(7, 'Docente2', '$2b$10$P4x2sY3dB8MOgCRIX0u6HOV1FIJO1WHb9D.NxAvKHgi4UTzO1wK26', 'docente', '2026-06-08 05:01:37');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clases_programadas`
--
ALTER TABLE `clases_programadas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente_id` (`docente_id`);

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente_id` (`docente_id`);

--
-- Indices de la tabla `logs_acceso`
--
ALTER TABLE `logs_acceso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clases_programadas`
--
ALTER TABLE `clases_programadas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `logs_acceso`
--
ALTER TABLE `logs_acceso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clases_programadas`
--
ALTER TABLE `clases_programadas`
  ADD CONSTRAINT `clases_programadas_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes` (`id`);

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
