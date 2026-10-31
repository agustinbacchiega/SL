# El Sistema — Solo Leveling

App web instalable (PWA) que convierte tu entrenamiento diario en el Sistema de *Solo Leveling*. Funciona offline y guarda todo en el dispositivo.

## Fiel al canon

- **Despertar**: "Has adquirido las cualificaciones para ser un Jugador. ¿Aceptarás?" (si rechazás, tu corazón se detiene en 0.02 s).
- **Misión Diaria — Preparativos para volverse poderoso**: 100 flexiones, 100 abdominales, 100 sentadillas y 10 km de carrera, con cuenta regresiva hasta medianoche y la advertencia de castigo.
- **Recompensas**: recuperación total, +3 puntos de habilidad, Caja Aleatoria, XP y oro.
- **Zona de Castigo**: si no completás la diaria pierdes HP, se corta la racha y el Sistema se pone en rojo hasta que cumplas la misión de castigo "Sobrevivir".
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

## Instalar

1. Activá GitHub Pages en *Settings → Pages → Source: GitHub Actions*. El workflow publica en cada push.
2. Abrí la URL en el celular:
   - **Android (Chrome)**: menú ⋮ → *Instalar app*.
   - **iPhone (Safari)**: Compartir → *Agregar a inicio*.

Para probarla en local: `python3 -m http.server` y entrá a `http://localhost:8000`.

Fan app sin afiliación oficial.
