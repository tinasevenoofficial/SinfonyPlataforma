import {palabras} from '../ValoresDefecto/palabras'


//Se tiene para el texto que se va a imprimir se acorde al campo que se escribio en la plantilla

export default function CambiarVocabulario(props) {
    let found = props.found;
    console.log(props.found.slice(3, -3).split(':')[0])
    let palabra = props.found.slice(3, -3).split(':')[0];
    let texto = props.texto;
    let genero = props.genero;
    let cantidad = props.cantidad;
    let nuevoTexto = '';

    console.log("texto")
    console.log(texto)
    palabras.map((item, index) => {
        if (item.name === palabra) {
            if (item.tipo === 'cantidad') {
                if (cantidad === 1) {
                    nuevoTexto = texto.replace(found, item.singular);
                } else if (cantidad > 1) {
                    nuevoTexto = texto.replace(found, item.plural);
                }
            } else if (item.tipo === 'generoCantidad') {
                if (cantidad === 1 && genero === 'Masculino') {
                    nuevoTexto = texto.replace(found, item.singularM);
                }
                if (cantidad === 1 && genero === 'Femenino') {
                    nuevoTexto = texto.replace(found, item.singularF);
                }
                if (cantidad > 1 && genero === 'Masculino') {
                    nuevoTexto = texto.replace(found, item.pluralM);
                }
                if (cantidad > 1 && genero === 'Femenino') {
                    nuevoTexto = texto.replace(found, item.pluralF);
                }

            }
        }
    })
    console.log(nuevoTexto);
    return (nuevoTexto)

}
