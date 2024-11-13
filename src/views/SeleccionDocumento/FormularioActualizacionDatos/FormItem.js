// src/components/FormItem.js
import React, { useRef, useEffect } from 'react';

import { 
    Box, 
    TextField, 
    IconButton, 
    Button, 
    Typography, Grid
  } from '@material-ui/core/';
  import DeleteIcon from '@material-ui/icons/Delete';

  
  import SweetAlert from "react-bootstrap-sweetalert";

// Función auxiliar para establecer valores anidados en un objeto
const setNestedValue = (obj, path, value) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = { ...obj };
    let temp = current;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            temp[key] = value;
        } else {
            if (!temp[key]) {
                // Determina si el siguiente key es un índice numérico para manejar arrays
                temp[key] = isNaN(keys[index + 1]) ? {} : [];
            } else {
                temp[key] = Array.isArray(temp[key]) ? [...temp[key]] : { ...temp[key] };
            }
            temp = temp[key];
        }
    });

    return current;
};

const FormItem = ({ index, form, updateForm, removeForm, dataJson }) => {
    const fileInputRef = useRef(null);
    const [error, setError] = React.useState(null);

    useEffect(() => {
      handleJsonUpload();
    },[])

    const handleChange = (path, value) => {
        const updatedForm = setNestedValue(form, path, value);
        updateForm(index, updatedForm);
    };

    const addCompareciente = () => {
        const currentComparecientes = form.minuta?.protocolizacion?.comparecientes || [];
        const newComparecientes = [...currentComparecientes, {
            fideicomiso: {
                nombre_fideicomiso: '',
                nit_fideicomiso: '',
                representante_fideicomiso: {
                    nombre_apoderada: '',
                    edad_apoderada: '',
                    domicilio_apoderada: '',
                    cedula_apoderada: '',
                    ciudad_cedula_apoderada: ''
                },
                fiduciaria: {
                    nombre_fiduciaria: '',
                    nit_fiduciaria: ''
                },
                escritura_fiduciaria: {
                    numero_escritura: '',
                    fecha_escritura: '',
                    notaria_escritura: '',
                    domicilio_fiduciaria: ''
                },
                representante_legal_fideicomiso: {
                    nombre_representante: '',
                    cedula_representante: '',
                    cargo_representante: ''
                },
                fideicomitente_desarrollador: {
                    representante_legal: {
                        nombre_representante: '',
                        edad_representante: '',
                        ciudad_representante: '',
                        cedula_representante: '',
                        ciudad_expedicion_cedula: '',
                        calidad_representante: ''
                    },
                    sociedad: {
                        nombre_sociedad_actual: '',
                        nombre_sociedad_anterior: '',
                        nit_sociedad: '',
                        domicilio_sociedad: '',
                        numero_escritura_constitucion: '',
                        fecha_escritura_constitucion: '',
                        notaria_constitucion: '',
                        matricula_mercantil: '',
                        camara_comercio_inscripcion: '',
                        fecha_inscripcion: '',
                        numero_inscripcion_libro: '',
                        ultima_reforma_escritura: {
                            numero_escritura_reforma: '',
                            fecha_escritura_reforma: '',
                            notaria_reforma: ''
                        },
                        ultima_inscripcion_reforma: {
                            numero_escritura_ultima: '',
                            fecha_escritura_ultima: '',
                            notaria_ultima: '',
                            fecha_inscripcion_ultima: '',
                            numero_inscripcion_ultima: ''
                        }
                    }
                }
            }
        }];
        handleChange('minuta.protocolizacion.comparecientes', newComparecientes);
    };

    const removeCompareciente = (i) => {
        const currentComparecientes = form.minuta?.protocolizacion?.comparecientes || [];
        const newComparecientes = currentComparecientes.filter((_, idx) => idx !== i);
        handleChange('minuta.protocolizacion.comparecientes', newComparecientes);
    };

    const addComprador = () => {
        const currentCompradores = form.minuta?.compradores || [];
        const newCompradores = [...currentCompradores, {
            nombre_comprador: '',
            domicilio_comprador: '',
            direccion_domicilio_comprador: '',
            telefono_comprador: '',
            Actividad_economica: '',
            cedula_comprador: '',
            estado_civil_comprador: '',
            apoderado: {
                nombre_apoderado: '',
                domicilio_apoderado: '',
                numero_documento_apoderado: '',
                tipo_documento_apoderado: ''
            }
        }];
        handleChange('minuta.compradores', newCompradores);
    };

    const removeComprador = (i) => {
        const currentCompradores = form.minuta?.compradores || [];
        const newCompradores = currentCompradores.filter((_, idx) => idx !== i);
        handleChange('minuta.compradores', newCompradores);
    };

    const handleJsonUpload = (event) => {
        //const file = event.target.files[0];
        //if (file) {
            //const reader = new FileReader();
            //reader.onload = (e) => {
                try {
                    const jsonData = dataJson;
                    // Validar que el JSON tenga la estructura esperada
                    if (jsonData.minuta) {
                        updateForm(index, jsonData);
                        setError(null);
                    } else {
                        setError('El JSON no contiene la sección "minuta".');
                    }
                } catch (err) {
                    setError('Error al parsear el archivo JSON. Asegúrate de que el archivo sea válido.');
                }
            //};
            //reader.readAsText(file);
            // Resetear el input para permitir cargar el mismo archivo nuevamente si es necesario
            //event.target.value = null;
        //}
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
           <Box style={{ marginBottom: '20px' }}>
                <Grid container justify="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
                <Typography variant="h4">Formulario #{index + 1}</Typography>
                <Button
                    onClick={() => removeForm(index)}
                    style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
                >
                    Eliminar Formulario
                </Button>
                </Grid>

                {/* Botón para Cargar JSON */}
                <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item>
                    <Button onClick={triggerFileInput}>Cargar JSON</Button>
                    <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleJsonUpload}
                    />
                </Grid>
                {error && (
                    <Grid item xs={12}>
                    <SweetAlert>{error}</SweetAlert>
                    </Grid>
                )}
                </Grid>

                {/* Notaria Section */}
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Notaria
                </Typography>
                <Grid container direction="column" spacing={2}>
                <Grid item>
                    <TextField
                    label="Fecha escritura"
                    value={form.minuta?.notaria?.['Fecha escritura'] || ''}
                    onChange={(e) => handleChange('minuta.notaria.Fecha escritura', e.target.value)}
                    fullWidth
                    required
                    />
                </Grid>
                <Grid item>
                    <TextField
                    label="Notario encargado"
                    value={form.minuta?.notaria?.notario_encargado || ''}
                    onChange={(e) => handleChange('minuta.notaria.notario_encargado', e.target.value)}
                    fullWidth
                    required
                    />
                </Grid>
                <Grid item>
                    <TextField
                    label="Nombre notario"
                    value={form.minuta?.notaria?.nombre_notario || ''}
                    onChange={(e) => handleChange('minuta.notaria.nombre_notario', e.target.value)}
                    fullWidth
                    required
                    />
                </Grid>
                </Grid>
            </Box>
            {/* Protocolizacion Section */}
            <Typography styles={{ root: { fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' } }}>Protocolizacion</Typography>
            <Grid container direction="column" spacing={2}>
            <Grid item>
                <Button
                    text="Agregar Compareciente"
                    onClick={addCompareciente}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                />
                {form.minuta?.protocolizacion?.comparecientes && form.minuta.protocolizacion.comparecientes.map((compareciente, i) => (
                     <Box key={i} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
                     <Grid container justify="space-between" alignItems="center" style={{ marginBottom: '10px' }}>
                       <Typography variant="h6">Compareciente {i + 1}</Typography>
                       <IconButton
                         onClick={() => removeCompareciente(i)}
                         style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
                         aria-label="Eliminar Compareciente"
                       >
                         <DeleteIcon />
                       </IconButton>
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom>Fideicomiso</Typography>
                     <Grid container spacing={2}>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           label="Nombre fideicomiso"
                           value={compareciente.fideicomiso?.nombre_fideicomiso || ''}
                           onChange={(e) => handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.nombre_fideicomiso`, e.target.value)}
                           fullWidth
                           required
                         />
                       </Grid>
                       <Grid item xs={12} sm={6}>
                         <TextField
                           label="NIT fideicomiso"
                           value={compareciente.fideicomiso?.nit_fideicomiso || ''}
                           onChange={(e) => handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.nit_fideicomiso`, e.target.value)}
                           fullWidth
                           required
                         />
                       </Grid>
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Representante Fideicomiso</Typography>
                     <Grid container spacing={2}>
                       {['nombre_apoderada', 'edad_apoderada', 'domicilio_apoderada', 'cedula_apoderada', 'ciudad_cedula_apoderada'].map((field, index) => (
                         <Grid item xs={12} sm={6} key={index}>
                           <TextField
                             label={field.replace('_', ' ')}
                             value={compareciente.fideicomiso?.representante_fideicomiso?.[field] || ''}
                             onChange={(e) =>
                               handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.representante_fideicomiso.${field}`, e.target.value)
                             }
                             fullWidth
                             required
                           />
                         </Grid>
                       ))}
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Fiduciaria</Typography>
                     <Grid container spacing={2}>
                       {['nombre_fiduciaria', 'nit_fiduciaria'].map((field, index) => (
                         <Grid item xs={12} sm={6} key={index}>
                           <TextField
                             label={field.replace('_', ' ')}
                             value={compareciente.fideicomiso?.fiduciaria?.[field] || ''}
                             onChange={(e) =>
                               handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.fiduciaria.${field}`, e.target.value)
                             }
                             fullWidth
                             required
                           />
                         </Grid>
                       ))}
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Escritura Fiduciaria</Typography>
                     <Grid container spacing={2}>
                       {['numero_escritura', 'fecha_escritura', 'notaria_escritura', 'domicilio_fiduciaria'].map((field, index) => (
                         <Grid item xs={12} sm={6} key={index}>
                           <TextField
                             label={field.replace('_', ' ')}
                             value={compareciente.fideicomiso?.escritura_fiduciaria?.[field] || ''}
                             onChange={(e) =>
                               handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.escritura_fiduciaria.${field}`, e.target.value)
                             }
                             fullWidth
                             required
                           />
                         </Grid>
                       ))}
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Representante Legal Fideicomiso</Typography>
                     <Grid container spacing={2}>
                       {['nombre_representante', 'cedula_representante', 'cargo_representante'].map((field, index) => (
                         <Grid item xs={12} sm={6} key={index}>
                           <TextField
                             label={field.replace('_', ' ')}
                             value={compareciente.fideicomiso?.representante_legal_fideicomiso?.[field] || ''}
                             onChange={(e) =>
                               handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.representante_legal_fideicomiso.${field}`, e.target.value)
                             }
                             fullWidth
                             required
                           />
                         </Grid>
                       ))}
                     </Grid>
                 
                     <Typography variant="subtitle1" gutterBottom style={{ marginTop: '15px' }}>Fideicomitente Desarrollador</Typography>
                     <Grid container spacing={2}>
                       {['nombre_sociedad_actual', 'nit_sociedad', 'domicilio_sociedad'].map((field, index) => (
                         <Grid item xs={12} sm={6} key={index}>
                           <TextField
                             label={field.replace('_', ' ')}
                             value={compareciente.fideicomiso?.fideicomitente_desarrollador?.sociedad?.[field] || ''}
                             onChange={(e) =>
                               handleChange(`minuta.protocolizacion.comparecientes[${i}].fideicomiso.fideicomitente_desarrollador.sociedad.${field}`, e.target.value)
                             }
                             fullWidth
                             required
                           />
                         </Grid>
                       ))}
                     </Grid>
                   </Box>
                ))}
            </Grid>
            </Grid>

            {/* Compradores Section */}
            <Typography styles={{ root: { fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' } }}>Compradores</Typography>
            <div tokens={{ childrenGap: 10 }}>
                <Button
                    text="Agregar Comprador"
                    onClick={addComprador}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                />
                {form.minuta?.compradores && form.minuta.compradores.map((comprador, i) => (
                    <Box key={i} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
                    <Grid container justify="space-between" alignItems="center" style={{ marginBottom: '10px' }}>
                      <Typography variant="h6">Comprador {i + 1}</Typography>
                      <IconButton 
                        onClick={() => removeComprador(i)} 
                        style={{ backgroundColor: '#f8d7da', color: '#721c24' }} 
                        aria-label="Eliminar Comprador"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nombre comprador"
                          value={comprador.nombre_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].nombre_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Domicilio comprador"
                          value={comprador.domicilio_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].domicilio_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Dirección domicilio comprador"
                          value={comprador.direccion_domicilio_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].direccion_domicilio_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Teléfono comprador"
                          value={comprador.telefono_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].telefono_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Actividad económica"
                          value={comprador.Actividad_economica || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].Actividad_economica`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Cédula comprador"
                          value={comprador.cedula_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].cedula_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Estado civil comprador"
                          value={comprador.estado_civil_comprador || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].estado_civil_comprador`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                
                    <Typography variant="subtitle1" style={{ marginTop: '15px' }}>Apoderado</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nombre apoderado"
                          value={comprador.apoderado?.nombre_apoderado || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].apoderado.nombre_apoderado`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Domicilio apoderado"
                          value={comprador.apoderado?.domicilio_apoderado || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].apoderado.domicilio_apoderado`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Número documento apoderado"
                          value={comprador.apoderado?.numero_documento_apoderado || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].apoderado.numero_documento_apoderado`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Tipo documento apoderado"
                          value={comprador.apoderado?.tipo_documento_apoderado || ''}
                          onChange={(e) => handleChange(`minuta.compradores[${i}].apoderado.tipo_documento_apoderado`, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </div>
        </div>
    );
}

export default FormItem;