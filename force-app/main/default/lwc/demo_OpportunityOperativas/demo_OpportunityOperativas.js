import {LightningElement, api, wire, track} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import locale from '@salesforce/i18n/locale';
import currentUserId from '@salesforce/user/Id';
import {errorApex, toast, copiarTextoAlPortapapeles} from 'c/demo_lwcUtils';

import OPP_ACCOUNT_NUMDOC from '@salesforce/schema/Opportunity.Account.DEMO_NumeroDocumento__c';
import OPP_ACCOUNT_NAME from '@salesforce/schema/Opportunity.Account.Name';
import OPP_OWNER from '@salesforce/schema/Opportunity.OwnerId';
import OPP_IS_CLOSED from '@salesforce/schema/Opportunity.IsClosed';
import OPP_ETAPA from '@salesforce/schema/Opportunity.StageName';

const OPP_FIELDS_GETRECORD = [OPP_ACCOUNT_NUMDOC, OPP_ACCOUNT_NAME, OPP_OWNER, OPP_IS_CLOSED, OPP_ETAPA];

export default class demoOpportunityOperativas extends LightningElement {

	@api recordId;

	oportunidad = {_pendienteCita: false, _cerrada: false};

	@track modalesVisibles = {};

	@wire(getRecord, {recordId: '$recordId', fields: OPP_FIELDS_GETRECORD})
	wiredOpportunity({error, data: oportunidad}) {
		if (oportunidad) {
            const etapa = getFieldValue(oportunidad, OPP_ETAPA) === 'Preparation';
			const esPropietario = getFieldValue(oportunidad, OPP_OWNER) === currentUserId;
			const isClosed = getFieldValue(oportunidad, OPP_IS_CLOSED);
			const pendienteCita = etapa === 'Pendiente Cita';
            const contactoInformado = Boolean(getFieldValue(oportunidad, OPP_ACCOUNT_NAME));

			this.oportunidad = {
				...oportunidad,
				_pendienteCita: pendienteCita,
				_abierta: !isClosed,
				_cerrada: isClosed
			};

			this.botonesDisabled = {
				programarCita: !['Activa', 'Pendiente Interno'].includes(etapa) || !esPropietario || !contactoInformado,
				derivarGestor: !contactoInformado || isClosed || etapa === 'Nueva' || !esPropietario,
				cerrarOportunidad: etapa !== 'Activa' || !esPropietario
			};
		} else if (error) {
			errorApex(this, error, 'Error recuperando los datos de la oportunidad');
		}
	}

	abrirModal({currentTarget: {dataset: {modal: nombreModal}}}) {
		this.modalesVisibles = {[nombreModal]: true};
		setTimeout(() => this.template.querySelector(`.${nombreModal}`).abrirModal(), 20);
	}

	modalAbierto({detail: {nombreModal}}) {
		this.template.querySelectorAll('lightning-button').forEach(b => b.style.pointerEvents = 'none');
		this.template.querySelector(`lightning-button[data-modal="${nombreModal}"]`).variant = 'brand';
	}

	modalCerrado({detail: {nombreModal}}) {
		this.modalesVisibles[nombreModal] = false;
		this.template.querySelectorAll('lightning-button').forEach(b => b.style.pointerEvents = 'auto');
		const boton = this.template.querySelector(`lightning-button[data-modal="${nombreModal}"]`);
		boton && (boton.variant = boton.dataset.variant);
	}

	async copiarNifAlPortapapeles() {
		const nif = getFieldValue(this.oportunidad, OPP_ACCOUNT_NUMDOC);
		if (nif) {
			try {
				await copiarTextoAlPortapapeles(nif);
				toast('success', 'Se copió NIF', `Se ha copiado el NIF ${nif} (${getFieldValue(this.oportunidad, OPP_ACCOUNT_NAME)}) al portapapeles`);
			} catch (error) {
				console.error(error);
			}
		} else {
			toast('info', 'El NIF del cliente no está informado', 'La cuenta no tiene el número de documento de identidad informado');
		}
	}

	formatFecha(fecha) {
		const format = new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false});
		const parts = format.formatToParts(fecha);
		const dia = parts.find(p => p.type === 'day').value;
		const mes = (parts.find(p => p.type === 'month')?.value ?? '').toLowerCase().replace(/^./, c => c.toUpperCase());
		const hora = parts.find(p => p.type === 'hour').value;
		const minut = parts.find(p => p.type === 'minute').value;
		return `${dia} ${mes} ${hora}:${minut}`;
	}
}