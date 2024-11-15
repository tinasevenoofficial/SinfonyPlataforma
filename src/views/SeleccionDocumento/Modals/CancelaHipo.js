import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Attachment from "@material-ui/icons/Attachment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import { infoColor } from "assets/jss/material-dashboard-pro-react.js";

//ant design
import { message } from 'antd';

const useStyles = makeStyles(theme => ({
    root: { color: 'black', fontSize: '18px' },
}));


export default function CancelaHipo() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const auth = useSelector((state) => state.auth);
    const [numeroDocu, setNumeroDocu] = useState('')
    const [numeroEscri, setNumeroEscri] = useState('')
    const [comentarios, setComentarios] = React.useState('');
    const [cedulaSolicitante, setCedulaSolicitante] = useState(null);
    const [camaraComercio, setCamaraComercio] = useState(null);
    const [cartaBanco, setCartaBanco] = useState(null);
    const formData = new FormData();

    //alert key
    const key = 'updatable';

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onCedulaChange = event => {
        // Update the state 
        setCedulaSolicitante(event.target.files[0]);
    };

    const cedulaData = () => {
        if (cedulaSolicitante) {
            return (
                <div>
                    <p style={{ fontSize: 10, color: '#aaaaaa' }}>Nombre: {cedulaSolicitante.name}</p>
                </div>
            );
        } else {
            return (
                <div style={{ fontSize: 10, color: '#E36767' }}>
                    Selecciona un archivo
                </div>
            );
        }
    };

    const onCamaraComercioChange = event => {
        // Update the state 
        setCamaraComercio(event.target.files[0]);
    };

    const camaraComercioData = () => {
        if (camaraComercio) {
            return (
                <div>
                    <p style={{ fontSize: 10, color: '#aaaaaa' }}>Nombre: {camaraComercio.name}</p>
                </div>
            );
        } else {
            return (
                <div style={{ fontSize: 10, color: '#E36767' }}>
                    Selecciona un archivo
                </div>
            );
        }
    };

    const onCartaBancoChange = event => {
        // Update the state 
        setCartaBanco(event.target.files[0]);
    };

    const cartaBancoData = () => {
        if (cartaBanco) {
            return (
                <div>
                    <p style={{ fontSize: 10, color: '#aaaaaa' }}>Nombre: {cartaBanco.name}</p>
                </div>
            );
        } else {
            return (
                <div style={{ fontSize: 10, color: '#E36767' }}>
                    Selecciona un archivo
                </div>
            );
        }
    };

    const sendData = () => {
        if ((numeroDocu && numeroEscri) !== '' && (cedulaSolicitante && camaraComercio && cartaBanco)) {
            message.loading({ content: 'Creando Trámite...', key: key, duration: 10 });
            
            let config = {
                method: 'post',
                url: process.env.REACT_APP_URL_API + "/api/tramite",
                headers: { Authorization: `Bearer ${auth.token}` },
                data: formData,
            };

            formData.append('tipo_tramite', 'escritura');
            formData.append('tipo_documento', 'cancelacion_hipoteca');
            formData.append('identificacion', numeroDocu);
            formData.append('numero_escritura', numeroEscri);
            formData.append('anotaciones', comentarios);
            formData.append('documento_1', cedulaSolicitante, 'cedula_solicitante');
            formData.append('documento_2', camaraComercio, 'camara_comercio');
            formData.append('documento_3', cartaBanco, 'carta_banco');

            axios(config)
                .then((response) => {
                    message.success({ content: '¡Trámite Creado!', key: key, duration: 3 });
                    handleClose();
                    setNumeroDocu('');
                    setNumeroEscri('');
                    setComentarios('');
                    setCedulaSolicitante(null);
                    setCamaraComercio(null);
                    setCartaBanco(null);
                    console.log(response.data)
                })
                .catch((e) => {
                    message.error({content: 'No se pudo crear el tramite', key: key, duration: 3})
                })
        } else {
            message.error({ content: 'Es necesario diligenciar los campos requeridos', key: key, duration: 2})
        }
    }

    return (
        <div>
            <Button style={{ width: '100%' }} color="mi" onClick={handleClickOpen}>
                Solicitar
            </Button>
            <Dialog fullWidth="true" maxWidth="md" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{ paddingTop: '25px' }}>Cancelación hipoteca</DialogTitle>
                <DialogContent>
                    <form >
                        <GridContainer >
                            <GridItem className={classes.color} md={6}>
                                <CustomInput
                                    id="numerodocu"
                                    labelText="Número de Documento o Nit"
                                    labelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.root,
                                        }
                                    }}
                                    formControlProps={{
                                        fullWidth: true,
                                        required: true,
                                    }}
                                    inputProps={{
                                        type: "number",
                                        onChange: (e) => setNumeroDocu(e.target.value),
                                        value: numeroDocu,
                                    }}
                                />
                            </GridItem>
                            <GridItem className={classes.color} md={6}>
                                <CustomInput
                                    id="numerodocu"
                                    labelText="Número de la escritura"
                                    labelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.root,
                                        }
                                    }}
                                    formControlProps={{
                                        fullWidth: true,
                                        required: true,
                                    }}
                                    inputProps={{
                                        type: "number",
                                        onChange: (e) => setNumeroEscri(e.target.value),
                                        value: numeroEscri,
                                    }}
                                />
                            </GridItem>
                        </GridContainer>
                        <div style={{ marginBottom: "10px" }} className={classes.formCategory}>
                            <span style={{ color: '#aaaaaa', fontSize: 14 }}><b>Adjuntos requeridos *</b></span>
                        </div>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={8} >
                                <span style={{ fontSize: 14, color: '#aaaaaa' }}><b>Copia de Cédula del Solicitante *</b></span>
                                {cedulaData()}
                            </GridItem>
                            <GridItem xs={12} sm={12} md={1} >
                                <div style={{ marginTop: "0px" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        size="sm"
                                        color="info"
                                    >
                                        <Attachment />
                                        SUBIR ARCHIVO
                                        <input
                                            accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => onCedulaChange(e)}
                                        />
                                    </Button>

                                </div>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={8} >
                                <span style={{ fontSize: 13.5, color: '#aaaaaa' }}><b>Camara y Comercio de la entidad que cancela la hipoteca *</b></span>
                                {camaraComercioData()}
                            </GridItem>
                            <GridItem xs={12} sm={12} md={1}>
                                <div style={{ marginTop: "0px" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        size="sm"
                                        color="info"
                                    >
                                        <Attachment />
                                        SUBIR ARCHIVO
                                        <input
                                            type="file"
                                            accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                            style={{ display: "none" }}
                                            onChange={(e) => onCamaraComercioChange(e)}
                                        />
                                    </Button>
                                </div>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={8} >
                                <span style={{ fontSize: 14, color: '#aaaaaa' }}><b>Carta del banco *</b></span>
                                {cartaBancoData()}
                            </GridItem>
                            <GridItem xs={12} sm={12} md={1}>
                                <div style={{ marginTop: "0px" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        size="sm"
                                        color="info"
                                    >
                                        <Attachment />
                                        SUBIR ARCHIVO
                                        <input
                                            type="file"
                                            accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                            style={{ display: "none" }}
                                            onChange={(e) => onCartaBancoChange(e)}
                                        />
                                    </Button>
                                </div>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <CustomInput
                                    id="standard-multiline-flexible"
                                    labelText="Anotaciones"
                                    labelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.root,
                                        }
                                    }}
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        type: "text",
                                        onChange: (e) => setComentarios(e.target.value),
                                        value: comentarios,
                                    }}
                                />
                            </GridItem>
                        </GridContainer>
                        <div className={classes.formCategory}>
                            <span style={{ color: '#aaaaaa', fontSize: 14 }}> De ser necesario alguna nota, escribirla en el campo anotaciones.</span>
                        </div>
                        <div className={classes.formCategory}>
                            <span style={{ color: '#E36767', fontSize: 12 }}><small>*</small> Campos requeridos</span>
                        </div>
                    </form>
                </DialogContent>
                <div style={{ padding: '23px' }}>
                    <DialogActions style={{ display: 'contents' }}>
                        <Button color="rose" size="sm" onClick={handleClose} style={{ float: 'left' }}>
                            Cancelar
                        </Button>
                        <Button color="rose" size="sm" onClick={sendData} style={{ float: 'right' }}>
                            Continuar
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}