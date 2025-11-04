Para crear entorno virtual:

* python -m venv venv

Para ejecutar entorno virtual:

* .\venv\Scripts\activate

* En el caso de que no se pueda: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Para instalar las dependencias:

* pip install -r requirements.txt

Para poblar la base de datos:

* python seed.py

Para correr el backend:

* python app.py