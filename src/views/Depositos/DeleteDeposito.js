import React, {  useRef, useEffect, useState } from "react";
import axios from 'axios';
import {useDispatch,useSelector} from 'react-redux';
import {Link} from "react-router-dom"
import { useHistory } from "react-router";

// @material-ui/core components
import { makeStyles, styled } from "@material-ui/core/styles";
// import Collapse from '@material-ui/core/Collapse';

// material-ui icons
//import Price from "@material-ui/icons/AddShoppingCart";

// core components
import Button from "components/CustomButtons/Button.js";

// importar modal

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import stylesForms from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import stylesTables from "assets/jss/material-dashboard-pro-react/components/tableStyle";
import stylesButton from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";

import { Spin, message, Select } from 'antd';

const { Option } = Select;
const useStyles = makeStyles(styles);
const useStylesForm = makeStyles(stylesForms);
const useStylesTables = makeStyles(stylesTables);
const useStylesButton = makeStyles(stylesButton)

export default function DeleteDepostio ({ id, set, filtro }) {
    
    const auth = useSelector((state) =>   state.auth);

    const history = useHistory();
    const [] = useState([]);


    const eliminar = () => {
        message.warning('eliminando datos...');
        let config = {
            headers: {Authorization: `Bearer ${auth.token}`, 'Access-Control-Allow-Origin':true },
        };
        axios.delete('https://notadev.sinfony.com.co/desarrollo/api/depositos/'+id, config)
        .then((response) => {

            if(response.status === 201){

                set(filtro);
                message.success('Datos eliminados correctamente');
            }
            else{
                console.log(response.status)
                message.error('Ha ocurrido un error');
            }
        })
    };

    return(
        
            <Button 
                justIcon
                color="danger"
                className="lassesButton.marginRight"
                onClick={eliminar}>
                <span class="material-icons">
                    delete
                </span>
            </Button>
        
    );
}