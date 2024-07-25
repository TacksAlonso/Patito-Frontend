# Patito-Frontend

La pagina esta hecha con react

Se implemento un login: 
![alt text](image.png)

En el cual se genera el token para las demas llamadas al ser confirmado como exitoso:

Una vez logeado se muestra la siguiente ventana:
![alt text](image-1.png)

En ella podemos a preciar opciones en el menu las cuales son:
    - Registro ordenes
        - En esta ventana se podra crear ordenes
    - Listar ordenes
        - En esta se podra listar las ordenes existentes
    - Salir
        - Se genera un logout


La ventana de registro de ordenes se visualiza asi:
![alt text](image-2.png)

En ella al dar clic en el cuadro de Seleccionar cliente nos abrira el siguiente modal:
![alt text](image-3.png)

Se puede buscar por nombre, apellido, telefono o email:
![alt text](image-4.png)
Podemos registrar a nuevos clientes
![alt text](image-5.png)
Al obtener el listado de clientes, al dar en el boton Selecionar nos permitira marcar al cliente

Al dar clic en el cuadro de Seleccionar tienda nos abrira el siguiente modal:
![alt text](image-6.png)
Se nos mostrara las tiendas disponibles, al dar en el boton Selecionar nos permitira marcar la tienda

El cuadro de vendor es una caja de texto, por lo cual solo se podra capturar el nombre del vendedor.

El boton de Agregar producto, nos abrira la siguiente modal:
![alt text](image-7.png)
Al escribir se realizara una busqueda de los articulos exitentes: 
![alt text](image-8.png)
Al seleccionar un articulo se nos desplegara la opcion de definir cuanta cantidad deseamos agregar y si deseamos agregar descuento:
![alt text](image-9.png)
En el caso que no se cuente con stock suficiente se ocultara el boton de seleccionar
![alt text](image-10.png)

Al seleccionar los productos podemos generar el pedido, se nos pedira una confirmacion:
![alt text](image-12.png)

Se creara la orden:
![alt text](image-11.png)

En el menu de Listar ordenes, se mostrara el listado de todas las ordenes creadas:
![alt text](image-13.png)

Al dar clic en ver Detalles podemos ver los detalles de la orden al final de la pagina:
![alt text](image-14.png)

Podemos entregar la orden con el boton entregar:
![alt text](image-15.png)

Con ello se cambiara el estado de la orden
![alt text](image-16.png)

Al entregar o cancelar se ocultan los botones de entregar y cancelar

En el caso de cancelar y que se haya superado el tiempo de 10 min despues de su creacion se mandara el siguiente mensaje:
![alt text](image-17.png)

En el caso de estar en tiempo permitira cancelar la orden:
![alt text](image-18.png)
