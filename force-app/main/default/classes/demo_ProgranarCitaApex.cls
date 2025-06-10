public with sharing class demo_ProgranarCitaApex {


	@AuraEnabled
	public static Event programarCita(Id recordId, Boolean asignacionAuto, Boolean comprobarContacto, Id idPropietario, Datetime startDateTime) {
		try {
			return programarCita2(recordId, asignacionAuto, comprobarContacto, idPropietario, startDateTime, startDateTime.addMinutes(30));
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	private static Event programarCita2(Id idOportunidad, Boolean asignacionAuto, Boolean comprobarContacto, Id idPropietario, Datetime startDateTime, Datetime endDateTime) {
		Opportunity oportunidadAsociada = [SELECT Name, RecordType.DeveloperName FROM Opportunity WHERE Id = :idOportunidad];

		Event nuevoEvento = new Event();
		nuevoEvento.Type = 'Cita con cliente';
		nuevoEvento.WhatId = idOportunidad;
		nuevoEvento.Subject = 'Cita - ' + oportunidadAsociada.Name;
		nuevoEvento.StartDateTime = startDateTime;
		nuevoEvento.EndDateTime = endDateTime;

		Opportunity oportunidad = new Opportunity(Id = idOportunidad);
		// oportunidad.CSBD_Fecha_Cita__c = startDateTime;

		if (!String.isBlank(idPropietario)) {
			oportunidad.OwnerId = idPropietario;
			nuevoEvento.OwnerId = idPropietario;
		} else {
			//Se marca el evento como pendiente de asignación automática externa -- se enviará a omnichannel en la reactivación
			oportunidad.OwnerId = [SELECT Id FROM User WHERE UserName LIKE 'csbd_generico@cc-caixabank.com%'].Id;
			nuevoEvento.OwnerId = [SELECT Id FROM Calendar WHERE Name = 'Citas pendientes de reasignar' LIMIT 1].Id;
		}

		insert nuevoEvento;
		update oportunidad;

		//la llamada a omnichannel para el alta se añade en finalizarCita() cuando esta se cumple
		return nuevoEvento;
	}
}