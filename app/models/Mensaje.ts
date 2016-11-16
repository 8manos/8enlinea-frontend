export class Mensaje {
	constructor(
		id:string,
		createdAt:string,
		updatedAt:string,
		mensaje: string,
		estado: string,
		tiempo_escribiendo: number,
		tiempo_respuesta: number,
		autor: Object,
		multimedia?: string, 
		acciones?: Array<Object>,
		en_conversacion?: Array<Object>
	) {  }
}
