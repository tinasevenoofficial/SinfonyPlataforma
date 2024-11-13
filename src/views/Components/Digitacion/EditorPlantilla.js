import React, { useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import CargarEnviarPlantilla from "./CargarEnviarPlantilla"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardText from "components/Card/CardText.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CustomInput from "components/CustomInput/CustomInput.js";
import FormLabel from "@material-ui/core/FormLabel";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import useStyles from "../../../assets/jss/material-dashboard-pro-react/views/common";

export default function EditorContainer(props) {
  const classes = useStyles();

  //Si viene para editar una plantilla se ingresa el valor provenientes de la plantillas si es de cero se crean los valores por defecto

  const [contentState, setContentSate] = useState(props.location.state ? props.location.state.archivoJson : {
    "blocks": [{ "key": "cv3g4", "text": "", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }],
    "entityMap": {}
  });
  const [nombrePlantilla, setNombrePlantilla] = useState(props.location.state ? props.location.state.nombrePlantilla : '')
  const [estadoPlantilla, setEstadoPlantilla] = useState(props.location.state ? true : false)
  const [idDocumentoPrincipal, setIdDocumentoPrincipal] = useState(props.location.state ? props.location.state.idDocu : 0)

  const onContentStateChange = (contentState) => {
    setContentSate(contentState);
  };

  return (
    < div >
      <GridContainer>
        <GridItem md={12} style={{ margin: 'auto' }}>
          <Card>
            <CardHeader color="primary" text>
              <CardText className={classes.cardText} color="primary">
                <h4 className={classes.colorWhite}> {estadoPlantilla ? <span>Edita tu plantilla</span> : <span>Crea tu plantilla</span>} </h4>
              </CardText>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'start' }}>
                  <FormLabel>
                    Nombre de la plantilla
                  </FormLabel>
                  <div style={{ marginTop: "-10px" }}>
                    <CustomInput
                      id="nombrePlantilla"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: nombrePlantilla,
                        type: "text",
                        onChange: (e) => setNombrePlantilla(e.target.value),
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'start' }}>
                  <FormLabel>
                    <span style={{ color: 'red', fontSize: '10px', float: 'right' }}>* Recuerde consultar los anexos de ayuda en la creación de plantillas agiles.</span>
                  </FormLabel>
                  <Editor editorStyle={{ border: "2px solid #c0c0c038", height: '500px', overflow: 'scroll', width: '100%' }}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    defaultContentState={contentState}
                    onContentStateChange={onContentStateChange}
                    mention={{
                      separator: ' ',
                      trigger: 'Z',
                      suggestions: [
                        { text: 'APPLE', value: 'ZZtext:nombreCampo:ordenZZZ', url: 'apple' },
                        { text: 'BANANA', value: 'banana', url: 'banana' },
                        { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                        { text: 'DURIAN', value: 'durian', url: 'durian' },
                        { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                        { text: 'FIG', value: 'fig', url: 'fig' },
                        { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                        { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
                      ],
                    }}
                  />
                  {/* <textarea style={{ marginTop: '15px', width: "100%", height: '400px' }}
                    disabled
                    value={JSON.stringify(contentState, null, 4)}
                  /> */}
                </GridItem>
              </GridContainer>

            </CardBody>
            <CardFooter style={{ textAlign: "right" }}>
              <CargarEnviarPlantilla
                data={contentState}
                nombrePlantilla={nombrePlantilla}
                estado={estadoPlantilla}
                idDocumento={idDocumentoPrincipal}
                setIdDocumentoPrincipal={setIdDocumentoPrincipal}
                history={props.history}
              />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div >
  )

}

