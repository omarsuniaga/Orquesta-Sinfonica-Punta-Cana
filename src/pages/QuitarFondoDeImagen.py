import cv2

# Cargar imagen
image = cv2.imread("imagen.jpg")

# Cargar cascada de Haar
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

# Detectar rostros en imagen
faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5)

# Recorrer las coordenadas de los rostros detectados
for (x, y, w, h) in faces:
    # Crear máscara en forma de rostro
    mask = np.zeros(image.shape[:2], dtype=np.uint8)
    roi_corners = np.array([[(x, y), (x+w, y), (x+w, y+h), (x, y+h)]], dtype=np.int32)
    channel_count = image.shape[2]
    ignore_mask_color = (255,)*channel_count
    cv2.fillPoly(mask, roi_corners, ignore_mask_color)
    # Aplicar máscara a imagen
    image = cv2.bitwise_and(image, image, mask=mask)

# Mostrar imagen resultante
cv2.imshow("Imagen con solo rostro", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
