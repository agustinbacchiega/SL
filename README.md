# El Sistema — Solo Leveling

App web instalable (PWA) que convierte tu entrenamiento diario en el Sistema de *Solo Leveling*. Funciona offline y guarda todo en el dispositivo.

## Fiel al canon

- **Despertar**: "Has adquirido las cualificaciones para ser un Jugador. ¿Aceptarás?" (si rechazás, tu corazón se detiene en 0.02 s).
- **Misión Diaria — Preparativos para volverse poderoso**: 100 flexiones, 100 abdominales, 100 sentadillas y 10 km de carrera, con cuenta regresiva hasta medianoche y la advertencia de castigo.
- **Recompensas**: recuperación total, +3 puntos de habilidad, Caja Aleatoria, XP y oro.
- **Zona de Castigo**: si no completás la diaria perdés HP, se corta la racha y el Sistema se pone en rojo. Para sobrevivir tenés que pasar X horas (4 h canon) sin usar las apps prohibidas y hacer el ejercicio de castigo.
- **Ventana de Estado**: nivel, clase, título, rango (E → D → C → B → A → S → Nivel Nacional), HP, MP, fatiga y STR / VIT / AGI / INT / PER. Cada nivel da +5 puntos para repartir.
- **Habilidades**: Tenacidad, Sprint, Sed de Sangre, Sigilo, Daga Mortal y, tras el cambio de clase, Extracción de Sombras ("¡Levántate!").
- **Cambio de Clase** en nivel 40 → Nigromante. Al nivel 100 → título *Monarca de las Sombras*.
- **Títulos**, que se consiguen con misiones secretas y dan bonus, **Tienda**, **Inventario**, **Mazmorras Instantáneas** (llaves) y **Misiones Secundarias** personalizadas.

## Evaluación del Jugador

Al despertar, el Sistema hace una evaluación: sexo, edad, altura, peso actual y objetivo, meta (perder grasa, ganar músculo, recomposición, resistencia o salud), nivel de actividad, flexiones, carrera, lesiones, tiempo disponible y horario preferido. Con eso:

- asigna la **misión diaria** a tu nivel (con menos carga en la zona lesionada) y la sube un 10% cada 7 misiones completadas, hasta llegar al estándar canon de 100 / 100 / 100 / 10 km;
- define tus **estadísticas iniciales**;
- estima IMC, calorías, proteína y agua, y agrega misiones secundarias acordes a tu objetivo;
- ajusta la hora del recordatorio.

En *Estado* podés registrar tu peso y ver el progreso hacia la meta. En *Sistema* podés repetir la evaluación o editar la dificultad a mano.

La misión diaria trae además un **cronómetro de entrenamiento** y temporizadores de descanso (30, 60 y 90 s).

## Rutinas

La pestaña *Rutinas* arma un **plan semanal** según tu evaluación: objetivo, días que entrenás, nivel, lesiones y tiempo disponible. Hay 8 rutinas con nombres del anime y ejercicios reales sin equipo:

| Rutina | Enfoque |
|---|---|
| Despertar | Cuerpo completo, principiante |
| Arsenal de Igris | Fuerza, tren superior |
| Pasos del Lobo | Fuerza, piernas y glúteos |
| Núcleo de Sombra | Core y estabilidad |
| Persecución de Kasaka | HIIT, quema de grasa |
| Marcha de la Legión | Resistencia, cardio |
| Fortaleza de Tank | Hipertrofia, volumen |
| Respiración del Monarca | Movilidad y recuperación |

Las repeticiones y series se ajustan a tu nivel, la cantidad de ejercicios a tu tiempo, y si tenés una lesión se reemplazan los ejercicios de riesgo (marcados como *adaptado*). Los ejercicios por tiempo tienen cuenta regresiva. Completar una rutina da XP.

## Progresión extra

- **Curva de niveles**: pensada para llegar al nivel 100 en alrededor de un año a un año y medio de constancia.
- **Habilidades equipables**: 3 ranuras, 4 desde el nivel 25 y 5 tras el cambio de clase. Hay 12 habilidades que se desbloquean por nivel, más la de clase.
- **Mazmorras raras**: Puertas Rojas (3 oleadas, más XP) y la Mazmorra Doble (muy rara), con jefes variados por rango.
- **Eventos aleatorios**: misiones de emergencia con tiempo límite, comerciante con descuentos, puertas con llaves gratis, bendiciones de XP y cofres.
- **Pruebas de fuerza**: flexiones máximas, sentadillas en 1 minuto, plancha, burpees en 3 minutos y 1 km. Registran récords y desbloquean títulos.
- **Entrenamiento guiado**: cada rutina se puede hacer paso a paso, con series, temporizador automático para ejercicios por tiempo y descansos que avanzan solos.
- **Jefe semanal**: cada semana aparece un jefe con HP que baja con todo lo que hacés (diaria, rutinas, mazmorras, pruebas, diario…). Si lo vencés antes del domingo hay recompensa grande.
- **Tarjeta de cazador**: genera una imagen con tu nivel, rango, estadísticas y récords para compartir.
- **Diario**: en el Calendario, cada día tiene una entrada de texto y un estado de ánimo. La de hoy da +15 XP y los días con entrada se marcan con ✎.
- **Logros** con 4 o 5 niveles cada uno y recompensas, y **títulos con requisitos visibles** (salvo los secretos).

## Bloqueo de apps en el castigo

Una app web no puede bloquear otras apps por sí sola, así que se apoya en el sistema del teléfono (configurable en *Sistema → Zona de Castigo*):

- **iPhone**: la app ejecuta un Atajo y le pasa la hora de fin del castigo. Una automatización de Atajos te devuelve a la pantalla de inicio si abrís una app prohibida antes de esa hora. Los pasos están dentro de la app.
- **Android**: el botón abre Bienestar Digital para activar el Modo concentración con esas apps.
- **Solo por honor**: cuenta regresiva y lista de apps, sin bloqueo real.

## Secretos

- **Misión secreta "Superar los límites"**: hacer el doble de la misión diaria da una recompensa oculta (XP, oro y Caja Aleatoria) cada día que lo logres.
- **Mazmorras**: cada llave genera 2 oleadas y un jefe (Lycan, Kasaka, Igris, Cerbero, Vulcan, Baran) adaptados a tu objetivo y lesiones. Los ejercicios por tiempo usan cuenta regresiva y los jefes pueden soltar otra llave.

## Instalar

1. Activá GitHub Pages en *Settings → Pages → Source: GitHub Actions*. El workflow publica en cada push.
2. Abrí la URL en el celular:
   - **Android (Chrome)**: menú ⋮ → *Instalar app*.
   - **iPhone (Safari)**: Compartir → *Agregar a inicio*.

Para probarla en local: `python3 -m http.server` y entrá a `http://localhost:8000`.

Fan app sin afiliación oficial.
