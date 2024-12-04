/*eslint-disable*/
import React, { useEffect } from "react";
import axios from 'axios';
import ObtenerWord from '../CrearArchivo/ObtenerWord.js'
import { useSelector } from "react-redux";
// @material-ui/core components
import { createTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
// @material-ui/icons
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CardText from "components/Card/CardText.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Radio from '@material-ui/core/Radio';
import MUIDataTable from "mui-datatables";
import useStyles from "../../../assets/jss/material-dashboard-pro-react/views/common";
import { message } from 'antd';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

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

export default function Documents({ history }) {

    const auth = useSelector((state) => state.auth);
    const classes2 = useStyles2();
    const [documentos, setDocumentos] = React.useState([]);
    let [reloadPage, setReloadPage] = React.useState(false);
    const [posicion, setPosicion] = React.useState(-1);
    const [seleccion, setSeleccion] = React.useState(-1);
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

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
            label: 'Nombre del documento',
            name: 'nombre_documento',
            options: {
                sort: false,
            }
        },
        {
            label: 'Fecha de creación',
            name: 'created_at',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta) => {
                    return (
                        formatDate(tableMeta.rowData[3])
                    );
                }
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
                    <CircularProgress className={classes2.progress} size={20} color="primary" /> : "No se han encontrado documentos",
            },
            pagination: {
                next: "Siguiente Pagina",
                previous: "Anterior Pagina",
                rowsPerPage: "Documentos por pagina",
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
                        textAlign: 'center',
                    }
                },
            },
        });

    const editarDocu = () => {
        if (seleccion === -1) {
            alert(" Seleccione un documento a editar")
        } else {
            history.push({ pathname: '/admin/Formulario', state: { idDocu: seleccion } })
        }
    }

    const previsualizarDocu = () => {
        if (seleccion === -1) {
            alert(" Seleccione un documento a previsualizar")
        } else {
            history.push({ pathname: '/admin/obtenerHtml', state: { idDocu: seleccion } })
        }
    }

    const crearPdfDocu = () => {
        if (seleccion === -1) {
            alert(" Seleccione un documento para exportar en PDF")
        } else {
            history.push({ pathname: '/admin/Formulario', state: { idDocu: seleccion } })
        }
    }

    const eliminarDocu = () => {
        if (seleccion === -1) {
            alert(" Seleccione un documento a eliminar")
        } else {
            let config = {
                method: 'delete',
                url: process.env.REACT_APP_URL_API + '/api/documentosAgiles/' + seleccion,
                headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
            };
            const fechData = async () => {
                const result = await axios(config);
                setReloadPage(true)
                message.success({ content: '¡Se ha eliminado el documento!', duration: 2 });
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
            url: process.env.REACT_APP_URL_API + "/api/documentosAgiles",
            headers: { Authorization: `Bearer ${auth.token}` },
            data: "",
        };
        const fechData = async () => {
            const result = await axios(config);
            console.log(result.data)
            await setDocumentos(Object.values(result.data));
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
                                <h4 className={classes.colorWhite}> Listado de Documentos </h4>
                            </CardText>
                        </CardHeader>
                        <CardBody>
                            <GridContainer >
                                <GridItem xs={12} sm={12} md={12} style={{ marginBottom: '14px', textAlign: 'end' }}>
                                    <Button variant="contained" color="rose" onClick={() => editarDocu()} component="label">Editar</Button>
                                    <Button style={{ marginLeft: '4px' }} variant="contained" color="rose" component="label" onClick={() => previsualizarDocu()}>Previsualizar</Button>
                                    {/* <Button variant="contained" color="danger" component="label" >PDF</Button> */}
                                    <ObtenerWord idDocu={seleccion} />
                                    <Button variant="contained" color="rose" style={{ marginLeft: '4px' }} onClick={() => eliminarDocu()} component="label">Eliminar</Button>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ margin: 'auto' }}>
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={''}
                                            data={documentos}
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
