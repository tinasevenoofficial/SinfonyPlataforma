/* eslint-disable */
import React from "react";
import InputUpdate from '../ComponetsForm/InputUpdate';
import InputTipoDoc from '../ComponetsForm/InputTipoDoc';
import InputNotaria from '../ComponetsForm/inputNotaria';
import InputPais from '../ComponetsForm/InputPais';
import InputEstadoCivil from '../ComponetsForm/InputEstadoCivil';
import InputSoloGenero from '../ComponetsForm/InputSoloGenero';
import InputNotaria2 from "../ComponetsForm/InputNotaria2";
import InputNotaria3 from "../ComponetsForm/InputNotaria3";
import InputEmail from "../ComponetsForm/inputEmail";
import InputTiempo from "../ComponetsForm/InputTiempo";
import InputTipoDocNum from "../ComponetsForm/inputTipoDocNum"
import InputFechaTiempo from "../ComponetsForm/InputFechaTiempo";
import InputTextArea from "../ComponetsForm/InputTextarea";
import InputArray from "../ComponetsForm/InputArray";
import InputMayorMenorEdad from "../ComponetsForm/InputMayorMenorEdad";

export default function jsonACampos(props) {

    let documentos = props.documentos ? props.documentos : [];
    let esSubArray = props.subArray ? props.subArray : false;
    let indexSubArray = props.subArray ? props.indexSubArray : -1;
    console.log("documentos recibidos por Props en jsonACampos")
    console.log(props.documentos)
    let fieldsForm = [];
    let nombresCampos = []

    //actualizar campos con solo una variable
    const update = (posicion, value = 0) => {
        console.log("JSON que tiene todo")
        console.log(documentos)
        let jsontemp = [...documentos];
        console.log("Actualizar campos");
        console.log(jsontemp[posicion]);
        jsontemp[posicion].valor = value;
        documentos = [...jsontemp];
    };

    const updateArray = (posicionArrayGeneral, posicionSubArray, value) => {
        console.log("JSON que tiene todo ARRAY")
        console.log(documentos)
        let jsontemp = [...documentos];
        let subJsonTemp = [...jsontemp[posicionArrayGeneral].valor]
        console.log("Actualizar campos");
        console.log(subJsonTemp[posicionSubArray]);
        subJsonTemp[posicionSubArray].valor = value;
        documentos = [...jsontemp];
    };

    const updateCantidadArray = (posicionArrayGeneral, cantidad) => {
        console.log("JSON que tiene todo")
        console.log(documentos)
        let jsontemp = [...documentos];
        console.log("Actualizar campos");
        console.log(jsontemp[posicionArrayGeneral]);
        jsontemp[posicionArrayGeneral].cantidad = cantidad;
        documentos = [...jsontemp];
    }


    documentos.sort((a, b) => parseFloat(a.orden) - parseFloat(b.orden));
    documentos.forEach((item, index) => {

        //Realizar nombres de campos presentables para mostrar en formulario
        let nombreCampo = "";
        if (/_/g.test(item.nombre)) {
            nombreCampo = item.nombre.split('_')[0].substr(0, 1).toUpperCase() + item.nombre.split('_')[0].substr(1,) + " " + item.nombre.split('_')[1];
        } else {
            nombreCampo = item.nombre.substr(0, 1).toUpperCase() + item.nombre.substr(1,);
        }

        //Creación de campos
        let tipo = item.tipo.includes('invicible') ? item.tipo.replace("invicible", "")  : item.tipo
        console.log(tipo)
        switch (tipo) {
            case "number": {
                let found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre.toString());
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"number"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "number1": {
                let found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre.toString());
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"number"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "text": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"text"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "email": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputEmail
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date1": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date2": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date3": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date4": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date5": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputUpdate
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                tipo={"date"}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "date6": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputFechaTiempo
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "tipoDoc": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputTipoDoc
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "tipoDocCom": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputTipoDoc
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "textarea": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputTextArea
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "pais": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputPais
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "tiempo": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputTiempo
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "estadocivil": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputEstadoCivil
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "sologenero": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputSoloGenero
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "tipoDocNum": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputTipoDocNum
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "notaria": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <InputNotaria
                                update={esSubArray ? props.updateArrayProps : update}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "notaria1": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <InputNotaria2
                                update={esSubArray ? props.updateArrayProps : update}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "notaria2": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <InputNotaria3
                                update={esSubArray ? props.updateArrayProps : update}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "array": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputArray
                                valor={item.valor}
                                camposOriginal={item.original}
                                nombre={item.nombre}
                                cantidad={item.cantidad}
                                index={index}
                                update={updateArray}
                                updateField={update}
                                updateCantidad={updateCantidadArray}
                            />
                        </div>
                    )
                }
                break;
            }

            case "mayoromenor": {
                const found = nombresCampos.find(element => element == item.nombre);
                if (!found) {
                    nombresCampos.push(item.nombre);
                    fieldsForm.push(
                        <div className="col-md-12" style={{ margin: '20px' }}>
                            <span style={{ fontSize: 16 }}><b>{nombreCampo}:</b></span>
                            <InputMayorMenorEdad
                                update={esSubArray ? props.updateArrayProps : update}
                                valor={item.valor}
                                nombre={item.nombre}
                                index={index}
                                indexArray={indexSubArray}
                            />
                        </div>
                    )
                }
                break;
            }


            default:
                return "Campo no reconocido";
        }
    });
    console.log("Campos finales en jsonAcampos");
    console.log(fieldsForm);

    return [documentos, fieldsForm]

}
