/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import moment from 'moment';
import localeEs from 'moment/locale/es';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import { message } from 'antd';

moment.updateLocale('es', localeEs);

const useStyles2 = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'rigth',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: '#FFFFFF',
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: '#FFFFFF',
        position: 'absolute',
    },
    progress: {
        marginTop: '10px',
    },
}));

export default function CargarEnviarPlantilla(props) {

    const auth = useSelector((state) => state.auth);
    const classes2 = useStyles2();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const buttonClassname = clsx({
        [classes2.buttonSuccess]: success,
    });
    const formData = new FormData();
    const [archivo, setArchivo] = useState(null);
    const [nombrePlantilla, setNombrePlantilla] = useState('')
    const [idDocumento, setIdDocumento] = useState(0)
    const [estado, setEstado] = useState(false)
    let [varJson, setVarJson] = useState([]);
    let [archivoJson, setArchivoJson] = useState([]);

    const createJson = (arraydata, archivo, nombrePlantilla) => {
        let varTempJson = [...varJson];
        let varTempJsonArray = [...varJson]
        let activateY = false;
        let varNameTempJsonArray = [];
        let data = arraydata.map((linea, index) => {
            let html = [];
            linea.hijos.forEach((item, index) => {
                let foundY = item.texto.match(/(Y{3})\w*:\w*(Y{3})/gm);
                console.log(item.texto);
                console.log(foundY);
                let endFoundY = item.texto.match(/(Y{3})\\\w*:\w*(Y{3})/gm);
                console.log(endFoundY);
                if (foundY) {
                    activateY = true;
                    foundY.forEach(element => {
                        if (!varNameTempJsonArray.includes(element.slice(3, -3).split(':')[0])) {
                            varTempJson = [...varTempJson, { tipo: 'array', nombre: element.slice(3, -3).split(':')[0], orden: element.slice(3, -3).split(':')[1], valor: "", original: "", cantidad: 1 }];
                            varNameTempJsonArray.push(element.slice(3, -3).split(':')[0])
                        }
                    });
                    console.log(varNameTempJsonArray);
                }
                console.log(activateY);
                if (activateY) {
                    let inicio = 0;

                    //Si hay varios YYY-YYY en un mismo parrafo
                    if (foundY.length >= 1) {
                        foundY.map((name, ind) => {
                            let value = item.texto
                            let primeraFrase = value.substring(inicio, value.indexOf(name)); // for finding the first part
                            let indexNuevo = value.indexOf(name) + name.length; //for the last part
                            let segundaFrase = value.substring(indexNuevo, value.indexOf(endFoundY[ind]));
                            let nuevoInicio = value.indexOf(endFoundY[ind]) + endFoundY[ind].length; //for the last part
                            console.log(primeraFrase)
                            console.log(segundaFrase)
                            inicio = nuevoInicio
                            //encontrar ZZZ-ZZZ en segunda frase
                            let found = segundaFrase.match(/(Z{3})\w*:\w*:\w*(Z{3})/gm)
                            if (Array.isArray(found)) {
                                varTempJsonArray = []
                                console.log("entro activateY");
                                console.log(found)
                                let indexNombre = varNameTempJsonArray.length - 1;
                                console.log("indexy nameTempJson Array");
                                console.log(indexNombre);
                                console.log(varNameTempJsonArray);
                                varNameTempJsonArray.map((etiquetaYYY, index) => {
                                    found.forEach(element => {
                                        let foundit = false;
                                        let indice;
                                        varTempJson.map((name, ind) => {
                                            console.log(varNameTempJsonArray[index])
                                            if (varNameTempJsonArray[index] === name.nombre) {
                                                foundit = true;
                                                indice = ind;
                                                console.log("Número " + indice + " nombre " + name.nombre)
                                            }
                                        });
                                        if (foundit) {
                                            varTempJsonArray = [...varTempJsonArray, { tipo: element.slice(3, -3).split(':')[0], nombre: element.slice(3, -3).split(':')[1], orden: element.slice(3, -3).split(':')[2], valor: "" }];
                                            varTempJson[indice].valor = [...varTempJsonArray];
                                            varTempJson[indice].original = [...varTempJsonArray];
                                            console.log(indice);
                                            foundit = false;
                                        }
                                    });
                                    console.log(varTempJsonArray)
                                })
                            }
                            if (primeraFrase) {
                                varTempJsonArray = []
                                let found = primeraFrase.match(/(Z{3})\w*:\w*:\w*(Z{3})/gm)
                                if (Array.isArray(found)) {
                                    // console.log(found);
                                    found.forEach(element => {
                                        let foundit = false;
                                        varTempJson.map((name, ind) => {
                                            // console.log(element.slice(3, -3).split(':')[1])
                                            if (element.slice(3, -3).split(':')[1] === name.nombre) {
                                                foundit = true;
                                            }
                                        });
                                        if (!foundit) {
                                            varTempJson = [...varTempJson, { tipo: element.slice(3, -3).split(':')[0], nombre: element.slice(3, -3).split(':')[1], orden: element.slice(3, -3).split(':')[2], valor: "" }];
                                        }
                                    });
                                }
                            }
                        })
                        //Saltar a otro parrafo, despues de analizar el presente
                        if (endFoundY) {
                            activateY = false;
                        }
                    } else {
                        //Si hay un YYY y despues solo zzz-zzz en parrafos
                        let found = item.texto.match(/(Z{3})\w*:\w*:\w*(Z{3})/gm)
                        if (Array.isArray(found)) {
                            console.log("entro activateY");
                            console.log(found)
                            found.forEach(element => {
                                let foundit = false;
                                let indice;
                                varTempJson.map((name, ind) => {
                                    if (varNameTempJsonArray === name.nombre) {
                                        foundit = true;
                                        indice = ind;
                                    }
                                });
                                if (foundit) {
                                    varTempJsonArray = [...varTempJsonArray, { tipo: element.slice(3, -3).split(':')[0], nombre: element.slice(3, -3).split(':')[1], orden: element.slice(3, -3).split(':')[2], valor: "" }];
                                    varTempJson[indice].valor = [...varTempJsonArray];
                                }
                            });
                        }
                        if (endFoundY) {
                            activateY = false;
                        }
                        console.log(varTempJsonArray)
                    }
                    console.log(varTempJsonArray)
                } else {
                    console.log("entra")
                    varTempJsonArray = []
                    let found = item.texto.match(/(Z{3})\w*:\w*:\w*(Z{3})/gm)
                    if (Array.isArray(found)) {
                        // console.log(found);
                        found.forEach(element => {
                            let foundit = false;
                            varTempJson.map((name, ind) => {
                                // console.log(element.slice(3, -3).split(':')[1])
                                if (element.slice(3, -3).split(':')[1] === name.nombre) {
                                    foundit = true;
                                }
                            });
                            if (!foundit) {
                                varTempJson = [...varTempJson, { tipo: element.slice(3, -3).split(':')[0], nombre: element.slice(3, -3).split(':')[1], orden: element.slice(3, -3).split(':')[2], valor: "" }];
                            }
                        });
                    }

                }

            });
            return html;
        })
        setVarJson([...varTempJson]);
        console.log(varTempJson);
        setArchivoJson([...varTempJson]);
    }

    const getFile = (archivo, nombrePlantilla, estado, idDocumento) => {
        // Create an object of formData
        setSuccess(false);
        setError(false);
        //console.log(archivo.blocks[0].text != '');
        if (archivo.blocks[0].text != '') {
            if (nombrePlantilla) {
                setSuccess(false);
                setLoading(true);
                setEstado(estado)
                setIdDocumento(idDocumento);
                setNombrePlantilla(nombrePlantilla);
                setArchivo(archivo)
                loaddata(archivo, nombrePlantilla);
            } else {
                message.warning('Falta digitar el nombre de la plantilla');
            }
        } else {
            if (nombrePlantilla) {
                message.warning('Falta digitar la plantilla');
            } else {
                message.warning('Falta digitar el nombre de la plantilla y la plantilla')
            }
        }
    }

    const loaddata = (archivo, nombrePlantilla) => {
        let arraydata = archivo.blocks.map((item) => {
            let align = "";
            let hijos = [];
            let indices = [];
            let intervalos = [];
            let temp = 0;
            if (item.data["text-align"]) {
                align = item.data["text-align"];
            }
            if (item.inlineStyleRanges.length > 0) {
                item.inlineStyleRanges.forEach((indice) => {
                    if (indices.indexOf(indice.offset) === -1) {
                        indices.push(indice.offset);
                    }
                    if (indices.indexOf(indice.offset + indice.length) === -1) {
                        indices.push(indice.offset + indice.length);
                    }
                })
                indices.push(item.text.length);
                indices.sort((a, b) => a - b);
                indices.forEach((element) => {
                    intervalos.push({ text: item.text.slice(temp, element), inicio: temp, fin: element });
                    temp = element;
                });
                intervalos.forEach((element) => {
                    let negrillaHijo = false;
                    let italicaHijo = false;
                    item.inlineStyleRanges.forEach((item) => {
                        if (element.inicio >= item.offset && element.fin <= (item.offset + item.length)) {
                            switch (item.style) {
                                case "BOLD": negrillaHijo = true; break;
                                case "ITALIC": italicaHijo = true; break;
                            }
                        }
                    })
                    hijos.push({
                        letra: "Arial",
                        negrilla: negrillaHijo,
                        italica: italicaHijo,
                        size: "12",
                        texto: element.text,
                    })
                })
            } else {
                hijos.push({
                    letra: "Arial",
                    negrilla: false,
                    italica: false,
                    size: "12",
                    texto: item.text,
                })
            }
            return { align, hijos }
        })
        //console.log("Prueba")
        createJson(arraydata, archivo, nombrePlantilla)
        //console.log(arraydata);
    }

    useEffect(() => {
        if (nombrePlantilla !== '') {
            let jsonA = {
                cantidad: 'Uno',
                genero: "Masculino",
                archivoJson: archivoJson,
            }
            formData.append(
                'nombre_plantilla',
                nombrePlantilla,
            );
            formData.append(
                'variables',
                JSON.stringify(jsonA),
            );
            formData.append(
                'archivo',
                JSON.stringify(archivo),
            );
            //console.log(formData.get('variables'));
            //Axios
            let config;
            if (!estado) {
                config = {
                    method: 'post',
                    url: process.env.REACT_APP_URL_API + "/api/PlantillaAgiles",
                    headers: { Authorization: `Bearer ${auth.token} ` },
                    data: formData,
                };
            } else {
                config = {
                    method: 'put',
                    url: process.env.REACT_APP_URL_API + "/api/PlantillaAgiles/" + idDocumento,
                    mode: 'cors',
                    headers: { Authorization: `Bearer ${auth.token} `, "Access-Control-Allow-Origin": "*" },
                    data: {
                        archivo: JSON.stringify(archivo),
                        nombre_plantilla: nombrePlantilla,
                        variables: jsonA,
                    },
                };
            }
            axios(config)
                .then((response) => {
                    setSuccess(true);
                    setLoading(false);
                    console.log(response.data.id)
                    moveToplantillas();
                })
        }
    }, [archivoJson])

    const moveToplantillas = () => {
        props.history.push({ pathname: '/admin/plantillas', state: { idDocu: idDocumento } })
    }

    return (
        <div style={{ textAlign: 'end', width: '100%' }}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={9}>
                    {success ? <Alert severity="success">La plantilla se ha subido exitosamente</Alert> : <span></span>}
                    {error ? <Alert severity="error">El nombre plantilla ya esta en uso</Alert> : <span></span>}
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                    <Button variant="contained" color="rose" className={buttonClassname} component="label" disabled={loading} onClick={() => getFile(props.data, props.nombrePlantilla, props.estado, props.idDocumento)} type="button">
                        {loading ? <span><i className="fa fa-spinner fa-spin"></i> Cargando</span> : "Subir plantilla"}
                    </Button>
                </GridItem>
            </GridContainer>
        </div>
    );
}
