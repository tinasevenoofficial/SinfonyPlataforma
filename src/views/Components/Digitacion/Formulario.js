/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from 'axios';
import clsx from 'clsx';
import { useSelector } from "react-redux";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon.js";
import MailOutline from "@material-ui/icons/MailOutline";
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CardFooter from "components/Card/CardFooter";
import jsonACampos from "./JsonACampos";

const useStyles = makeStyles(styles);
const useStyles2 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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

export default function Formulario(props) {
  const auth = useSelector((state) => state.auth);
  console.log(props.idDocu)
  console.log(props.documentos)
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [documentos, setDocumentos] = useState(props.documentos ? props.documentos : []);
  const [formulario, setFormulario] = useState(false);
  const [idDocumento, setIdDocumento] = React.useState(() => {
    if (props.idDocu) {
      return (props.idDocu)
    } else if (props.history) {
      return (props.history.location.state.idDocu)
    }
  });
  const [genero, setGenero] = React.useState('');
  const [cantidad, setCantidad] = React.useState('');
  const classes2 = useStyles2();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  let [fieldsForm, setFieldsForm] = useState([]);

  const buttonClassname = clsx({
    [classes2.buttonSuccess]: success,
  });

  useEffect(() => {
    console.log(documentos)
    console.log(documentos.length)
    if (documentos.length === 0) {
      console.log("entra para realizar la petición al backend");
      let config = {
        method: 'get',
        url: process.env.REACT_APP_URL_API + '/api/documentosAgiles/' + idDocumento,
        headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
      };
      const fechData = async () => {
        const result = await axios(config);
        console.log('Resultado peticion backend');
        console.log(result);
        let json = JSON.parse(result.data.variables_documento)
        setDocumentos(json.archivoJson);
        setCantidad(json.cantidad);
        setGenero(json.genero)
        setFormulario(true);
      }
      fechData();
    }
  }, []);

  const updateCantidad = (value) => {
    setCantidad(value);
  };

  const updateGenero = (value) => {
    setGenero(value)
  };


  useEffect(() => {
    if (formulario === true) {
      let array = jsonACampos({ documentos: documentos});
      setDocumentos(array[0]);
      setFieldsForm(array[1]);
    }
    console.log("Formulario")
    console.log(documentos)
  }, [formulario]);

  const actualizaDocu = () => {
    setSuccess(false);
    setLoading(true);
    let config = {
      method: 'put',
      url: process.env.REACT_APP_URL_API + "/api/documentosAgiles/" + idDocumento,
      headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
      data: JSON.stringify({
        "variables_documento": {
          cantidad: cantidad,
          genero: genero,
          archivoJson: documentos,
        }
      }),
    };
    const result = axios(config).then((response) => { setSuccess(true); setLoading(false); console.log(response) });
  }

  const vistaPrevia = () => {
    props.history.push({ pathname: '/admin/obtenerHtml', state: { idDocu: idDocumento } })
  }

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <MailOutline />
              </CardIcon>
              <h4 className={classes.cardIconTitle} style={{ color: "black" }}>
                Campos requeridos para completar documento:
              </h4>
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardIconTitle} style={{ color: "black" }}>
                Campos del documento:
              </h4>
              <form className="needs-validation" noValidate>
                {fieldsForm.map((item, index) => <div key={index}>{item}</div>)}
              </form>
            </CardBody>
            <CardFooter>
              <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
                <Button variant="contained" disabled={loading} className={buttonClassname} color="info" onClick={() => actualizaDocu()} component="label">{success ? "Actualizado" : "Actualizar"}</Button>
                <Button variant="contained" color="info" onClick={() => vistaPrevia()} component="label">Vista previa</Button>
                <div style={{ marginTop: '5px' }}>
                  {loading && <CircularProgress className={classes2.progress} size={40} color="primary" />}
                  {success ? <Alert severity="success">Los datos se han actualizado exitosamente</Alert> : <p></p>}
                </div>
              </GridItem>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
