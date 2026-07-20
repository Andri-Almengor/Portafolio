# Esquema de Google Sheets

- `Sections`: contenido editable de cada sección; `contentJson` conserva estructuras flexibles.
- `Projects`: proyectos, enlaces, estado de publicación y referencia privada a la imagen en Drive.
- `Admins`: administradores con `passwordHash`; no se guardan contraseñas.
- `Sessions`: hashes de refresh tokens, vencimiento y revocación.
- `Contacts`: mensajes recibidos y estado de seguimiento.

No cambie manualmente los encabezados. Las operaciones administrativas deben realizarse desde el panel para mantener formatos y validaciones coherentes.
