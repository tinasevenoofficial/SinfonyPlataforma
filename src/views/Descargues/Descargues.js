import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';
import ReactDOM, { render } from "react-dom";
import { useDispatch, useSelector } from 'react-redux';

// @material-ui/core components
import { makeStyles, styled } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import FormLabel from "@material-ui/core/FormLabel";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.js";
import Selects from "@material-ui/core/Select";

import { PAYMENT_METHODS } from "../../utils/constants";

// importar modal
import Persona from "views/Persona/Otorgante";
import Dialog from "../Components/Methods/DialogMethods";

import useStyles from "../../assets/jss/material-dashboard-pro-react/views/common";
import stylesForms from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import stylesTables from "assets/jss/material-dashboard-pro-react/components/tableStyle";
import stylesButton from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";
import DnsIcon from "@material-ui/icons/Dns";

import { Spin, message, Select } from 'antd';
import FormatearNum from "components/ComponenteFormatearNumero/Formatear_numeros"

const { Option } = Select;
//const useStyles = makeStyles(styles);
const useStylesForm = makeStyles(stylesForms);
const useStylesTables = makeStyles(stylesTables);
const useStylesButton = makeStyles(stylesButton)


export default function Descargues() {

    const auth = useSelector((state) => state.auth);

    const classes = useStyles();
    const classesForm = useStylesForm();
    const [loanding, setloanding] = useState(false);

    const [numDepo, setnumDepo] = useState('');
    const [deposito, setdeposito] = useState(
        {
            idDeposito: '',
            idRadicacion: '',
            gastoNot: '',
            boleta: '',
            registro: '',
            otros: '',
        }
    );
    const [descargueGN, setdescargueGN] = useState({
        value: '',
        formatVal: '',
    }
    );
    const [descargueBol, setdescargueBol] = useState({
        value: '1000',
        formatVal: '',
    }
    );
    const [descargueReg, setdescargueReg] = useState({
        value: '',
        formatVal: '',
    });
    const [descagueOtros, setDescagueOtros] = useState({
        value: '',
        formatVal: '',
    });
    const saveTotales = (num) => {

        while (num.indexOf('.') !== -1) {
            num = num.replace('.', '')
        }
        while(num.indexOf(',') !== -1){
            num = num.replace(',','.')
        }
        return parseFloat(num)
    };

    const validarInput = (value) => {
        let number = saveTotales(value);
        const regex = /[a-zA-Z]/;
        // const regex2 = /,{1}/;
        const haveLetter =  regex.test(value)
        console.log(haveLetter)
        if(value == ''){
            return false
        }
        if (Number.isNaN(parseInt(number)) || haveLetter){
            return true;
        }
        return false;
    }

    const handleDescargueGN = (event) => {
        if (validarInput(event.target.value)) {
            alert('por favor ingrese solo valores numericos')
        }
        else {
            if (!(deposito.gastoNot < saveTotales(event.target.value))) {
                setdescargueGN({
                    value: saveTotales(event.target.value),
                    formatVal: FormatearNum(event.target.value)
                });
            }
            else {
                setdescargueGN({
                    value: deposito.gastoNot,
                    formatVal: FormatearNum(deposito.gastoNot)
                });
            }
        }
    };
    const handleDescargueBol = (event) => {
        if (validarInput(event.target.value)) {
            alert('por favor ingrese solo valores numericos')
        }
        else {
            if (!(deposito.boleta < saveTotales(event.target.value))) {
                setdescargueBol({
                    value: saveTotales(event.target.value),
                    formatVal: FormatearNum(event.target.value)
                });
            }
            else {
                setdescargueBol({
                    value: deposito.boleta,
                    formatVal: FormatearNum(deposito.boleta)
                });
            }
        }
    };
    const handleDescargueOtr = (event) => {
        if (validarInput(event.target.value)) {
            alert('por favor ingrese solo valores numericos')
        }
        else {
            if (!(deposito.otros < saveTotales(event.target.value))) {
                setDescagueOtros({
                    value: saveTotales(event.target.value),
                    formatVal: FormatearNum(event.target.value)
                });
            }
            else {
                setDescagueOtros({
                    value: deposito.otros,
                    formatVal: FormatearNum(deposito.otros)
                });
            }
        }
    }
    const handleDescargueReg = (event) => {
        if (validarInput(event.target.value)) {
            alert('por favor ingrese solo valores numericos')
        }
        else {
            if (!(deposito.registro < saveTotales(event.target.value))) {
                setdescargueReg({
                    value: saveTotales(event.target.value),
                    formatVal: FormatearNum(event.target.value)
                });
            }
            else {
                setdescargueReg({
                    value: deposito.registro,
                    formatVal: FormatearNum(deposito.registro),
                });
            }
        }
    };
    const guardarDescargue = () => {
        setloanding(true);
        let config = {
            headers: { Authorization: `Bearer ${auth.token}`, 'Access-Control-Allow-Origin': true },
        };
        let data = {
            id_deposito: deposito.idDeposito,
            id_radicacion: deposito.idRadicacion,
            boleta: descargueBol.value,
            registro: descargueReg.value,
            notaria: descargueGN.value,
            otros: descagueOtros.value,
        };
        console.log(data)
        axios.post('https://notadev.sinfony.com.co/desarrollo/api/descargues', data, config)
            .then((response) => {
                if (response.status === 201) {

                    message.success('Datos enviados correctamente');
                }
                else {
                    console.log(response.status)
                    message.error('Ha ocurrido un error');
                }
                let initialstate = {
                    idDeposito: '',
                    idRadicacion: '',
                    gastoNot: '',
                    boleta: '',
                    registro: '',
                    otros: '',
                }
                setdeposito(initialstate);
                initialstate = {
                    value: '',
                    formatVal: '',
                }
                setdescargueBol(initialstate);
                setdescargueGN(initialstate);
                setdescargueReg(initialstate);
                setDescagueOtros(initialstate);
                setnumDepo('');
                setloanding(false);

            })
    };
    const consultaDeposito = () => {
        setloanding(true)
        let config = {
            headers: { Authorization: `Bearer ${auth.token}`, 'Access-Control-Allow-Origin': true },
        };
        axios.get('https://notadev.sinfony.com.co/desarrollo/api/depositosNumero?numero_deposito=' + numDepo, config)
            .then(({ data }) => {
                setloanding(false)
                setdeposito({
                    idDeposito: data.id,
                    idRadicacion: data.id_radicacion,
                    gastoNot: data.notaria,
                    boleta: data.boleta,
                    registro: data.registro,
                    otros: data.otros,
                });

        })
        .catch(error => {
            setloanding(false);
            message.error('no se encuentra el deposito');
        });
    };
    return (
        <Card>
            <Spin spinning={loanding}>
                <CardHeader color="primary" text>
                    <CardText className={classes.cardText} color="primary">
                        <h4 className={classes.colorWhite}> Descargues </h4>
                    </CardText>
                </CardHeader>
                <CardBody>
                    <form>
                        <GridContainer justify='center'>
                            <GridItem xs={3}>
                                <div>
                                    <FormLabel className={classesForm.labelHorizontal} style={{ fontSize: '20px' }}>
                                        <b>Numero Deposito</b>
                                    </FormLabel>
                                </div>
                            </GridItem>
                            <GridItem xs={1}>
                                <div>
                                    <CustomInput
                                        id='numDepo'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            value: numDepo,
                                            onChange: (event) => setnumDepo(event.target.value),
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                            <GridItem style={{ marginTop: '15px' }}>
                                <div>
                                    <Button
                                        justIcon
                                        color="rose"
                                        className={classes.marginRight}
                                        onClick={consultaDeposito}
                                    >
                                        <span className="material-icons">
                                            search
                                        </span>
                                    </Button>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>
                    <GridContainer justify='center' alignItems="center" style={{ backgroundColor: '#f2f2f2', marginTop: '20px' }}>
                        <GridItem xs={2}>
                            <div style={{ textAlign: 'end' }}>

                            </div>
                        </GridItem>
                        <GridItem xs={3} style={{ borderLeft: '1px solid black' }}>
                            <div style={{ textAlign: "start" }}>
                                <h3>Saldo Depósito</h3>
                            </div>
                        </GridItem>
                        <GridItem xs={3} style={{ borderLeft: '1px solid black' }}>
                            <div style={{ textAlign: 'start' }}>
                                <h3>Valor Descargue</h3>
                            </div>
                        </GridItem>
                    </GridContainer>
                    <form>
                        <GridContainer justify='center' alignItems="center">
                            <GridItem xs={2} style={{ marginTop: '0px' }}>
                                <div style={{ textAlign: 'end' }}>
                                    <FormLabel className={classesForm.labelHorizontal} style={{ fontSize: '20px' }}>
                                        <b>Gastos Notariales</b>
                                    </FormLabel>
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id='disable_GN'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            value: FormatearNum(deposito.gastoNot),
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id="input_GN"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: descargueGN.formatVal,
                                            onChange: handleDescargueGN,
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>
                    <form>
                        <GridContainer justify='center' alignItems="center">
                            <GridItem xs={2} style={{ marginTop: '0px' }}>
                                <div style={{ textAlign: 'end' }}>
                                    <FormLabel className={classesForm.labelHorizontal} style={{ fontSize: '20px' }}>
                                        <b>Boleta</b>
                                    </FormLabel>
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id='disable_Bol'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            value: FormatearNum(deposito.boleta),
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id="input_Bol"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: descargueBol.formatVal,
                                            onChange: handleDescargueBol,
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>
                    <form>
                        <GridContainer justify='center' alignItems="center">
                            <GridItem xs={2} style={{ marginTop: '0px' }}>
                                <div style={{ textAlign: 'end' }}>
                                    <FormLabel className={classesForm.labelHorizontal} style={{ fontSize: '20px' }}>
                                        <b>Registro</b>
                                    </FormLabel>
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id='disable_Reg'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            value: FormatearNum(deposito.registro),
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id="input_Reg"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: descargueReg.formatVal,
                                            onChange: handleDescargueReg,
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>
                    <form>
                        <GridContainer justify='center' alignItems="center">
                            <GridItem xs={2} style={{ marginTop: '0px' }}>
                                <div style={{ textAlign: 'end' }}>
                                    <FormLabel className={classesForm.labelHorizontal} style={{ fontSize: '20px' }}>
                                        <b>Otros</b>
                                    </FormLabel>
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id='disable_otr'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "text",
                                            value: FormatearNum(deposito.otros),
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                            <GridItem xs={3} style={{ marginTop: '10px' }}>
                                <div style={{ textAlign: 'start' }}>
                                    <CustomInput
                                        id="input_otr"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'text',
                                            value: descagueOtros.formatVal,
                                            onChange: handleDescargueOtr,
                                            autoComplete: "off"
                                        }}
                                    />
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>
                    <GridContainer justify='flex-end'>
                        <GridItem xs={3}>
                            <div>
                                <Button
                                    color='rose'
                                    className={classes.marginRight}
                                    onClick={guardarDescargue}
                                >
                                    <span>
                                        GUARDAR
                                    </span>
                                </Button>
                            </div>
                        </GridItem>
                    </GridContainer>
                </CardBody>
            </Spin>
        </Card>
    )
}