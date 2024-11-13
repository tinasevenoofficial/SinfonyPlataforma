// src/App.js
import React, { useState, useEffect } from 'react';
import AddFormButton from './AddFormButton';
import FormList from './FormList';
import SubmitButton from './SubmitButton';
import ProgressModal from './ProgressModal';
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "components/CustomButtons/Button.js";
import TemplateUploader from './TemplateUploader';
import axios from 'axios';
import { EXTERNAL_API_PATHS } from 'utils/constants';


function App({dataJson, idPlantilla}) {
  const [template, setTemplate] = useState(null);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState('');
  const [messages, setMessages] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Función para agregar un formulario
  const addForm = (form) => {
    setForms([...forms, form]);
  };

  // Función para actualizar un formulario
  const updateForm = (index, form) => {
    setForms(forms.map((f, i) => (i === index ? form : f)));
  };

  // Función para remover un formulario
  const removeForm = (index) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  // Función para manejar la apertura del modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para manejar el cierre del modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para resetear el estado después de la descarga
  const resetState = () => {
    setIsLoading(false);
    setProgress(0);
    setCurrent('');
    setMessages([]);
    setJobId(null);
    setDownloadUrl(null);
    setError(null);
    closeModal();
  };

  // Función para monitorear el estado del trabajo
  useEffect(() => {
    let interval = null;

    if (jobId && isLoading) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/status/${jobId}`);
          const data = await response.json();

          if (response.ok) {
            setProgress(data.progress);
            setCurrent(data.current);
            setMessages(data.messages);

            if (data.status === 'completado') {
              setDownloadUrl(`http://localhost:8000/download/${jobId}`);
              setIsLoading(false);
              clearInterval(interval);
              closeModal();
            }
          } else {
            setError(data.message || 'Error al obtener el estado del trabajo.');
            setIsLoading(false);
            clearInterval(interval);
            closeModal();
          }
        } catch (err) {
          setError('Error al comunicarse con el servidor.');
          setIsLoading(false);
          clearInterval(interval);
          closeModal();
        }
      }, 2000); // Poll cada 2 segundos
    }

    return () => clearInterval(interval);
  }, [jobId, isLoading]);

  useEffect(()=>{
    axios.get(EXTERNAL_API_PATHS.plantillaDocumentos+"/"+idPlantilla).then(async responsePlantilla => {
        const response = await  axios.get(EXTERNAL_API_PATHS.files+`/${responsePlantilla.data.url_documento}`,{ responseType: 'blob'})
        if (response.status == 200) {
             // Crear un Blob a partir de la respuesta binaria
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(blob);
            setTemplate(response.data)
            console.log("Plantilla Cargada!")          
        } else {
          console.error('Error en la descarga del archivo:', response.statusText);
        } 
      }).catch((e) => {
      console.log(e)
    });
   
  },[])

 

  return (<>
       {/* <p variant="xxLarge">Generador de Documentos</p>
        <TemplateUploader template={template} setTemplate={setTemplate} />*/}
        <div style={{ marginBottom: '20px' }}>
            <Button
                color="primary"
                onClick={addForm}
              >
                Agregar Formulario
            </Button>
        </div>
        <FormList forms={forms} updateForm={updateForm} removeForm={removeForm} dataJson={dataJson} />
        {/*<SubmitButton
          template={template}
          forms={forms}
          setIsLoading={setIsLoading}
          setProgress={setProgress}
          setCurrent={setCurrent}
          setMessages={setMessages}
          setJobId={setJobId}
          setDownloadUrl={setDownloadUrl}
          setError={setError}
          openModal={openModal}
        />*/}

        {/* Modal de Progreso */}
        <ProgressModal
          isOpen={isModalOpen}
          onDismiss={closeModal}
          progress={progress}
          current={current}
          latestMessage={messages[messages.length - 1] || ''}
          messages={messages}
        />

        {/* Mensaje de Error */}
        {error && (
          <SweetAlert
            onDismiss={() => setError(null)}
            dismissButtonAriaLabel="Cerrar"
          >
            {error}
          </SweetAlert>
        )}

        {/* Enlace de Descarga */}
        {downloadUrl && (
          <SweetAlert
            
            isMultiline={false}
            actions={
              <div>
                <a href={downloadUrl} download="documentos_generados.zip">
                  <Button text="Descargar Documentos" />
                </a>
                <Button text="Resetear" onClick={resetState} />
              </div>
            }
          >
            Documentos generados exitosamente.
          </SweetAlert>
        )}
        </>
  );
}

export default App;
