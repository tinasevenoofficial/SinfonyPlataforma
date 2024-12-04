/*eslint-disable*/
import React, { useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
// @material-ui/core components
import { createTheme, MuiThemeProvider, withStylesm, makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import Radio from '@material-ui/core/Radio';
import MUIDataTable from "mui-datatables";
import { message } from 'antd';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from "../../../assets/jss/material-dashboard-pro-react/views/common";

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

export default function Plantillas({ history }) {
    const auth = useSelector((state) => state.auth);
    const classes2 = useStyles2();
    const [plantillas, setPlantillas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    let [reloadPage, setReloadPage] = React.useState(false);
    const [posicion, setPosicion] = React.useState(-1);
    const [seleccion, setSeleccion] = React.useState(-1);
    const classes = useStyles();

    const columns = [
        {
            name: "Seleccionar",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Radio
                            checked={posicion === parseInt(tableMeta.rowIndex)}
                            onChange={(e) => { setSeleccion(parseInt(tableMeta.rowData[1])); setPosicion(tableMeta.rowIndex); }}
                            value={tableMeta.rowIndex}
                            name="radio-button-demo"
                        />
                    );
                }
            }
        },
        {
            name: 'id',
            options: {
                display: false,
            }
        },
        {
            label: 'Nombre de la plantilla',
            name: 'nombre_plantilla',
            options: {
                sort: false,
            }
        },

    ];
    const options = {
        filter: false,
        selectableRows: 'none',
        download: false,
        print: false,
        viewColumns: false,
        textLabels: {
            body: {
                noMatch: loading ?
                    <CircularProgress className={classes2.progress} size={20} color="primary" /> : "No se han encontrado plantillas",
            },
            pagination: {
                next: "Siguiente Pagina",
                previous: "Anterior Pagina",
                rowsPerPage: "Plantillas por pagina",
                displayRows: "de" // 1-10 of 30
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Download CSV",
                print: "Print",
                viewColumns: "View Columns",
                filterTable: "Filter Table"
            },
            filter: {
                title: "FILTERS",
                reset: "reset",
            },
            viewColumns: {
                title: "Show Columns"
            },
            selectedRows: {
                text: "rows(s) deleted",
                delete: "Delete"
            }
        }
    };

    const getMuiTheme = () =>
        createTheme({
            overrides: {
                MUIDataTableHeadCell: {
                    root: {
                        textAlign: 'inherit',
                    }
                },
                MUIDataTableBodyCell: {
                    root: {
                        textAlign: 'left',
                    }
                },
            },
        });

    const editarPlanti = () => {
        if (seleccion === -1) {
            alert(" Seleccione una plantilla a editar")
        } else {
            let config = {
                method: 'get',
                url: process.env.REACT_APP_URL_API + '/api/PlantillaAgiles/' + seleccion + '/showWithFile',
                headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
            };
            const fechData = async () => {
                const result = await axios(config);
                history.push({ pathname: '/admin/editorText', state: { idDocu: seleccion, archivoJson: result.data.archivoJson, nombrePlantilla: result.data.nombre_plantilla } })
            }
            fechData();

        }
    }

    const eliminarPlanti = () => {
        if (seleccion === -1) {
            alert(" Seleccione una plantilla a eliminar")
        } else {
            let config = {
                method: 'delete',
                url: process.env.REACT_APP_URL_API + '/api/PlantillaAgiles/' + seleccion,
                headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
            };
            const fechData = async () => {
                try {
                    const result = await axios(config);
                    console.log(result);
                    message.success({ content: '¡Se ha eliminado la plantilla!', duration: 4 });
                    setReloadPage(true)
                } catch (e) {
                    message.error({ content: '¡No se ha podido eliminar la plantilla!', duration: 4 });
                }

            }
            fechData();

        }
    }

    //get
    useEffect(() => {
        setLoading(true);
        //Axios
        let config = {
            method: 'get',
            url: process.env.REACT_APP_URL_API + "/api/PlantillaAgiles/Order",
            headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'aplication/json' },
            params: {
                orden: 'id',
            }
        };
        const fechData = async () => {
            const result = await axios(config);
            console.log(result.data)
            setPlantillas(result.data);
            setLoading(false);
        }
        fechData();
    }, [reloadPage]);

    return (
        <div>
            <GridContainer>
                <GridItem md={8} style={{ margin: 'auto' }}>
                    <Card>
                        <CardHeader color="primary" text>
                            <CardText className={classes.cardText} color="primary">
                                <h4 className={classes.colorWhite}> Listado de Plantillas </h4>
                            </CardText>
                        </CardHeader>
                        <CardBody>
                            <GridContainer >
                                <GridItem xs={12} sm={12} md={12} style={{ marginBottom: '14px', textAlign: 'end' }}>
                                    <Button variant="contained" color="rose" onClick={() => editarPlanti()} component="label">Editar</Button>
                                    <Button style={{ marginLeft: '4px' }} variant="contained" color="rose" onClick={() => eliminarPlanti()} component="label">Eliminar</Button>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ margin: 'auto' }}>
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={''}
                                            data={plantillas}
                                            columns={columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
