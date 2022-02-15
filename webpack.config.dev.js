// Este es el archivo de configuración para webpack
// Requerimos el paquete para poder trabajar con rutas llamado path
const path = require("path");
//Requerimos el plugin de html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//requerimos el plugin de css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//Importamos el plugin para copiar archivos
const CopyWebpack = require('copy-webpack-plugin')
//Aqui va el modulo de las variables de entorno
const DotEnv = require('dotenv-webpack')

/** @type {import('webpack').Configuration} */ //Esto es para habilitar el autocompletado

module.exports = {
  // Punto de entrada de nuestra app (el index.js)
  entry: "./src/index.js",
  //Hacia donde enviaremos lo que va a preparar webpack
  output: {
    path: path.resolve(__dirname, "dist"),
    //Nombre del archivo que se creará en la carpeta del output
    //Lo ponemos de esa forma para que nos muestre un hash en cada build y asi saber si se modificó el archivo

    filename: "[name].[contenthash].js",
    //Esto es para que las imagenes de dist se guarden en una carpeta y no queden sueltas
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  //Aqui le decimos que este archivo es para modo desarrollo
  mode: "development",
  //Aqui le indicariamos que se mantenga escuchando con el metodo watch
  watch: true,
  //Extensiones con las que trabajaremos
  resolve: {
    extensions: [".js"],
    alias : {
      "@assets" : path.resolve(__dirname, 'src/assets/'),
      "@styles" : path.resolve(__dirname, 'src/styles/'),
      "@templates" : path.resolve(__dirname, 'src/templates/'),
      "@utils" : path.resolve(__dirname, 'src/utils/'),
      "@images" : path.resolve(__dirname, 'src/assets/images/'),
    }
  },
  //Creamos las reglas segun se van a comportar diferentes tipos de archivos
  module: {
    rules: [
      {
        //Aqui se va a conectar nuestro webpack con babel
        //test es para saber como trabajar con ciertas extensiones
        test: /\.m?js$/, //Esto es para decir que va a trabajar con cualquier archivo .mjs o (?) .js
        exclude: /node_modules/, //Esto es para que excluya todos los elementos del node modules
        use: {
          loader: "babel-loader", //Para indicarle los loader que va a utilizar en este caso babel loader
        },
      },
      //Aqui añadiremos la regla para que reconozca las extenciones de css y sass
      {
        test: /\.css$/i,
        //Esta vez el loader lo llamaremos desde el plugin de la siguiente forma
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      //Esta es la regla para los loaders de las imagenes
      {
        test: /\.png/,
        type: "asset/resource",
      },
      //Configuramos las reglas para leer archivos woff y woff2 que son los formatos de las fuentes
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: "application/font-woff",
            name: "[name].[contenthash].[ext]",
            output: "./assets/fonts/",
            publicPath: "../assets/fonts/",
            esModule: false,
          },
        }
      }
    ],
  },
  //Aqui iran los plugins con los que trabajaremos
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html'
    }),
    //Aqui llamaremos el plugin de css sin ninguna configuracion interna como la del html
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    //Aqui configuraremos el plugin para la copia de archivos
    new CopyWebpack({
      patterns:[{
          //desde donde se copiaran los archivos
          from: path.resolve(__dirname, "src", "assets/images"),
          //Hacia donde moveremos el archivo
          to: "assets/images"
        }]
    }),
    //Aqui configuramos el plugin para trabajar con las variables de entorno
    new DotEnv(),
    
  ], 
};
