# crop-recommendation-system

A full stack crop recommendation system that extracts the latitude and longitude coordinates and based on that gathers environment data to predict which crops grow best in an area.  
It is a colleborative effort of :  
[Amlan Jyoti Sarmah](https://github.com/AmlanJSarmah)  
[Prisha](https://github.com/prishabhatia46)  
[Smriti Singh](https://github.com/SmrSingh)  
[Ayushi Kashyap](https://github.com/ayushikashyap1207)  
[Dishita](https://github.com/dishi575)  
[Aanchal Rathi](https://github.com/AanchalRathi).

The project is created as a part of Project Exhibition 2, organised by VIT Bhopal University. It aims to demonstrate proficiency in areas of full stack development and Machine Learning.

## Proposed Design

![design-final](https://github.com/user-attachments/assets/448cccc5-f57b-49ba-981c-8e8db69c4a34)

## Installation Instruction

The project is divided into three parts

- The `model` directory stores the ML model and required data, the `crop_recommendation.py` files starts a server at port 5000 that can be accessed via an API. We can pass feature variables, make a prediction and recommend some crops.
- The `api` directory contains the source code for the MAIN API that returns the feature variable data like `N`, `P`, `K`, `rainfall in mm` etc for almost all the Indian states.
- The `views` directory stores the code for the frontend client.

Following are the steps to set up the project locally

### Setting the Flask API

To set up the flask API in the models folder we need to install the packages mentioned in `requirements.txt` by running

```
    pip install -r ./requirements.txt
```

after that we run

```
    python crop_recommendation.py
```

This starts a server at port 5000 that can be accessed by the frontend

### Setting up the MAIN API

To set up the main api we install every required package using the command

```
    npm install
```

After installing we save all the data in `assets/cropRecommendation.statedatas.json` in a MONGO DB database inside the _cropRecommendation_ collection in _statedatas_ document.  
**The mongo db server must be at port 27017**

To start the server run

```
    npm start
```

The server starts at Port 8080

### Setting up the Frontend

In the `views/script.js` file put your Open Weather API key in the `OPEN_WEATHER_API_KEY` variable inside the strings, it can by clicking (here)[https://openweathermap.org/api] and signing up.  
We can now simply run the `index.html` file or start it via live server.
