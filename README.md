# Earthquake Prediction

This repository's goal is to showcase how to use Next.js and FastAPI to build a website that monitors earthquakes in real time and forecast the magnitudes of earthquakes using machine learning. It utilizes a CatBoost regression model that was trained using [USGS earthquakes data](https://earthquake.usgs.gov/fdsnws/event/1/) by creating time series features, embedding lags, and adding seasonal indicators. In addition to that, the website was designed using Figma and you can authenticate via Google Sign-in through NextAuth.js. You can access the [Next.js app](https://earthquake-prediction.vercel.app) and the [API](https://earthquake-prediction.onrender.com/docs) here.

## Requirements

To install the API/ML requirements for **Python 3.9+**:

```
cd app/server
pip install -r requirements.txt
```

To install the Next.js dependencies:

```
cd app/client
npm install
```

## Development

To run the API:

```
uvicorn app.main:app --reload
```

To run the Next.js app:

```
npm run dev
```

## License

This repository is released under the [MIT license](https://opensource.org/licenses/MIT). In short, this means you are free to use this software in any personal, open-source or -commercial projects. Attribution is optional but appreciated.
